/**
 * budget.js - Budget Calculation and Display Module
 * 
 * Handles all budget-related calculations and rendering for the homestead project.
 * Calculates costs at step, phase, and project levels.
 */

// ============================================
// CONFIGURATION
// ============================================
const BUDGET_CONFIG = {
    currency: 'R',
    locale: 'en-ZA',
    highCostThreshold: 10000, // Items above this are highlighted
    exportFilename: 'homestead-budget.csv'
};

// ============================================
// BUDGET CALCULATION FUNCTIONS
// ============================================

/**
 * Calculate total cost for a single step
 * @param {Object} step - Step object with materials array
 * @returns {number} Total cost for the step
 */
function calculateStepCost(step) {
    if (!step.materials || !Array.isArray(step.materials)) {
        return 0;
    }
    
    return step.materials.reduce((total, material) => {
        const cost = typeof material.cost === 'number' ? material.cost : 0;
        const quantity = material.quantity || 1;
        return total + (cost * quantity);
    }, 0);
}

/**
 * Calculate total cost for a phase
 * @param {Array} steps - Array of step objects
 * @returns {Object} Phase budget breakdown
 */
function calculatePhaseBudget(steps) {
    if (!steps || !Array.isArray(steps)) {
        return { total: 0, steps: [] };
    }
    
    const stepBreakdown = steps.map((step, index) => {
        const stepCost = calculateStepCost(step);
        return {
            stepNumber: index + 1,
            title: step.title || `Step ${index + 1}`,
            cost: stepCost,
            materials: step.materials || []
        };
    });
    
    const total = stepBreakdown.reduce((sum, step) => sum + step.cost, 0);
    
    return {
        total,
        steps: stepBreakdown
    };
}

/**
 * Calculate project-wide budget across all phases
 * @param {Object} phasesData - Object with phase data
 * @returns {Object} Project budget summary
 */
function calculateProjectBudget(phasesData) {
    const phases = [];
    let projectTotal = 0;
    
    for (const [phaseName, phaseData] of Object.entries(phasesData)) {
        const steps = Array.isArray(phaseData) ? phaseData : (phaseData.steps || []);
        const phaseBudget = calculatePhaseBudget(steps);
        
        phases.push({
            name: phaseName,
            total: phaseBudget.total,
            steps: phaseBudget.steps
        });
        
        projectTotal += phaseBudget.total;
    }
    
    return {
        total: projectTotal,
        phases
    };
}

// ============================================
// FORMATTING FUNCTIONS
// ============================================

/**
 * Format currency value
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
        return `${BUDGET_CONFIG.currency}0`;
    }
    
    return `${BUDGET_CONFIG.currency}${amount.toLocaleString(BUDGET_CONFIG.locale)}`;
}

/**
 * Check if cost is high (above threshold)
 * @param {number} cost - Cost to check
 * @returns {boolean} True if cost is high
 */
function isHighCost(cost) {
    return cost >= BUDGET_CONFIG.highCostThreshold;
}

// ============================================
// RENDERING FUNCTIONS
// ============================================

/**
 * Render materials list with costs
 * @param {Array} materials - Array of material objects
 * @param {HTMLElement} container - Container element
 */
function renderMaterialsList(materials, container) {
    if (!materials || materials.length === 0) {
        container.innerHTML = '<p class="no-data">No materials listed</p>';
        return;
    }
    
    const ul = document.createElement('ul');
    ul.className = 'materials-list';
    
    materials.forEach(material => {
        const li = document.createElement('li');
        const cost = typeof material.cost === 'number' ? material.cost : 0;
        const quantity = material.quantity || 1;
        const itemTotal = cost * quantity;
        
        // Add high-cost class if applicable
        if (isHighCost(itemTotal)) {
            li.classList.add('high-cost-item');
        }
        
        // Build display text
        let displayText = material.item || material.name || 'Unnamed item';
        if (quantity > 1) {
            displayText += ` (${quantity}x ${formatCurrency(cost)})`;
        }
        displayText += ` — ${formatCurrency(itemTotal)}`;
        
        li.innerHTML = `
            <span class="material-name">${displayText}</span>
            ${isHighCost(itemTotal) ? '<span class="high-cost-badge">High Cost</span>' : ''}
        `;
        
        ul.appendChild(li);
    });
    
    container.appendChild(ul);
}

/**
 * Render phase budget summary
 * @param {Object} phaseBudget - Phase budget object from calculatePhaseBudget
 * @param {HTMLElement} container - Container element
 */
