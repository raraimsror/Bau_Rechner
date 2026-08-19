# RemontExpert 3D Pro - Development Plan

**Updated:** 2026-08-19  
**Status:** LAUNCH PREPARATION — Vācijas tirgus (DE noklusējuma valoda)  
**Kontrolpunkts:** LAUNCH → pēc tā React migrācija

---

## ✅ COMPLETED PHASES

### Phase 1-13: Core Development (COMPLETE)
- ✅ Critical bug fixes and validation
- ✅ 3D visualization with mobile support
- ✅ Paint calculation with bucket optimization (Alpina/Caparol)
- ✅ Wallpaper calculation (rolls + glue)
- ✅ Modular ECO/NORM/PRO classes
- ✅ PDF export with Cyrillic support (PT Sans fonts)
- ✅ Legal compliance pages (7 pages)
- ✅ Mobile responsive design
- ✅ Mobile 3D scaling (Strategy 6)
- ✅ Debounce recalculation (1.5s)
- ✅ Full localization (RU/EN/DE)
- ✅ Store selection (OBI/Hornbach/Bauhaus)
- ✅ Openings module (windows/doors with area deduction)
- ✅ Apple White UI redesign

**Result:** Functional MVP ready for pre-launch improvements

---

## 🎯 CURRENT PHASE: Pre-Launch Improvements (Phase 14)

**Mērķis:** sagatavot projektu laišanai Vācijas tirgū — saites-kalkulators, ko var izmantot jebkur Vācijā pirms remonta sākšanas. **DE ir noklusējuma valoda.**

### 14.1 Datu / cenu sinhronizācijas process
**Time:** 3-4h

**Problēma:** Cenas `data/prices_*.json` tiek atjauninātas manuāli; pēdējā atjaunināšana 2026-07-09. Nav pārskatāmības, cik svaigas ir cenas.

**Uzdevumi:**
- [ ] Izveidot dokumentētu cenu atjaunināšanas procesu (solis pa solim)
- [ ] UI rādīt "lastUpdated" datumu (data/prices_*.json → `lastUpdated`)
- [ ] Versiju/atjaunināšanas žurnāls vai fails
- [ ] (Opcionāli) cenu iegūšanas skripts (web scraping / API) — atsevišķā posmā

**Rezultāts:** Lietotājs redz, cik svaigas ir cenas; process dokumentēts.

### 14.2 Tehnoloģisko karšu paplašināšana
**Time:** 4-6h

**Problēma:** `tech-card.js` pašlaik aptver tikai primer + paint ECO klasē.

**Uzdevumi:**
- [ ] Tehnoloģiskās kartes visiem job tipiem (painting/wallpaper; flooring — pēc React)
- [ ] Visām klasēm (ECO/NORM/PRO)
- [ ] Soli-pa-solim instrukcijas daudzvalodu (DE/RU/EN)
- [ ] Iekļaušana info-modālī (libs/infos/) un/vai PDF

**Rezultāts:** Katram darba veidam/klasei ir pilna instrukciju karte.

### 14.3 3D scriptu pilnveide
**Time:** 3-5h

**Uzdevumi:**
- [ ] Atvērumu (logu/durvju) uzlabota vizualizācija
- [ ] Izmēru etiķetes (mērījumu rādīšana uz sienām)
- [ ] Atvērumu mērogošana — pārbaudīt, ka X/Y/Z izmaiņas korekti ietekmē atvērumus
- [ ] Mobile performance pārbaude

**Rezultāts:** 3D skats ir vizuāli pārliecinošs un informatīvs.

### 14.4 PDF noformējumi + checklists
**Time:** 4-6h

**Problēma:** PDF eksports pieejams tikai ECO klasei.

**Uzdevumi:**
- [ ] PDF eksports visām klasēm (NORM/PRO)
- [ ] Checklisti (darbu saraksts ar atzīmēšanu)
- [ ] Veikala + cenu atjaunināšanas datuma informācija PDF
- [ ] Tehnoloģiskās kartes iekļaušana PDF (pēc 14.2)
- [ ] Juri diska disclaimeri (PdfDisclaimers) visās valodās

**Rezultāts:** Pilnvērtīgs PDF katram lietotājam — tāme + checklists.

### 14.5 Saites-kalkulators (URL-encoded state)
**Time:** 3-4h

**Problēma:** Aprēķina stāvokli nevar dalīties — katrs atver no nulles.

**Uzdevumi:**
- [ ] Stāvokļa iekodēšana URL parametros: izmēri, sienas, darba veids, klase, veikals, valoda, atvērumi
- [ ] Stāvokļa atjaunošana no URL (share → precīzi tas pats skats)
- [ ] "Kopīgot saiti" poga (kopēšana)
- [ ] (Opcionāli) QR kods PDF

**Rezultāts:** Saites-kalkulators — var dalīties un izmantot jebkur Vācijā pirms remonta.

### 14.6 Testēšana + fināla pārbaude
**Time:** 4-6h

