/* =========================================================
   RemontExpert 3D Pro
   STABLE PDF EXPORT SYSTEM
   AUTO JSON MAPPING VERSION
   v2.2 — FIXED: direct itemsDict lookup, robust language detection
   ========================================================= */

/*
REQUIRED:
---------------------------------------------------------

window.inventoryData = inventory.json content

Example:

fetch('data/inventory.json')
    .then(r => r.json())
    .then(data => {
        window.inventoryData = data;
    });

---------------------------------------------------------
*/

/* =========================================================
   CYRILLIC → LATIN TRANSLITERATION
   Fixes jsPDF standard font encoding issues (=AB@C<5=BK bug)
   Long-term fix: embed a TTF Unicode font via doc.addFileToVFS
   ========================================================= */

function cyrillicToLatin(text) {

    const map = {
        'А': 'A',  'Б': 'B',  'В': 'V',  'Г': 'G',  'Д': 'D',
        'Е': 'E',  'Ё': 'Yo', 'Ж': 'Zh', 'З': 'Z',  'И': 'I',
        'Й': 'Y',  'К': 'K',  'Л': 'L',  'М': 'M',  'Н': 'N',
        'О': 'O',  'П': 'P',  'Р': 'R',  'С': 'S',  'Т': 'T',
        'У': 'U',  'Ф': 'F',  'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch',
        'Ш': 'Sh', 'Щ': 'Shch','Ъ': '',  'Ы': 'Y',  'Ь': '',
        'Э': 'E',  'Ю': 'Yu', 'Я': 'Ya',
        'а': 'a',  'б': 'b',  'в': 'v',  'г': 'g',  'д': 'd',
        'е': 'e',  'ё': 'yo', 'ж': 'zh', 'з': 'z',  'и': 'i',
        'й': 'y',  'к': 'k',  'л': 'l',  'м': 'm',  'н': 'n',
        'о': 'o',  'п': 'p',  'р': 'r',  'с': 's',  'т': 't',
        'у': 'u',  'ф': 'f',  'х': 'kh', 'ц': 'ts', 'ч': 'ch',
        'ш': 'sh', 'щ': 'shch','ъ': '', 'ы': 'y',  'ь': '',
        'э': 'e',  'ю': 'yu', 'я': 'ya'
    };

    return String(text)
        .split('')
        .map(c => map[c] !== undefined ? map[c] : c)
        .join('');
}

/* renderText is defined inside generateEcoPDF after font loading */


/* =========================================================
   FONT LOADER — PT Sans (Latin + Cyrillic, ~300 KB)
   Loads TTF from local fonts/ directory, caches in window._pdfFontBase64.
   Falls back to transliteration if fetch fails.
   ========================================================= */

async function loadCyrillicFont(fontPath = 'fonts/PTSans-Regular.ttf') {

    // Cache fonts separately by path
    if (!window._pdfFontCache) {
        window._pdfFontCache = {};
    }

    if (window._pdfFontCache[fontPath]) {
        return window._pdfFontCache[fontPath];         // already cached
    }

    try {
        const response = await fetch(fontPath);

        if (!response.ok) {
            throw new Error('HTTP ' + response.status);
        }

        const buffer = await response.arrayBuffer();
        const bytes  = new Uint8Array(buffer);
        let bin = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            bin += String.fromCharCode(bytes[i]);
        }

        const base64 = btoa(bin);
        window._pdfFontCache[fontPath] = base64;
        console.log('[PDF] Font loaded and cached:', fontPath);
        return base64;

    } catch (err) {
        console.warn('[PDF] Font load failed:', fontPath, err);
        return null;
    }
}

/* =========================================================
   MAIN EXPORT FUNCTION  (async — awaits font when lang = ru)
   ========================================================= */

