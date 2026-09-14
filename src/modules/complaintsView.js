import { store } from '../data/store.js';

export class ComplaintsView {
  constructor(options = {}) {
    this.container = options.container;
    this.onNavigate = options.onNavigate || (() => {});
    this.onShowToast = options.onShowToast || (() => {});
    this.prefillData = options.prefillData || null;
    this.showModal = false;
  }

  setPrefill(data) {
    this.prefillData = data;
    this.showModal = true;
    this.render();
    this.attachEvents();
  }

  mount() {
    this.render();
    this.attachEvents();
  }

  render() {
    const complaints = store.getComplaintsForCurrentUser();

    this.container.innerHTML = `
      <div class="screen-view complaints-screen-view">
        <!-- Page Title & Plus Button matching Screenshot 5 -->
        <div class="page-title-row-between">
          <div class="page-title-block">
            <h2 class="page-main-heading">Complaints</h2>
            <p class="page-sub-heading">Report food issues with details.</p>
          </div>

          <!-- Green Plus Button matching Screenshot 5 -->
          <button id="open-complaint-modal-btn" class="btn-green-plus" title="Report Issue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>

        <!-- Complaints Stream or Empty State matching Screenshot 5 -->
        <div class="complaints-content-area">
          ${complaints.length > 0 ? `
            <div class="complaints-cards-grid">
              ${complaints.map(cmp => this.renderComplaintCard(cmp)).join('')}
            </div>
          ` : `
            <!-- Exact Empty State matching Screenshot 5 -->
            <div class="empty-complaint-card">
              <div class="empty-amber-badge">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="12" y1="18" x2="12" y2="12"/>
                  <line x1="12" y1="9" x2="12.01" y2="9"/>
                </svg>
              </div>
              <strong class="empty-state-title">No complaints filed yet</strong>
              <span class="empty-state-sub-action" id="empty-add-trigger">Tap + to report an issue</span>
            </div>
          `}
        </div>

        <!-- File Complaint Modal -->
        <div id="complaint-modal" class="modal-overlay ${this.showModal ? '' : 'hidden'}">
          <div class="modal-surface-card">
            <div class="modal-header-line">
              <h3 class="modal-title">File Food Issue Complaint</h3>
              <button id="close-complaint-modal-btn" class="btn-modal-close">&times;</button>
            </div>

            <form id="file-complaint-form">
              <div class="form-input-group">
                <label class="input-label-text">Vendor / Store Name</label>
                <input 
                  type="text" 
                  id="cmp-vendor-input" 
                  class="custom-text-input" 
                  required 
                  placeholder="e.g. InstaGrocer, FreshSupermarket, Blinkit"
                  value="${this.prefillData && this.prefillData.vendor ? this.prefillData.vendor : 'Local Grocery Delivery'}"
                />
              </div>

              <div class="form-row-2col">
                <div class="form-input-group">
                  <label class="input-label-text">Order / Bill ID</label>
                  <input 
                    type="text" 
                    id="cmp-order-input" 
                    class="custom-text-input" 
                    placeholder="e.g. ORD-8942-X"
                    value="${this.prefillData && this.prefillData.orderId ? this.prefillData.orderId : 'ORD-' + Math.floor(1000 + Math.random() * 9000)}"
                  />
                </div>
                <div class="form-input-group">
                  <label class="input-label-text">Issue Category</label>
                  <select id="cmp-issue-type" class="custom-select-input">
                    <option value="Short Quantity" ${this.prefillData && this.prefillData.issueType === 'Short Quantity' ? 'selected' : ''}>Short Quantity / Missing Food</option>
                    <option value="Spoiled / Poor Quality" ${this.prefillData && this.prefillData.issueType === 'Spoiled / Poor Quality' ? 'selected' : ''}>Spoiled / Rotten Quality</option>
                    <option value="Expired Date">Expired Shelf-Life Date</option>
                    <option value="Wrong Item Delivered">Wrong Item Delivered</option>
                    <option value="Damaged Packaging">Damaged Packaging</option>
                  </select>
                </div>
              </div>

              <div class="form-row-2col">
                <div class="form-input-group">
                  <label class="input-label-text">Product Affected</label>
                  <input 
                    type="text" 
                    id="cmp-product-input" 
                    class="custom-text-input" 
                    required 
                    placeholder="e.g. Fresh Tomatoes"
                    value="${this.prefillData && this.prefillData.productName ? this.prefillData.productName : ''}"
                  />
                </div>
                <div class="form-input-group">
                  <label class="input-label-text">Refund Claim Amount</label>
                  <input 
                    type="text" 
                    id="cmp-amount-input" 
                    class="custom-text-input" 
                    placeholder="e.g. $4.50"
                    value="${this.prefillData && this.prefillData.claimAmount ? this.prefillData.claimAmount : '$3.50'}"
                  />
                </div>
              </div>

              <div class="form-input-group">
                <label class="input-label-text">Issue Details / Evidence</label>
                <textarea 
                  id="cmp-desc-input" 
                  class="custom-textarea-input" 
                  rows="3" 
                  placeholder="Describe the discrepancy (e.g. weighed 1.6kg instead of 2kg ordered)..."
                >${this.prefillData && this.prefillData.description ? this.prefillData.description : ''}</textarea>
              </div>

              <div class="modal-buttons-row">
                <button type="button" id="cancel-complaint-btn" class="btn-action-light">Cancel</button>
                <button type="submit" class="btn-primary-mint">Build & File Report</button>
              </div>
            </form>
          </div>
        </div>

        <!-- View Complaint Letter Modal -->
        <div id="letter-modal" class="modal-overlay hidden">
          <div class="modal-surface-card">
            <div class="modal-header-line">
              <h3 class="modal-title">Formal Complaint Letter</h3>
              <button id="close-letter-modal-btn" class="btn-modal-close">&times;</button>
            </div>
            <pre class="letter-pre-box" id="letter-text-content"></pre>
            <div class="modal-buttons-row">
              <button id="copy-letter-btn" class="btn-primary-mint">📋 Copy Letter Text</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderComplaintCard(cmp) {
    const formattedDate = new Date(cmp.date).toLocaleDateString([], { month: 'short', day: 'numeric' });

    return `
      <div class="complaint-card-item" data-id="${cmp.id}">
        <div class="complaint-top-row">
          <div>
            <span class="badge-status badge-shortage">${cmp.issueType}</span>
            <h4 class="complaint-vendor-title">${cmp.vendor} • ${cmp.orderId}</h4>
          </div>
          <div class="complaint-status-pill pill-pending">
            ${cmp.status}
          </div>
        </div>

        <div class="complaint-body-line">
          <strong>Item: ${cmp.productName}</strong>
          <p>${cmp.description}</p>
        </div>

        <div class="complaint-footer-row">
          <span class="complaint-date">🕒 Filed ${formattedDate}</span>
          <div class="complaint-actions-wrap">
            <button class="btn-action-view-letter" data-letter-id="${cmp.id}">
              📄 View Letter
            </button>
            <button class="btn-delete-record" data-delete-id="${cmp.id}">
              🗑️
            </button>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    const openModalBtn = this.container.querySelector('#open-complaint-modal-btn');
    const emptyAddTrigger = this.container.querySelector('#empty-add-trigger');
    const closeModalBtn = this.container.querySelector('#close-complaint-modal-btn');
    const cancelModalBtn = this.container.querySelector('#cancel-complaint-btn');
    const modal = this.container.querySelector('#complaint-modal');
    const form = this.container.querySelector('#file-complaint-form');

    const openModal = () => {
      this.showModal = true;
      if (modal) modal.classList.remove('hidden');
    };

    const closeModal = () => {
      this.showModal = false;
      this.prefillData = null;
      if (modal) modal.classList.add('hidden');
    };

    if (openModalBtn) openModalBtn.addEventListener('click', openModal);
    if (emptyAddTrigger) emptyAddTrigger.addEventListener('click', openModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const vendor = this.container.querySelector('#cmp-vendor-input').value.trim();
        const orderId = this.container.querySelector('#cmp-order-input').value.trim();
        const issueType = this.container.querySelector('#cmp-issue-type').value;
        const productName = this.container.querySelector('#cmp-product-input').value.trim();
        const claimAmount = this.container.querySelector('#cmp-amount-input').value.trim();
        const description = this.container.querySelector('#cmp-desc-input').value.trim();

        store.addComplaint({
          vendor,
          orderId,
          issueType,
          productName,
          claimAmount,
          description
        });

        this.onShowToast('Complaint report built and filed!', 'success');
        closeModal();
        this.render();
        this.attachEvents();
      });
    }

    // View letter
    const viewLetterBtns = this.container.querySelectorAll('.btn-action-view-letter');
    const letterModal = this.container.querySelector('#letter-modal');
    const letterPre = this.container.querySelector('#letter-text-content');
    const closeLetterBtn = this.container.querySelector('#close-letter-modal-btn');
    const copyLetterBtn = this.container.querySelector('#copy-letter-btn');

    viewLetterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-letter-id');
        const cmp = store.getComplaintsForCurrentUser().find(c => c.id === id);
        if (cmp) {
          const letterText = `FORMAL NOTICE OF FOOD VERIFICATION DISCREPANCY

To: Customer Support, ${cmp.vendor}
Date: ${new Date(cmp.date).toLocaleDateString()}
Order Reference: ${cmp.orderId}
Product Concerned: ${cmp.productName}
Claim Reason: ${cmp.issueType}
Refund Amount Requested: ${cmp.claimAmount}

Dear Customer Relations,

I am writing to officially report an issue with order #${cmp.orderId} received from ${cmp.vendor}.

Upon receipt, the order items were inspected using the Food Verification Platform:
- Discrepancy details: ${cmp.description}
- Stated issue: ${cmp.issueType} regarding ${cmp.productName}.

Under consumer protection guidelines for perishable foodstuffs, goods received must conform strictly to the quantity, quality, and condition paid for.

Please process a refund or credit adjustment of ${cmp.claimAmount} to the original payment method.

Thank you,
siva (Food Verification Platform User)`;

          letterPre.textContent = letterText;
          letterModal.classList.remove('hidden');

          copyLetterBtn.onclick = () => {
            navigator.clipboard.writeText(letterText);
            this.onShowToast('Letter text copied to clipboard!', 'success');
          };
        }
      });
    });

    if (closeLetterBtn) {
      closeLetterBtn.addEventListener('click', () => {
        letterModal.classList.add('hidden');
      });
    }

    // Delete complaint
    const deleteBtns = this.container.querySelectorAll('.btn-delete-record');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-delete-id');
        store.deleteComplaint(id);
        this.onShowToast('Complaint removed.', 'info');
        this.render();
        this.attachEvents();
      });
    });
  }
}
