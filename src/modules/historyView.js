import { store } from '../data/store.js';

export class HistoryView {
  constructor(options = {}) {
    this.container = options.container;
    this.onNavigate = options.onNavigate || (() => {});
    this.onShowToast = options.onShowToast || (() => {});
    this.activeFilter = 'All';
    this.searchQuery = '';
  }

  mount() {
    this.render();
    this.attachEvents();
  }

  render() {
    const filteredRecords = this.getFilteredRecords();

    this.container.innerHTML = `
      <div class="screen-view history-screen-view">
        <!-- Page Heading matching Screenshot 4 -->
        <div class="page-title-block">
          <h2 class="page-main-heading">History</h2>
          <p class="page-sub-heading">All your food verification records.</p>
        </div>

        <!-- Search Bar matching Screenshot 4 -->
        <div class="search-input-wrapper">
          <div class="search-box-inner">
            <span class="search-box-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input 
              type="text" 
              id="history-search-input" 
              class="custom-search-input has-icon" 
              placeholder="Search records..." 
              value="${this.searchQuery}"
            />
          </div>
        </div>

        <!-- Filter Tabs matching Screenshot 4: All, Quantity, Quality, Order -->
        <div class="history-filter-pills-row">
          ${['All', 'Quantity', 'Quality', 'Order'].map(filter => `
            <button class="filter-pill-btn ${this.activeFilter === filter ? 'active' : ''}" data-filter="${filter}">
              ${filter}
            </button>
          `).join('')}
        </div>

        <!-- Records Stream or Empty State matching Screenshot 4 -->
        <div class="history-records-container" id="history-list">
          ${filteredRecords.length > 0 ? `
            <div class="records-list-grid">
              ${filteredRecords.map(rec => this.renderRecordCard(rec)).join('')}
            </div>
          ` : `
            <!-- Empty State matching Screenshot 4 -->
            <div class="empty-state-card">
              <div class="empty-icon-badge">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                  <line x1="9" y1="12" x2="15" y2="12"/>
                  <line x1="9" y1="16" x2="13" y2="16"/>
                </svg>
              </div>
              <strong class="empty-state-title">No records yet</strong>
              <span class="empty-state-sub">Perform a Quantity or Quality check to start recording data.</span>
            </div>
          `}
        </div>
      </div>
    `;
  }

  renderRecordCard(rec) {
    const isQuantity = rec.type === 'Quantity';
    const isQuality = rec.type === 'Quality';
    const isOrder = rec.type === 'Order';

    const formattedDate = new Date(rec.timestamp).toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    let statusChip = '';
    if (isQuantity) {
      statusChip = rec.status === 'Shortage' 
        ? `<span class="badge-status badge-shortage">Deficit ${rec.difference} ${rec.unit}</span>`
        : `<span class="badge-status badge-match">Exact Match</span>`;
    } else if (isQuality) {
      statusChip = rec.qualityScore >= 80 
        ? `<span class="badge-status badge-fresh">${rec.qualityScore}% Fresh</span>`
        : `<span class="badge-status badge-shortage">${rec.qualityScore}% Warning</span>`;
    } else {
      statusChip = `<span class="badge-status badge-info">${rec.fulfillmentRate}% Fulfilled</span>`;
    }

    return `
      <div class="record-item-card" data-id="${rec.id}">
        <div class="record-top-row">
          <div class="record-title-box">
            <span class="record-type-badge">${rec.type}</span>
            <strong class="record-product-name">${rec.productName}</strong>
          </div>
          <div class="record-meta-box">
            ${statusChip}
            <button class="btn-delete-record" data-id="${rec.id}" title="Delete Record">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="record-details-line">
          <span>${rec.notes || 'Verification recorded.'}</span>
        </div>

        <div class="record-bottom-row">
          <span class="record-time-text">🕒 ${formattedDate}</span>
          ${(rec.status === 'Shortage' || (isQuality && rec.qualityScore < 70)) ? `
            <button class="btn-sm-complaint" data-escalate-id="${rec.id}">
              Report Issue &rarr;
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }

  getFilteredRecords() {
    let records = store.getChecksForCurrentUser();

    // Filter by category
    if (this.activeFilter !== 'All') {
      records = records.filter(r => r.type === this.activeFilter);
    }

    // Search query
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      records = records.filter(r => 
        (r.productName && r.productName.toLowerCase().includes(q)) ||
        (r.notes && r.notes.toLowerCase().includes(q)) ||
        (r.type && r.type.toLowerCase().includes(q))
      );
    }

    return records;
  }

  attachEvents() {
    // Filter pills
    const filterBtns = this.container.querySelectorAll('.filter-pill-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeFilter = btn.getAttribute('data-filter');
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.render();
        this.attachEvents();
      });
    });

    // Search input
    const searchInput = this.container.querySelector('#history-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        const list = this.container.querySelector('#history-list');
        const filtered = this.getFilteredRecords();
        if (filtered.length > 0) {
          list.innerHTML = `<div class="records-list-grid">${filtered.map(rec => this.renderRecordCard(rec)).join('')}</div>`;
        } else {
          list.innerHTML = `
            <div class="empty-state-card">
              <div class="empty-icon-badge">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <strong class="empty-state-title">No matching records found</strong>
              <span class="empty-state-sub">Try adjusting your search terms or filter.</span>
            </div>
          `;
        }
        this.attachCardActions();
      });
    }

    this.attachCardActions();
  }

  attachCardActions() {
    // Delete buttons
    const deleteBtns = this.container.querySelectorAll('.btn-delete-record');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        store.deleteCheck(id);
        this.onShowToast('Record deleted.', 'info');
        this.render();
        this.attachEvents();
      });
    });

    // Escalate to complaint
    const escalateBtns = this.container.querySelectorAll('.btn-sm-complaint');
    escalateBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-escalate-id');
        const rec = store.getChecksForCurrentUser().find(c => c.id === id);
        if (rec) {
          this.onNavigate('complaints', {
            productName: rec.productName,
            issueType: rec.type === 'Quantity' ? 'Short Quantity' : 'Poor Quality',
            shortage: rec.type === 'Quantity' ? `${rec.difference} ${rec.unit}` : `Score ${rec.qualityScore}%`,
            description: rec.notes
          });
        }
      });
    });
  }
}
