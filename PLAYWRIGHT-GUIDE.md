# Playwright Test Guide - FairPlay

## Pre pokretanja

Potrebne su ti environment varijable. Možeš ih postaviti na dva načina:

### Opcija 1: .env fajl (preporučeno za lokalni rad)

Kreiraj `.env` fajl u root-u projekta:

```
BASIC_AUTH_USER=tvoj_user
BASIC_AUTH_PASS=tvoj_pass
TEST_USER_EMAIL=tvoj_email
TEST_USER_PASSWORD=tvoj_password
```

### Opcija 2: Inline pre komande

```bash
BASIC_AUTH_USER=user BASIC_AUTH_PASS=pass TEST_USER_EMAIL=email TEST_USER_PASSWORD=pass npx playwright test
```

---

## Pokretanje testova

### Svi testovi

```bash
npm test
```

### Po grupama

| Komanda | Šta pokreće |
|---|---|
| `npm run test:login` | Login testovi (auth/) |
| `npm run test:products` | Product testovi (products/) |
| `npm run test:purchase` | Purchase testovi (purchase/) |
| `npm run test:account` | Account testovi (account/) |
| `npm run test:referral` | Referral testovi (referral/) |

### Pojedinačan test fajl

```bash
npx playwright test tests/auth/login.spec.js
npx playwright test tests/products/browse-products.spec.js
npx playwright test tests/products/buy-bundles.spec.js
npx playwright test tests/products/purchase-flow.spec.js
npx playwright test tests/products/verify-prices.spec.js
npx playwright test tests/purchase/complete-purchase.spec.js
npx playwright test tests/purchase/duplicate-purchase.spec.js
npx playwright test tests/referral/referral-tracking.spec.js
npx playwright test tests/account/flex-start-stop.spec.js
npx playwright test tests/account/profile.spec.js
npx playwright test tests/account/delete-payment.spec.js
```

### Pojedinačan test po imenu

```bash
npx playwright test -g "should login with valid credentials"
npx playwright test -g "should display Flex subscription plans"
npx playwright test -g "should complete payment and see success page"
```

`-g` filtrira testove po imenu (ili delu imena). Može i regex:

```bash
npx playwright test -g "should show BUY NOW"
```

---

## Režimi pokretanja

### Headed (sa otvorenim browserom)

```bash
npm run test:headed
```

Ili za specifičan fajl:

```bash
npx playwright test tests/auth/login.spec.js --headed
```

### UI Mode (interaktivni runner - kao Cypress runner)

```bash
npm run test:ui
```

Otvara se vizuelni interfejs gde možeš:
- Birati koje testove da pokreneš
- Gledati svaki korak
- Videti screenshot svakog koraka
- Ponovo pokrenuti test

### Debug Mode (step by step)

```bash
npm run test:debug
```

Ili za specifičan test:

```bash
npx playwright test tests/auth/login.spec.js --debug
```

Otvara Playwright Inspector - možeš korak po korak ići kroz test.

---

## Rezultati i reporti

### HTML Report (nakon što testovi završe)

```bash
npm run report
```

Otvara detaljan HTML izveštaj sa:
- Status svakog testa (pass/fail)
- Screenshot na failure
- Video snimak
- Trace fajl za debug

### Trace Viewer (za detaljnu analizu pada)

```bash
npx playwright show-trace test-results/FOLDER/trace.zip
```

---

## Korisne opcije

### Pokreni samo testove koji su pali prošli put

```bash
npx playwright test --last-failed
```

### Pokreni sa retry-om

```bash
npx playwright test --retries=2
```

### Pokreni sa jednim workerom (bez paralelizacije)

```bash
npx playwright test --workers=1
```

### Pokreni samo logged-in ili logged-out projekte

```bash
npx playwright test --project=logged-in
npx playwright test --project=logged-out
```

---

## Struktura test fajlova

```
tests/
  auth.setup.js               ← Automatski login (ne pokrećeš ručno)
  helpers/
    payment.js                ← Payment helper funkcije
    products.js               ← Product helper funkcije
  auth/
    login.spec.js             ← Login flow (3 testa)
  products/
    browse-products.spec.js   ← Pregled proizvoda (4 testa)
    buy-bundles.spec.js       ← Kupovina bundlova (6 testova)
    purchase-flow.spec.js     ← Purchase flow (6 testova)
    verify-prices.spec.js     ← Provera cena (8 testova)
  purchase/
    complete-purchase.spec.js ← Kompletan purchase (7 testova)
    duplicate-purchase.spec.js← Duplikat prevencija (4 testa)
  referral/
    referral-tracking.spec.js ← Referral praćenje (4 testa)
  account/
    flex-start-stop.spec.js   ← Flex start/stop (5 testova)
    profile.spec.js           ← Profil stranica (7 testova)
    delete-payment.spec.js    ← Brisanje plaćanja (2 testa)
```

---

## Čišćenje

```bash
npm run clean
```

Briše `playwright-report/`, `test-results/` i `.auth/` foldere.
