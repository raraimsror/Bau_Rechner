# RemontExpert 3D Pro - Demo Launch Plan

**Mērķis:** Palaist funkcionālu demo versiju ar krāsošanas un tapetēšanas aprēķiniem pirmajiem klientiem.

**Statuss:** Prototips → Produkcijas demo  
**Termiņš:** ASAP (ir interesenti)  
**Apjoms:** Krāsošana + Tapetēšana (grīdas segums vēlāk)

---

## FĀZE 1: Kritisko kļūdu labošana (1-2 dienas)

### 1.1 Radio pogu inicializācija
- [ ] Pievienot `checked` atribūtus HTML radio pogām
- [ ] Pārbaudīt, ka noklusējuma izvēle: Painting + Econom
- [ ] Testēt, ka lietotājs redz izvēlētu opciju uzreiz

**Fails:** `index.html` (radio inputs)

### 1.2 Econom klases darba izmaksu loģika
- [ ] Izlemt: vai Econom = tikai materiāli (darbs 0€) vai arī izmanto workRate?
- [ ] Ja darbs = 0€, pievienot skaidru paziņojumu lietotājam
- [ ] Ja izmanto workRate, labot `calculateTotals()` funkciju

**Fails:** `script.js:299-323`

### 1.3 Visibility rules labošana
- [ ] Pārbaudīt, kuri bloki ir `painting_pro.json` un `wallpaper_pro.json`
- [ ] Atjaunot `visibilityRules` objektu ar pareizajiem bloku ID
- [ ] Testēt visus 3 līmeņus: Econom, Standard, Premium

**Fails:** `script.js:354-358`

### 1.4 Input validācija
- [ ] Pievienot `min="1"` visiem izmēru input laukiem
- [ ] Pievienot JavaScript validāciju (negatīvi skaitļi, 0, tukši lauki)
- [ ] Parādīt kļūdas paziņojumu, ja ievade nederīga

**Fails:** `index.html` + `script.js`

---

## FĀZE 2: Lietojamības uzlabojumi (2-3 dienas)

### 2.1 Checkbox funkcionalitāte (sienu izvēle)
- [ ] Implementēt loģiku, kas aprēķina tikai izvēlētās sienas
- [ ] "Выбрать всё" checkbox atzīmē/noņem visas sienas
- [ ] Pārrēķināt tāmi, kad lietotājs maina izvēli
- [ ] Vizuāli izcelts 3D skatā, kuras sienas izvēlētas

**Fails:** `script.js` (jauna funkcija `getSelectedWalls()`)

### 2.2 Loading state
- [ ] Pievienot spinner, kamēr ielādējas JSON faili
- [ ] Parādīt "Aprēķina..." tekstu, kad notiek kalkulācija
- [ ] Disable pogas, kamēr notiek aprēķins

**Fails:** `index.html` + `style.css` + `script.js`

### 2.3 Kļūdu apstrāde
- [ ] Ja JSON fails neizdodas ielādēt → parādīt lietotājam saprotamu paziņojumu
- [ ] Pievienot fallback vērtības, ja trūkst datu
- [ ] Console.error vietā → user-friendly ziņojumi

**Fails:** `script.js` (fetch error handling)

### 2.4 Vizuālā atgriezeniskā saite
- [ ] Kad lietotājs maina izmērus → parādīt, ka notiek pārrēķins
- [ ] Kad maina servisa līmeni → highlight, kas mainījās tāmē
- [ ] Smooth scroll uz tāmes sadaļu pēc aprēķina

**Fails:** `script.js` + `style.css`

---

## FĀZE 3: Datu struktūras sakārtošana (1-2 dienas)

### 3.1 Pārskatīt un atjaunot pricing.json
- [ ] Pārbaudīt aktuālās cenas (TOOM, Depo, Kurši)
- [ ] Pievienot avota linku katrai cenai (verificējamība)
- [ ] Pievienot `lastUpdated` lauku katram materiālam
- [ ] Strukturēt: `{ material, price, unit, store, url, updated }`

**Fails:** `pricing.json`

### 3.2 Pārskatīt painting_pro.json
- [ ] Pārbaudīt, vai visi bloki ir loģiski
- [ ] Pievienot aprakstus katram blokam (ko tas ietver)
- [ ] Pārbaudīt, vai `serviceLevel` filtri ir pareizi
- [ ] Noņemt demo/test datus

**Fails:** `painting_pro.json`

### 3.3 Pārskatīt wallpaper_pro.json
- [ ] Pārbaudīt, vai visi bloki ir loģiski
- [ ] Pievienot aprakstus katram blokam
- [ ] Pārbaudīt, vai `serviceLevel` filtri ir pareizi
- [ ] Noņemt demo/test datus

**Fails:** `wallpaper_pro.json`

### 3.4 Dzēst flooring_pro.json
- [ ] Noņemt no projekta (vēlāk pievienosim)
- [ ] Noņemt flooring opciju no HTML radio pogām
- [ ] Noņemt flooring loģiku no `script.js`

**Fails:** `flooring_pro.json` (delete), `index.html`, `script.js`

---

## FĀZE 4: Materiālu aprēķins (2-3 dienas)

### 4.1 Krāsas aprēķins
- [ ] m² → litri (pēc ražotāja specifikācijas)
- [ ] Pievienot 10% rezervi
- [ ] Aprēķināt bundžu skaitu (piemēram, 2.5L, 5L, 10L)
- [ ] Parādīt tāmē: "Krāsa: 15.5L (2x10L + 1x5L + 1x2.5L)"

**Fails:** `script.js` (jauna funkcija `calculatePaintQuantity()`)

