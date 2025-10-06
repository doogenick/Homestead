/**
 * phase-loader.js - Generic Phase Content Loader
 * 
 * Loads phase data from data/phaseX_data.js modules
 * Used for phases 2, 3, and 4 which use simpler data structure
 * 
 * Expected Data Structure:
 * export const phaseXData = {
 *   "Section Name": {
 *     "days": "1-2",
 *     "materials": [{"item": "Name", "cost": "R1,000"}],
 *     "steps": ["Step 1", "Step 2"]
 *   }
 * }
 */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    phaseNumber: null, // Will be set dynamically
    dataModule: null   // Will be set dynamically
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Initialize phase loader with phase number
 */
function initPhaseLoader(phaseNumber) {
    CONFIG.phaseNumber = phaseNumber;
    loadPhaseData();
}

/**
 * Load and render phase data
 */
async function loadPhaseData() {
    const container = document.getElementById('phase-content');
    
    if (!container) {
        console.error('Phase content container not found');
        return;
    }
    
    try {
        // Dynamically import the phase data module
        const module = await import(`../data/phase${CONFIG.phaseNumber}_data.js`);
        const phaseData = module[`phase${CONFIG.phaseNumber}Data`];
        
        if (!phaseData) {
            throw new Error(`Phase ${CONFIG.phaseNumber} data not found in module`);
        }
        
        renderPhaseContent(phaseData, container);
        
    } catch (error) {
        console.error(`Error loading phase ${CONFIG.phaseNumber} data:`, error);
        container.innerHTML = `
            <div class="warning">
                <strong>⚠️ Error Loading Phase ${CONFIG.phaseNumber} Content</strong>
                <p>${escapeHtml(error.message)}</p>
                <p>This phase may not have data configured yet.</p>
            </div>
        `;
    }
}

/**
 * Render phase content to container
 */
function renderPhaseContent(phaseData, container) {
    container.innerHTML = ''; // Clear existing content
    
    for (const [sectionName, section] of Object.entries(phaseData)) {
        const sectionDiv = document.createElement('section');
        
        // Section header
        const h2 = document.createElement('h2');
        h2.textContent = `${sectionName}${section.days ? ` (Days ${section.days})` : ''}`;
        sectionDiv.appendChild(h2);
        
        // Materials
        if (section.materials && section.materials.length > 0) {
            const h3mat = document.createElement('h3');
            h3mat.textContent = '📦 Materials Required';
            sectionDiv.appendChild(h3mat);
            
            const ul = document.createElement('ul');
            section.materials.forEach(mat => {
                const li = document.createElement('li');
                li.textContent = `${mat.item} — `;
                const costSpan = document.createElement('span');
                costSpan.className = 'cost';
                costSpan.textContent = mat.cost;
                li.appendChild(costSpan);
                ul.appendChild(li);
            });
            sectionDiv.appendChild(ul);
        }
        
        // Steps
        if (section.steps && section.steps.length > 0) {
            const h3steps = document.createElement('h3');
            h3steps.textContent = '📋 Step-by-Step Instructions';
            sectionDiv.appendChild(h3steps);
            
            const stepContainer = document.createElement('div');
            stepContainer.className = 'step-by-step';
            
            section.steps.forEach((step, index) => {
                const stepDiv = document.createElement('div');
                stepDiv.className = 'step';
                
                const stepText = typeof step === 'string' ? step : step.description || step.title;
                stepDiv.innerHTML = `<strong>Step ${index + 1}</strong><br>${escapeHtml(stepText)}`;
                
                stepContainer.appendChild(stepDiv);
            });
            
            sectionDiv.appendChild(stepContainer);
        }
        
        // Tips
        if (section.tips && section.tips.length > 0) {
            const h3tips = document.createElement('h3');
            h3tips.textContent = '💡 Pro Tips';
            sectionDiv.appendChild(h3tips);
            
            section.tips.forEach(tip => {
                const tipDiv = document.createElement('div');
                tipDiv.className = 'tip';
                tipDiv.textContent = tip;
                sectionDiv.appendChild(tipDiv);
            });
        }
        
        container.appendChild(sectionDiv);
    }
}

// Export for use in HTML pages
window.initPhaseLoader = initPhaseLoader;
