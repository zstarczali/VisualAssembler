<?php
declare(strict_types=1);

// Támogatási beszélgetések (support.php) a dashboardon: lista, beszélgetés, válasz (opcionálisan e-mailben is), lezárás, törlés.
// A nyitott oldal 10–30 mp-enként frissít (?poll=1 JSON), így az új üzenet magától megjelenik.
define('VA_REGISTER', true);
require __DIR__ . '/lib.php';
require __DIR__ . '/admin.php';

vaAdminRequire();
$h = 'vaH';
$csrf = vaAdminCsrf();
$flash = vaAdminFlash();
$db = vaDb();
$id = (int) ($_GET['id'] ?? 0);

$thread = null;
if ($id > 0) {
    $st = $db->prepare('SELECT * FROM va_support_threads WHERE id = ?');
    $st->execute([$id]);
    $thread = $st->fetch() ?: null;
}

// csatolmány: kép inline (?inline=1, előnézet), minden más letöltésként
if (isset($_GET['file'])) {
    $st = $db->prepare('SELECT name, mime, data FROM va_support_files WHERE id = ?');
    $st->execute([(int) $_GET['file']]);
    $f = $st->fetch();
    if (!$f) {
        http_response_code(404);
        exit;
    }
    vaSupportSendFile($f, isset($_GET['inline']));
    exit;
}

