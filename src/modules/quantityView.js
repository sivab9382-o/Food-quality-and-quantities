import { store } from '../data/store.js';

export class QuantityView {
  constructor(options = {}) {
    this.container = options.container;
    this.onNavigate = options.onNavigate || (() => {});
    this.onShowToast = options.onShowToast || (() => {});
    this.activeUnit = 'kg';
    this.currentResult = null;
  }

  mount() {
    this.render();
    this.attachEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="screen-view quantity-screen-view">
        <!-- Page Title & Subtitle matching Screenshot 3 -->
        <div class="page-title-block">
          <h2 class="page-main-heading">Quantity Check</h2>
          <p class="page-sub-heading">Compare ordered vs. received quantity.</p>
        </div>

        <!-- Form Card Container matching Screenshot 3 -->
        <div class="form-surface-card">
          <!-- Food / Product Name -->
          <div class="form-input-group">
            <label class="input-label-text" for="qty-product-name">Food / Product Name</label>
            <input 
              type="text" 
              id="qty-product-name" 
              class="custom-text-input" 
              placeholder="e.g. Tomatoes, Rice 5kg bag..." 
              value="${this.currentResult ? this.currentResult.productName : ''}"
            />
          </div>

          <!-- Unit Selector Pills matching Screenshot 3 -->
          <div class="form-input-group">
            <label class="input-label-text">Unit</label>
            <div class="unit-pills-row" id="unit-pills-group">
              ${['kg', 'g', 'L', 'ml', 'units', 'pack'].map(unit => `
                <button type="button" class="unit-pill-btn ${this.activeUnit === unit ? 'active' : ''}" data-unit="${unit}">
                  ${unit}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Expected Qty vs Received Qty side-by-side -->
          <div class="qty-inputs-row">
            <div class="form-input-group">
              <label class="input-label-text" for="qty-expected">Expected Qty</label>
              <input 
                type="number" 
                step="any" 
                id="qty-expected" 
                class="custom-text-input text-center" 
                placeholder="0" 
                value="${this.currentResult ? this.currentResult.expectedQty : ''}"
              />
            </div>
            <div class="form-input-group">
              <label class="input-label-text" for="qty-received">Received Qty</label>
              <input 
                type="number" 
                step="any" 
                id="qty-received" 
                class="custom-text-input text-center" 
                placeholder="0" 
                value="${this.currentResult ? this.currentResult.receivedQty : ''}"
              />
            </div>
          </div>

          <!-- Calculate Difference Button matching Screenshot 3 -->
          <button type="button" id="btn-calc-diff" class="btn-primary-mint">
            <span class="btn-icon-svg">⚖️</span>
            <span>Calculate Difference</span>
          </button>
        </div>

        <!-- Calculation Result Card (Conditional) -->
        <div id="qty-result-box" class="result-display-container ${this.currentResult ? '' : 'hidden'}">
          ${this.currentResult ? this.renderResultCard(this.currentResult) : ''}
        </div>
      </div>
    `;
  }

  renderResultCard(res) {
    const isShortage = res.difference < 0;
    const isMatch = res.difference === 0;
    const isSurplus = res.difference > 0;

    const badgeClass = isShortage ? 'badge-danger-soft' : (isMatch ? 'badge-success-soft' : 'badge-info-soft');
    const badgeText = isShortage ? '⚠️ Shortage / Missing Food Detected' : (isMatch ? '✅ Exact Match' : 'ℹ️ Surplus Delivered');

    return `
      <div class="analysis-result-card ${isShortage ? 'border-shortage' : 'border-success'}">
        <div class="result-header-row">
          <span class="status-chip ${badgeClass}">${badgeText}</span>
          <span class="result-timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        <div class="diff-numbers-grid">
          <div class="diff-box">
            <span class="diff-box-label">Expected</span>
            <strong class="diff-box-val">${res.expectedQty} ${res.unit}</strong>
          </div>
          <div class="diff-box">
            <span class="diff-box-label">Received</span>
            <strong class="diff-box-val">${res.receivedQty} ${res.unit}</strong>
          </div>
          <div class="diff-box highlight-diff">
            <span class="diff-box-label">Variance</span>
            <strong class="diff-box-val ${isShortage ? 'text-red' : (isMatch ? 'text-green' : 'text-blue')}">
              ${res.difference > 0 ? '+' : ''}${res.difference} ${res.unit} (${res.diffPercent}%)
            </strong>
          </div>
        </div>

        ${isShortage ? `
          <div class="shortage-notice-box">
            <strong>Missing: ${Math.abs(res.difference)} ${res.unit} of ${res.productName}</strong>
            <p>You paid for items you did not receive. You can automatically generate a complaint report with estimated refund claim.</p>
          </div>
        ` : ''}

        <div class="result-actions-row">
          <button id="save-qty-check-btn" class="btn-secondary-outline">
            💾 Save to History
          </button>
          ${isShortage ? `
            <button id="escalate-complaint-btn" class="btn-danger-solid">
              📄 Build Complaint Report
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }

  attachEvents() {
    // Unit pill buttons
    const unitPills = this.container.querySelectorAll('.unit-pill-btn');
    unitPills.forEach(pill => {
      pill.addEventListener('click', () => {
        this.activeUnit = pill.getAttribute('data-unit');
        unitPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });

    // Calculate difference button
    const calcBtn = this.container.querySelector('#btn-calc-diff');
    calcBtn.addEventListener('click', () => {
      const prodNameInput = this.container.querySelector('#qty-product-name');
      const expectedInput = this.container.querySelector('#qty-expected');
      const receivedInput = this.container.querySelector('#qty-received');

      const productName = prodNameInput.value.trim() || 'Food Item';
      const expected = parseFloat(expectedInput.value);
      const received = parseFloat(receivedInput.value);

      if (isNaN(expected) || isNaN(received)) {
        alert('Please enter valid numeric values for Expected Qty and Received Qty.');
        return;
      }

      const difference = parseFloat((received - expected).toFixed(2));
      const diffPercent = expected > 0 ? parseFloat(((difference / expected) * 100).toFixed(1)) : 0;
      const status = difference < 0 ? 'Shortage' : (difference === 0 ? 'Match' : 'Surplus');

      this.currentResult = {
        productName,
        unit: this.activeUnit,
        expectedQty: expected,
        receivedQty: received,
        difference,
        diffPercent,
        status,
        notes: difference < 0 
          ? `Missing ${Math.abs(difference)} ${this.activeUnit} of ${productName} (${Math.abs(diffPercent)}% deficit)`
          : `Received exactly ${received} ${this.activeUnit}`
      };

      const resultBox = this.container.querySelector('#qty-result-box');
      resultBox.classList.remove('hidden');
      resultBox.innerHTML = this.renderResultCard(this.currentResult);
      this.attachResultEvents();
    });
  }

  attachResultEvents() {
    const saveBtn = this.container.querySelector('#save-qty-check-btn');
    const complaintBtn = this.container.querySelector('#escalate-complaint-btn');

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        if (!this.currentResult) return;
        store.addCheck({
          type: 'Quantity',
          ...this.currentResult
        });
        this.onShowToast(`Saved ${this.currentResult.productName} quantity check to History!`, 'success');
        saveBtn.disabled = true;
        saveBtn.textContent = '✅ Saved';
      });
    }

    if (complaintBtn) {
      complaintBtn.addEventListener('click', () => {
        if (!this.currentResult) return;
        // Pre-save check
        const check = store.addCheck({
          type: 'Quantity',
          ...this.currentResult
        });

        // Navigate to Complaints tab with prefilled data
        this.onNavigate('complaints', {
          productName: this.currentResult.productName,
          issueType: 'Short Quantity',
          shortage: `${Math.abs(this.currentResult.difference)} ${this.currentResult.unit} missing`,
          description: `Ordered ${this.currentResult.expectedQty} ${this.currentResult.unit}, but only received ${this.currentResult.receivedQty} ${this.currentResult.unit}. Deficit of ${Math.abs(this.currentResult.difference)} ${this.currentResult.unit} (${Math.abs(this.currentResult.diffPercent)}%).`
        });
      });
    }
  }
}
