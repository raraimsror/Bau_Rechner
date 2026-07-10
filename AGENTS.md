# Bau_Rechner

RemontExpert 3D Pro — renovation calculator with CSS 3D room view, PDF export, i18n (RU/EN/DE).

## Language notes

- **Agent ↔ user**: Latvian (LV)
- **Code comments**: Russian (— `script.js`, `room3d.js` etc. all have Russian comments)
- **UI strings**: RU/EN/DE via i18n
- **Data file keys**: English (`data/*.json`)

## Architecture

- **Vanilla JS** (11 modules loaded via `<script>` tags in `index.html` — no bundler, no npm)
- **CSS 3D room** (no Three.js — `room3d.js` rotates a CSS `div` cube via JS transforms)
- **jsPDF** vendored as `libs/jspdf.umd.min.js`
- **i18n**: `lang.js` has UI translations inline; result texts live in `locales/*/{common,tasks,inventory,categories}.json`
- **Data**: `data/pricing.json` (Alpina paints, Erfurt wallpaper), `data/{painting,wallpaper}_pro.json` (work models)
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
| `script.js` (805L) | Main — loads pricing, orchestrates recalculation, renders receipt |
| `room3d.js` (255L) | CSS-3D cube, mouse/touch drag, dimension inputs, mobile scaling |
| `ECO.js` / `NORM.js` / `PRO.js` | Per-class calculation logic (window globals) |
| `paint.js` / `wallpaper.js` / `tech-card.js` | Material-specific calculations (Alpina bucket optimization, roll/glue) |
| `pdf-export.js` (845L) | jsPDF receipt generation, transliterates Cyrillic → Latin |
| `lang.js` (193L) | Language switch, `tr(category, key)` helper |
| `info-modal.js` | Loads `libs/infos/room-measurement-{lang}.html` in a modal |

## Calculations

- **Paint**: `(area / 5.5) × 2 × 1.1` → greedy bucket optimization (2.5L/5L/25L Alpina)
- **Wallpaper**: `(area / 10.6) × 1.1` rolls; `Math.ceil(area / 22.5)` glue packages
- **Mobile 3D scale**: `(min(viewport_w, viewport_h) × 0.75) / max(x, y, z)`

## Recalculation flow

1. User changes dimensions/walls/job/class → triggers `loadReceipt(jobType)`
2. `loadReceipt` fetches `data/{painting|wallpaper}_pro.json` → calls `renderReceipt(model)`
3. `renderReceipt` calls `calculateTotals(model)` which dispatches to ECO/NORM/PRO module
4. DOM is fully replaced (`box.innerHTML = ...`)
5. Checkbox listeners re-attached

Recalculation is debounced at 1.5s in `room3d.js`. 3D updates immediately, receipt waits.

## i18n quirks

- `t('key')` — UI strings from inline `translations` object in `lang.js`
- `tr(category, key)` — result strings from `locales/{lang}/*.json` (loaded asynchronously on language change)
- `getTranslatedLineName()` maps line IDs to translation keys with prefix-stripping logic (`paintInspection` → `tasks/painting.inspection`)
- Language persisted in `localStorage('language')`; auto-detected from `navigator.language`

## Service levels

- **ECO** — materials + optional tool checkboxes
- **NORM** — materials + work checkboxes (user selects)
- **PRO** — materials + all work (no checkboxes)
- PDF export button **only shown for ECO** class

## Reset buttons

- 🔃 (reset filters) — resets job to `painting`, all walls checked except floor
- 🔃 (reset work blocks) — resets ECO tool checkboxes and NORM work checkboxes to defaults in `script.js:724-763`

## PDF export

- Called from `window.generateEcoPDF(totals, currentJob)` (ECO only)
- Uses `locales/pdf-disclaimer.js` (`window.PdfDisclaimers`) for legal texts
- Transliterates Russian text because jsPDF standard font doesn't support Cyrillic
- Fonts in `fonts/` (PT Sans) are not currently used by pdf-export.js

## State (all global on `window`)

- `currentJob` — `'painting'` | `'wallpaper'`
- `currentClass` — `'econom'` | `'standard'` | `'premium'`
- `pricing` — loaded from `data/pricing.json`
- `selectedEcoTools` / `selectedNormWorks` — checkbox state objects

## No tests / no build / no linter

Pure static HTML/CSS/JS. No package.json, no build step, no CI.

## Communication conventions (LV)

1. Questions & instructions are numbered (1, 2, 3...)
   a) Sub-points use letters (a, b, c...)
   b) Deeper level uses Roman numerals (i, ii, iii...)
2. Answers follow the same numbering — **every reply must use numbered points matching the questions**
3. Code changes only after confirmation