# Data Protocol for Homestead Project

## Overview
This document defines the standardized JSON data structure for all phase content. Follow this protocol when creating or updating phase data to ensure consistency and proper rendering.

---

## Phase 1 Data Structure

Phase 1 uses **detailed JSON files** with rich metadata for each section.

### Location
`data/phase1/[section-name].json`

### Sections
- `water.json`
- `shelter.json`
- `sanitation.json`
- `fencing.json`
- `kitchen.json`
- `chickens.json`
- `garden.json`
- `schedule.json`

### JSON Schema

```json
{
  "title": "Section Title",
  "phase": "Phase 1",
  "days": "1-2",
  "goal": "Clear description of what this section achieves",
  "materials": [
    {
      "item": "Item name and description",
      "cost": 1000
    }
  ],
  "total_cost": 19130,
  "tools": [
    "Tool name 1",
    "Tool name 2"
  ],
  "steps": [
    {
      "title": "Step Title",
      "description": "Detailed step description with instructions"
    }
  ],
  "tips": [
    "Helpful tip or best practice"
  ],
  "safety": [
    "Safety warning or guideline"
  ],
  "estimated_time_hours": 16,
  "images": [
    "path/to/image.jpg"
  ]
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ Yes | Section title (e.g., "Water System Installation") |
| `phase` | string | ⚪ Optional | Phase identifier (e.g., "Phase 1") |
| `days` | string | ⚪ Optional | Timeline (e.g., "1-2") |
| `goal` | string | ✅ Yes | Primary objective of this section |
| `materials` | array | ✅ Yes | List of required materials |
| `materials[].item` | string | ✅ Yes | Material name and specs |
| `materials[].cost` | number | ✅ Yes | Cost in South African Rand (numeric) |
| `total_cost` | number | ⚪ Optional | Sum of all material costs |
| `tools` | array | ⚪ Optional | List of required tools |
| `steps` | array | ✅ Yes | Step-by-step instructions |
| `steps[].title` | string | ✅ Yes | Step title/summary |
| `steps[].description` | string | ✅ Yes | Detailed instructions |
| `tips` | array | ⚪ Optional | Pro tips and best practices |
| `safety` | array | ⚪ Optional | Safety warnings |
| `estimated_time_hours` | number | ⚪ Optional | Time estimate in hours |
| `images` | array | ⚪ Optional | Image file paths |

### Example: water.json

```json
{
  "title": "Water System Installation",
  "phase": "Phase 1",
  "days": "1-2",
  "goal": "Ensure reliable access to potable water for family, garden, and livestock using the borehole and solar-powered pumping system.",
  "materials": [
    {"item": "Solar submersible pump kit (24V, 3m³/hr minimum)", "cost": 8500},
    {"item": "2x 100W solar panels with mounting brackets", "cost": 3200},
    {"item": "MPPT solar controller (24V, 20A)", "cost": 1200}
  ],
  "total_cost": 19130,
  "tools": [
    "Shovel / spade",
    "Level",
    "Drill + bits for brackets"
  ],
  "steps": [
    {
      "title": "Test Borehole Depth and Water Level",
      "description": "Drop a weighted string down the borehole. Mark water level. Ensure pump will be submerged at least 1m below water level but 2m above bottom."
    }
  ],
  "tips": [
    "Install a bypass valve at the pump to allow manual filling during cloudy periods using a generator if needed."
  ],
  "safety": [
    "Always disconnect solar panels before handling electrical connections.",
    "Wear gloves and safety glasses when handling cement or tools."
  ],
  "estimated_time_hours": 16,
  "images": [
    "images/water/pump_install.jpg"
  ]
}
```

---

## Phase 2, 3, 4 Data Structure

Phases 2-4 use **simplified JavaScript modules** for easier editing.

### Location
`data/phase[X]_data.js` where X is 2, 3, or 4

### JavaScript Module Format

```javascript
// data/phase2_data.js
export const phase2Data = {
  "Section Name": {
    "days": "1-5",
    "materials": [
      {"item": "Material description", "cost": "R1,000"}
    ],
    "steps": [
      "Step 1 description",
      "Step 2 description"
    ],
    "tips": [
      "Optional tip"
    ]
  },
  "Another Section": {
    "days": "6-10",
    "materials": [
      {"item": "Another material", "cost": "R2,500"}
    ],
    "steps": [
      "Step 1",
      "Step 2"
    ]
  }
};
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Section Name | object | ✅ Yes | Top-level key is the section name |
| `days` | string | ⚪ Optional | Timeline (e.g., "1-5") |
| `materials` | array | ✅ Yes | List of materials |
| `materials[].item` | string | ✅ Yes | Material name |
| `materials[].cost` | string | ✅ Yes | Cost as formatted string (e.g., "R1,000") |
| `steps` | array | ✅ Yes | Array of step descriptions (strings) |
| `tips` | array | ⚪ Optional | Array of tip strings |