**Uzdevumi:**
- [ ] Visas 3 klases (ECO/NORM/PRO) × abi job tipi
- [ ] Visas 3 valodas (DE pirmā)
- [ ] Mobile (320px - 1920px) + 3D uz mobīlajiem
- [ ] Visi checkboxi, reset pogas, veikalu pārslēgšana
- [ ] Aprēķinu atbilstība oriģinālam
- [ ] PDF eksports visām klasēm

**Rezultāts:** Bez kritiskiem bugiem, gatavs laišanai.

---

## 🚀 Phase 15: LAUNCH (KONTROLPUNKTS)

**Time:** 1 diena (izvietošana)

- [ ] Hostings/Vācijas domēns
- [ ] SSL, SEO (meta, structured data)
- [ ] Analytics (GA / Plausible)
- [ ] DE kā noklusējuma valoda + validācija
- [ ] Juri diska lapu pārbaude (impressum/datenschutz)

**Rezultāts:** Tiešsaistē pieejams saites-kalkulators Vācijas tirgum.

---

## ⚛️ Phase 16: React Migration (PĒC LAUNCH)

**Kad:** tūlīt pēc Phase 15 laišanas.

**Pieeja:** jauns projekts līdzās esošajam; oriģināls paliek par atsauci/fallback; funkcionalitātes paritāte bez zaudējumiem.

### 16.1 Projekta setup (4-6h)
- [ ] Bau_Rechner_React/ mapē (Vite + React 18)
- [ ] Dependencies: react-router-dom, i18next, jspdf
- [ ] Mape: components/, services/, hooks/, context/
- [ ] Statisko aktīvu kopēšana (data/, locales/, pics/, fonts/)

### 16.2 State management (3-4h)
- [ ] AppContext ar useReducer (izmēri, sienas, darba veids, klase, veikals, valoda, atvērumi)
- [ ] useDebounce, useLocalStorage, useCalculations hooki
- [ ] i18next konfigurācija (esošie locales/ JSON)

### 16.3 Komponenti (6-10h)
- [ ] Layout (Header, Footer, MainLayout)
- [ ] Filters (JobTypeSelector, WallSelector, StoreSelector)
- [ ] RoomViewer (Room3D port, RoomInputs, InfoModal)
- [ ] Results (RepairClassSelector, Receipt, ReceiptLine, PDFExportButton)

### 16.4 Aprēķinu servisi (4-5h)
- [ ] eco.js / norm.js / pro.js / paint.js / wallpaper.js / techCard.js (tīras funkcijas)
- [ ] PDF eksports (jspdf npm)

### 16.5 Testēšana (4-6h)
- [ ] Funkcionālā paritāte ar oriģinālu
- [ ] Mobile testēšana
- [ ] Produkcijas build

**Kopā:** ~28-38h

---

## 🔮 FUTURE (b) — pēc React migrācijas

### Tuvākā nākotne (1-2 mēneši)
- [ ] UI/UX uzlabojumi React vidē
- [ ] Lietotāju testēšana un atsauksmes
- [ ] Veikalu cenu automātiska sinhronizācija (API/scraping)
- [ ] Cenu svaiguma indikators (pēc 14.1)

### Vidējs termiņš (3-6 mēneši)
- [ ] TypeScript migrācija
- [ ] Unit tests (Jest + React Testing Library) / E2E (Playwright)
- [ ] Veikalu API integrācija (automātiska cenu atjaunināšana)
- [ ] Paplašināta materiālu datubāze (vairāk zīmolu)
- [ ] Lietotāju konti un saglabāti projekti
- [ ] Salīdzināšanas rīks (vairāki varianti)
- [ ] LV valodas pievienošana

### Ilgtermiņš (6-12 mēneši)
- [ ] AI asistents materiālu izvēlei
- [ ] Paplašināta 3D ģeometrija (jumti, fasādes, terases)
- [ ] Mobile app (React Native)
- [ ] Profesionāļu profili (uzņēmēji, arhitekti)
- [ ] Marketplace integrācija
- [ ] Darba laika kalkulators, kalendāra integrācija
- [ ] Sarakste ar uzņēmējiem

---

## 📊 Progress Tracker

```
14.1 Price sync           ⏳ 0%
14.2 Tech cards           ⏳ 0%
14.3 3D improvements      ⏳ 0%
14.4 PDF + checklists     ⏳ 0%
14.5 Link-calculator      ⏳ 0%
14.6 Testing              ⏳ 0%
─────────────────────────────────
Phase 14 (Pre-launch)     ⏳ 0%
Phase 15 (LAUNCH)         ⏳ 0%
Phase 16 (React)          ⏳ 0%
```

**Estimated Time (Phase 14):** 21-31h  
**Target LAUNCH:** pēc Phase 14 pabeigšanas

---

## 📚 Resources

- **Architecture:** HISTORY.md, AGENTS.md
- **Roadmap:** šī faila Phase 14-16
- **Testing:** manuālais checklists Phase 14.6

---

**Last Updated:** 2026-08-19  
**Next Review:** pēc katra Phase 14 apakšposma pabeigšanas