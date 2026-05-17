# RemontExpert 3D Pro - Development Plan

**Updated:** 2026-05-16 21:19  
**Status:** PRODUCTION READY → React Migration Phase

---

## ✅ COMPLETED PHASES

### Phase 1-9: Core Development (COMPLETE)
- ✅ Critical bug fixes and validation
- ✅ 3D visualization with mobile support
- ✅ Paint calculation with bucket optimization
- ✅ Wallpaper calculation (rolls + glue)
- ✅ Modular ECO/NORM/PRO classes
- ✅ PDF export with logo
- ✅ Legal compliance pages (7 pages)
- ✅ Mobile responsive design
- ✅ Mobile 3D scaling (Strategy 6)
- ✅ Debounce recalculation (1.5s)
- ✅ Full localization (RU/EN/DE)

**Result:** Fully functional MVP ready for production

---

## 🎯 CURRENT PRIORITY: React Migration

### Why React?
Current Vanilla JS implementation works perfectly, but React migration will provide:
- Better state management and component reusability
- Easier maintenance and scalability
- Modern development workflow with hot reload
- Better TypeScript integration potential (future)
- Improved testing capabilities
- Cleaner separation of concerns

### Migration Strategy
**Approach:** Create new React project alongside existing one
- Keep original as reference and fallback
- Gradual migration with feature parity verification
- No feature loss - maintain all existing functionality

---

## 📋 Phase 11: React Migration (CURRENT)

### 11.1 Project Setup & Architecture
**Time:** 4-6h

**Tasks:**
- [ ] Create Bau_Rechner_React/ folder alongside existing project
- [ ] Initialize Vite + React project
- [ ] Install dependencies (react-router-dom, i18next, jspdf)
- [ ] Set up folder structure (components/, services/, hooks/, context/)
- [ ] Configure Vite for absolute imports
- [ ] Copy static assets (data/, locales/, pics/, libs/)

**Deliverables:**
- Working React dev server
- Folder structure ready
- All static assets accessible

---

### 11.2 State Management & Context
**Time:** 3-4h

**Tasks:**
- [ ] Create AppContext with useReducer
- [ ] Define all state variables (dimensions, selections, pricing)
- [ ] Implement all reducer actions
- [ ] Create custom hooks (useAppContext, useDebounce)
- [ ] Set up i18next configuration
- [ ] Create LanguageProvider

**Deliverables:**
- Global state management working
- Language switching functional
- Custom hooks ready

---

### 11.3 Layout Components
**Time:** 2-3h

**Tasks:**
- [ ] Create Header component (logo, language selector)
- [ ] Create Footer component (links, copyright)
- [ ] Create MainLayout (3-column responsive grid)
- [ ] Apply CSS Modules for styling
- [ ] Test responsive behavior

**Deliverables:**
- Basic layout structure
- Responsive design working
- Header and footer functional

---

### 11.4 Filters Panel (Left Column)
**Time:** 2-3h

**Tasks:**
- [ ] Create JobTypeSelector component (radio buttons)
- [ ] Create WallSelector component (6 checkboxes)
- [ ] Create ResetFiltersButton component
- [ ] Connect to AppContext
- [ ] Apply translations

**Deliverables:**
- Left panel fully functional
- State updates working
- Translations applied

---

### 11.5 3D Viewer (Center Column)
**Time:** 4-5h

**Tasks:**
- [ ] Create RoomInputs component (X, Y, Z inputs)
- [ ] Create Room3D component (port room3d.js logic)
- [ ] Implement mouse/touch controls
- [ ] Implement mobile scaling (Strategy 6)
- [ ] Create InfoModal component
- [ ] Test 3D interactions

**Deliverables:**
- 3D visualization working
- Mobile scaling functional
- Touch controls working
- Info modal functional

---

### 11.6 Results Panel (Right Column)
**Time:** 3-4h

**Tasks:**
- [ ] Create RepairClassSelector component
- [ ] Create Receipt component
- [ ] Create ReceiptLine component (with checkboxes)
- [ ] Create ResetWorkBlocksButton component
- [ ] Implement dynamic rendering based on repair class

**Deliverables:**
- Right panel fully functional
- Receipt rendering correctly
- Checkboxes working

---

### 11.7 Calculation Services
**Time:** 4-5h

**Tasks:**
- [ ] Port ECO.js to services/calculations/eco.js
- [ ] Port NORM.js to services/calculations/norm.js
- [ ] Port PRO.js to services/calculations/pro.js
- [ ] Port paint.js to services/calculations/paint.js
- [ ] Port wallpaper.js to services/calculations/wallpaper.js
- [ ] Port tech-card.js to services/calculations/techCard.js
- [ ] Create useCalculations hook
- [ ] Implement debounced recalculation (1.5s)

**Deliverables:**
- All calculation logic working
- Pure functions (no global state)
- Debounce working correctly

---

### 11.8 PDF Export
**Time:** 2-3h

