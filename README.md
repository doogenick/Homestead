# Beaufort West Homestead Project

A comprehensive, phase-based guide for building a sustainable homestead in Beaufort West, Western Cape. This static website provides detailed instructions, material lists, cost estimates, and step-by-step guides for each phase of homestead development.

## 🏡 Project Overview

- **Location:** Beaufort West, Western Cape
- **Property Size:** 2-3 hectares (expandable to 21ha)
- **Timeline:** 4 phases from 14 days to 3+ years
- **Goal:** Achieve full self-sufficiency with phased infrastructure development

## 📋 Phases

### Phase 1 – Essentials (14 Days)
Set up temporary shelter, water, sanitation, security, kitchen, chickens, and garden.

**Sections:**
- 💧 Water System
- 🏕️ Shelter
- 🚿 Sanitation
- 🔒 Security & Fencing
- 🍳 Kitchen
- 🐔 Chickens
- 🌱 Garden
- 📅 Schedule & Review

### Phase 2 – Expansion (Months 1-3)
Expand shelter, livestock pens, and garden space for greater sustainability.

### Phase 3 – Permanent Systems (Months 3-6)
Install long-term infrastructure: permanent water, solar power, and sanitation.

### Phase 4 – Full Self-Sufficiency (6 months - 3 years)
Achieve complete self-sufficiency with advanced systems and homestead upgrades.

## 🚀 Quick Start

### View Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/[username]/Homestead-main.git
   cd Homestead-main
   ```

2. Open in browser:
   ```bash
   # Open index.html directly, or use a local server:
   python -m http.server 8000
   # Then visit: http://localhost:8000
   ```

### Deploy to GitHub Pages

1. Push to GitHub
2. Go to Settings → Pages
3. Select branch: `main`, folder: `/ (root)`
4. Save and wait 1-2 minutes
5. Visit: `https://[username].github.io/Homestead-main/`

## 📁 Project Structure

```
Homestead-main/
├── index.html              # Homepage with phase overview
├── phase1.html            # Phase 1 with tabbed sections
├── phase2.html            # Phase 2 content
├── phase3.html            # Phase 3 content
├── phase4.html            # Phase 4 content
├── style.css              # Global styles with CSS variables
├── js/
│   ├── main.js           # Phase 1 content loader
│   └── phase-loader.js   # Phase 2-4 content loader
├── data/
│   ├── phase1/           # Phase 1 detailed JSON files
│   │   ├── water.json
│   │   ├── shelter.json
│   │   ├── sanitation.json
│   │   ├── fencing.json
│   │   ├── kitchen.json
│   │   ├── chickens.json
│   │   ├── garden.json
│   │   └── schedule.json
│   ├── phase1_data.js    # Phase 1 simplified (legacy)
│   ├── phase2_data.js    # Phase 2 data module
│   ├── phase3_data.js    # Phase 3 data module
│   └── phase4_data.js    # Phase 4 data module
├── DATA_PROTOCOL.md      # Data structure documentation
├── CLEANUP_SUMMARY.md    # Code cleanup details
└── README.md             # This file
```

## 🛠️ Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox
- **JavaScript (ES6+)** - Modules, async/await, fetch API
- **JSON** - Data storage
- **No frameworks** - Pure vanilla JS for simplicity
- **No build step** - Ready for GitHub Pages

## 📝 Adding Content

### For Phase 1 (Detailed Sections)

1. Create a new JSON file in `data/phase1/`
2. Follow the schema in `DATA_PROTOCOL.md`
3. Add a tab button in `phase1.html`

Example:
```json
{
  "title": "New Section",
  "goal": "What this achieves",
  "materials": [
    {"item": "Material name", "cost": 1000}
  ],
  "steps": [
    {"title": "Step 1", "description": "Details"}
  ]
}
```

### For Phase 2-4 (Simplified)

1. Edit `data/phase[X]_data.js`
2. Add a new section to the exported object

Example:
```javascript
export const phase2Data = {
  "New Section": {
    "days": "1-5",
    "materials": [
      {"item": "Material", "cost": "R1,000"}
    ],
    "steps": [
      "Step 1",
      "Step 2"
    ]
  }
};
```

See `DATA_PROTOCOL.md` for complete documentation.

## ✨ Features

### User Experience
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Tabbed navigation for Phase 1
- ✅ Loading states with animations
- ✅ Error handling with user-friendly messages
- ✅ Smooth transitions and hover effects

### Performance
- ✅ Content caching (instant tab switching)
- ✅ Lazy loading for images
- ✅ Optimized CSS with variables
- ✅ Minimal JavaScript footprint
- ✅ No external dependencies

### Accessibility
- ✅ ARIA attributes for screen readers
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Semantic HTML structure
- ✅ WCAG AA color contrast

### Developer Experience
- ✅ Clean, documented code
- ✅ Modular architecture
- ✅ Easy to customize
- ✅ No build process
- ✅ Version control friendly

## 🎨 Customization

### Colors

Edit CSS variables in `style.css`:

```css
:root {
    --color-primary: #3498db;
    --color-secondary: #2c3e50;
    --color-accent: #667eea;
}
```

### Configuration

Edit config in `js/main.js`:

```javascript
const CONFIG = {
    dataPath: 'data/phase1/',
    defaultSection: 'water',
    cacheEnabled: true
};
```

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Requirements:**
- ES6 modules support
- Fetch API
- CSS Grid and Flexbox
- CSS Custom Properties

## 🐛 Troubleshooting

### Content Not Loading

1. Check browser console for errors
2. Verify JSON is valid (use jsonlint.com)
3. Ensure file paths are correct
4. Check `data-section` attribute matches filename

### Styles Not Applying

1. Clear browser cache
2. Check CSS file is loading
3. Verify class names match
4. Check for CSS syntax errors

### Module Import Errors

1. Ensure you're using a web server (not `file://`)
2. Check file extensions are `.js`
3. Verify export/import syntax

## 📚 Documentation

- **[DATA_PROTOCOL.md](DATA_PROTOCOL.md)** - Complete data structure guide
- **[CLEANUP_SUMMARY.md](CLEANUP_SUMMARY.md)** - Code optimization details
- **Inline Comments** - JSDoc comments throughout code

## 🤝 Contributing

This is a personal homestead project, but suggestions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is for personal use. Feel free to adapt for your own homestead projects.

## 🙏 Acknowledgments

- Built for the Beaufort West Homestead Project
- Designed for easy content updates via LLM-generated data
- Optimized for GitHub Pages deployment

## 📞 Support

For questions or issues:
- Check `DATA_PROTOCOL.md` for data structure help
- Review `CLEANUP_SUMMARY.md` for implementation details
- Check browser console for error messages

---

**Version:** 2.0  
**Last Updated:** 2025-10-06  
**Status:** ✅ Production Ready
