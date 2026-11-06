const APP_URL = "http://localhost:5173";
const LANG_KEY = "vc.landing.lang";
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

function applyLanguage(lang) {
    const dict = translations[lang];
    if (!dict) return;
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const text = resolveKey(dict, element.getAttribute("data-i18n"));
        if (typeof text === "string") element.textContent = text;
    });
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

loadLanguage(currentLanguage());
