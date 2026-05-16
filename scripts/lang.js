// scripts/lang.js
// Translations for UI elements
const translations = {
    ru: {
        title: "RemontExpert 3D Pro - Русская версия",
        filters: "Фильтры",
        jobTypes: "Тип работ",
        painting: "Покраска",
        wallpaper: "Поклейка обоев",
        selectAll: "Выбрать всё",
        frontWall: "Передняя стена",
        backWall: "Задняя стена",
        leftWall: "Левая стена",
        rightWall: "Правая стена",
        floor: "Пол",
        ceiling: "Потолок",
        roomSize: "Размеры комнаты (см)",
        repairClass: "Класс ремонта",
        econom: "Эконом - только материалы, клиент работает сам",
        standard: "Стандарт - выбор работ + связь с мастерами",
        premium: "Премиум - полный сервис под ключ",
        results: "Результаты",
        resetFilters: "Сбросить фильтры",
        resetWorkBlocks: "Сбросить выбор работ",
        loginRegister: "Вход / Регистрация",
        aboutUs: "О нас",
        partners: "Партнеры",
        mission: "Миссия",
        contacts: "Контакты",
        copyright: "© 2026 RemontExpert — Все права защищены"
    },
    en: {
        title: "RemontExpert 3D Pro - English Version",
        filters: "Filters",
        jobTypes: "Job Types",
        painting: "Painting",
        wallpaper: "Wallpaper",
        selectAll: "Select All",
        frontWall: "Front Wall",
        backWall: "Back Wall",
        leftWall: "Left Wall",
        rightWall: "Right Wall",
        floor: "Floor",
        ceiling: "Ceiling",
        roomSize: "Room Size (cm)",
        repairClass: "Repair Class",
        econom: "Economy - materials only, DIY work",
        standard: "Standard - work selection + contractor connection",
        premium: "Premium - full turnkey service",
        results: "Results",
        resetFilters: "Reset Filters",
        resetWorkBlocks: "Reset Work Blocks",
        loginRegister: "Login / Register",
        aboutUs: "About Us",
        partners: "Partners",
        mission: "Mission",
        contacts: "Contacts",
        copyright: "© 2026 RemontExpert — All Rights Reserved"
    },
    de: {
        title: "RemontExpert 3D Pro - Deutsche Version",
        filters: "Filter",
        jobTypes: "Arbeitstypen",
        painting: "Malen",
        wallpaper: "Tapezieren",
        selectAll: "Alles auswählen",
        frontWall: "Vorderwand",
        backWall: "Rückwand",
        leftWall: "Linke Wand",
        rightWall: "Rechte Wand",
        floor: "Boden",
        ceiling: "Decke",
        roomSize: "Raumgröße (cm)",
        repairClass: "Renovierungsklasse",
        econom: "Economy - nur Materialien, Eigenarbeit",
        standard: "Standard - Arbeitsauswahl + Handwerkervermittlung",
        premium: "Premium - kompletter Rundum-Service",
        results: "Ergebnisse",
        resetFilters: "Filter zurücksetzen",
        resetWorkBlocks: "Arbeitsblöcke zurücksetzen",
        loginRegister: "Anmelden / Registrieren",
        aboutUs: "Über uns",
        partners: "Partner",
        mission: "Mission",
        contacts: "Kontakte",
        copyright: "© 2026 RemontExpert — Alle Rechte vorbehalten"
    }
};

let currentLang = 'ru';
let resultsTranslations = {
    categories: {},
    tasks: {},
    inventory: {},
    common: {}
};

// Load JSON translations for results
async function loadResultsTranslations(lang) {
    try {
        const [categories, tasks, inventory, common] = await Promise.all([
            fetch(`locales/${lang}/categories.json`).then(r => r.json()),
            fetch(`locales/${lang}/tasks.json`).then(r => r.json()),
            fetch(`locales/${lang}/inventory.json`).then(r => r.json()),
            fetch(`locales/${lang}/common.json`).then(r => r.json())
        ]);

        resultsTranslations = { categories, tasks, inventory, common };
        return true;
    } catch (error) {
        console.error('Failed to load translations:', error);
        return false;
    }
}

function setLanguage(lang) {
    if (translations[lang]) {
        currentLang = lang;
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
        document.title = t('title');

        // Load results translations and then update UI
        loadResultsTranslations(lang).then(() => {
            localize();
            // Trigger results recalculation if loadReceipt exists
            if (typeof loadReceipt === 'function' && typeof currentJob !== 'undefined') {
                loadReceipt(currentJob);
            }
        });
    }
}

function t(key) {
    return translations[currentLang][key] || key;
}

// Translation function for results
function tr(category, key) {
    if (resultsTranslations[category] && resultsTranslations[category][key]) {
        return resultsTranslations[category][key];
    }
    // Handle nested keys (e.g., "painting.inspection")
    if (category && key && resultsTranslations[category]) {
        const parts = key.split('.');
        let value = resultsTranslations[category];
        for (const part of parts) {
            if (value && value[part]) {
                value = value[part];
            } else {
                return key;
            }
        }
        return value;
    }
    return key;
}

function localize() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });

    // Update title attributes
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        el.title = t(key);
    });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Set language from localStorage or detect
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
        setLanguage(savedLang);
    } else {
        const userLang = navigator.language || navigator.userLanguage;
        if (userLang.startsWith('en')) setLanguage('en');
        else if (userLang.startsWith('de')) setLanguage('de');
        else setLanguage('ru');
    }

    // Language selector event
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.value = currentLang;
        langSelect.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }
});
