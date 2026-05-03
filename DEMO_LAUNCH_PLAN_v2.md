# RemontExpert 3D Pro - Demo Launch Plan v2

**Mērķis:** Palaist funkcionālu demo versiju ar krāsošanas un tapetēšanas aprēķiniem pirmajiem klientiem.

**Statuss:** Fāze 1 pabeigta ✅ → Turpinām ar aprēķinu loģiku  
**Termiņš:** ASAP (ir interesenti)  
**Apjoms:** Krāsošana + Tapetēšana (grīdas segums vēlāk)

---

## ✅ FĀZE 1: Kritisko kļūdu labošana (PABEIGTA 2026-05-02)

### Izpildīts:
- ✅ Radio pogu inicializācija (painting + econom checked)
- ✅ Input validācija (min/max, negatīvi skaitļi)
- ✅ Visibility rules labošana (ECO/NORM/PRO)
- ✅ NORM klases checkbox funkcionalitāte
- ✅ Persistent b1 inspection warning ar "вернуть" linku
- ✅ Reset pogas (filtri + darbu izvēle)
- ✅ Servisa klašu nosaukumi: ECO/NORM/PRO ar tooltips
- ✅ Flooring opcija noņemta
- ✅ Footer pozicionēšana
- ✅ Vertical layout kreisajā panelī

**Commits:** 8e86634, bd6ca76

---

## FĀZE 2: Aprēķinu loģikas uzlabošana (NĀKAMĀ)

### 2.1 Atsevišķs calculations.js fails
**Mērķis:** Atdalīt aprēķinu loģiku no UI loģikas

- [ ] Izveidot `calculations.js` failu
- [ ] Pārcelt visas aprēķinu funkcijas:
  - `calculateArea()` - platības aprēķins
  - `calculateMaterials()` - materiālu daudzumi
  - `calculateTotals()` - kopējās summas
  - `calculatePaintQuantity()` - krāsas litri
  - `calculateWallpaperQuantity()` - tapešu ruļļi
- [ ] Pievienot JSDoc komentārus katrai funkcijai
- [ ] Importēt `calculations.js` no `script.js`

**Jauns fails:** `calculations.js`

### 2.2 Krāsas aprēķins (m² → litri)
**Formula:** `litri = (m² / izklāšana) * slāņi * (1 + rezerve)`

- [ ] Pievienot `coverage` lauku pricing.json (piemēram, 10 m²/L)
- [ ] Pievienot `coats` lauku (cik slāņi vajadzīgi)
- [ ] Pievienot 10% rezervi
- [ ] Aprēķināt bundžu skaitu:
  - Pieejamie izmēri: 0.75L, 2.5L, 5L, 10L
  - Optimizēt kombināciju (mazāk bundžu)
- [ ] Parādīt tāmē: "Krāsa: 15.5L (1×10L + 1×5L + 1×0.75L)"

**Funkcija:** `calculatePaintQuantity(area, coverage, coats)`

### 2.3 Tapešu aprēķins (m² → ruļļi)
**Formula:** `ruļļi = ceil((m² / 5.3) * (1 + rezerve + rapports))`

- [ ] Standarta rullis: 0.53m × 10m = 5.3m²
- [ ] Pievienot 10% rezervi
- [ ] Pievienot 5% rapporta zudumiem
- [ ] Aprēķināt līmes daudzumu (kg pēc ruļļu skaita)
- [ ] Parādīt tāmē: "Tapetes: 8 ruļļi (0.53×10m) + Līme: 2kg"

**Funkcija:** `calculateWallpaperQuantity(area, rollWidth, rollLength)`

### 2.4 Aprīkojuma aprēķins
**Loģika:** Daudzums atkarīgs no m² un darba tipa

**Krāsošanai:**
- Ruļļi: 1 gab. uz 50m²
- Otas: 1 komplekts uz 100m²
- Vanniņas: 1 gab. uz 50m²
- Masking tape: 1 rullis uz 20m perimetra
- Plēve: 1 rullis uz 30m²

**Tapetēšanai:**
- Tapešu nazis: 1 gab.
- Līmēšanas ota: 1 gab.
- Ruļlis gludināšanai: 1 gab.
- Spainis līmei: 1 gab.
- Lineāls/līmeņrādis: 1 gab.

**Funkcija:** `calculateEquipment(area, jobType)`

### 2.5 Sienu izvēles aprēķins
**Mērķis:** Aprēķināt tikai izvēlētās sienas

- [ ] Pārveidot `calculateArea()` lai pieņem `selectedSides` masīvu
- [ ] Aprēķināt katras sienas platību atsevišķi
- [ ] Summēt tikai izvēlētās sienas
- [ ] Atjaunot 3D vizualizāciju (highlight izvēlētās sienas)

**Funkcija:** `calculateSelectedArea(dimensions, selectedSides)`

### 2.6 Cenu avotu verificējamība
**Mērķis:** Katrai cenai ir avots un datums

- [ ] Pievienot `pricing.json` struktūrā:
  ```json
  {
    "material": "Krāsa Dulux Matt",
    "price": 25.99,
    "unit": "2.5L",
    "store": "TOOM",
    "url": "https://toom.lv/...",
    "lastUpdated": "2026-05-02"
  }
  ```
