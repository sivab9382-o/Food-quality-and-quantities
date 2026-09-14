import { store } from '../data/store.js';

export class OrderView {
  constructor(options = {}) {
    this.container = options.container;
    this.onNavigate = options.onNavigate || (() => {});
    this.onShowToast = options.onShowToast || (() => {});
    
    this.orderVendor = 'InstaGrocer Delivery';
    this.orderNumber = 'ORD-2026-981';
    this.items = [
      { id: 1, name: 'Roma Tomatoes (1 kg)', status: 'received', price: '$2.99' },
      { id: 2, name: 'Whole Milk (1 Gallon)', status: 'received', price: '$4.29' },
      { id: 3, name: 'Artisan Sourdough Bread', status: 'missing', price: '$4.99' },
      { id: 4, name: 'Organic Bananas (Bunch)', status: 'damaged', price: '$2.19' },
      { id: 5, name: 'Pasture-Raised Eggs (12pk)', status: 'received', price: '$5.49' }
    ];
  }

  mount() {
    this.render();
    this.attachEvents();
  }

  render() {
    const totalItems = this.items.length;
    const receivedCount = this.items.filter(i => i.status === 'received').length;
    const missingCount = this.items.filter(i => i.status === 'missing').length;
    const damagedCount = this.items.filter(i => i.status === 'damaged').length;
    const fulfillmentPercent = totalItems > 0 ? Math.round((receivedCount / totalItems) * 100) : 100;

    this.container.innerHTML = `
      <div class="screen-view order-screen-view">
        <div class="page-title-block">
          <h2 class="page-main-heading">Order Delivery Verification</h2>
          <p class="page-sub-heading">Verify complete grocery deliveries item-by-item.</p>
        </div>

        <!-- Order Header Card -->
        <div class="form-surface-card">
          <div class="order-meta-grid">
            <div class="form-input-group">
              <label class="input-label-text">Delivery Vendor / Store</label>
              <input type="text" id="order-vendor-input" class="custom-text-input" value="${this.orderVendor}" />
            </div>
            <div class="form-input-group">
              <label class="input-label-text">Order / Receipt ID</label>
              <input type="text" id="order-id-input" class="custom-text-input" value="${this.orderNumber}" />
            </div>
          </div>

          <!-- Fulfillment Progress Bar -->
          <div class="order-fulfillment-summary">
            <div class="fulfill-text-row">
              <span>Order Fulfillment Rate</span>
              <strong class="${fulfillmentPercent === 100 ? 'text-green' : 'text-amber'}">${fulfillmentPercent}% Complete</strong>
            </div>
            <div class="fulfill-track">
              <div class="fulfill-fill" style="width: ${fulfillmentPercent}%;"></div>
            </div>
            <div class="fulfill-tags-row">
              <span class="tag-status tag-rec">✅ ${receivedCount} Received</span>
              <span class="tag-status tag-mis">❌ ${missingCount} Missing</span>
              <span class="tag-status tag-dam">⚠️ ${damagedCount} Damaged</span>
            </div>
          </div>
        </div>

        <!-- Item Checklist Table / List -->
        <div class="content-section-card">
          <div class="section-title-row">
            <h3 class="section-main-title">Delivery Items Checklist</h3>
            <button id="add-order-item-btn" class="btn-sm-text">+ Add Item</button>
          </div>

          <div class="order-items-list" id="order-items-container">
            ${this.items.map(item => `
              <div class="order-item-row" data-id="${item.id}">
                <div class="order-item-left">
                  <strong class="item-name-text">${item.name}</strong>
                  <span class="item-price-text">${item.price}</span>
                </div>
                <div class="order-item-toggles">
                  <button class="status-btn btn-status-rec ${item.status === 'received' ? 'active' : ''}" data-status="received" title="Received in good condition">
                    ✅ Received
                  </button>
                  <button class="status-btn btn-status-mis ${item.status === 'missing' ? 'active' : ''}" data-status="missing" title="Missing from delivery">
                    ❌ Missing
                  </button>
                  <button class="status-btn btn-status-dam ${item.status === 'damaged' ? 'active' : ''}" data-status="damaged" title="Damaged or spoiled">
                    ⚠️ Damaged
                  </button>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="order-actions-bar">
            <button id="save-order-check-btn" class="btn-secondary-outline">
              💾 Save Order Check to History
            </button>
            ${(missingCount > 0 || damagedCount > 0) ? `
              <button id="escalate-order-complaint-btn" class="btn-danger-solid">
                📄 File Order Complaint (${missingCount + damagedCount} issues)
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    const statusBtns = this.container.querySelectorAll('.status-btn');
    statusBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const row = btn.closest('.order-item-row');
        const id = parseInt(row.getAttribute('data-id'), 10);
        const newStatus = btn.getAttribute('data-status');

        const item = this.items.find(i => i.id === id);
        if (item) {
          item.status = newStatus;
          this.render();
          this.attachEvents();
        }
      });
    });

    const addItemBtn = this.container.querySelector('#add-order-item-btn');
    if (addItemBtn) {
      addItemBtn.addEventListener('click', () => {
        const name = prompt('Enter item name (e.g. Greek Yogurt 500g):');
        if (name && name.trim()) {
          this.items.push({
            id: Date.now(),
            name: name.trim(),
            status: 'received',
            price: '$3.99'
          });
          this.render();
          this.attachEvents();
        }
      });
    }

    const saveOrderBtn = this.container.querySelector('#save-order-check-btn');
    if (saveOrderBtn) {
      saveOrderBtn.addEventListener('click', () => {
        const vendor = this.container.querySelector('#order-vendor-input').value;
        const orderId = this.container.querySelector('#order-id-input').value;
        const missing = this.items.filter(i => i.status === 'missing');
        const damaged = this.items.filter(i => i.status === 'damaged');

        store.addCheck({
          type: 'Order',
          productName: `${vendor} (${orderId})`,
          missingItemsCount: missing.length + damaged.length,
          fulfillmentRate: Math.round((this.items.filter(i => i.status === 'received').length / this.items.length) * 100),
          notes: `${missing.length} missing, ${damaged.length} damaged out of ${this.items.length} items.`
        });

        this.onShowToast('Saved Order Verification to History!', 'success');
        saveOrderBtn.disabled = true;
        saveOrderBtn.textContent = '✅ Saved';
      });
    }

    const complaintBtn = this.container.querySelector('#escalate-order-complaint-btn');
    if (complaintBtn) {
      complaintBtn.addEventListener('click', () => {
        const vendor = this.container.querySelector('#order-vendor-input').value;
        const orderId = this.container.querySelector('#order-id-input').value;
        const missing = this.items.filter(i => i.status === 'missing');
        const damaged = this.items.filter(i => i.status === 'damaged');

        const issueList = [
          ...missing.map(m => `Missing: ${m.name} (${m.price})`),
          ...damaged.map(d => `Damaged/Spoiled: ${d.name} (${d.price})`)
        ].join('\n');

        this.onNavigate('complaints', {
          vendor,
          orderId,
          productName: `${missing.length + damaged.length} Order Items`,
          issueType: 'Missing & Damaged Items in Order',
          shortage: `${missing.length} missing, ${damaged.length} damaged`,
          description: `Delivery Order #${orderId} from ${vendor} arrived with defective/missing items:\n${issueList}`
        });
      });
    }
  }
}
