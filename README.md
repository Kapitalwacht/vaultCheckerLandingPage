# VaultChecker — Landing Page

Public marketing site for **VaultChecker**, a multi-store platform that digitalises the neighbourhood
_"cuaderno de fiado"_ (store credit ledger). The page presents the problem, the benefits, the plans
and the FAQ, and sends visitors to the deployed app to sign in or create an account.

Built with plain **HTML**, **CSS** and **JavaScript**: there are no dependencies and no build step.

---

## Tech stack

| Concern    | Choice                                                     |
|------------|------------------------------------------------------------|
| Markup     | HTML5                                                      |
| Styles     | CSS (`src/styles.css`)                                     |
| Behaviour  | Vanilla JavaScript (`src/script.js`, `src/app-shots.js`)   |
| i18n       | JSON dictionaries loaded at runtime (`i18n/es.json`, `i18n/en.json`) |
| Hosting    | GitHub Pages                                               |

---

## Project structure

```
vaultCheckerLandingPage/
├── assets/             # Favicon and logos
├── i18n/
│   ├── en.json         # English texts
│   └── es.json         # Spanish texts
└── src/
    ├── index.html      # The landing page
    ├── styles.css      # Styles
    ├── script.js       # Menu, language switch and links to the app
    └── app-shots.js    # App screenshots shown in the carousel
```

### Page sections

| Section      | Anchor        | Content                                     |
|--------------|---------------|---------------------------------------------|
| Home         | `#home`       | Value proposition and the problem it solves |
| Benefits     | `#benefits`   | Benefits and app screenshots                |
| Plans        | `#membership` | Barrio, Negocio and Cadena                  |
| FAQ          | `#faq`        | Frequently asked questions                  |
| Contact      | `#contact`    | Footer and contact details                  |

### Languages

Elements with a `data-i18n` attribute take their text from the dictionaries in `i18n/`. The chosen
language is remembered in `localStorage` under `vc.landing.lang`. To add or change a text, update
**both** `en.json` and `es.json`.

### Link to the app

The sign-in and sign-up buttons use the `APP_URL` constant at the top of `src/script.js`. It points
to the deployed app:

```js
const APP_URL = "https://vaultchecker-frontend.web.app";
```

---

## Running locally

The dictionaries are loaded with `fetch`, so open the site through a local server, not as a file:

```bash
python -m http.server 8080
```

- Landing page: `http://localhost:8080/src/`

## Deployment

Published with **GitHub Pages** from `main`:
`https://kapitalwacht.github.io/vaultCheckerLandingPage/src/`.

## Related repositories

- [VaultCheckerFrontend](https://github.com/Kapitalwacht/VaultCheckerFrontend) — web application
- [VaultCheckerBackend](https://github.com/Kapitalwacht/VaultCheckerBackend) — REST API