function renderPhaseBudget(phaseBudget, container) {
    container.innerHTML = '';
    
    const budgetSection = document.createElement('div');
    budgetSection.className = 'budget-section';
    budgetSection.innerHTML = `
        <h3>💰 Phase Budget Breakdown</h3>
        <div id="phase-budget-content"></div>
        <div class="phase-total">
            <strong>Phase Total:</strong> 
            <span class="cost-amount">${formatCurrency(phaseBudget.total)}</span>
        </div>
    `;
    
    container.appendChild(budgetSection);
    
    // Render step-by-step breakdown
    const contentDiv = budgetSection.querySelector('#phase-budget-content');
    
    if (phaseBudget.steps && phaseBudget.steps.length > 0) {
        phaseBudget.steps.forEach(step => {
            if (step.materials && step.materials.length > 0) {
                const stepDiv = document.createElement('div');
                stepDiv.className = 'budget-step';
                
                const stepHeader = document.createElement('h4');
                stepHeader.innerHTML = `
                    ${step.title} 
                    <span class="step-cost">${formatCurrency(step.cost)}</span>
                `;
                stepDiv.appendChild(stepHeader);
                
                const materialsContainer = document.createElement('div');
                materialsContainer.className = 'step-materials';
                renderMaterialsList(step.materials, materialsContainer);
                stepDiv.appendChild(materialsContainer);
                
                contentDiv.appendChild(stepDiv);
            }
        });
    }
}

/**
 * Render project cost summary table
 * @param {Object} projectBudget - Project budget from calculateProjectBudget
 * @param {HTMLElement} container - Container element
 */
function renderProjectSummary(projectBudget, container) {
    container.innerHTML = '';
    
    const summarySection = document.createElement('section');
    summarySection.className = 'budget-summary';
    summarySection.innerHTML = `
        <h2>💰 Project Cost Summary</h2>
        <div class="budget-overview">
            <div class="total-budget">
                <span class="label">Total Project Cost:</span>
                <span class="amount">${formatCurrency(projectBudget.total)}</span>
            </div>
        </div>
        <table class="budget-table">
            <thead>
                <tr>
                    <th>Phase</th>
                    <th>Cost (${BUDGET_CONFIG.currency})</th>
                    <th>% of Total</th>
                </tr>
            </thead>
            <tbody id="budget-table-body"></tbody>
        </table>
        <div class="budget-actions">
            <button class="btn" onclick="exportBudgetCSV()">📥 Export to CSV</button>
        </div>
    `;
    
    container.appendChild(summarySection);
    
    // Populate table
    const tbody = summarySection.querySelector('#budget-table-body');
    
    projectBudget.phases.forEach(phase => {
        const percentage = projectBudget.total > 0 
            ? ((phase.total / projectBudget.total) * 100).toFixed(1)
            : 0;
        
        const row = document.createElement('tr');
        if (isHighCost(phase.total)) {
            row.classList.add('high-cost-row');
        }
        
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
        <td class="cost-cell"><strong>${formatCurrency(projectBudget.total)}</strong></td>
        <td class="percentage-cell"><strong>100%</strong></td>
    `;
    tbody.appendChild(totalRow);
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

/**
 * Export budget to CSV
 * @param {Object} projectBudget - Project budget data
 */
function exportBudgetCSV(projectBudget) {
    if (!projectBudget) {
        console.error('No budget data to export');
        return;
    }
    
    let csv = 'Phase,Step,Material,Quantity,Unit Cost,Total Cost\n';
    
    projectBudget.phases.forEach(phase => {
        phase.steps.forEach(step => {
            step.materials.forEach(material => {
                const cost = typeof material.cost === 'number' ? material.cost : 0;
                const quantity = material.quantity || 1;
                const itemTotal = cost * quantity;
                
                csv += `"${phase.name}","${step.title}","${material.item || material.name}",${quantity},${cost},${itemTotal}\n`;
            });
        });
        
        // Add phase total
        csv += `"${phase.name}","PHASE TOTAL","","","",${phase.total}\n`;
    });
    
    // Add project total
    csv += `"PROJECT TOTAL","","","","",${projectBudget.total}\n`;
    
    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = BUDGET_CONFIG.exportFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// ============================================
// EXPORTS
// ============================================

// Make functions available globally
window.BudgetTracker = {
    calculateStepCost,
    calculatePhaseBudget,
    calculateProjectBudget,
    formatCurrency,
    renderMaterialsList,
    renderPhaseBudget,
    renderProjectSummary,
    exportBudgetCSV
};
