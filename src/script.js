const APP_URL = "https://vaultchecker-frontend.web.app";
const LANG_KEY = "vc.landing.lang";
const WHATSAPP_NUMBER = "51942993152";
const CONTACT_ENDPOINT = "https://formsubmit.co/ajax/kapitalwatch@gmail.com";
const CONTACT_TIMEOUT_MS = 10000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const translations = {};

const header = document.querySelector("header");
const navToggle = document.querySelector("[data-nav-toggle]");

function closeMenu() {
    if (!header) return;
    header.classList.remove("nav-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
}

function resolveKey(dict, key) {
    return key.split(".").reduce((value, part) => (value == null ? value : value[part]), dict);
}

function t(key) {
    const lang = document.documentElement.lang;
    const text = resolveKey(translations[lang] || {}, key);
    return typeof text === "string" ? text : "";
}

function updateWhatsAppLinks() {
    const message = t("contact.whatsapp.message");
    document.querySelectorAll("[data-whatsapp]").forEach((link) => {
        link.href = `https://wa.me/${WHATSAPP_NUMBER}` + (message ? `?text=${encodeURIComponent(message)}` : "");
    });
}

function applyLanguage(lang) {
    const dict = translations[lang];
    if (!dict) return;
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const text = resolveKey(dict, element.getAttribute("data-i18n"));
        if (typeof text === "string") element.textContent = text;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
        const text = resolveKey(dict, element.getAttribute("data-i18n-placeholder"));
        if (typeof text === "string") element.setAttribute("placeholder", text);
    });
    updateWhatsAppLinks();
    const toggle = document.querySelector("[data-lang-toggle]");
    if (toggle) toggle.textContent = lang === "es" ? "EN" : "ES";
    try {
        localStorage.setItem(LANG_KEY, lang);
    } catch (error) {}
}

async function loadLanguage(lang) {
    if (!translations[lang]) {
        try {
            const response = await fetch(`../i18n/${lang}.json`);
            translations[lang] = await response.json();
        } catch (error) {
            return;
        }
    }
    applyLanguage(lang);
}

function currentLanguage() {
    try {
        return localStorage.getItem(LANG_KEY) || "es";
    } catch (error) {
        return "es";
    }
}

document.querySelectorAll(".FAQ_show_text").forEach((button) => {
    button.addEventListener("click", () => {
        const card = button.closest(".FAQ_card");
        const isOpen = card.classList.toggle("open");
        button.textContent = isOpen ? "−" : "+";
    });
});

document.querySelectorAll("[data-target]").forEach((button) => {
    button.addEventListener("click", () => {
        const target = document.getElementById(button.getAttribute("data-target"));
        if (target) target.scrollIntoView({ behavior: "smooth" });
        closeMenu();
    });
});

document.querySelectorAll("[data-app-login]").forEach((button) => {
    button.addEventListener("click", () => {
        closeMenu();
        window.location.href = `${APP_URL}/login`;
    });
});

document.querySelectorAll("[data-app-register]").forEach((button) => {
    button.addEventListener("click", () => {
        closeMenu();
        window.location.href = `${APP_URL}/register`;
    });
});

const langToggle = document.querySelector("[data-lang-toggle]");
if (langToggle) {
    langToggle.addEventListener("click", () => {
        const next = document.documentElement.lang === "es" ? "en" : "es";
        loadLanguage(next);
    });
}

