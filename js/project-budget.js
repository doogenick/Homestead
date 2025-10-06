/**
 * project-budget.js - Project-wide Budget Calculator
 * 
 * Calculates and displays budget summaries for the entire homestead project.
 * Loads data from all phases and aggregates costs.
 */

// ============================================
// CONFIGURATION
// ============================================
const PROJECT_CONFIG = {
    phases: [
        { name: 'Phase 1', path: 'data/phase1/', files: ['water', 'shelter', 'sanitation', 'fencing', 'kitchen', 'chickens', 'garden', 'schedule'] },
        { name: 'Phase 2', path: 'data/phase2_data.js', type: 'module' },
        { name: 'Phase 3', path: 'data/phase3_data.js', type: 'module' },
        { name: 'Phase 4', path: 'data/phase4_data.js', type: 'module' }
    ]
};

// ============================================
// STATE MANAGEMENT
// ============================================
let projectBudgetData = {
    total: 0,
    phases: []
};

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
    projectTotal: document.getElementById('project-total'),
    budgetContainer: document.getElementById('budget-summary-container')
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
 * Load Phase 1 data (individual JSON files)
 */
async function loadPhase1Data() {
    const phase = PROJECT_CONFIG.phases[0];
    const phaseData = {
        name: phase.name,
        total: 0,
        sections: []
    };
    
    for (const file of phase.files) {
        try {
            const response = await fetch(`${phase.path}${file}.json`);
            if (response.ok) {
                const data = await response.json();
                const sectionCost = calculateSectionCost(data);
                phaseData.sections.push({
                    name: data.title,
                    cost: sectionCost,
                    materials: data.materials || []
                });
                phaseData.total += sectionCost;
            }
        } catch (error) {
            console.warn(`Failed to load ${file}.json:`, error);
        }
    }
    
    return phaseData;
}

/**
 * Calculate cost for a section
 */
function calculateSectionCost(data) {
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
 * Load Phase 2-4 data (JavaScript modules)
 */
async function loadPhaseData(phaseConfig) {
    try {
        if (phaseConfig.type === 'module') {
            // Dynamic import for ES modules
            const module = await import(`../${phaseConfig.path}`);
            const phaseKey = phaseConfig.path.replace('data/', '').replace('_data.js', '');
            const phaseData = module[`${phaseKey}Data`];
            
            if (!phaseData) {
                throw new Error(`No data found in ${phaseConfig.path}`);
            }
            
            return calculateModulePhaseBudget(phaseConfig.name, phaseData);
        }
    } catch (error) {
        console.warn(`Failed to load ${phaseConfig.path}:`, error);
        return {
            name: phaseConfig.name,
            total: 0,
            sections: []
        };
    }
}

/**
 * Calculate budget for module-based phases (2-4)
 */
function calculateModulePhaseBudget(phaseName, phaseData) {
    const sections = [];
    let total = 0;
    
    for (const [sectionName, sectionData] of Object.entries(phaseData)) {
        const sectionCost = calculateSectionCost(sectionData);
        sections.push({
            name: sectionName,
            cost: sectionCost,
            materials: sectionData.materials || []
        });
        total += sectionCost;
    }
    
    return {
        name: phaseName,
        total,
        sections
    };
}

/**
 * Load all phase data
 */
async function loadAllPhaseData() {
    const phasePromises = PROJECT_CONFIG.phases.map(async (phase, index) => {
        if (index === 0) {
            return await loadPhase1Data();
        } else {
            return await loadPhaseData(phase);
        }
    });
    
    const phases = await Promise.all(phasePromises);
    const total = phases.reduce((sum, phase) => sum + phase.total, 0);
    
    return {
        total,
        phases
    };
}

/**
 * Render project budget summary
 */
function renderProjectBudget(budgetData) {
    if (!elements.budgetContainer) return;
    
    // Update total
    if (elements.projectTotal) {
        elements.projectTotal.textContent = formatCurrency(budgetData.total);
    }
    
    // Create table
    const table = document.createElement('table');
    table.className = 'budget-table';
    
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Phase</th>
            <th>Cost (${formatCurrency(0).charAt(0)})</th>
            <th>% of Total</th>
        </tr>
    `;
    table.appendChild(thead);
    
    const tbody = document.createElement('tbody');
    
    budgetData.phases.forEach(phase => {
        const percentage = budgetData.total > 0 
            ? ((phase.total / budgetData.total) * 100).toFixed(1)
            : 0;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${phase.name}</td>
            <td class="cost-cell">${formatCurrency(phase.total)}</td>
            <td class="percentage-cell">${percentage}%</td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Add total row
    const totalRow = document.createElement('tr');
    totalRow.className = 'total-row';
    totalRow.innerHTML = `
        <td><strong>Total</strong></td>
        <td class="cost-cell"><strong>${formatCurrency(budgetData.total)}</strong></td>
        <td class="percentage-cell"><strong>100%</strong></td>
    `;
    tbody.appendChild(totalRow);
    
    table.appendChild(tbody);
    elements.budgetContainer.appendChild(table);
}

/**
 * Export project budget to CSV
 */
function exportProjectBudget() {
    if (!projectBudgetData.phases) {
        alert('No budget data available to export');
        return;
    }
    
    let csv = 'Phase,Section,Material,Quantity,Unit Cost,Total Cost\n';
    
    projectBudgetData.phases.forEach(phase => {
        phase.sections.forEach(section => {
            section.materials.forEach(material => {
                const cost = typeof material.cost === 'number' ? material.cost : 0;
                const quantity = material.quantity || 1;
                const itemTotal = cost * quantity;
                
                csv += `"${phase.name}","${section.name}","${material.item || material.name}",${quantity},${cost},${itemTotal}\n`;
            });
        });
        
        // Add phase total
        csv += `"${phase.name}","PHASE TOTAL","","",,"${phase.total}"\n`;
    });
    
    // Add project total
    csv += `"PROJECT TOTAL","","","","","${projectBudgetData.total}"\n`;
    
    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'homestead-project-budget.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize project budget calculation
 */
async function initProjectBudget() {
    try {
        projectBudgetData = await loadAllPhaseData();
        renderProjectBudget(projectBudgetData);
    } catch (error) {
        console.error('Failed to load project budget:', error);
        if (elements.projectTotal) {
            elements.projectTotal.textContent = 'Error loading budget';
        }
    }
}

// ============================================
// GLOBAL EXPORTS
// ============================================

// Make functions available globally
window.exportProjectBudget = exportProjectBudget;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectBudget);
} else {
    initProjectBudget();
}