- [ ] Pievienot tāmē info ikonu ar avota linku
- [ ] Parādīt "Cenas atjaunotas: 2026-05-02"

**Fails:** `pricing.json`

---

## FĀZE 3: Datu struktūras sakārtošana (1-2 dienas)

### 3.1 Pārskatīt pricing.json
- [ ] Pārbaudīt aktuālās cenas (TOOM, Depo, Kurši)
- [ ] Pievienot `coverage` (izklāšana m²/L)
- [ ] Pievienot `coats` (slāņu skaits)
- [ ] Pievienot avota URL un datumu
- [ ] Strukturēt pēc kategorijām: paint, wallpaper, equipment

### 3.2 Pārskatīt painting_pro.json
- [ ] Pārbaudīt darbu bloku loģiku
- [ ] Pievienot detalizētus aprakstus
- [ ] Pārbaudīt `serviceLevel` filtrus
- [ ] Pievienot `workRate` (€/m²) katram blokam

### 3.3 Pārskatīt wallpaper_pro.json
- [ ] Pārbaudīt darbu bloku loģiku
- [ ] Pievienot detalizētus aprakstus
- [ ] Pārbaudīt `serviceLevel` filtrus
- [ ] Pievienot `workRate` (€/m²) katram blokam

### 3.4 Dzēst flooring_pro.json
- [ ] Noņemt failu no projekta
- [ ] Pārbaudīt, ka nav atsauču `script.js`

---

## FĀZE 4: PDF eksports (2 dienas)

### 4.1 Integrēt jsPDF
- [ ] Pievienot jsPDF CDN linku
- [ ] Izveidot "Lejupielādēt PDF" pogu
- [ ] Testēt PDF ģenerēšanu

### 4.2 PDF saturs
- [ ] Projekta nosaukums un datums
- [ ] Telpas izmēri un platība
- [ ] Izvēlētais darba tips un servisa līmenis
- [ ] Detalizēta tāme (darbi + materiāli + aprīkojums)
- [ ] Materiālu saraksts ar daudzumiem
- [ ] Kopējā summa
- [ ] Juridiskais disclaimer: "Šis ir informatīvs aprēķins. Precīzu tāmi var sniegt tikai pēc apskates."

### 4.3 PDF dizains
- [ ] Tabulas ar borders
- [ ] Krāsu shēma
- [ ] Footer: "Ģenerēts ar RemontExpert 3D Pro"

---

## FĀZE 5: Lietojamības uzlabojumi (1-2 dienas)

### 5.1 Loading state
- [ ] Spinner JSON ielādes laikā
- [ ] "Aprēķina..." teksts kalkulācijas laikā
- [ ] Disable pogas aprēķina laikā

### 5.2 Kļūdu apstrāde
- [ ] User-friendly ziņojumi, ja JSON neizdodas ielādēt
- [ ] Fallback vērtības, ja trūkst datu
- [ ] Validācijas ziņojumi

### 5.3 Vizuālā atgriezeniskā saite
- [ ] Smooth scroll uz rezultātiem pēc aprēķina
- [ ] Highlight izmaiņas, kad maina servisa līmeni
- [ ] Animācijas pārejām

---

## FĀZE 6: Testēšana (2 dienas)

### 6.1 Funkcionālā testēšana
- [ ] Visi input scenāriji
- [ ] Visi servisa līmeņi
- [ ] Abi darbu tipi
- [ ] Sienu izvēle
- [ ] PDF eksports

### 6.2 Cross-browser testēšana
- [ ] Chrome, Firefox, Safari, Edge
- [ ] Mobile browsers

### 6.3 Responsive testēšana
- [ ] Desktop, Tablet, Mobile
- [ ] 3D vizualizācija visās ierīcēs

---

## FĀZE 7: Deployment (1 diena)

### 7.1 Hosting
- [ ] GitHub Pages / Netlify / Vercel
- [ ] Custom domain (optional)

### 7.2 Analytics
- [ ] Google Analytics vai Plausible
- [ ] Izsekot: apmeklējumi, aprēķini, PDF lejupielādes

### 7.3 Legal
- [ ] Cookie banner (GDPR)
- [ ] Privacy Policy
- [ ] Disclaimer par aprēķinu precizitāti

---

## Prioritāšu secība:

**MUST HAVE:**
- ✅ Fāze 1: Kritisko kļūdu labošana
- 🔄 Fāze 2: Aprēķinu loģika
- Fāze 3: Datu struktūras

**SHOULD HAVE:**
- Fāze 4: PDF eksports
- Fāze 5: Lietojamības uzlabojumi

**NICE TO HAVE:**
- Fāze 6: Testēšana
- Fāze 7: Deployment

---

## Laika novērtējums:

- **Minimālā demo:** 7-10 dienas (Fāze 1-3)
- **Pilna demo:** 12-16 dienas (Fāze 1-5)
- **Production-ready:** 18-22 dienas (visas fāzes)

---

## Nākamais solis:

**Fāze 2.1:** Izveidot `calculations.js` un atdalīt aprēķinu loģiku.

Vai sākam ar calculations.js izveidi?