async function generateEcoPDF(totals, jobType) {

    if (typeof window.jspdf === 'undefined') {
        alert('jsPDF library not loaded');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const MARGIN_LEFT = 25;
    const MARGIN_RIGHT = 185;

    let yPos = MARGIN_LEFT;

    // Robust language detection — checks all common global variable names
    const currentLang = (
        window.currentLang       ||  // most common
        window.appLang           ||
        window.selectedLang      ||
        window.lang              ||
        window.language          ||
        document.documentElement.lang ||  // <html lang="de">
        'de'                            // final fallback
    ).toLowerCase().slice(0, 2);        // normalize: "de-DE" → "de"

    /* =========================================================
       CYRILLIC FONT REGISTRATION
       For Russian: load PT Sans TTF and register with jsPDF.
       For DE/EN: use built-in helvetica (no fetch needed).
       ========================================================= */

    let useCustomFont = false;
    console.log('[PDF] CurrentLang:', currentLang);

    if (currentLang === 'ru') {
        console.log('[PDF] Loading Cyrillic fonts...');
        const fontRegular = await loadCyrillicFont('fonts/PTSans-Regular.ttf');
        const fontBold = await loadCyrillicFont('fonts/PTSans-Bold.ttf');

        if (fontRegular && fontBold) {
            doc.addFileToVFS('PTSans-Regular.ttf', fontRegular);
            doc.addFont('PTSans-Regular.ttf', 'PTSans', 'normal');
            doc.addFileToVFS('PTSans-Bold.ttf', fontBold);
            doc.addFont('PTSans-Bold.ttf', 'PTSans', 'bold');
            useCustomFont = true;
            console.log('[PDF] PTSans fonts (Regular + Bold) registered for Cyrillic rendering.');
        } else {
            console.warn('[PDF] Font loading failed, using transliteration fallback');
        }
    }

    /* Override safeText — if custom font loaded, pass text as-is (no transliteration) */
    function renderText(value) {
        if (value === null || value === undefined) return '';
        const str = String(value);
        return useCustomFont ? str : cyrillicToLatin(str);
    }

    /* Override setFont helper — uses PTSans for RU, helvetica otherwise */
    function setFont(style) {
        if (useCustomFont) {
            doc.setFont('PTSans', style || 'normal');
        } else {
            doc.setFont('helvetica', style || 'normal');
        }
    }

    const inventory = window.inventoryData || {};

    /* =========================================================
       LOCAL UI TRANSLATIONS
       ========================================================= */

    const ui = {

        de: {
            title:           'RemontExpert 3D Pro',
            subtitle:        'Materialberechnung - Klasse ECONOM',
            object:          'Objekt:',
            wallArea:        'Wandfläche',
            workType:        'Arbeitstyp',
            painting:        'Malerarbeiten',
            wallpaper:       'Tapezieren',
            repairClass:     'Renovierungsklasse',
            matDetails:      'Materialdetails',
            wpDetails:       'Tapetendetails',
            subtotal:        'Summe',
            grandTotal:      'GESAMT',
            materialsTotal:  'Materialien gesamt',
            tools:           'Werkzeuge',
            equipment:       'Gerätemiete',
            extras:          'Zusatzmaterialien',
            note:            '* ECONOM-Klasse: nur Materialien und Werkzeuge. Kunde arbeitet selbständig.',
            page:            'Seite',
            of:              'von',
            legal:           'RECHTLICHE HINWEISE',
            /* --- category keys --- */
            primerRequired:  'Grundierung',
            paintTwoCoats:   'Farbe (2 Schichten)',
            tools_cat:       'Werkzeuge',
            equipment_cat:   'Gerätemiete',
            extras_cat:      'Zusatzmaterialien'
        },

        en: {
            title:           'RemontExpert 3D Pro',
            subtitle:        'Material Calculation - ECONOMY Class',
            object:          'Object:',
            wallArea:        'Wall area',
            workType:        'Work type',
            painting:        'Painting',
            wallpaper:       'Wallpapering',
            repairClass:     'Repair class',
            matDetails:      'Material details',
            wpDetails:       'Wallpaper details',
            subtotal:        'Subtotal',
            grandTotal:      'TOTAL',
            materialsTotal:  'Materials total',
            tools:           'Tools',
            equipment:       'Equipment rental',
            extras:          'Extra materials',
            note:            '* ECONOMY class: materials and tools only. Customer works independently.',
            page:            'Page',
            of:              'of',
            legal:           'LEGAL INFORMATION',
            /* --- category keys --- */
            primerRequired:  'Primer',
            paintTwoCoats:   'Paint (2 coats)',
            tools_cat:       'Tools',
            equipment_cat:   'Equipment rental',
            extras_cat:      'Extra materials'
        },

        ru: {
            title:           'RemontExpert 3D Pro',
            subtitle:        'Расчёт материалов — ECONOM',
            object:          'Объект:',
            wallArea:        'Площадь стен',
            workType:        'Тип работ',
            painting:        'Покраска',
            wallpaper:       'Поклейка обоев',
            repairClass:     'Класс ремонта',
            matDetails:      'Детали материалов',
            wpDetails:       'Детали обоев',
            subtotal:        'Сумма',
            grandTotal:      'ИТОГО',
            materialsTotal:  'Материалы всего',
            tools:           'Инструменты',
            equipment:       'Аренда оборудования',
            extras:          'Доп. материалы',
            note:            '* ECONOM класс: только материалы и инструменты. Клиент работает самостоятельно.',
            page:            'Страница',
            of:              'из',
            legal:           'ЮРИДИЧЕСКАЯ ИНФОРМАЦИЯ',
            /* --- category keys --- */
            primerRequired:  'Грунтовка',
            paintTwoCoats:   'Краска (2 слоя)',
            tools_cat:       'Инструменты',
            equipment_cat:   'Аренда оборудования',
            extras_cat:      'Доп. материалы'
        }

    };

    const lbl = ui[currentLang] || ui.de;

    /* =========================================================
       AUTO FLATTEN INVENTORY
       ========================================================= */

    function flattenInventory(obj, result = {}) {

        Object.entries(obj).forEach(([key, value]) => {

            if (
                typeof value === 'object'
                && value !== null
                && !Array.isArray(value)
            ) {

                flattenInventory(value, result);

            } else {

                result[value] = key;

            }

        });

        return result;
    }

    const reverseInventory = flattenInventory(inventory);

    /* =========================================================
       ITEM TRANSLATIONS
       ========================================================= */

    const itemTranslations = {

        de: {
            brushes:      'Malerpinsel',
            rollers:      'Malerwalzen',
            tape:         'Malerband',
            covers:       'Schutzfolie',
            sprayGun:     'Farbspritzgerät',
            ledLights:    'LED-Strahler',
            sander:       'Schleifmaschine',
            laser:        'Lasernivelliergerät',
            extraTape:    'Extra Band und Folie',
            extraTools:   'Extra Werkzeuge',
            safety:       'Schutzausrüstung',
            wpBrush:      'Tapezierbürste',
            wpRoller:     'Andrückwalze',
            wpSmoother:   'Tapezierwischer',
            wpSpatula:    'Tapezierspachtel',
            wpKnife:      'Tapeziermesser',
            wpTape:       'Malerband',
            wpBucket:     'Kleistereimer',
            wpSteamer:    'Dampfablöser',
            wpTable:      'Tapeziertisch',
            wpLaser:      'Lasergerät',
            wpExtraGlue:  'Extra Kleister',
            wpExtraTools: 'Extra Werkzeuge',
            wpSafety:     'Schutzausrüstung'
        },

        en: {
            brushes:      'Paint brushes',
            rollers:      'Paint rollers',
            tape:         'Masking tape',
            covers:       'Protective film',
            sprayGun:     'Spray gun with compressor',
            ledLights:    'LED floodlights',
            sander:       'Sanding machine',
            laser:        'Laser level',
            extraTape:    'Extra tape and film',
            extraTools:   'Extra tools',
            safety:       'Safety equipment',
            wpBrush:      'Wallpaper brush',
            wpRoller:     'Seam roller',
            wpSmoother:   'Smoother',
            wpSpatula:    'Spatula',
            wpKnife:      'Wallpaper knife',
            wpTape:       'Masking tape',
            wpBucket:     'Paste bucket',
            wpSteamer:    'Steam stripper',
            wpTable:      'Pasting table',
            wpLaser:      'Laser level',
            wpExtraGlue:  'Extra paste',
            wpExtraTools: 'Extra tools',
            wpSafety:     'Safety equipment'
        },

        ru: {
            brushes:      'Кисти малярные',
            rollers:      'Валики малярные',
            tape:         'Малярная лента',
            covers:       'Защитная плёнка',
            sprayGun:     'Краскопульт',
            ledLights:    'LED прожекторы',
            sander:       'Шлифмашина',
            laser:        'Лазерный уровень',
            extraTape:    'Доп. плёнка и лента',
            extraTools:   'Доп. инструменты',
            safety:       'Средства защиты',
            wpBrush:      'Щётка обойная',
            wpRoller:     'Прижимной валик',
            wpSmoother:   'Гладилка',
            wpSpatula:    'Шпатель',
            wpKnife:      'Обоиный нож',
            wpTape:       'Малярная лента',
            wpBucket:     'Ведро для клея',
            wpSteamer:    'Парогенератор',
            wpTable:      'Обоиный стол',
            wpLaser:      'Лазерный уровень',
            wpExtraGlue:  'Доп. клей',
            wpExtraTools: 'Доп. инструменты',
            wpSafety:     'Средства защиты'
        }

    };

    const itemsDict =
        itemTranslations[currentLang]
        || itemTranslations.de;

    /* =========================================================
       SAFE ITEM TRANSLATION
       Priority:
         1. Direct key lookup:  name = "brushes"  → itemsDict["brushes"]
         2. Reverse inventory:  name = "Malerpinsel" → key → itemsDict[key]
         3. safeText fallback:  return original name
       ========================================================= */

    function translateItem(name) {

        /* Guard: undefined, null, empty, or literal string "undefined" */
        if (
            name === null
            || name === undefined
            || name === 'undefined'
            || name === 'null'
            || String(name).trim() === ''
        ) {
            return '—';
        }

        const trimmed = String(name).trim();

        /* 1. Direct: name IS already the translation key (e.g. "brushes") */
        if (itemsDict[trimmed]) {
            return renderText(itemsDict[trimmed]);
        }

        /* 2. Reverse: name is a display value, look up its key */
        const key = reverseInventory[trimmed];

        if (!key) {
            console.warn('[translateItem] Key not found for:', trimmed);
            return renderText(trimmed);
        }

        return renderText(itemsDict[key] || trimmed);
    }

    /* =========================================================
       RESOLVE CATEGORY LABEL
       FIX: maps raw keys like "primerRequired" to translated labels
       ========================================================= */

    function resolveCategoryLabel(category) {

        if (!category) return '';

        /* Direct hit in lbl (tools, equipment, extras, primerRequired, etc.) */
        if (lbl[category]) {
            return renderText(lbl[category]);
        }

        /* Try category + '_cat' suffix variant */
        if (lbl[category + '_cat']) {
            return renderText(lbl[category + '_cat']);
        }

        /* Fallback: return the raw key as-is */
        return renderText(category);
    }

    /* =========================================================
       SAFE PAGE BREAK
       ========================================================= */

    function checkPageBreak() {

        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
    }

    /* =========================================================
       HEADER
       ========================================================= */

    setFont('bold');
    doc.setFontSize(18);

    doc.text(renderText(lbl.title), 105, yPos, { align: 'center' });

    yPos += 10;

    doc.setFontSize(12);

    doc.text(renderText(lbl.subtitle), 105, yPos, { align: 'center' });

    yPos += 15;

    /* =========================================================
       GENERAL INFO
       ========================================================= */

    doc.setFontSize(10);

    setFont('bold');
    doc.text(renderText(lbl.object), MARGIN_LEFT, yPos);

    yPos += 8;

    setFont('normal');

    doc.text(
        renderText(`${lbl.wallArea}: ${totals.area.toFixed(2)} m\u00B2`),
        MARGIN_LEFT,
        yPos
    );

    yPos += 6;

    doc.text(
        renderText(
            `${lbl.workType}: ${
                jobType === 'painting'
                    ? lbl.painting
                    : lbl.wallpaper
            }`
        ),
        MARGIN_LEFT,
        yPos
    );

    yPos += 6;

    doc.text(
        renderText(`${lbl.repairClass}: ECONOM`),
        MARGIN_LEFT,
        yPos
    );

    yPos += 10;

    doc.line(MARGIN_LEFT, yPos, MARGIN_RIGHT, yPos);

    yPos += 10;

    /* =========================================================
       MATERIALS — PAINTING
       ========================================================= */

    if (jobType === 'painting' && totals.paintData) {

        setFont('bold');
        doc.text(renderText(lbl.matDetails), MARGIN_LEFT, yPos);
        yPos += 8;

        /* Primer */
        if (totals.primerData && totals.primerData.cans) {

            setFont('bold');
            doc.text(renderText(lbl.primerRequired), MARGIN_LEFT + 2, yPos);
            yPos += 6;

            setFont('normal');

            totals.primerData.cans.forEach(can => {

                const label = renderText(`${can.name || ''} ${can.size || ''}L`);

                doc.text(label, MARGIN_LEFT + 5, yPos);

                doc.text(
                    `${(can.price || 0).toFixed(2)} EUR`,
                    MARGIN_RIGHT,
                    yPos,
                    { align: 'right' }
                );

                yPos += 6;
                checkPageBreak();
            });

            yPos += 4;
        }

        /* Paint */
        if (totals.paintData && totals.paintData.buckets) {

            setFont('bold');
            doc.text(renderText(lbl.paintTwoCoats), MARGIN_LEFT + 2, yPos);
            yPos += 6;

            setFont('normal');

            totals.paintData.buckets.forEach(bucket => {

                const label = renderText(`${bucket.name || ''} ${bucket.size || ''}L`);

                doc.text(label, MARGIN_LEFT + 5, yPos);

                doc.text(
                    `${(bucket.price || 0).toFixed(2)} EUR`,
                    MARGIN_RIGHT,
                    yPos,
                    { align: 'right' }
                );

                yPos += 6;
                checkPageBreak();
            });

            /* Materials subtotal line */
            if (totals.materialsTotal !== undefined) {

                yPos += 2;

                setFont('bold');

                doc.text(
                    renderText(`${lbl.materialsTotal}:`),
                    25,
                    yPos
                );

                doc.text(
                    `${(totals.materialsTotal || 0).toFixed(2)} EUR`,
                    MARGIN_RIGHT,
                    yPos,
                    { align: 'right' }
                );

                yPos += 10;

                setFont('normal');
            }
        }
    }

    /* =========================================================
       TOOL GROUPS
       ========================================================= */

    if (totals.items && totals.items.length > 0) {

        totals.items.forEach(group => {

            if (!group.lines || !group.lines.length) return;

            const checkedLines = group.lines.filter(l => l.checked);

            if (!checkedLines.length) return;

            setFont('bold');

            const categoryLabel = resolveCategoryLabel(group.category);

            doc.text(categoryLabel, MARGIN_LEFT, yPos);

            yPos += 7;

            setFont('normal');

            checkedLines.forEach(line => {

                const displayName = translateItem(line.name);

                doc.text(
                    `[X] ${displayName}`,
                    25,
                    yPos
                );

                doc.text(
                    `${(line.price || 0).toFixed(2)} EUR`,
                    MARGIN_RIGHT,
                    yPos,
                    { align: 'right' }
                );

                yPos += 6;
                checkPageBreak();
            });

            if (group.subtotal > 0) {

                yPos += 2;

                setFont('bold');

                doc.text(
                    renderText(`${lbl.subtotal}:`),
                    25,
                    yPos
                );

                doc.text(
                    `${group.subtotal.toFixed(2)} EUR`,
                    MARGIN_RIGHT,
                    yPos,
                    { align: 'right' }
                );

                yPos += 8;

                setFont('normal');
            }

        });

    }

    /* =========================================================
       TOTALS SECTION
       ========================================================= */

    doc.line(MARGIN_LEFT, yPos, MARGIN_RIGHT, yPos);
    yPos += 10;

    setFont('normal');
    doc.setFontSize(10);

    doc.text(renderText(`${lbl.tools}:`), MARGIN_LEFT, yPos);
    doc.text(
        `${(totals.toolsTotal || 0).toFixed(2)} EUR`,
        MARGIN_RIGHT, yPos, { align: 'right' }
    );
    yPos += 6;

    doc.text(renderText(`${lbl.equipment}:`), MARGIN_LEFT, yPos);
    doc.text(
        `${(totals.equipmentTotal || 0).toFixed(2)} EUR`,
        MARGIN_RIGHT, yPos, { align: 'right' }
    );
    yPos += 6;

    doc.text(renderText(`${lbl.extras}:`), MARGIN_LEFT, yPos);
    doc.text(
        `${(totals.extrasTotal || 0).toFixed(2)} EUR`,
        MARGIN_RIGHT, yPos, { align: 'right' }
    );
    yPos += 10;

    /* Grand total */
    setFont('bold');
    doc.setFontSize(14);

    doc.text(renderText(`${lbl.grandTotal}:`), MARGIN_LEFT, yPos);
    doc.text(
        `${(totals.grandTotal || 0).toFixed(2)} EUR`,
        MARGIN_RIGHT, yPos, { align: 'right' }
    );
    yPos += 12;

    /* Note */
    setFont('normal');
    doc.setFontSize(8);
    doc.text(renderText(lbl.note), MARGIN_LEFT, yPos);

    /* =========================================================
       FOOTER — PAGE 1
       ========================================================= */

    setFont('normal');
    doc.setFontSize(9);
    doc.text(
        renderText(`${lbl.page} 1 ${lbl.of} 2`),
        105, 290, { align: 'center' }
    );

    /* =========================================================
       LEGAL PAGE — PAGE 2 (uses window.PdfDisclaimers from pdf-disclaimer.js)
       ========================================================= */

    doc.addPage();
    yPos = 20;

    setFont('bold');
    doc.setFontSize(14);
    doc.text(renderText(lbl.legal), 105, yPos, { align: 'center' });

    yPos += 20;

    setFont('normal');
    doc.setFontSize(8);

    const disclaimer = window.PdfDisclaimers?.[currentLang] ?? window.PdfDisclaimers?.de;
    const lines = [];

    if (disclaimer) {
        // Sections (1. TITLE, text, blank line)
        if (disclaimer.sections) {
            disclaimer.sections.forEach(s => {
                lines.push(s.title);
                lines.push(s.text);
                lines.push('');
            });
        }

        // Privacy section
        lines.push('');
        if (disclaimer.privacyTitle) lines.push(disclaimer.privacyTitle);
        if (disclaimer.privacyText) lines.push(disclaimer.privacyText);

        // Impressum section
        lines.push('');
        if (disclaimer.impressumTitle) lines.push(disclaimer.impressumTitle);
        if (disclaimer.responsible) lines.push(disclaimer.responsible);
        lines.push('[YOUR NAME / COMPANY]');
        lines.push('[ADDRESS]');
        lines.push('[CITY, COUNTRY]');
        lines.push('E-Mail: [YOUR EMAIL]');

        // Important note
        lines.push('');
        if (disclaimer.importantNote) lines.push(disclaimer.importantNote);
    }

    lines.forEach(line => {
        if (!line) {
            yPos += 3;
        } else {
            const maxWidth = MARGIN_RIGHT - MARGIN_LEFT;
            const wrapped = doc.splitTextToSize(renderText(line), maxWidth);
            doc.text(wrapped, MARGIN_LEFT, yPos);
            yPos += wrapped.length * 5;
        }
        checkPageBreak();
    });

    /* Footer — page 2 */
    setFont('normal');
    doc.setFontSize(9);
    doc.text(
        renderText(`RemontExpert 3D Pro - ${lbl.page} 2 ${lbl.of} 2`),
        105, 290, { align: 'center' }
    );


    /* =========================================================
       SAVE
       ========================================================= */

    const now = new Date();

    const dateStr =
        `${now.getFullYear()}-`
        + `${String(now.getMonth() + 1).padStart(2, '0')}-`
        + `${String(now.getDate()).padStart(2, '0')}`;

    const langSuffix = currentLang.toUpperCase();   // DE, EN, RU

    doc.save(
        `RemontExpert_ECO_${jobType}_${langSuffix}_${dateStr}.pdf`
    );

}

/* =========================================================
   GLOBAL EXPORT
   ========================================================= */

// generateEcoPDF is async — call with await or .then()
// Example: await generateEcoPDF(totals, 'painting');
// Example: generateEcoPDF(totals, 'painting').then(() => console.log('done'));
window.generateEcoPDF = generateEcoPDF;