/**
 * main.js - Phase Content Loader with Budget Tracking
 * 
 * Handles dynamic loading of phase section data from JSON files.
 * Implements caching, error handling, and accessibility features.
 * 
 * Expected JSON Structure:
 * {
 *   "title": "Section Title",
 *   "phase": "Phase 1",
 *   "days": "1-2",
 *   "goal": "Description of goal",
 *   "materials": [{"item": "Name", "cost": 1000, "quantity": 1}],
 *   "total_cost": 10000,
 *   "tools": ["Tool 1", "Tool 2"],
 *   "steps": [{"title": "Step", "description": "Details"}],
 *   "tips": ["Tip 1", "Tip 2"],
 *   "safety": ["Safety note 1"],
 *   "estimated_time_hours": 16,
 *   "images": ["path/to/image.jpg"]
 * }
 */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    dataPath: 'data/phase1/',
    defaultSection: 'water',
    cacheEnabled: true
};

// ============================================
// STATE MANAGEMENT
// ============================================
const state = {
    cache: new Map(),
    currentSection: null,
    isLoading: false,
    currentBudget: null
};

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
    tabs: document.querySelectorAll('.tab'),
    contentDiv: document.getElementById('content'),
    budgetSection: document.getElementById('budget-section'),
    budgetDisplay: document.getElementById('section-budget-display')
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format currency (South African Rand)
 */
function formatCurrency(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
        return 'R0';
    }
    return `R${amount.toLocaleString('en-ZA')}`;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Show loading state
 */
function showLoading() {
    if (!elements.contentDiv) return;
    elements.contentDiv.innerHTML = '<div class="loading">Loading content</div>';
    state.isLoading = true;
}

/**
 * Show error message
 */
function showError(message) {
    if (!elements.contentDiv) return;
    elements.contentDiv.innerHTML = `
        <div class="warning">
            <strong>⚠️ Error Loading Content</strong>
            <p>${escapeHtml(message)}</p>
            <p>Please check the console for more details.</p>
        </div>
    `;
    state.isLoading = false;
}

// ============================================
// BUDGET FUNCTIONS
// ============================================

/**
 * Calculate budget for a section
 */
function calculateSectionBudget(data) {
    if (!data.materials || !Array.isArray(data.materials)) {
        return 0;
    }
    
    return data.materials.reduce((total, material) => {
        const cost = typeof material.cost === 'number' ? material.cost : 0;
        const quantity = material.quantity || 1;
        return total + (cost * quantity);
    }, 0);
}

/**
 * Render budget information for a section
 */
function renderSectionBudget(data) {
    if (!elements.budgetDisplay) return;
    
    const sectionBudget = calculateSectionBudget(data);
    
    if (sectionBudget <= 0) {
        elements.budgetDisplay.innerHTML = '<p>No budget information available</p>';
        return;
    }
    
    let html = `
        <div class="section-budget-summary">
            <p><strong>Total Cost:</strong> <span class="cost-amount">${formatCurrency(sectionBudget)}</span></p>
        </div>
    `;
    
    if (data.materials && data.materials.length > 0) {
        html += '<h4>📦 Material Breakdown</h4><ul class="budget-materials">';
        data.materials.forEach(material => {
            const cost = typeof material.cost === 'number' ? material.cost : 0;
            const quantity = material.quantity || 1;
            const itemTotal = cost * quantity;
            
            // Build display text with quantity
            let displayText = material.item || material.name || 'Unnamed item';
            if (quantity > 1) {
                displayText += ` (${quantity}x ${formatCurrency(cost)})`;
            }
            displayText += ` — ${formatCurrency(itemTotal)}`;
            
            html += `
                <li>
                    <span class="material-name">${displayText}</span>
                </li>
            `;
        });
        html += '</ul>';
    }
    
    elements.budgetDisplay.innerHTML = html;
}

// ============================================
// CONTENT RENDERING
// ============================================

/**
 * Render materials section
 */
function renderMaterials(materials, totalCost) {
    if (!materials || materials.length === 0) return '';
    
    let html = '<h3>📦 Materials Required</h3><ul>';
    materials.forEach(mat => {
        const item = escapeHtml(mat.item || mat.name || 'Unnamed item');
        const cost = typeof mat.cost === 'number' ? mat.cost : 0;
        const quantity = mat.quantity || 1;
        const itemTotal = cost * quantity;
        
        // Build display text with quantity
        let displayText = item;
        if (quantity > 1) {
            displayText += ` (${quantity}x ${formatCurrency(cost)})`;
        }
        displayText += ` — <span class="cost">${formatCurrency(itemTotal)}</span>`;
        
        html += `<li>${displayText}</li>`;
    });
    html += '</ul>';
    
    if (totalCost) {
        html += `<div class="total-cost">💰 Total Cost: <span class="cost">${formatCurrency(totalCost)}</span></div>`;
    }
    
    return html;
}

/**
 * Render tools section
 */