### Example: phase2_data.js

```javascript
export const phase2Data = {
  "Water System": {
    "days": "1-2",
    "materials": [
      {"item": "Solar submersible pump kit", "cost": "R8,500"},
      {"item": "2x 100W solar panels", "cost": "R3,200"}
    ],
    "steps": [
      "Test borehole depth and water level",
      "Prepare tank platform",
      "Install solar panel frame"
    ]
  },
  "Shelter": {
    "days": "1-3",
    "materials": [
      {"item": "Canvas safari tents", "cost": "R4,500"}
    ],
    "steps": [
      "Select and prepare site",
      "Create raised platform"
    ]
  }
};
```

---

## Adding New Content

### For Phase 1 (Detailed)

1. Create a new JSON file in `data/phase1/`
2. Name it with lowercase and hyphens (e.g., `new-section.json`)
3. Follow the Phase 1 JSON schema above
4. Add a new tab button in `phase1.html`:
   ```html
   <button class="tab" data-section="new-section" role="tab">🔧 New Section</button>
   ```

### For Phase 2, 3, or 4 (Simplified)

1. Open `data/phase[X]_data.js`
2. Add a new section to the exported object:
   ```javascript
   export const phase2Data = {
     // ... existing sections ...
     "New Section Name": {
       "days": "X-Y",
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

---

## Data Validation Checklist

Before committing new data, verify:

- ✅ All required fields are present
- ✅ Costs are numeric (Phase 1) or formatted strings with "R" prefix (Phase 2-4)
- ✅ Steps are clear and actionable
- ✅ No HTML or special characters in strings (will be escaped automatically)
- ✅ Image paths are correct and files exist
- ✅ JSON is valid (use a JSON validator)
- ✅ File encoding is UTF-8

---

## Best Practices

### Content Writing

1. **Be Specific**: Include exact measurements, quantities, and specifications
2. **Be Actionable**: Each step should be a clear action
3. **Be Safe**: Always include relevant safety warnings
4. **Be Realistic**: Provide accurate time and cost estimates

### Cost Format

- **Phase 1**: Use numeric values (e.g., `8500`)
- **Phase 2-4**: Use formatted strings (e.g., `"R8,500"`)
- Always use South African Rand (R)
- Include commas for thousands

### Steps Format

- Start with action verbs (Install, Connect, Test, etc.)
- Keep each step focused on one task
- Include measurements and specifications
- Mention safety considerations inline when relevant

### Tips Format

- Focus on practical advice
- Include local considerations (e.g., Beaufort West wind conditions)
- Mention common mistakes to avoid
- Suggest alternatives or optimizations

---

## File Structure

```
Homestead-main/
├── index.html                 # Homepage
├── phase1.html               # Phase 1 with tabs
├── phase2.html               # Phase 2 simple layout
├── phase3.html               # Phase 3 simple layout
├── phase4.html               # Phase 4 simple layout
├── style.css                 # Global styles
├── js/
│   ├── main.js              # Phase 1 content loader
│   └── phase-loader.js      # Phase 2-4 content loader
└── data/
    ├── phase1/              # Phase 1 detailed JSON files
    │   ├── water.json
    │   ├── shelter.json
    │   ├── sanitation.json
    │   ├── fencing.json
    │   ├── kitchen.json
    │   ├── chickens.json
    │   ├── garden.json
    │   └── schedule.json
    ├── phase1_data.js       # Phase 1 simplified (legacy, not used)
    ├── phase2_data.js       # Phase 2 data module
    ├── phase3_data.js       # Phase 3 data module
    └── phase4_data.js       # Phase 4 data module
```

---

## Migration Notes

### Converting from Old Format

If you have data in the old format (phase1_content.js), convert it:

**Old Format:**
```javascript
"materials": [
  {"item": "Pump", "cost": "R8,500"}
]
```

**New Phase 1 Format:**
```json
"materials": [
  {"item": "Pump", "cost": 8500}
]
```

**New Phase 2-4 Format:**
```javascript
"materials": [
  {"item": "Pump", "cost": "R8,500"}
]
```

---

## Troubleshooting

### Content Not Loading

1. Check browser console for errors
2. Verify JSON is valid (use jsonlint.com)
3. Ensure file paths are correct
4. Check that data-section attribute matches filename

### Incorrect Rendering

1. Verify field names match schema exactly
2. Check data types (string vs number)
3. Ensure arrays are properly formatted
4. Look for special characters that need escaping

---

## Future Enhancements

Potential additions to the data structure:

- Video tutorial links
- PDF download links
- Interactive diagrams
- Cost calculator
- Progress tracking
- Shopping list generator
- Supplier recommendations

---

**Last Updated:** 2025-10-06
**Version:** 1.0
