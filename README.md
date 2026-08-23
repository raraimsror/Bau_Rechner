# 🏗️ RemontExpert 3D Pro

**Renovation calculator with 3D visualization**  
Simple tool for transparent renovation planning and material calculation

---

## 📌 About the Project

RemontExpert 3D Pro is an interactive web tool designed to make renovation understandable, transparent, and accessible to everyone.

The platform combines:
- **3D room visualization** - see your space in 3D
- **Material calculation** - precise quantities based on manufacturer specs
- **Cost estimation** - transparent pricing with real products
- **Service levels** - choose ECO/NORM/PRO based on your needs
- **PDF export** - download detailed estimate with one click

---

## 🎯 Project Goals

### 1. Make renovation predictable and understandable
Most renovation calculators are either too complex or too simplistic. RemontExpert 3D Pro aims to be the golden middle:
- Minimum unnecessary actions
- Maximum useful information
- Visual clarity
- Honest and transparent calculations

### 2. Connect clients with material suppliers
One of the key ideas is to become a bridge between people and stores/suppliers.

**Users get:**
- Clear estimate
- Material list with quantities
- Approximate prices
- Professional recommendations

**Suppliers get:**
- Prepared clients
- Transparent list of needed products
- Less questions and misunderstandings

### 3. Make renovation accessible even for beginners
The project is designed so that the site can serve as a technological guide for DIY enthusiasts.

---

## 🧩 Who Is This For?

✔ **Regular users** who want to understand:
- How much will renovation cost
- What materials are needed
- What stages are included
- What affects the price

✔ **Professionals** who can use the tool as:
- Quick calculation for clients
- Visual demonstration
- Preliminary estimate
- Consultation aid

✔ **Stores and suppliers** who can:
- Integrate their prices
- Show clients ready material sets
- Use the site as a training tool

---

## 🛠️ Current Status

**Version:** 1.1 (Pre-Launch)  
**Status:** ✅ Production ready → pre-launch improvements (DE market)  
**Last Updated:** 2026-08-19  
**Default language:** DE (German market)

### ✅ Working Features:

**Core Functionality:**
- 3D room visualization (rotation, zoom, touch support) — pure CSS 3D
- Input validation with visual feedback
- Wall selection (checkboxes / switches)
- 2 work types: Painting + Wallpaper
- 3 service levels: ECO / NORM / PRO
- Detailed receipt with subtotals
- PDF export with logo and Cyrillic support
- Openings (windows/doors) with area deduction (>2 m² fully deducted)

**Calculations:**
- Paint calculation with bucket optimization (Alpina / Caparol)
- Wallpaper calculation (Erfurt Rauhfaser 20m rolls)
- Glue calculation based on area
- Real product data with accurate pricing

**Store Selection:**
- Choose store: OBI / Hornbach / Bauhaus
- Per-store prices loaded from data/prices_{store}.json
- Receipt and PDF recalculate with the selected store's prices

**Technical:**
- Mobile responsive design
- Mobile 3D scaling (Strategy 6)
- Debounce recalculation (1.5s)
- Modular architecture (12 JS modules)
- i18n RU/EN/DE (UI + all calculation results)
- Legal compliance pages (7 pages)

---

## 📂 Project Structure

```
Bau_Rechner/
├── index.html              # Main page
├── style.css               # Styles
├── /scripts/               # JavaScript modules
│   ├── room3d.js          # 3D visualization (CSS 3D)
│   ├── openings.js        # Windows/doors CRUD (localStorage)
│   ├── paint.js           # Paint calculation
│   ├── wallpaper.js       # Wallpaper calculation
│   ├── tech-card.js       # Technical cards (primer + paint)
│   ├── ECO.js             # ECO service level
│   ├── NORM.js            # NORM service level
│   ├── PRO.js             # PRO service level
│   ├── script.js          # Main controller + store selector
│   ├── pdf-export.js      # PDF generation (PT Sans fonts)
│   ├── lang.js            # i18n (UI + results)
│   └── info-modal.js      # Measurement instructions modal
├── /pages/                 # Legal/info pages
│   ├── impressum.html     # Company info (DE)
│   ├── datenschutz.html   # Privacy policy (DE)
│   ├── disclaimer.html    # Legal disclaimer (DE)
│   ├── about.html         # About us (RU)
│   ├── partners.html      # Partners (RU)
│   ├── mission.html       # Mission (RU)
│   └── contacts.html      # Contacts (RU)
├── /data/                  # JSON data files
│   ├── pricing.json       # Default prices (TOOM)
│   ├── prices_obi.json    # OBI prices
│   ├── prices_hornbach.json # Hornbach prices
│   ├── prices_bauhaus.json # Bauhaus prices
│   ├── painting_pro.json  # Painting work model
│   ├── wallpaper_pro.json # Wallpaper work model
├── /locales/               # RU/EN/DE result translations
├── /pics/                  # Images and assets
├── /fonts/                 # PT Sans fonts (PDF)
├── /libs/                  # External libraries (jsPDF)
├── HISTORY.md             # Development history
├── PLAN.md                # Development plan (launch roadmap)
└── README.md              # This file
```