### 4.2 Tapešu aprēķins
- [ ] m² → ruļļu skaits (standarta rullis 0.53m x 10m = 5.3m²)
- [ ] Pievienot 10% rezervi + rapporta zudumi
- [ ] Aprēķināt līmes daudzumu
- [ ] Parādīt tāmē: "Tapetes: 8 ruļļi (standarta 0.53x10m)"

**Fails:** `script.js` (jauna funkcija `calculateWallpaperQuantity()`)

### 4.3 Aprīkojuma aprēķins
- [ ] Otas, ruļļi, vanniņas - atkarībā no m²
- [ ] Masking tape, plēve - atkarībā no m²
- [ ] Parādīt tāmē ar daudzumiem

**Fils:** `script.js` (atjaunot `calculateMaterials()`)

---

## FĀZE 5: PDF eksports (2 dienas)

### 5.1 Integrēt jsPDF bibliotēku
- [ ] Pievienot jsPDF CDN linku HTML
- [ ] Izveidot `generatePDF()` funkciju
- [ ] Testēt PDF ģenerēšanu

**Fails:** `index.html`, `script.js`

### 5.2 PDF saturs
- [ ] Projekta nosaukums un datums
- [ ] Telpas izmēri un platība
- [ ] Izvēlētais darba tips un servisa līmenis
- [ ] Detalizēta tāme (darbi + materiāli + aprīkojums)
- [ ] Materiālu saraksts ar daudzumiem
- [ ] Kopējā summa
- [ ] Footer: "Ģenerēts ar RemontExpert 3D Pro"

**Fails:** `script.js` (generatePDF funkcija)

### 5.3 PDF dizains
- [ ] Logo (ja ir)
- [ ] Tabulas ar borders
- [ ] Krāsu shēma (atbilstoša mājas lapai)
- [ ] QR kods uz mājas lapu (optional)

**Fails:** `script.js`

---

## FĀZE 6: Valodu atbalsts (1 diena)

### 6.1 Izvēlēties galveno valodu
- [ ] Izlemt: LV, RU vai DE?
- [ ] Pārtulkot visu HTML saturu
- [ ] Pārtulkot JavaScript paziņojumus

**Fails:** `index.html`, `script.js`

### 6.2 Valodu pārslēdzējs (optional)
- [ ] Pievienot dropdown LV/RU/DE
- [ ] Izveidot tulkojumu objektu
- [ ] Implementēt pārslēgšanas loģiku

**Fails:** `index.html`, `script.js` (jauns `translations` objekts)

---

## FĀZE 7: Testēšana (2 dienas)

### 7.1 Funkcionālā testēšana
- [ ] Testēt visus input scenārijus (mazi/lieli izmēri)
- [ ] Testēt visus servisa līmeņus (ECO/NORM/PRO)
- [ ] Testēt abus darbu tipus (krāsošana/tapetes)
- [ ] Testēt sienu izvēli (checkbox)
- [ ] Testēt PDF eksportu

### 7.2 Cross-browser testēšana
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers (iOS Safari, Chrome Android)

### 7.3 Responsive testēšana
- [ ] Desktop (1920x1080, 1366x768)
- [ ] Tablet (iPad, Android tablet)
- [ ] Mobile (iPhone, Android phone)
- [ ] 3D vizualizācija darbojas visās ierīcēs

### 7.4 Performance testēšana
- [ ] Ielādes ātrums < 3 sekundes
- [ ] 3D vizualizācija smooth (60fps)
- [ ] Aprēķini notiek < 1 sekunde

---

## FĀZE 8: Deployment (1 diena)

### 8.1 Hosting izvēle
- [ ] GitHub Pages (bezmaksas, vienkārši)
- [ ] Netlify (bezmaksas, CDN, forms)
- [ ] Wix (ja plāno turpināt ar Wix Velo)

### 8.2 Domain
- [ ] Reģistrēt domēnu (piemēram, remontexpert.lv)
- [ ] Vai izmantot subdomain (demo.remontexpert.lv)

### 8.3 Analytics
- [ ] Google Analytics vai Plausible
- [ ] Izsekot: apmeklējumi, aprēķinu skaits, PDF lejupielādes

### 8.4 Legal
- [ ] Cookie banner (GDPR)
- [ ] Privacy Policy lapa
- [ ] Impressum (ja vajag)

---

## FĀZE 9: Marketing (ongoing)

### 9.1 Landing page
- [ ] Skaidrs value proposition
- [ ] Demo video vai screenshots
- [ ] CTA: "Izmēģini kalkulatoru"
- [ ] Kontakta forma

### 9.2 Pirmie klienti
- [ ] Nosūtīt linku interesantiem
- [ ] Savākt feedback
- [ ] Iterēt pēc feedback

### 9.3 Social media
- [ ] Facebook post
- [ ] LinkedIn post
- [ ] Instagram story

---

## Prioritāšu secība (ja ierobežots laiks):

**MUST HAVE (Fāze 1-3):**
- Kritisko kļūdu labošana
- Lietojamības uzlabojumi
- Datu struktūras sakārtošana

**SHOULD HAVE (Fāze 4-5):**
- Materiālu aprēķins
- PDF eksports

**NICE TO HAVE (Fāze 6-9):**
- Valodu atbalsts
- Testēšana
- Deployment
- Marketing

---

## Laika novērtējums:

- **Minimālā demo versija:** 5-7 dienas (Fāze 1-3)
- **Pilna demo versija:** 10-14 dienas (Fāze 1-5)
- **Production-ready:** 15-20 dienas (visas fāzes)

---

## Nākamais solis:

Sākt ar **Fāzi 1: Kritisko kļūdu labošana**.

Vai vēlies, lai es uzreiz sāku labot kļūdas, vai vispirms vēlies pārrunāt kādu konkrētu fāzi?
