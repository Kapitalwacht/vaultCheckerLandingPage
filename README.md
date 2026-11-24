# VaultChecker Landing Page

Public marketing site for VaultChecker, a multi-store platform that digitalises the neighbourhood
paper store credit ledger. The page presents the problem, the benefits, the plans
and the FAQ, and sends visitors to the deployed app to sign in or create an account.

Built with plain HTML, CSS and JavaScript: there are no dependencies and no build step.

## Tech stack

| Concern    | Choice                                                     |
|------------|------------------------------------------------------------|
| Markup     | HTML5                                                      |
| Styles     | CSS (`src/styles.css`)                                     |
| Behaviour  | Vanilla JavaScript (`src/script.js`, `src/app-shots.js`)   |
| i18n       | JSON dictionaries loaded at runtime (`i18n/es.json`, `i18n/en.json`) |
| Hosting    | GitHub Pages                                               |

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
    ├── script.js       # Menu, language switch, links to the app and contact form
    └── app-shots.js    # App screenshots shown in the carousel
```

### Page sections

| Section      | Anchor        | Content                                     |
|--------------|---------------|---------------------------------------------|
| Home         | `#home`       | Value proposition and the problem it solves |
| Benefits     | `#benefits`   | Benefits and app screenshots                |
| Plans        | `#membership` | Corner, Business and Chain                  |
| FAQ          | `#faq`        | Frequently asked questions                  |
| Contact      | `#contact`    | WhatsApp card and contact form              |

### Languages

Elements with a `data-i18n` attribute take their text from the dictionaries in `i18n/`, and
inputs with `data-i18n-placeholder` take their placeholder from them. The chosen
language is remembered in `localStorage` under `vc.landing.lang`. To add or change a text, update
both `en.json` and `es.json`.

### Link to the app

The sign-in and sign-up buttons use the `APP_URL` constant at the top of `src/script.js`. It points
to the deployed app:

```js
const APP_URL = "https://vaultchecker-frontend.web.app";
```

## Contact section

The `#contact` section sits between the FAQ and the footer. The menu and the footer links scroll to it.

### WhatsApp

The WhatsApp card links to `https://wa.me/51942993152` (+51 942 993 152) and opens in a new tab. The
prefilled message comes from `contact.whatsapp.message` in the dictionaries, so it follows the
chosen language. The number is the `WHATSAPP_NUMBER` constant in `src/script.js`.

### Contact form

The form asks for name, email and message. It is validated in the browser with translated error
messages, has a hidden honeypot field (`_honey`) to stop bots, and disables the button while it sends.

There is no backend: the form is sent with [FormSubmit](https://formsubmit.co), which is free and
needs no account. `src/script.js` sends a JSON `POST` to the `CONTACT_ENDPOINT` constant:

```js
const CONTACT_ENDPOINT = "https://formsubmit.co/ajax/kapitalwatch@gmail.com";
```

Besides `name`, `email` and `message`, the request includes `_replyto`, `_subject`,
`_template: "table"` and `_captcha: "false"`.

### Activating the form

FormSubmit must be activated once for the receiving address:

1. Open the published page (or the local server) and send a test message from the form.
2. FormSubmit sends an activation email to `kapitalwatch@gmail.com`.
3. Open that email and confirm it. Until then no message is delivered.

After activation every message arrives in that inbox, and replying answers the visitor directly.

## Running locally

The dictionaries are loaded with `fetch`, so open the site through a local server, not as a file:

```bash
python -m http.server 8080
```

- Landing page: `http://localhost:8080/src/`

## Deployment

Published with GitHub Pages from `main`:
`https://kapitalwacht.github.io/vaultCheckerLandingPage/src/`.

## Related repositories

- [VaultCheckerFrontend](https://github.com/Kapitalwacht/VaultCheckerFrontend): web application
- [VaultCheckerBackend](https://github.com/Kapitalwacht/VaultCheckerBackend): REST API