if (navToggle && header) {
    navToggle.addEventListener("click", () => {
        const open = header.classList.toggle("nav-open");
        navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
}

function initGallery(gallery) {
    const track = gallery.querySelector("[data-track]");
    const slides = Array.from(track.children);
    const shots = window.APP_SHOTS || [];
    slides.forEach((slide, i) => {
        const img = slide.querySelector("img");
        if (img && shots[i]) img.src = shots[i];
    });
    const dotsBox = gallery.querySelector("[data-dots]");
    const prev = gallery.querySelector("[data-prev]");
    const next = gallery.querySelector("[data-next]");
    let index = 0;

    const dots = slides.map((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "Slide " + (i + 1));
        dot.addEventListener("click", () => go(i));
        dotsBox.appendChild(dot);
        return dot;
    });

    function go(i) {
        index = (i + slides.length) % slides.length;
        track.style.transform = "translateX(" + (-index * 100) + "%)";
        dots.forEach((d, di) => d.classList.toggle("is_active", di === index));
    }

    if (prev) prev.addEventListener("click", () => go(index - 1));
    if (next) next.addEventListener("click", () => go(index + 1));

    let startX = null;
    track.addEventListener("pointerdown", (e) => { startX = e.clientX; });
    track.addEventListener("pointerup", (e) => {
        if (startX === null) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
        startX = null;
    });

    go(0);
}

document.querySelectorAll("[data-gallery]").forEach(initGallery);

function setMessage(element, key) {
    if (key) {
        element.setAttribute("data-i18n", key);
        element.textContent = t(key);
    } else {
        element.removeAttribute("data-i18n");
        element.textContent = "";
    }
}

function initContactForm(form) {
    const submit = form.querySelector("[data-contact-submit]");
    const status = form.querySelector("[data-contact-status]");
    const fields = {
        name: form.elements.name,
        email: form.elements.email,
        message: form.elements.message
    };

    function validateField(name) {
        const value = fields[name].value.trim();
        let error = "";
        if (name === "name" && !value) error = "contact.errors.nameRequired";
        if (name === "email") {
            if (!value) error = "contact.errors.emailRequired";
            else if (!EMAIL_PATTERN.test(value)) error = "contact.errors.emailInvalid";
        }
        if (name === "message") {
            if (!value) error = "contact.errors.messageRequired";
            else if (value.length < 10) error = "contact.errors.messageShort";
        }
        const input = fields[name];
        const errorBox = document.getElementById(input.id + "-error");
        if (error) {
            input.setAttribute("aria-invalid", "true");
            input.setAttribute("aria-describedby", errorBox.id);
        } else {
            input.removeAttribute("aria-invalid");
            input.removeAttribute("aria-describedby");
        }
        setMessage(errorBox, error);
        return !error;
    }

    function setStatus(type, key) {
        status.classList.toggle("is_success", type === "success");
        status.classList.toggle("is_error", type === "error");
        setMessage(status, key);
    }

    Object.keys(fields).forEach((name) => {
        fields[name].addEventListener("input", () => {
            if (fields[name].hasAttribute("aria-invalid")) validateField(name);
        });
        fields[name].addEventListener("blur", () => {
            if (fields[name].value.trim()) validateField(name);
        });
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        setStatus("", "");
        const results = Object.keys(fields).map(validateField);
        if (results.includes(false)) {
            const firstInvalid = form.querySelector("[aria-invalid='true']");
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        if (form.elements._honey.value) {
            form.reset();
            setStatus("success", "contact.form.success");
            return;
        }

        submit.disabled = true;
        setMessage(submit, "contact.form.sending");
        const email = fields.email.value.trim();
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), CONTACT_TIMEOUT_MS);
        try {
            const response = await fetch(CONTACT_ENDPOINT, {
                method: "POST",
                signal: controller.signal,
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                    name: fields.name.value.trim(),
                    email: email,
                    message: fields.message.value.trim(),
                    _replyto: email,
                    _subject: t("contact.form.subject"),
                    _template: "table",
                    _captcha: "false",
                    _honey: ""
                })
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok || String(data.success) !== "true") throw new Error(data.message || "Send failed");
            form.reset();
            setStatus("success", "contact.form.success");
        } catch (error) {
            const reason = error.name === "AbortError"
                ? `No response from FormSubmit after ${CONTACT_TIMEOUT_MS / 1000} s`
                : error.message;
            console.warn("[contact] Message not sent:", reason);
            setStatus("error", "contact.form.error");
        } finally {
            clearTimeout(timer);
            submit.disabled = false;
            setMessage(submit, "contact.form.submit");
        }
    });
}

document.querySelectorAll("[data-contact-form]").forEach(initContactForm);

loadLanguage(currentLanguage());