**Tasks:**
- [ ] Port pdf-export.js to services/pdfExport.js
- [ ] Integrate jsPDF npm package
- [ ] Create PDFExportButton component
- [ ] Test PDF generation with all data
- [ ] Verify logo appears correctly

**Deliverables:**
- PDF export working
- All data included
- Formatting matches original

---

### 11.9 Testing & Verification
**Time:** 4-6h

**Tasks:**
- [ ] Test all 3 repair classes (ECO/NORM/PRO)
- [ ] Test both job types (painting/wallpaper)
- [ ] Test all 3 languages (RU/EN/DE)
- [ ] Test mobile responsiveness (320px - 1920px)
- [ ] Test 3D viewer on mobile devices
- [ ] Test PDF export
- [ ] Test all checkbox interactions
- [ ] Test reset buttons
- [ ] Verify calculations match original
- [ ] Fix any bugs found

**Deliverables:**
- All features working
- Feature parity with original
- No critical bugs

---

### 11.10 Build & Documentation
**Time:** 1-2h

**Tasks:**
- [ ] Run production build
- [ ] Test production bundle
- [ ] Update README.md with React instructions
- [ ] Document component structure
- [ ] Document state management
- [ ] Create migration notes

**Deliverables:**
- Production build ready
- Documentation updated
- Migration complete

---

## 📊 Phase 11 Progress Tracker

```
11.1 Project Setup         ⏳ 0%
11.2 State Management      ⏳ 0%
11.3 Layout Components     ⏳ 0%
11.4 Filters Panel         ⏳ 0%
11.5 3D Viewer             ⏳ 0%
11.6 Results Panel         ⏳ 0%
11.7 Calculation Services  ⏳ 0%
11.8 PDF Export            ⏳ 0%
11.9 Testing               ⏳ 0%
11.10 Build & Docs         ⏳ 0%
─────────────────────────────────
Overall Progress           ⏳ 0%
```

**Estimated Time:** 28-38 hours  
**Target Completion:** 2026-05-25

---

## 🔮 FUTURE ENHANCEMENTS (After React Migration)

### Phase 10: UI/UX Design Improvements (POSTPONED)
*Will be implemented in React after migration*

**Planned improvements:**
- Color scheme and branding
- Typography system
- Layout and spacing improvements
- Interactive elements styling
- 3D viewer UI enhancements
- Receipt section redesign
- Legal pages styling

**Reason for postponement:** React migration takes priority. UI/UX improvements will be easier to implement with React components and CSS Modules.

---

## 🔮 FUTURE ENHANCEMENTS (After React Migration)

### Short-term (1-2 months)
- [ ] UI/UX design improvements (Phase 10)
- [ ] User testing and feedback collection
- [ ] Performance optimization
- [ ] SEO optimization (meta tags, structured data)
- [ ] Analytics integration (Google Analytics / Plausible)
- [ ] A/B testing setup

### Mid-term (3-6 months)
- [ ] TypeScript migration
- [ ] Unit tests (Jest + React Testing Library)
- [ ] E2E tests (Playwright)
- [ ] Store API integration (automatic price updates)
- [ ] Extended material database (more brands)
- [ ] User accounts and saved projects
- [ ] Email notifications
- [ ] Comparison tool (multiple variants)

### Long-term (6-12 months)
- [ ] AI assistant for material selection
- [ ] Extended 3D geometry (roofs, facades, terraces)
- [ ] Mobile app (React Native)
- [ ] Professional profiles (contractors, architects)
- [ ] Marketplace integration
- [ ] Work time calculator
- [ ] Calendar integration
- [ ] Chat with contractors

---

## 📝 React Migration Technical Details

### Technology Stack

**Core:**
- React 18 (hooks, concurrent features)
- Vite 5 (fast dev server, optimized builds)
- React Router 6 (future multi-page support)

**State Management:**
- Context API + useReducer (recommended for this project size)
- Alternative: Zustand (if more complex state needed)

**Styling:**
- CSS Modules (recommended - easy migration from existing CSS)
- Alternative: Styled Components (if dynamic styling needed)

**Localization:**
- i18next + react-i18next (industry standard)
- Keep existing JSON structure in locales/

**PDF Export:**
- jsPDF (npm package, same as current)

**Development:**
- ESLint + Prettier (code quality)
- Vite dev server with HMR

### Folder Structure

