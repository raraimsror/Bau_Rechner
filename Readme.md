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

**Version:** 1.0 (Production Ready)  
**Status:** ✅ Fully functional MVP  
**Last Updated:** 2026-05-06

### ✅ Working Features:

**Core Functionality:**
- 3D room visualization (rotation, zoom, touch support)
- Input validation with visual feedback
- Wall selection (checkboxes)
- 2 work types: Painting + Wallpaper
- 3 service levels: ECO / NORM / PRO
- Detailed receipt with subtotals
- PDF export with logo

**Calculations:**
- Paint calculation with bucket optimization (Alpina 2.5L/5L/25L)
- Wallpaper calculation (Erfurt Rauhfaser 20m rolls)
- Glue calculation based on area
- Real product data with accurate pricing

**Technical:**
- Mobile responsive design
- Mobile 3D scaling (Strategy 6)
- Debounce recalculation (1.5s)
- Modular architecture (9 JS modules)
- Legal compliance pages (7 pages)

---

## 📂 Project Structure

```
Bau_Rechner/
├── index.html              # Main page
├── style.css               # Styles
├── /scripts/               # JavaScript modules
│   ├── room3d.js          # 3D visualization
│   ├── paint.js           # Paint calculation
│   ├── wallpaper.js       # Wallpaper calculation
│   ├── tech-card.js       # Technical card
│   ├── ECO.js             # ECO service level
│   ├── NORM.js            # NORM service level
│   ├── PRO.js             # PRO service level
│   ├── script.js          # Main controller
│   └── pdf-export.js      # PDF generation
├── /pages/                 # Legal/info pages
│   ├── impressum.html     # Company info (DE)
│   ├── datenschutz.html   # Privacy policy (DE)
│   ├── disclaimer.html    # Legal disclaimer (DE)
│   ├── about.html         # About us (RU)
│   ├── partners.html      # Partners (RU)
│   ├── mission.html       # Mission (RU)
│   └── contacts.html      # Contacts (RU)
├── /pics/                  # Images and assets
├── /libs/                  # External libraries
├── /data/                  # JSON data files
├── HISTORY.md             # Development history
├── PLAN.md                # Development plan
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
- **3D:** Three.js
- **PDF:** jsPDF
- **Architecture:** Modular ES6 modules

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
// coverage = 5.5 m²/L (Alpina)
// coats = 2
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

### Short-term (1-2 months):
- UI/UX design improvements
- User testing and feedback
- Performance optimization
- SEO optimization
- Analytics integration

### Mid-term (3-6 months):
- Store API integration (automatic price updates)
- Extended material database
- User accounts and saved projects
- Multi-language support (LV/RU/DE)

### Long-term (6-12 months):
- AI assistant for material selection
- Extended 3D geometry (roofs, facades)
- Mobile app
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
- Three.js (3D visualization)
- jsPDF (PDF generation)

---

**Built with ❤️ for transparent renovation planning**

---

**Last Updated:** 2026-05-06  
**Version:** 1.0.0  
**Status:** Production Ready ✓