// élő frissítés
if (isset($_GET['poll'])) {
    header('Content-Type: application/json; charset=utf-8');
    if ($thread) {
        $db->prepare('UPDATE va_support_threads SET unread_admin = 0 WHERE id = ?')->execute([$id]);
        echo json_encode(['messages' => vaSupportMessages($db, $id, (int) ($_GET['after'] ?? 0))], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } else {
        echo json_encode(['unread' => vaSupportUnread(), 'msgs' => vaSupportUserMessages()]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $back = 'inbox.php' . ($id ? '?id=' . $id : '');
    vaAdminCheckCsrf($back);
    $action = (string) ($_POST['action'] ?? '');
    try {
        // az összes beszélgetés törlése (listaoldal)
        if ($action === 'delete_all') {
            $n = 0;
            foreach ($db->query('SELECT id FROM va_support_threads')->fetchAll() as $t) {
                vaSupportDeleteThread($db, (int) $t['id']);
                $n++;
            }
            $_SESSION['flash'] = ['ok', "$n CONVERSATION" . ($n === 1 ? '' : 'S') . ' DELETED.'];
            header('Location: inbox.php');
            exit;
        }
        if (!$thread) {
            throw new InvalidArgumentException('NO SUCH CONVERSATION.');
        }
        if ($action === 'reply') {
            $body = mb_substr(trim(str_replace("\0", '', (string) ($_POST['text'] ?? ''))), 0, 8000);
            $raw = [];
            $up = $_FILES['files'] ?? null;
            foreach (is_array($up['name'] ?? null) ? $up['name'] : [] as $i => $name) {
                if (($up['error'][$i] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
                    continue;
                }
                if ($up['error'][$i] !== UPLOAD_ERR_OK) {
                    throw new InvalidArgumentException('A FILE COULD NOT BE UPLOADED (PHP UPLOAD ERROR ' . (int) $up['error'][$i] . ').');
                }
                $raw[] = [(string) $name, (string) file_get_contents($up['tmp_name'][$i])];
            }
            $files = vaSupportCheckFiles($raw);
            if ($files === 'files') {
                throw new InvalidArgumentException('MAX 3 FILES, 4 MB IN TOTAL.');
            }
            if (!is_array($files)) {
                throw new InvalidArgumentException('THIS FILE TYPE CANNOT BE SENT. ALLOWED: ' . strtoupper(implode(', ', VA_SUPPORT_FILE_EXT)) . '.');
            }
            if ($body === '' && !$files) {
                throw new InvalidArgumentException('THE REPLY IS EMPTY.');
            }
            $db->prepare("INSERT INTO va_support_messages (thread_id, sender, body, created_at) VALUES (?, 'admin', ?, NOW())")->execute([$id, $body]);
            vaSupportStoreFiles($db, (int) $db->lastInsertId(), $files);
            $db->prepare('UPDATE va_support_threads SET unread_user = unread_user + 1, unread_admin = 0, updated_at = NOW() WHERE id = ?')->execute([$id]);
            if (!empty($_POST['mail']) && $thread['email'] !== '') {
                $hu = $thread['lang'] === 'hu';
                vaNotifyMail($thread['email'],
                    $hu ? 'Válasz a C64 Visual Assembler támogatásától' : 'Reply from C64 Visual Assembler support',
                    $body . ($files ? "\n\n" . ($hu ? 'Csatolmány' : 'Attachments') . ': ' . implode(', ', array_map(static fn($f) => $f[0], $files))
                        . ($hu ? ' (az alkalmazásban nyithatod meg)' : ' (open them in the app)') : '') . "\n\n-- \n" . ($hu ? 'Válaszolni az alkalmazásban tudsz: Menü → Támogatás.' : 'You can answer in the app: Menu → Support.') . "\nhttps://www.c64va.pro/\n");
            }
            $_SESSION['flash'] = ['ok', 'REPLY SENT.'];
        } elseif ($action === 'close' || $action === 'reopen') {
            $db->prepare('UPDATE va_support_threads SET status = ? WHERE id = ?')->execute([$action === 'close' ? 'closed' : 'open', $id]);
        } elseif ($action === 'delete_msg') {
            if (!vaSupportDeleteMessage($db, $id, (int) ($_POST['message_id'] ?? 0))) {
                throw new InvalidArgumentException('NO SUCH MESSAGE.');
            }
            $_SESSION['flash'] = ['ok', 'MESSAGE DELETED.'];
        } elseif ($action === 'delete') {
            vaSupportDeleteThread($db, $id);
            $_SESSION['flash'] = ['ok', "CONVERSATION #$id DELETED."];
            $back = 'inbox.php';
        }
    } catch (InvalidArgumentException $e) {
        $_SESSION['flash'] = ['err', $e->getMessage()];
    } catch (Throwable $e) {
        error_log('VA inbox: ' . $e->getMessage());
        $_SESSION['flash'] = ['err', 'SERVER ERROR: ' . $e->getMessage()];
    }
    header('Location: ' . $back . ($action === 'reply' ? '#reply' : ''));
    exit;
}

$who = static fn(array $t): string => $t['email'] !== '' ? ($t['name'] !== '' ? $t['name'] . ' <' . $t['email'] . '>' : $t['email'])
    : ($t['name'] !== '' ? $t['name'] : 'ANONYMOUS ' . substr($t['install_id'], 0, 8));
$when = static fn(string $s): string => substr($s, 0, 16);
// üzenet törlése: kis × a meta-sorban (a JS-ből hozzáadott üzeneteknél ugyanez a form épül)
$delBtn = static fn(int $mid): string => '<form class="inline msg-del" method="post" onsubmit="return confirm(\'Delete this message?\')">'
    . '<input type="hidden" name="csrf" value="' . vaH($csrf) . '"><input type="hidden" name="action" value="delete_msg">'
    . '<input type="hidden" name="message_id" value="' . $mid . '"><button class="msg-x" type="submit" aria-label="Delete message">x</button></form>';
$size = static fn(int $n): string => $n >= 1048576 ? round($n / 1048576, 1) . ' MB' : max(1, (int) round($n / 1024)) . ' KB';
$filesHtml = static function (array $files) use ($size): string {
    $out = '';
    foreach ($files as $f) {
        $url = 'inbox.php?file=' . (int) $f['id'];
        $out .= $f['image']
            ? '<a class="att att-img" href="' . $url . '&amp;inline=1" target="_blank" rel="noopener"><img src="' . $url . '&amp;inline=1" alt="' . vaH($f['name']) . '" loading="lazy"></a>'
            : '<a class="att" href="' . $url . '">' . vaH($f['name']) . ' <span class="no">(' . $size((int) $f['size']) . ')</span></a>';
    }
    return $out !== '' ? '<div class="atts">' . $out . '</div>' : '';
};
$btn = static fn(string $action, string $label, string $cls, string $confirm) => '<form class="inline" method="post"'
    . ($confirm !== '' ? ' onsubmit="return confirm(' . vaH(json_encode($confirm)) . ')"' : '') . '>'
    . '<input type="hidden" name="csrf" value="' . vaH($csrf) . '"><input type="hidden" name="action" value="' . $action . '">'
    . '<button class="btn sm ' . $cls . '" type="submit">' . $label . '</button></form> ';

ob_start(); ?>
    <div class="sec-s">// ADMIN</div>
    <h1 class="sec-t">SUPPORT <span>INBOX</span></h1>
    <div class="row" style="margin:-14px 0 16px"><button class="btn sm" type="button" id="sound-toggle"></button>
        <span class="hint" style="margin:0">NEW MESSAGES BEEP ON EVERY ADMIN PAGE; THE BROWSER ALLOWS SOUND AFTER YOUR FIRST CLICK ON THE PAGE.</span></div>
    <script>
    (function () {
      var b = document.getElementById('sound-toggle');
      var on = function () { try { return localStorage.getItem('va-admin-sound') !== '0'; } catch (e) { return true; } };
      var label = function () { b.textContent = on() ? 'SOUND: ON' : 'SOUND: OFF'; };
      b.addEventListener('click', function () {
        try { localStorage.setItem('va-admin-sound', on() ? '0' : '1'); } catch (e) {}
        label();
        if (on() && window.vaBeep) setTimeout(window.vaBeep, 50);
      });
      label();
    })();
    </script>
    <?php if ($flash): ?><div class="flash <?= $h($flash[0]) ?>"><?= $h($flash[1]) ?></div><?php endif; ?>

<?php if ($thread):
    $db->prepare('UPDATE va_support_threads SET unread_admin = 0 WHERE id = ?')->execute([$id]);
    $messages = vaSupportMessages($db, $id); ?>
    <div class="row" style="margin-bottom:14px"><a class="btn" href="inbox.php">&lt;- ALL CONVERSATIONS</a>
        <?= $thread['status'] === 'open' ? $btn('close', 'CLOSE', '', '') : $btn('reopen', 'REOPEN', '', '') ?>
        <?= $btn('delete', 'DELETE', 'dng', 'Delete conversation #' . $id . ' with all messages?') ?></div>
    <div class="box" style="margin-bottom:18px">
        <div class="box-t">#<?= $id ?> / <?= $h($who($thread)) ?> <span class="<?= $thread['status'] === 'open' ? 'yes' : 'no' ?>">(<?= $h(strtoupper($thread['status'])) ?>)</span></div>
        <table class="kv" style="margin-bottom:14px">
            <tr><td>APP</td><td><?= $h(trim($thread['version'] . ' / ' . $thread['os'] . ' / ' . strtoupper($thread['lang']), ' /')) ?></td></tr>
            <tr><td>COUNTRY</td><td><?= $h($thread['country'] !== '' ? $thread['country'] . ' ' . vaCountryName($thread['country']) : '-') ?></td></tr>
            <tr><td>INSTALL</td><td><?= $h($thread['install_id']) ?></td></tr>
            <tr><td>STARTED</td><td><?= $h($when($thread['created_at'])) ?></td></tr>
        </table>
        <div class="chat" id="chat">
            <?php foreach ($messages as $m): ?><div class="msg msg-<?= $m['from'] ?>" data-id="<?= $m['id'] ?>"><div class="msg-meta"><?= $m['from'] === 'admin' ? 'YOU' : 'USER' ?> / <?= $h(date('Y-m-d H:i', strtotime($m['at']))) ?><?= $delBtn((int) $m['id']) ?></div><?php if ($m['text'] !== ''): ?><div class="msg-text"><?= $h($m['text']) ?></div><?php endif; ?><?= $filesHtml($m['files']) ?></div><?php endforeach; ?>
        </div>
        <form method="post" class="msg-form" id="reply" style="margin-top:16px" enctype="multipart/form-data">
            <input type="hidden" name="csrf" value="<?= $h($csrf) ?>"><input type="hidden" name="action" value="reply">
            <label>REPLY<textarea class="note" name="text" maxlength="8000" placeholder="Plain text"></textarea></label>
            <label>ATTACH FILES (OPTIONAL, MAX 3 / 4 MB: IMAGES, ASM, UB, TXT, PRG, D64, SID, CRT, ZIP ...)<input type="file" name="files[]" multiple></label>
            <div class="row">
                <button class="btn pri" type="submit">SEND REPLY</button>
                <?php if ($thread['email'] !== ''): ?><label class="chk"><input type="checkbox" name="mail" value="1" checked> ALSO EMAIL TO <?= $h($thread['email']) ?></label><?php endif; ?>
            </div>
        </form>
        <p class="hint">THE APP SHOWS THE REPLY AT ITS NEXT START OR WITHIN A MINUTE IF IT IS RUNNING (WITH A BEEP). NEW USER MESSAGES APPEAR HERE BY THEMSELVES. CTRL+ENTER SENDS.</p>
    </div>
    <script>
    (function () {
      var chat = document.getElementById('chat'), form = document.getElementById('reply');
      var last = function () { var m = chat.querySelectorAll('.msg'); return m.length ? m[m.length - 1].getAttribute('data-id') : 0; };
      var pad = function (n) { return String(n).padStart(2, '0'); };
      var fmt = function (iso) { var d = new Date(iso); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); };
      chat.scrollTop = chat.scrollHeight;
      setInterval(function () {
        fetch('inbox.php?id=<?= $id ?>&poll=1&after=' + last(), { credentials: 'same-origin', cache: 'no-store' })
          .then(function (r) { return r.json(); }).then(function (r) {
            (r.messages || []).forEach(function (m) {
              var div = document.createElement('div');
              div.className = 'msg msg-' + m.from + ' msg-new';
              div.setAttribute('data-id', m.id);
              var meta = document.createElement('div'); meta.className = 'msg-meta'; meta.textContent = (m.from === 'admin' ? 'YOU' : 'USER') + ' / ' + fmt(m.at);
              var del = document.createElement('form'); del.className = 'inline msg-del'; del.method = 'post';
              del.onsubmit = function () { return confirm('Delete this message?'); };
              [['csrf', <?= json_encode($csrf) ?>], ['action', 'delete_msg'], ['message_id', m.id]].forEach(function (kv) {
                var i = document.createElement('input'); i.type = 'hidden'; i.name = kv[0]; i.value = kv[1]; del.appendChild(i);
              });
              var x = document.createElement('button'); x.className = 'msg-x'; x.type = 'submit'; x.textContent = 'x'; x.setAttribute('aria-label', 'Delete message');
              del.appendChild(x); meta.appendChild(del);
              div.appendChild(meta);
              if (m.text) { var text = document.createElement('div'); text.className = 'msg-text'; text.textContent = m.text; div.appendChild(text); }
              if (m.files && m.files.length) {
                var atts = document.createElement('div'); atts.className = 'atts';
                m.files.forEach(function (f) {
                  var a = document.createElement('a'), url = 'inbox.php?file=' + f.id;
                  a.className = 'att' + (f.image ? ' att-img' : '');
                  if (f.image) { a.href = url + '&inline=1'; a.target = '_blank'; var img = document.createElement('img'); img.src = url + '&inline=1'; img.alt = f.name; a.appendChild(img); }
                  else { a.href = url; a.textContent = f.name + ' (' + Math.max(1, Math.round(f.size / 1024)) + ' KB)'; }
                  atts.appendChild(a);
                });
                div.appendChild(atts);
              }
              chat.appendChild(div);
              chat.scrollTop = chat.scrollHeight;
            });
          }).catch(function () {});
      }, 10000);
      form.elements.text.addEventListener('keydown', function (e) { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) form.requestSubmit(); });
    })();
    </script>
<?php else:
    $tab = in_array($_GET['tab'] ?? '', ['open', 'closed', 'all'], true) ? $_GET['tab'] : 'open';
    $where = $tab === 'all' ? '1' : ($tab === 'closed' ? "t.status = 'closed'" : "t.status = 'open'");
    $threads = $db->query("SELECT t.*, (SELECT body FROM va_support_messages m WHERE m.thread_id = t.id ORDER BY m.id DESC LIMIT 1) AS last_body,
            (SELECT sender FROM va_support_messages m WHERE m.thread_id = t.id ORDER BY m.id DESC LIMIT 1) AS last_from,
            (SELECT COUNT(*) FROM va_support_messages m WHERE m.thread_id = t.id) AS msgs
        FROM va_support_threads t WHERE $where ORDER BY t.unread_admin > 0 DESC, t.updated_at DESC LIMIT 200")->fetchAll(); ?>
    <div class="row" style="justify-content:space-between;margin-bottom:14px">
        <div class="tabs" style="margin:0">
            <?php foreach (['open' => 'OPEN', 'closed' => 'CLOSED', 'all' => 'ALL'] as $k => $v): ?><a class="<?= $tab === $k ? 'on' : '' ?>" href="inbox.php?tab=<?= $k ?>"><?= $v ?></a><?php endforeach; ?>
        </div>
        <?= $btn('delete_all', 'DELETE ALL CONVERSATIONS', 'dng', 'Delete ALL support conversations with every message and attachment? This cannot be undone.') ?>
    </div>
    <div class="box">
        <?php if ($threads): ?><table class="wide">
            <tr><th>#</th><th>FROM</th><th>LAST MESSAGE</th><th>MSGS</th><th>UPDATED</th><th>COUNTRY</th><th>APP</th><th></th></tr>
            <?php foreach ($threads as $t): ?><tr<?= $t['unread_admin'] > 0 ? ' class="unread"' : '' ?>>
                <td class="n"><a href="inbox.php?id=<?= (int) $t['id'] ?>"><?= (int) $t['id'] ?></a></td>
                <td class="e"><a href="inbox.php?id=<?= (int) $t['id'] ?>"><?= $h($who($t)) ?></a><?= $t['unread_admin'] > 0 ? ' <span class="warn">NEW ' . (int) $t['unread_admin'] . '</span>' : '' ?></td>
                <td class="e clip"><?= $t['last_from'] === 'admin' ? '<span class="no">YOU:</span> ' : '' ?><?= (string) $t['last_body'] !== '' ? $h(mb_substr(preg_replace('/\s+/', ' ', (string) $t['last_body']), 0, 90)) : '<span class="no">(ATTACHMENT)</span>' ?></td>
                <td class="n"><?= (int) $t['msgs'] ?></td>
                <td><?= $h($when($t['updated_at'])) ?></td>
                <td><?= $h($t['country'] ?: '--') ?></td>
                <td><?= $h(trim($t['version'] . ' / ' . $t['os'], ' /')) ?></td>
                <td><form class="inline" method="post" action="inbox.php?id=<?= (int) $t['id'] ?>" onsubmit="return confirm(<?= $h(json_encode('Delete conversation #' . $t['id'] . ' with all messages and attachments?')) ?>)">
                    <input type="hidden" name="csrf" value="<?= $h($csrf) ?>"><input type="hidden" name="action" value="delete">
                    <button class="btn sm dng" type="submit">DELETE</button></form></td>
            </tr><?php endforeach; ?>
        </table><?php else: ?><p class="no">NO CONVERSATIONS.</p><?php endif; ?>
        <p class="hint">USERS WRITE FROM THE APP (MENU -> SUPPORT). THIS LIST REFRESHES BY ITSELF WHEN A NEW MESSAGE ARRIVES.</p>
    </div>
    <script>
    // az admin.php élő értesítése jelzi az új üzenetet; a csipogás után frissül a lista (ha épp nem gépelsz)
    document.addEventListener('va-support-change', function () {
      setTimeout(function () { if (!document.activeElement || !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) location.reload(); }, 900);
    });
    </script>
<?php endif; ?>
<?php vaAdminPage('SUPPORT', (string) ob_get_clean());
