/* =========================================================
   RemontExpert 3D Pro
   PDF EXPORT - DOM-BASED VERSION
   v3.0 — Reads data directly from DOM dataset attributes
   ========================================================= */

/* =========================================================
   CYRILLIC → LATIN TRANSLITERATION
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

/* =========================================================
   FONT LOADER — PT Sans (Latin + Cyrillic)
   ========================================================= */

async function loadCyrillicFont(fontPath = 'fonts/PTSans-Regular.ttf') {
    if (!window._pdfFontCache) {
        window._pdfFontCache = {};
    }

    if (window._pdfFontCache[fontPath]) {
        return window._pdfFontCache[fontPath];
    }

    try {
        const response = await fetch(fontPath);
        if (!response.ok) {
            throw new Error('HTTP ' + response.status);
        }

        const buffer = await response.arrayBuffer();
        const bytes = new Uint8Array(buffer);
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
   COLLECT SELECTED ITEMS FROM DOM
   ========================================================= */

function collectSelectedItemsFromDOM() {
    const items = [];
    const checkboxes = document.querySelectorAll('.receipt__line input[type=checkbox]:checked');

    checkboxes.forEach(checkbox => {
        const dataset = checkbox.dataset;
        if (dataset.label && dataset.price) {
            items.push({
                category: dataset.category || '',
                label: dataset.label,
                price: parseFloat(dataset.price) || 0
            });
        }
    });

    return items;
}

/* =========================================================
   GROUP ITEMS BY CATEGORY
   ========================================================= */

function groupItemsByCategory(items) {
    const groups = {};

    items.forEach(item => {
        const cat = item.category || 'other';
        if (!groups[cat]) {
            groups[cat] = [];
        }
        groups[cat].push(item);
    });

    return groups;
}

/* =========================================================
   MAIN EXPORT FUNCTION
   ========================================================= */

async function generateEcoPDF(totals, jobType) {
    if (typeof window.jspdf === 'undefined') {
        alert('jsPDF library not loaded');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let yPos = 20;

    // Detect current language
    const currentLang = (
        window.currentLang ||
        document.documentElement.lang ||
        'ru'
    ).toLowerCase().slice(0, 2);

    /* =========================================================
       CYRILLIC FONT REGISTRATION
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
            console.log('[PDF] PTSans fonts registered.');
        } else {
            console.warn('[PDF] Font loading failed, using transliteration fallback');
        }
    }

    /* Helper: render text with font support */
    function renderText(value) {
        if (value === null || value === undefined) return '';
        const str = String(value);
        return useCustomFont ? str : cyrillicToLatin(str);
    }

    /* Helper: set font */
    function setFont(style) {
        if (useCustomFont) {
            doc.setFont('PTSans', style || 'normal');
        } else {
            doc.setFont('helvetica', style || 'normal');
        }
    }

    /* Helper: page break */
    function checkPageBreak() {
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
    }

    /* =========================================================
       UI LABELS
       ========================================================= */

    const labels = {
        ru: {
            title: 'RemontExpert 3D Pro',
            subtitle: 'Raschet materialov - ECONOM',
            object: 'Obekt:',
            wallArea: 'Ploshchad sten',
            workType: 'Tip rabot',
            painting: 'Pokraska',
            wallpaper: 'Pokleka oboev',
            repairClass: 'Klass remonta',
            selectedItems: 'Vybrannye pozitsii',
            subtotal: 'Summa',
            total: 'ITOGO',
            note: '* ECONOM: tolko materialy i instrumenty. Klient rabotaet samostoyatelno.'
        },
        en: {
            title: 'RemontExpert 3D Pro',
            subtitle: 'Material Calculation - ECONOMY Class',
            object: 'Object:',
            wallArea: 'Wall area',
            workType: 'Work type',
            painting: 'Painting',
            wallpaper: 'Wallpapering',
            repairClass: 'Repair class',
            selectedItems: 'Selected items',
            subtotal: 'Subtotal',
            total: 'TOTAL',
            note: '* ECONOMY class: materials and tools only. Customer works independently.'
        },
        de: {
            title: 'RemontExpert 3D Pro',
            subtitle: 'Materialberechnung - Klasse ECONOM',
            object: 'Objekt:',
            wallArea: 'Wandflaeche',
            workType: 'Arbeitstyp',
            painting: 'Malerarbeiten',
            wallpaper: 'Tapezieren',
            repairClass: 'Renovierungsklasse',
            selectedItems: 'Ausgewaehlte Positionen',
            subtotal: 'Summe',
            total: 'GESAMT',
            note: '* ECONOM-Klasse: nur Materialien und Werkzeuge. Kunde arbeitet selbstaendig.'
        }
    };

    const lbl = labels[currentLang] || labels.de;

    /* =========================================================
       PDF HEADER
       ========================================================= */

    setFont('bold');
    doc.setFontSize(16);
    doc.text(renderText(lbl.title), 105, yPos, { align: 'center' });
    yPos += 8;

    setFont('normal');
    doc.setFontSize(11);
    doc.text(renderText(lbl.subtitle), 105, yPos, { align: 'center' });
    yPos += 12;

    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    /* =========================================================
       OBJECT INFORMATION
       ========================================================= */

    setFont('bold');
    doc.text(renderText(lbl.object), 20, yPos);
    yPos += 8;

    setFont('normal');
    doc.text(
        renderText(`${lbl.wallArea}: ${(totals.area || 0).toFixed(2)} m²`),
        20,
        yPos
    );
    yPos += 6;

    doc.text(
        renderText(
            `${lbl.workType}: ${
                jobType === 'painting' ? lbl.painting : lbl.wallpaper
            }`
        ),
        20,
        yPos
    );
    yPos += 6;

    doc.text(renderText(`${lbl.repairClass}: ECONOM`), 20, yPos);
    yPos += 10;

    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    /* =========================================================
       SELECTED ITEMS FROM DOM
       ========================================================= */

    const selectedItems = collectSelectedItemsFromDOM();
    const groupedItems = groupItemsByCategory(selectedItems);

    if (Object.keys(groupedItems).length > 0) {
        setFont('bold');
        doc.text(renderText(lbl.selectedItems), 20, yPos);
        yPos += 8;

        let grandTotal = 0;

        Object.entries(groupedItems).forEach(([category, items]) => {
            setFont('bold');
            doc.text(renderText(category.toUpperCase()), 22, yPos);
            yPos += 6;

            setFont('normal');

            let categoryTotal = 0;

            items.forEach(item => {
                doc.text(renderText(item.label), 25, yPos);
                doc.text(
                    `${item.price.toFixed(2)} EUR`,
                    170,
                    yPos,
                    { align: 'right' }
                );

                categoryTotal += item.price;
                yPos += 6;
                checkPageBreak();
            });

            // Category subtotal
            setFont('bold');
            doc.text(renderText(`${lbl.subtotal}:`), 25, yPos);
            doc.text(
                `${categoryTotal.toFixed(2)} EUR`,
                170,
                yPos,
                { align: 'right' }
            );
            yPos += 8;
            setFont('normal');

            grandTotal += categoryTotal;
        });

        yPos += 4;
        doc.line(20, yPos, 190, yPos);
        yPos += 8;

        // Grand total
        setFont('bold');
        doc.setFontSize(12);
        doc.text(renderText(lbl.total), 20, yPos);
        doc.text(
            `${grandTotal.toFixed(2)} EUR`,
            170,
            yPos,
            { align: 'right' }
        );
        yPos += 10;
        doc.setFontSize(11);
        setFont('normal');
    }

    /* =========================================================
       MATERIALS DETAILS (if available)
       ========================================================= */

    if (totals.materialTotal && totals.materialTotal > 0) {
        doc.line(20, yPos, 190, yPos);
        yPos += 8;

        setFont('bold');
        doc.text(renderText('Materials'), 20, yPos);
        yPos += 6;
        setFont('normal');

        doc.text(renderText('Materials total:'), 25, yPos);
        doc.text(
            `${totals.materialTotal.toFixed(2)} EUR`,
            170,
            yPos,
            { align: 'right' }
        );
        yPos += 10;
    }

    /* =========================================================
       FOOTER NOTE
       ========================================================= */

    yPos += 10;
    doc.setFontSize(9);
    doc.text(renderText(lbl.note), 20, yPos);

    /* =========================================================
       DISCLAIMER (if available)
       ========================================================= */

    if (window.PdfDisclaimers && window.PdfDisclaimers[currentLang]) {
        doc.addPage();
        yPos = 20;

        setFont('bold');
        doc.setFontSize(14);
        doc.text(renderText('Legal Information'), 105, yPos, { align: 'center' });
        yPos += 10;

        setFont('normal');
        doc.setFontSize(10);

        const disclaimer = window.PdfDisclaimers[currentLang];
        const lines = doc.splitTextToSize(renderText(disclaimer), 170);
        lines.forEach(line => {
            doc.text(line, 20, yPos);
            yPos += 5;
            checkPageBreak();
        });
    }

    /* =========================================================
       SAVE PDF
       ========================================================= */

    const filename = `RemontExpert_ECONOM_${jobType}_${Date.now()}.pdf`;
    doc.save(filename);
    console.log('[PDF] Saved:', filename);
}

// Export to global scope
window.generateEcoPDF = generateEcoPDF;