function renderTools(tools) {
    if (!tools || tools.length === 0) return '';
    
    let html = '<h3>🔧 Tools Needed</h3><ul>';
    tools.forEach(tool => {
        html += `<li>${escapeHtml(tool)}</li>`;
    });
    html += '</ul>';
    
    return html;
}

/**
 * Render steps section
 */
function renderSteps(steps) {
    if (!steps || steps.length === 0) return '';
    
    let html = '<h3>📋 Step-by-Step Instructions</h3><div class="step-by-step">';
    steps.forEach((step, index) => {
        const title = step.title ? escapeHtml(step.title) : `Step ${index + 1}`;
        const description = step.description ? escapeHtml(step.description) : escapeHtml(step);
        html += `<div class="step"><strong>${title}</strong><br>${description}</div>`;
    });
    html += '</div>';
    
    return html;
}

/**
 * Render tips section
 */
function renderTips(tips) {
    if (!tips || tips.length === 0) return '';
    
    let html = '<h3>💡 Pro Tips</h3>';
    tips.forEach(tip => {
        const content = typeof tip === 'string' ? tip : tip.content;
        html += `<div class="tip">${escapeHtml(content)}</div>`;
    });
    
    return html;
}

/**
 * Render safety section
 */
function renderSafety(safety) {
    if (!safety || safety.length === 0) return '';
    
    let html = '<h3>⚠️ Safety Guidelines</h3><div class="safety"><ul>';
    safety.forEach(item => {
        html += `<li>${escapeHtml(item)}</li>`;
    });
    html += '</ul></div>';
    
    return html;
}

/**
 * Render images section
 */
function renderImages(images) {
    if (!images || images.length === 0) return '';
    
    let html = '<h3>📷 Reference Images</h3>';
    images.forEach(img => {
        const src = typeof img === 'string' ? img : img.name;
        const alt = typeof img === 'object' && img.description ? img.description : 'Reference image';
        html += `<div class="diagram"><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy"></div>`;
    });
    
    return html;
}

/**
 * Render complete section content
 */
function renderContent(data) {
    let html = `<h2>${escapeHtml(data.title)}</h2>`;
    
    // Goal and metadata
    if (data.goal) {
        html += `<p><strong>🎯 Goal:</strong> ${escapeHtml(data.goal)}</p>`;
    }
    if (data.days) {
        html += `<p><strong>📅 Timeline:</strong> Days ${escapeHtml(data.days)}</p>`;
    }
    if (data.estimated_time_hours) {
        html += `<p><strong>⏱️ Estimated Time:</strong> ${data.estimated_time_hours} hours</p>`;
    }
    
    // Main content sections
    html += renderMaterials(data.materials, data.total_cost);
    html += renderTools(data.tools);
    html += renderSteps(data.steps);
    html += renderTips(data.tips);
    html += renderSafety(data.safety);
    html += renderImages(data.images);
    
    // Store budget data for rendering
    state.currentBudget = data;
    
    return html;
}

// ============================================
// DATA LOADING
// ============================================

/**
 * Load section data from JSON file
 */
async function loadSection(sectionName) {
    // Prevent duplicate loads
    if (state.isLoading && state.currentSection === sectionName) {
        return;
    }
    
    // Check cache first
    if (CONFIG.cacheEnabled && state.cache.has(sectionName)) {
        renderFromCache(sectionName);
        return;
    }
    
    showLoading();
    state.currentSection = sectionName;
    
    try {
        const response = await fetch(`${CONFIG.dataPath}${sectionName}.json`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Cache the data
        if (CONFIG.cacheEnabled) {
            state.cache.set(sectionName, data);
        }
        
        // Render content
        elements.contentDiv.innerHTML = renderContent(data);
        
        // Render budget information
        renderSectionBudget(data);
        
        state.isLoading = false;
        
    } catch (error) {
        console.error(`Error loading section "${sectionName}":`, error);
        showError(`Failed to load "${sectionName}" section. ${error.message}`);
    }
}

/**
 * Render content from cache
 */
function renderFromCache(sectionName) {
    const data = state.cache.get(sectionName);
    elements.contentDiv.innerHTML = renderContent(data);
    renderSectionBudget(data);
    state.currentSection = sectionName;
}

// ============================================
// EVENT HANDLERS
// ============================================

/**
 * Handle tab click
 */
function handleTabClick(event) {
    const tab = event.currentTarget;
    const section = tab.getAttribute('data-section');
    
    if (!section) {
        console.warn('Tab missing data-section attribute');
        return;
    }
    
    // Update active state
    elements.tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    
    // Load content
    loadSection(section);
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize the application
 */
function init() {
    // Check if required elements exist
    if (!elements.contentDiv) {
        console.error('Content div not found. Make sure element with id="content" exists.');
        return;
    }
    
    if (!elements.tabs || elements.tabs.length === 0) {
        console.warn('No tabs found. Tab navigation will not work.');
        return;
    }
    
    // Add ARIA attributes for accessibility
    elements.tabs.forEach((tab, index) => {
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        tab.addEventListener('click', handleTabClick);
    });
    
    // Load default section
    loadSection(CONFIG.defaultSection);
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