---

## 🚀 Quick Start

### Local Development:

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Bau_Rechner.git
cd Bau_Rechner
```

2. Open in browser:
```bash
# Simply open index.html in your browser
# Or use a local server:
python -m http.server 8000
# Then visit: http://localhost:8000
```

3. Start developing:
- Edit files in `/scripts/` for functionality
- Edit `style.css` for styling
- Test on multiple devices

---

## 📊 Technical Details

### Technologies:
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **3D:** Pure CSS 3D (CSS transforms, no Three.js)
- **PDF:** jsPDF + PT Sans TTF fonts (Cyrillic support)
- **Architecture:** Modular scripts (window globals, no ES module imports)

### Browser Support:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Android)

### Performance:
- Page load: < 3 seconds
- 3D rendering: 60fps
- Calculations: < 1 second

---

## 🎨 Service Levels

### ECO (Economy)
**For:** DIY enthusiasts who work themselves

**Includes:**
- Material calculations
- Equipment recommendations
- Technical instructions

**Cost:** Materials only (0€ labor)

### NORM (Standard)
**For:** Clients who want to choose specific work

**Includes:**
- All work blocks with checkboxes
- Material calculations
- Connection with contractors (future)

**Cost:** Materials + selected work

### PRO (Premium)
**For:** Clients who want full turnkey service

**Includes:**
- All work from A to Z
- All materials
- Full service

**Cost:** Materials + all work

---

## 📝 Formulas Used

### Paint Calculation:
```javascript
liters = (area / coverage) × coats × 1.1
// coverage = from product data (default 6 m²/L)
// coats = 2 (from product data)
// reserve = 10%
```

### Wallpaper Calculation:
```javascript
rolls = (area / 10.6) × 1.1
// roll_size = 20m × 0.53m = 10.6m²
// reserve = 10%

glue = Math.ceil(area / 22.5) // packages
```

### Mobile 3D Scaling:
```javascript
scale = (viewport_min_dimension * 0.75) / actual_room_size
// actual_room_size = Math.max(width, height, depth)
```

---

## 🔮 Future Development

### Current: Pre-Launch Improvements (DE market)
- Data/price synchronization process + freshness indicator
- Tech cards expansion (all classes/job types)
- 3D script improvements
- PDF for all classes + checklists
- Shareable link-calculator (URL-encoded state)
- Launch (control point) → React migration after

See **[PLAN.md](PLAN.md)** for the detailed roadmap.

### After Launch (React migration)
- Vite + React 18 rewrite (feature parity with original)
- State management via Context/useReducer, i18next, jsPDF

### Mid-term (3-6 months)
- Store API integration (automatic price updates)
- Extended material database
- User accounts and saved projects
- LV language support

### Long-term (6-12 months)
- AI assistant for material selection
- Extended 3D geometry (roofs, facades)
- Mobile app (React Native)
- Professional profiles (contractors, architects)
- Marketplace integration

---

## 📄 Documentation

- **[HISTORY.md](HISTORY.md)** - Complete development timeline and milestones
- **[PLAN.md](PLAN.md)** - Current development plan and roadmap

---

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

**How to contribute:**
1. Open an issue with your suggestion
2. Fork the repository
3. Create a feature branch
4. Submit a pull request

---

## 📧 Contact

**Project Owner:** Raimond Rozentals  
**GitHub:** [github.com/raraimsror]

---

## 📜 License

This project is proprietary software. All rights reserved.

---

## 🙏 Acknowledgments

**Products used:**
- Alpina Wandfarbe (paint calculations)
- Erfurt Rauhfaser (wallpaper calculations)

**Libraries:**
- jsPDF (PDF generation)
- PT Sans fonts (ParaType, Cyrillic support)

---

**Built with ❤️ for transparent renovation planning**

---

**Last Updated:** 2026-08-19  
**Version:** 1.1.0  
**Status:** Pre-Launch (DE market)
