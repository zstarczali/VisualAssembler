# PayPal: átállás kézi (paypal.me) módról üzleti (Live) módra

## Jelenlegi állapot — kézi mód

- A `config.php`-ban `paypal.mode = 'sandbox'`, ezért a `buy.php` nem a PayPal Checkout gombot mutatja,
  hanem egy „Pay with PayPal” gombot a `https://paypal.me/ZsoltTarczali/5EUR` címre, és megkéri a vevőt,
  hogy a PayPal megjegyzésbe írja be, melyik e-mail címre kéri a sorozatszámot.
- A termékoldal (`va-product-site/index.html`) három BUY linkje (a „JUST 5€” bélyeg, a letöltési rész 3. lépése,
  a Pricing gomb) szintén a `paypal.me/ZsoltTarczali/5EUR` címre mutat, alatta ugyanez a megjegyzés-kérés.
- Az app licencablakának **Buy** gombja a `register/buy.php`-ra visz, így az is a fenti kézi oldalt kapja.

### Teendő minden befizetésnél

1. A PayPal „Pénzt kaptál” / „You've received money” levelében (vagy a
   [paypal.com/myaccount/activity](https://www.paypal.com/myaccount/activity) oldalon) megnézed a küldő
   e-mail címét és a megjegyzését.
   Ha nem jön levél: PayPal → Beállítások (fogaskerék) → **Értesítések** → „Pénzt kaptam” bekapcsolva.
2. `https://www.c64va.pro/register/stats.php` → **MANAGE** doboz → **EMAIL ADDRESS** mezőbe a cím
   (a megjegyzésben kért cím, ha van), nyelv (EN / HU) → **SEND SERIAL**.
3. Fent zöld sáv: „SERIAL SENT: …”. A cím donorként is felkerül, és látszik a LAST 50 SERIALS SENT listában.

## Átállás üzleti (Live) módra

Feltétel: **üzleti (Business) PayPal-fiók**. Live REST API-kulcsot magánfiók nem kap.

1. **PayPal Developer Dashboard** → Apps & Credentials → fent a kapcsoló **Live** állásban →
   alkalmazás létrehozása (ha még nincs) → **Live client ID** és **Live secret** kimásolása.
   A sandbox és a live kulcspár különböző — a mostani `client_id` a sandboxé, nem használható élesben.
2. Ugyanebben a Live alkalmazásban **webhook** hozzáadása:
   - URL: `https://www.c64va.pro/register/webhook.php`
   - esemény: `PAYMENT.CAPTURE.COMPLETED`
   - a kapott **webhook ID** feljegyzése.
3. **Próba sandboxban** (élesítés előtt erősen ajánlott): egy sandbox teszt-vevőfiókkal
   (`…@personal.example.com`, Developer Dashboard → Testing Tools → Sandbox Accounts) végigfuttatni a
   teljes folyamatot: fizetés → serial e-mail → a vásárlás megjelenik a dashboardon.
   Ehhez a próba idejére a `buy.php` kézi módját ki kell kapcsolni (lásd a megjegyzést lent).
4. A **szerveren** lévő `register/config.php` (nincs a repóban):

   ```php
   'paypal' => [
       'mode' => 'live',
       'client_id' => '<Live client ID>',
       'secret' => '<Live secret>',          // vagy a VA_PAYPAL_SECRET környezeti változóban
       'webhook_id' => '<Live webhook ID>',
       'price' => '5.00',
       'currency' => 'EUR',
       'item_name' => 'C64 Visual Assembler Professional',
   ],
   ```

   Ettől kezdve a `buy.php` magától az automatikus PayPal Checkout gombot mutatja (az app **Buy** gombja is),
   és a dashboard tetejéről eltűnnek a piros **SANDBOX** / **NO WEBHOOK** sávok.
5. **Termékoldal** (`va-product-site/index.html`): a három BUY link visszaírása `register/buy.php`-ra
   (`target="_blank" rel="noopener"` nélkül), és a „WRITE THE EMAIL ADDRESS FOR YOUR SERIAL IN THE PAYPAL NOTE”
   sorok törlése a letöltési 3. lépés és a Pricing gombsor alól. A letöltési felugró ablak („SEND $5 VIA PAYPAL”)
   támogatás marad, ott a megjegyzés-kérés maradhat.
6. Feltöltés után ellenőrzés: `https://www.c64va.pro/register/buy.php` — e-mail mező + sárga PayPal gomb;
   a forrásban a PayPal SDK URL-jében az új (Live) `client-id` szerepel.

## Élesítés után

- A serial a fizetés után automatikusan megy ki, a vásárlás **PAYPAL PURCHASES**-ként és a **REVENUE**
  táblában látszik.
- Ha a vevő a fizetés után túl korán bezárja az oldalt, a webhook pótolja a teljesítést. Ha mégis elakad egy
  rendelés, a dashboard **PAYPAL ORDERS** dobozában a **RECHECK** gomb lekérdezi a PayPaltól, és ha ki van
  fizetve, elküldi a serialt.
- A közben `paypal.me`-n érkezett befizetésekhez továbbra is a **SEND SERIAL** kell. A serial az e-mail címből
  számolódik, így a régi és az új vásárlók ugyanazt a sorozatszámot kapják ugyanarra a címre.

## Megjegyzés: a kézi mód kapcsolója

A `buy.php` akkor van kézi (paypal.me) módban, ha `paypal.mode` nem `live`, vagy üres a `client_id`
(`$manual` változó a `buy.php` elején). Sandboxos próbához ideiglenesen a `$manual = false;` sorral
kikapcsolható, a próba után vissza kell állítani.

## Adózás

Ha a fizetésért Professional serial jár, az termékértékesítés, nem adomány. Üzleti módra állás előtt
(és a rendszeres kézi eladásnál is) érdemes könyvelővel egyeztetni a vállalkozói formát és a számlázást.
