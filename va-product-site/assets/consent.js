// Süti-hozzájárulás (GDPR / ePrivacy): szükséges (mindig), beállítások (<code>va_docs_*</code>), statisztika (látogatószámláló).
// A döntés a va_consent sütiben: "1.<beállítások><statisztika>", pl. "1.10"; 180 napig érvényes.
// API: vaConsent.get('prefs' | 'stats'), vaConsent.open(); változáskor 'va-consent' esemény a document-en.
(function () {
  var NAME = 'va_consent';
  var MAX_AGE = 180 * 86400;
  var PREF_COOKIES = ['va_docs_lang', 'va_docs_manual', 'va_docs_width', 'va_docs_height'];

  function readCookie(name) {
    var row = document.cookie.split('; ').find(function (r) { return r.indexOf(name + '=') === 0; });
    return row ? decodeURIComponent(row.slice(name.length + 1)) : null;
  }
  function parse(v) {
    var m = /^1\.([01])([01])$/.exec(v || '');
    return m ? { prefs: m[1] === '1', stats: m[2] === '1' } : null;
  }
  var state = parse(readCookie(NAME));

  function save(next) {
    var prev = state || { prefs: false, stats: false };
    state = { prefs: !!next.prefs, stats: !!next.stats };
    var secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = NAME + '=1.' + (state.prefs ? 1 : 0) + (state.stats ? 1 : 0) + '; Max-Age=' + MAX_AGE + '; Path=/; SameSite=Lax' + secure;
    if (prev.prefs && !state.prefs) {
      PREF_COOKIES.forEach(function (c) { document.cookie = c + '=; Max-Age=0; Path=/; SameSite=Lax'; });
    }
    // a látogatószámláló sütije HttpOnly, ezért a szerver törli
    if (!state.stats) {
      fetch('visitor-counter.php?forget=1', { cache: 'no-store', credentials: 'same-origin' }).catch(function () {});
    }
    document.dispatchEvent(new CustomEvent('va-consent', { detail: { prefs: state.prefs, stats: state.stats } }));
  }

  var css = '' +
    '.vac{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483000;max-width:760px;margin:0 auto;' +
    'background:#12126a;color:#b8b8ff;border:2px solid #6868c8;box-shadow:0 8px 0 rgba(0,0,0,.45);' +
    "font-family:'C64Mono','Courier New',monospace;font-size:12px;line-height:1.7;letter-spacing:.5px;padding:18px 20px}" +
    ".vac h2{font-family:'C64Pro','C64Mono',monospace;font-size:13px;font-weight:normal;letter-spacing:2px;color:#b8c76f;margin:0 0 8px}" +
    '.vac p{margin:0 0 12px;color:#8888e8}.vac a{color:#b8c76f}.vac code{font-family:inherit;text-transform:none;color:#b8b8ff}' +
    '.vac-btns{display:flex;flex-wrap:wrap;gap:8px}' +
    ".vac button{font-family:inherit;font-size:11px;letter-spacing:1px;text-transform:uppercase;cursor:pointer;padding:9px 14px;" +
    'background:transparent;color:#b8b8ff;border:1px solid #6868c8;min-height:36px}' +
    '.vac button:hover,.vac button:focus-visible{border-color:#b8c76f;color:#b8c76f;outline:none}' +
    '.vac button.pri{background:#b8c76f;color:#12126a;border-color:#b8c76f}' +
    '.vac button.pri:hover,.vac button.pri:focus-visible{background:#d0dd88;color:#12126a}' +
    '.vac-opts{margin:0 0 14px;padding:0;list-style:none}' +
    '.vac-opts li{display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-top:1px solid #363690}' +
    '.vac-opts input{margin-top:4px;width:16px;height:16px;accent-color:#b8c76f;flex:none}' +
    '.vac-opts b{color:#b8b8ff;font-weight:normal}.vac-opts span{display:block;color:#8888e8;font-size:11px}' +
    '@media (max-width:520px){.vac{left:8px;right:8px;bottom:8px;padding:14px}.vac-btns button{flex:1 1 auto}}';

  var box = null;
  function close() {
    if (box) { box.remove(); box = null; }
  }
  function open(showSettings) {
    close();
    if (!document.getElementById('vac-style')) {
      var st = document.createElement('style');
      st.id = 'vac-style';
      st.textContent = css;
      document.head.appendChild(st);
    }
    var cur = state || { prefs: false, stats: false };
    box = document.createElement('section');
    box.className = 'vac';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Cookie settings');
    box.innerHTML =
      '<h2>COOKIES</h2>' +
      '<p>This site uses a few small cookies of its own: one remembers your choice here, and with your consent others remember your documentation ' +
      'language and window size and count unique visitors. No advertising or tracking cookies, nothing is shared with third parties. ' +
      '<a href="privacy.html">Privacy policy</a></p>' +
      (showSettings ?
        '<ul class="vac-opts">' +
        '<li><input type="checkbox" checked disabled id="vac-nec"><label for="vac-nec"><b>NECESSARY</b><span>Your cookie choice (<code>va_consent</code>). Always on.</span></label></li>' +
        '<li><input type="checkbox" id="vac-prefs"' + (cur.prefs ? ' checked' : '') + '><label for="vac-prefs"><b>PREFERENCES</b><span>Documentation language, manual and window size (<code>va_docs_*</code>), 1 year.</span></label></li>' +
        '<li><input type="checkbox" id="vac-stats"' + (cur.stats ? ' checked' : '') + '><label for="vac-stats"><b>STATISTICS</b><span>Unique visitor counter (<code>c64va_visitor_seen</code>), 1 year. Only a total number is stored, no personal data.</span></label></li>' +
        '</ul>' +
        '<div class="vac-btns"><button type="button" class="pri" data-vac="save">SAVE CHOICES</button>' +
        '<button type="button" data-vac="all">ACCEPT ALL</button><button type="button" data-vac="none">REJECT ALL</button></div>'
        :
        '<div class="vac-btns"><button type="button" class="pri" data-vac="all">ACCEPT ALL</button>' +
        '<button type="button" class="pri" data-vac="none">REJECT ALL</button><button type="button" data-vac="settings">SETTINGS</button></div>');
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-vac]');
      if (!b) return;
      var a = b.getAttribute('data-vac');
      if (a === 'settings') { open(true); return; }
      if (a === 'all') save({ prefs: true, stats: true });
      else if (a === 'none') save({ prefs: false, stats: false });
      else save({ prefs: box.querySelector('#vac-prefs').checked, stats: box.querySelector('#vac-stats').checked });
      close();
    });
    document.body.appendChild(box);
    var first = box.querySelector('button');
    if (first && showSettings !== undefined) first.focus();
  }

  window.vaConsent = {
    get: function (cat) { return !!(state && state[cat]); },
    decided: function () { return state !== null; },
    open: function () { open(true); }
  };
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-cookie-settings]');
    if (a) { e.preventDefault(); open(true); }
  });
  function init() { if (state === null) open(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
