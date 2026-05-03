/* =========================================================
   PDF EXPORT FÜR ECO KLASSE (DEUTSCH)
   ========================================================= */

/**
 * PDF-Generierung mit Rechnung für ECO-Klasse
 * @param {object} totals - Berechnungsergebnisse aus calculateEco()
 * @param {string} jobType - Arbeitstyp (painting | wallpaper)
 */
function generateEcoPDF(totals, jobType) {
    // Prüfen ob jsPDF geladen ist
    if (typeof window.jspdf === 'undefined') {
        alert('Fehler: jsPDF-Bibliothek nicht geladen');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let yPos = 20;

    // ========== SEITE 1: BERECHNUNG ==========

    // Überschrift
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("RemontExpert 3D Pro", 105, yPos, { align: "center" });
    yPos += 10;

    doc.setFontSize(14);
    doc.text("Materialberechnung - Klasse ECONOM", 105, yPos, { align: "center" });
    yPos += 15;

    // Objektinformationen
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Objekt:", 20, yPos);
    yPos += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Wandflache: ${totals.area.toFixed(2)} m²`, 20, yPos);
    yPos += 6;
    doc.text(`Arbeitstyp: ${jobType === 'painting' ? 'Malerarbeiten' : 'Tapezieren'}`, 20, yPos);
    yPos += 6;
    doc.text(`Renovierungsklasse: ECONOM`, 20, yPos);
    yPos += 10;

    // Trennlinie
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    // Materialdetails (wenn Malerarbeiten)
    if (jobType === 'painting' && totals.paintData) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Materialdetails:", 20, yPos);
        yPos += 7;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        // Grundierung (wenn vorhanden)
        if (totals.primerData) {
            const primer = totals.primerData;

            doc.setFont("helvetica", "bold");
            doc.text("Grundierung (erforderlich):", 25, yPos);
            yPos += 6;
            doc.setFont("helvetica", "normal");

            // Grundierungskanister gruppieren
            const primerGroups = {};
            primer.cans.forEach(can => {
                const key = `${can.name}_${can.size}L`;
                if (!primerGroups[key]) {
                    primerGroups[key] = {
                        name: can.name,
                        size: can.size,
                        price: can.price,
                        count: 0
                    };
                }
                primerGroups[key].count++;
            });

            Object.values(primerGroups).forEach(group => {
                doc.text(`${group.name} ${group.size}L`, 30, yPos);
                doc.text(`${group.count} x ${group.price.toFixed(2)} EUR`, 150, yPos, { align: "right" });
                yPos += 6;
            });

            doc.setTextColor(100, 100, 100);
            doc.text(`Benotigt: ${primer.litersNeeded}L`, 30, yPos);
            yPos += 5;
            doc.text(`Gesamt Grundierung: ${primer.totalLiters}L`, 30, yPos);
            doc.setTextColor(0, 0, 0);
            yPos += 8;
        }

        // Farbe
        const pd = totals.paintData;

        doc.setFont("helvetica", "bold");
        doc.text("Farbe (2 Anstriche):", 25, yPos);
        yPos += 6;
        doc.setFont("helvetica", "normal");

        // Farbeimer gruppieren
        const bucketGroups = {};
        pd.buckets.forEach(bucket => {
            const key = `${bucket.name}_${bucket.size}L`;
            if (!bucketGroups[key]) {
                bucketGroups[key] = {
                    name: bucket.name,
                    size: bucket.size,
                    price: bucket.price,
                    count: 0
                };
            }
            bucketGroups[key].count++;
        });

        Object.values(bucketGroups).forEach(group => {
            doc.text(`${group.name} ${group.size}L`, 30, yPos);
            doc.text(`${group.count} x ${group.price.toFixed(2)} EUR`, 150, yPos, { align: "right" });
            yPos += 6;
        });

        doc.setTextColor(100, 100, 100);
        doc.text(`Benotigt: ${pd.litersNeeded}L`, 30, yPos);
        yPos += 5;
        doc.text(`Gesamt Farbe: ${pd.totalLiters}L`, 30, yPos);
        doc.setTextColor(0, 0, 0);
        yPos += 10;
    }

    // Tapetendetails (wenn Tapezieren)
    if (jobType === 'wallpaper' && totals.wallpaperData) {
        const wp = totals.wallpaperData;

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Tapetendetails:", 20, yPos);
        yPos += 7;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        doc.text(`Rollen: ${wp.rolls} Stuck`, 25, yPos);
        yPos += 6;
        doc.text(`Kleister: ${wp.gluePackages} Packungen`, 25, yPos);
        yPos += 6;
        doc.text(`Tapetenkosten: ${wp.rollCost.toFixed(2)} EUR`, 25, yPos);
        yPos += 6;
        doc.text(`Kleisterkosten: ${wp.glueCost.toFixed(2)} EUR`, 25, yPos);
        yPos += 10;
    }

    // Trennlinie
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    // Positionen mit Checkbox
    if (totals.items && totals.items.length > 0) {
        totals.items.forEach(itemGroup => {
            // Prüfen ob mindestens eine Position ausgewählt ist
            const hasCheckedItems = itemGroup.lines && itemGroup.lines.some(line => line.checked);

            // Kategorie überspringen wenn keine ausgewählten Positionen
            if (!hasCheckedItems) return;

            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");

            // Kategorien auf Deutsch
            let categoryName = itemGroup.category;
            if (categoryName === "Инструменты") categoryName = "Werkzeuge";
            if (categoryName === "Аренда оборудования") categoryName = "Gerätemiete";
            if (categoryName === "Дополнительные материалы") categoryName = "Zusatzmaterialien";

            doc.text(categoryName, 20, yPos);
            yPos += 7;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);

            if (itemGroup.lines && itemGroup.lines.length > 0) {
                itemGroup.lines.forEach(line => {
                    // NUR ausgewählte Positionen anzeigen (checked = true)
                    if (line.hasOwnProperty('checked') && line.checked) {
                        const cost = line.price;

                        // Namen auf Deutsch übersetzen
                        let itemName = line.name;
                        if (itemName === "Кисти малярные") itemName = "Malerpinsel";
                        if (itemName === "Валики малярные") itemName = "Farbroller";
                        if (itemName === "Малярная лента") itemName = "Malerkrepp";
                        if (itemName === "Защитная плёнка") itemName = "Abdeckfolie";
                        if (itemName === "Краскопульт с компрессором") itemName = "Farbspruhgerat mit Kompressor";
                        if (itemName === "LED-прожекторы") itemName = "LED-Baustrahler";
                        if (itemName === "Шлифмашина с пылесосом") itemName = "Schleifmaschine mit Staubsauger";
                        if (itemName === "Лазерный нивелир") itemName = "Lasernivelliergerät";
                        if (itemName === "Дополнительная лента и плёнка") itemName = "Zusatzliches Kreppband und Folie";
                        if (itemName === "Дополнительные валики и кисти") itemName = "Zusatzliche Roller und Pinsel";
                        if (itemName === "Средства защиты и расходники") itemName = "Schutzausrustung und Verbrauchsmaterial";

                        doc.text(`[X] ${itemName}`, 25, yPos);
                        doc.text(`${cost.toFixed(2)} EUR`, 150, yPos, { align: "right" });
                        yPos += 6;
                    }
                });

                // Zwischensumme (nur wenn ausgewählte Positionen vorhanden)
                if (itemGroup.hasOwnProperty('subtotal') && itemGroup.subtotal > 0) {
                    yPos += 2;
                    doc.setFont("helvetica", "bold");
                    doc.text(`Summe ${categoryName}:`, 25, yPos);
                    doc.text(`${itemGroup.subtotal.toFixed(2)} EUR`, 150, yPos, { align: "right" });
                    doc.setFont("helvetica", "normal");
                    yPos += 8;
                }
            }
        });
    }

    // Trennlinie vor Gesamtsumme
    yPos += 5;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    // Gesamtsummen
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    doc.text("Materialien gesamt:", 20, yPos);
    doc.text(`${totals.materialTotal.toFixed(2)} EUR`, 150, yPos, { align: "right" });
    yPos += 6;

    doc.text("Werkzeuge:", 20, yPos);
    doc.text(`${(totals.toolsTotal || 0).toFixed(2)} EUR`, 150, yPos, { align: "right" });
    yPos += 6;

    doc.text("Gerätemiete:", 20, yPos);
    doc.text(`${(totals.equipmentTotal || 0).toFixed(2)} EUR`, 150, yPos, { align: "right" });
    yPos += 6;

    doc.text("Zusatzmaterialien:", 20, yPos);
    doc.text(`${(totals.extrasTotal || 0).toFixed(2)} EUR`, 150, yPos, { align: "right" });
    yPos += 10;

    // GESAMTSUMME
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("GESAMT:", 20, yPos);
    doc.text(`${totals.grandTotal.toFixed(2)} EUR`, 150, yPos, { align: "right" });
    yPos += 15;

    // Kurzer Hinweis
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);
    doc.text("* ECONOM-Klasse: nur Materialien und Werkzeuge. Kunde arbeitet selbststandig.", 20, yPos);
    yPos += 5;
    doc.text("* Unverbindliche Berechnung. Siehe Seite 2 fur rechtliche Hinweise.", 20, yPos);

    // Fußzeile Seite 1
    doc.setTextColor(150, 150, 150);
    doc.text(`Erstellt: ${new Date().toLocaleString('de-DE')}`, 105, 285, { align: "center" });
    doc.text("RemontExpert 3D Pro - Seite 1 von 2", 105, 290, { align: "center" });

    // ========== SEITE 2: RECHTLICHE HINWEISE ==========
    doc.addPage();
    yPos = 20;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("RECHTLICHE HINWEISE", 105, yPos, { align: "center" });
    yPos += 15;

    // Haftungsausschluss
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("HAFTUNGSAUSSCHLUSS", 20, yPos);
    yPos += 7;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    const disclaimerText = [
        "1. UNVERBINDLICHE BERECHNUNG",
        "Diese Materialberechnung ist eine unverbindliche Schatzung und dient ausschließlich zu",
        "Informationszwecken. Die tatsachlich benotigten Mengen konnen je nach Zustand der",
        "Oberflachen, Verarbeitungsmethode und individuellen Gegebenheiten abweichen.",
        "",
        "2. KEINE GEWAHRLEISTUNG",
        "Der Anbieter ubernimmt keine Gewahr fur die Richtigkeit, Vollstandigkeit oder Aktualitat",
        "der bereitgestellten Berechnungen und Preisangaben. Alle Angaben erfolgen ohne Gewahr.",
        "",
        "3. PREISANDERUNGEN",
        "Die angegebenen Preise basieren auf aktuellen Marktpreisen zum Zeitpunkt der Berechnung",
        "und konnen sich jederzeit andern. Verbindliche Preise erhalten Sie direkt beim jeweiligen Handler.",
        "",
        "4. EIGENVERANTWORTUNG",
        "Der Nutzer ist selbst dafur verantwortlich, die Berechnungen zu uberprufen und die tatsachlich",
        "benotigten Materialmengen vor dem Kauf zu ermitteln. Es wird empfohlen, einen Fachmann",
        "zu konsultieren.",
        "",
        "5. KEINE HAFTUNG FUR SCHADEN",
        "Der Anbieter haftet nicht fur direkte oder indirekte Schaden, die durch die Nutzung dieser",
        "Berechnung entstehen, einschließlich Materialverschwendung, Mehrkosten oder unzureichender",
        "Materialmengen.",
        "",
        "6. FACHGERECHTE AUSFUHRUNG",
        "Diese Berechnung ersetzt keine fachgerechte Planung und Ausfuhrung durch qualifizierte",
        "Handwerker. Fur professionelle Renovierungsarbeiten wird die Beauftragung eines",
        "Fachbetriebs empfohlen."
    ];

    disclaimerText.forEach(line => {
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
        doc.text(line, 20, yPos);
        yPos += 5;
    });

    yPos += 5;

    // Datenschutz
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DATENSCHUTZ", 20, yPos);
    yPos += 7;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Diese Berechnung erfolgt lokal in Ihrem Browser. Es werden keine personenbezogenen Daten", 20, yPos);
    yPos += 5;
    doc.text("erfasst, gespeichert oder an Dritte weitergegeben. Die PDF-Datei wird ausschließlich auf", 20, yPos);
    yPos += 5;
    doc.text("Ihrem Gerat gespeichert.", 20, yPos);
    yPos += 10;

    // Impressum Platzhalter
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("IMPRESSUM", 20, yPos);
    yPos += 7;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Verantwortlich fur den Inhalt:", 20, yPos);
    yPos += 5;
    doc.text("[IHR NAME / FIRMENNAME]", 20, yPos);
    yPos += 5;
    doc.text("[STRASSE UND HAUSNUMMER]", 20, yPos);
    yPos += 5;
    doc.text("[PLZ ORT, LAND]", 20, yPos);
    yPos += 5;
    doc.text("E-Mail: [IHRE E-MAIL]", 20, yPos);
    yPos += 10;

    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150, 0, 0);
    doc.text("WICHTIG: Bitte ersetzen Sie die Platzhalter [IN KLAMMERN] mit Ihren tatsachlichen Daten!", 20, yPos);

    // Fußzeile Seite 2
    doc.setTextColor(150, 150, 150);
    doc.text("RemontExpert 3D Pro - Seite 2 von 2", 105, 290, { align: "center" });
    doc.text("Stand: Mai 2026", 105, 285, { align: "center" });

    // PDF speichern
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;
    const fileName = `RemontExpert_ECO_${jobType}_${dateStr}_${timeStr}.pdf`;
    doc.save(fileName);
}

// Funktion exportieren
window.generateEcoPDF = generateEcoPDF;
