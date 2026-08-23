# Bau_Rechner

RemontExpert 3D Pro — renovation calculator with CSS 3D room view, PDF export, i18n (RU/EN/DE). Target: German market, **DE is the default language**.

## Language notes

- **Agent ↔ user**: Latvian (LV)
- **Code comments**: Russian (— `script.js`, `room3d.js` etc. all have Russian comments)
- **UI strings**: RU/EN/DE via i18n; **DE default**
- **Data file keys**: English (`data/*.json`)

## Architecture

- **Vanilla JS** (12 modules loaded via `<script>` tags in `index.html` — no bundler, no npm)
- **CSS 3D room** (no Three.js — `room3d.js` rotates a CSS `div` cube via JS transforms)
- **jsPDF** vendored as `libs/jspdf.umd.min.js`; PT Sans TTF fonts in `fonts/` for Cyrillic
- **i18n**: `lang.js` has UI translations inline; result texts live in `locales/*/{common,tasks,inventory,categories}.json`
- **Data**: `data/pricing.json` (default prices), `data/prices_{obi,hornbach,bauhaus}.json` (per-store prices), `data/{painting,wallpaper}_pro.json` (work models)
- All modules expose controllers on `window.*` — no ES module imports

## Quick start

Serve with any static HTTP server (CORS needed for `fetch` JSON):
```
python -m http.server 8000
```
Then open `http://localhost:8000`.

## Key modules & responsibilities

| File | Role |
|---|---|
| `script.js` | Main — loads pricing, store selector (`switchStore`), orchestrates recalculation, renders receipt |
| `room3d.js` | CSS-3D cube, mouse/touch drag, dimension inputs, mobile scaling, openings rendering |
| `openings.js` | CRUD windows/doors per wall (localStorage), area deduction (>2 m² rule), modal dialog |
| `ECO.js` / `NORM.js` / `PRO.js` | Per-class calculation logic (window globals) |
| `paint.js` / `wallpaper.js` / `tech-card.js` | Material-specific calculations (bucket optimization, roll/glue, primer/paint card) |
| `work-stages.js` | Shared work-stage percent table + `makeStageId()` — single source for NORM/PRO work items |
| `pdf-export.js` | jsPDF receipt generation with logo, loads PT Sans TTF (Cyrillic), transliteration fallback |
| `lang.js` | Language switch, `t(key)` UI helper, `tr(category, key)` result helper, DE fallback |
| `info-modal.js` | Loads `libs/infos/room-measurement-{lang}.html` in a modal; respects selected language |

## Calculations

- **Paint**: `(area / coverage) × coats × 1.1` → greedy bucket optimization. `coverage`/`coats` taken from the smallest bucket (base wall paint; order-independent), reserve 10%
- **Wallpaper**: `(area / 10.6) × 1.1` rolls; `Math.ceil(area / 22.5)` glue packages
- **Openings**: each opening **> 2 m²** fully deducted from its wall's area — only on walls whose toggle is checked; openings ≤ 2 m² are NOT deducted (slopes/recesses compensate)
- **Primer/ECO tool prices**: from store data (`pricing.primer`, `pricing.ecoEquipment`, `pricing.ecoExtras`, `pricing.ecoWallpaperTools`, `pricing.ecoWallpaperExtras`)
- **Mobile 3D scale**: `(min(viewport_w, viewport_h) × 0.75) / max(x, y, z)`

## Recalculation flow

1. User changes dimensions/walls/job/class/store → triggers `loadReceipt(jobType)`
2. `loadReceipt` fetches `data/{painting|wallpaper}_pro.json` → calls `renderReceipt(model)`
3. `renderReceipt` calls `calculateTotals(model)` which dispatches to ECO/NORM/PRO module
4. DOM is fully replaced (`box.innerHTML = ...`)
5. Checkbox listeners re-attached

Recalculation is debounced at 1.5s in `room3d.js`. 3D updates immediately, receipt waits.

**Race protection**: `loadReceipt`, `loadPricing` and language switching use sequence counters — a stale response never overwrites a newer result (rapid clicks on store/lang/checkboxes are safe).

## i18n quirks

- `t('key')` — UI strings from inline `translations` object in `lang.js`
- `tr(category, key)` — result strings from `locales/{lang}/*.json` (loaded asynchronously on language change)
- `getTranslatedLineName()` maps line IDs to translation keys with prefix-stripping logic (`paintInspection` → `tasks/painting.inspection`)
- Language persisted in `localStorage('language')`; auto-detected from `navigator.language` with **DE fallback**

## Service levels

- **ECO** — materials + optional tool checkboxes
- **NORM** — materials + work checkboxes (user selects)
- **PRO** — materials + all work (no checkboxes)
- PDF export button **only shown for ECO** class (planned: all classes)

## Store selection

- Buttons `.store-btn` (OBI/Hornbach/Bauhaus) → `switchStore(store)` in `script.js:236`
- Loads `data/prices_{store}.json`, replaces `pricing`, recalculates receipt + PDF
- Default store: `default` → `data/pricing.json`

## Reset buttons

- 🔃 (reset filters) — resets job to `painting`, all walls checked except floor
- 🔃 (reset work blocks) — resets ECO tool checkboxes and NORM work checkboxes to defaults in `script.js:724-763`

## PDF export

- Called from `window.generateEcoPDF(totals, currentJob)` (ECO only)
- Uses `locales/pdf-disclaimer.js` (`window.PdfDisclaimers`) for legal texts
- Loads PT Sans TTF from `fonts/` (cached in `window._pdfFontCache`); transliterates Cyrillic → Latin as fallback
- Includes selected store prices

## State (all global on `window`)

- `currentJob` — `'painting'` | `'wallpaper'` (**must stay reachable as `window.currentJob`** — declared with `var` in script.js; openings.js reads it)
- `currentClass` — `'econom'` | `'standard'` | `'premium'`
- `selectedStore` — `'default'` | `'obi'` | `'hornbach'` | `'bauhaus'`
- `pricing` — loaded from `data/pricing.json` or `data/prices_{store}.json`
- `selectedEcoTools` / `selectedNormWorks` — checkbox state objects

## No tests / no build / no linter

Pure static HTML/CSS/JS. No package.json, no build step, no CI.

## Communication conventions (LV)

1. Questions & instructions are numbered (1, 2, 3...)
   a) Sub-points use letters (a, b, c...)
   b) Deeper level uses Roman numerals (i, ii, iii...)
2. Answers follow the same numbering — **every reply must use numbered points matching the questions**
3. Code changes only after confirmation

## Documentation

- **HISTORY.md** — completed phases (1-13), updated 2026-08-19
- **PLAN.md** — launch roadmap: Phase 14 pre-launch → 15 LAUNCH → 16 React