```
Bau_Rechner_React/
├── public/
│   ├── data/              # Copy from original
│   ├── locales/           # Copy from original
│   ├── pics/              # Copy from original
│   └── libs/              # Copy from original
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Header.module.css
│   │   │   ├── Footer.jsx
│   │   │   ├── Footer.module.css
│   │   │   ├── MainLayout.jsx
│   │   │   └── MainLayout.module.css
│   │   ├── Filters/
│   │   │   ├── JobTypeSelector.jsx
│   │   │   ├── WallSelector.jsx
│   │   │   └── ResetFiltersButton.jsx
│   │   ├── RoomViewer/
│   │   │   ├── Room3D.jsx
│   │   │   ├── Room3D.module.css
│   │   │   ├── RoomInputs.jsx
│   │   │   ├── InfoModal.jsx
│   │   │   └── InfoModal.module.css
│   │   ├── Results/
│   │   │   ├── RepairClassSelector.jsx
│   │   │   ├── Receipt.jsx
│   │   │   ├── Receipt.module.css
│   │   │   ├── ReceiptLine.jsx
│   │   │   ├── PDFExportButton.jsx
│   │   │   └── ResetWorkBlocksButton.jsx
│   │   └── UI/
│   │       ├── Button.jsx
│   │       ├── Checkbox.jsx
│   │       └── RadioButton.jsx
│   ├── hooks/
│   │   ├── useCalculations.js
│   │   ├── useDebounce.js
│   │   ├── useLocalStorage.js
│   │   └── useAppContext.js
│   ├── services/
│   │   ├── calculations/
│   │   │   ├── eco.js
│   │   │   ├── norm.js
│   │   │   ├── pro.js
│   │   │   ├── paint.js
│   │   │   ├── wallpaper.js
│   │   │   └── techCard.js
│   │   ├── pdfExport.js
│   │   └── dataLoader.js
│   ├── context/
│   │   ├── AppContext.jsx
│   │   └── LanguageContext.jsx
│   ├── i18n/
│   │   └── config.js
│   ├── styles/
│   │   ├── global.css
│   │   └── variables.css
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
├── .eslintrc.js
└── README.md
```

### Key Implementation Patterns

**1. Global State (AppContext.jsx):**
```javascript
const initialState = {
  dimensions: { x: 400, y: 300, z: 250 },
  selectedWalls: { front: true, back: true, left: true, right: true, floor: false, ceiling: true },
  currentJob: 'painting',
  currentClass: 'econom',
  pricing: null,
  selectedEcoTools: { /* ... */ },
  selectedNormWorks: { /* ... */ }
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_DIMENSIONS': return { ...state, dimensions: action.payload };
    case 'TOGGLE_WALL': return { ...state, selectedWalls: { ...state.selectedWalls, [action.payload]: !state.selectedWalls[action.payload] }};
    // ... more actions
  }
}
```

**2. Calculations Hook (useCalculations.js):**
```javascript
export function useCalculations() {
  const { state } = useAppContext();
  const [totals, setTotals] = useState(null);
  const debouncedDimensions = useDebounce(state.dimensions, 1500);
  
  useEffect(() => {
    const area = calculateArea(debouncedDimensions, state.selectedWalls);
    const result = state.currentClass === 'econom' 
      ? calculateEco(state.currentJob, area, state.pricing, state.selectedEcoTools)
      : state.currentClass === 'standard'
      ? calculateNorm(state.currentJob, area, state.pricing, state.selectedNormWorks)
      : calculatePro(state.currentJob, area, state.pricing);
    setTotals(result);
  }, [debouncedDimensions, state.selectedWalls, state.currentJob, state.currentClass, state.pricing]);
  
  return totals;
}
```

**3. Component Example (Receipt.jsx):**
```javascript
export function Receipt() {
  const { state } = useAppContext();
  const { t } = useTranslation();
  const totals = useCalculations();
  
  if (!totals) return <div>Loading...</div>;
  
  return (
    <div className={styles.receipt}>
      <h3>{t('results')}</h3>
      {totals.items.map(group => (
        <ReceiptGroup key={group.category} group={group} />
      ))}
      <ReceiptTotal totals={totals} />
    </div>
  );
}
```

### Migration Checklist

**Before starting:**
- [ ] Backup current project
- [ ] Create git branch or new folder
- [ ] Review detailed plan in `.claude/plans/pure-spinning-pebble.md`

**During migration:**
- [ ] Keep original project running for comparison
- [ ] Test each component as you build it
- [ ] Verify calculations match original exactly
- [ ] Test on mobile devices regularly

**After migration:**
- [ ] Full feature comparison test
- [ ] Performance comparison
- [ ] Bundle size analysis
- [ ] Update documentation

---

## 🎯 Next Steps

**Immediate (This Week):**
1. Review React migration plan
2. Decide on technical choices (state management, styling)
3. Start Phase 11.1: Project Setup

**This Month:**
- Complete React migration (Phase 11)
- Full testing and verification
- Deploy React version

**Next Month:**
- UI/UX improvements (Phase 10 in React)
- User testing
- Performance optimization

---

## 📚 Resources

**React Migration Plan:**
- Detailed plan: `.claude/plans/pure-spinning-pebble.md`
- Estimated time: 28-38 hours
- Approach: New project alongside original

**Documentation:**
- Current architecture: HISTORY.md
- Original plan: PLAN.md (this file)
- Component structure: Will be documented during migration

**Testing:**
- Manual testing checklist in migration plan
- Automated tests: After migration complete

---

**Last Updated:** 2026-05-16 21:22  
**Next Review:** After Phase 11.1 completion
