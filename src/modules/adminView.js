import { store } from '../data/store.js';

export class AdminView {
  constructor(options = {}) {
    this.container = options.container;
    this.onNavigate = options.onNavigate || (() => {});
    this.onShowToast = options.onShowToast || (() => {});
    this.selectedUserFilter = 'all';
  }

  mount() {
    this.render();
    this.attachEvents();
  }

  render() {
    const orgStats = store.getAdminOrgStats();
    const users = store.getAllUsers().filter(u => u.role !== 'admin');
    const allChecks = store.getChecksForCurrentUser(this.selectedUserFilter);
    const allComplaints = store.getComplaintsForCurrentUser(this.selectedUserFilter);

    this.container.innerHTML = `
      <div class="screen-view admin-screen-view">
        <!-- Admin Overseer Header Banner -->
        <div class="admin-hero-card">
          <div class="admin-badge-row">
            <span class="admin-crown-badge">👑 ORGANIZATIONAL OVERSEER</span>
            <span class="live-dot-pulse">● Live Stream</span>
          </div>
          <h2 class="admin-hero-title">Admin Monitoring Center</h2>
          <p class="admin-hero-sub">
            Overseeing food verification checks, supplier shortage claims, and customer complaints across all staff accounts.
          </p>
        </div>

        <!-- Filter By Staff Member Bar -->
        <div class="admin-filter-bar-card">
          <label class="admin-filter-label" for="admin-user-filter">Filter Activity by Team Member:</label>
          <select id="admin-user-filter" class="custom-select-input admin-select">
            <option value="all" ${this.selectedUserFilter === 'all' ? 'selected' : ''}>All Team Accounts (${store.state.users.length - 1} staff members)</option>
            ${users.map(u => `
              <option value="${u.id}" ${this.selectedUserFilter === u.id ? 'selected' : ''}>
                ${u.name} (${u.email}) — ${u.tag}
              </option>
            `).join('')}
          </select>
        </div>

        <!-- Org KPI Stats Grid -->
        <div class="admin-kpi-grid">
          <div class="stat-box-card">
            <div class="stat-icon-wrapper icon-wrap-growth">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div class="stat-number-val">${orgStats.totalTeamChecks}</div>
            <div class="stat-title-label">Total Staff Checks</div>
          </div>

          <div class="stat-box-card">
            <div class="stat-icon-wrapper">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div class="stat-number-val text-red">${orgStats.pendingComplaints}</div>
            <div class="stat-title-label">Pending Complaints</div>
          </div>

          <div class="stat-box-card">
            <div class="stat-icon-wrapper icon-wrap-growth">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div class="stat-number-val text-green">${orgStats.totalClaimMoney}</div>
            <div class="stat-title-label">Total Shortage Claims</div>
          </div>
        </div>

        <!-- Section 1: Staff Complaints Resolution Queue -->
        <div class="content-section-card">
          <div class="section-title-row">
            <h3 class="section-main-title">Complaints Resolution Queue (${allComplaints.length})</h3>
            <span class="text-subtle-hint">Admin controls to approve or resolve user dispute claims</span>
          </div>

          <div class="admin-complaints-list">
            ${allComplaints.length > 0 ? allComplaints.map(cmp => `
              <div class="admin-complaint-row" data-id="${cmp.id}">
                <div class="admin-row-header">
                  <div class="admin-user-pill">
                    <span class="mini-avatar">${(cmp.userName || 'User')[0]}</span>
                    <strong>${cmp.userName}</strong>
                  </div>
                  <span class="badge-status ${cmp.status.includes('Approved') ? 'badge-match' : (cmp.status.includes('Pending') ? 'badge-shortage' : 'badge-info')}">
                    ${cmp.status}
                  </span>
                </div>

                <div class="admin-cmp-details">
                  <h4 class="admin-cmp-title">${cmp.vendor} • ${cmp.orderId}</h4>
                  <p class="admin-cmp-desc">${cmp.description}</p>
                  <div class="admin-cmp-meta-tags">
                    <span class="tag-issue">Issue: ${cmp.issueType}</span>
                    <span class="tag-claim">Claim Amount: <strong>${cmp.claimAmount}</strong></span>
                    <span class="tag-date">📅 ${new Date(cmp.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <!-- Admin Action Controls -->
                <div class="admin-decision-buttons">
                  <button class="btn-admin-action btn-approve" data-id="${cmp.id}" data-action="Approved Refund">
                    ✅ Approve Refund
                  </button>
                  <button class="btn-admin-action btn-credit" data-id="${cmp.id}" data-action="Store Credit Issued">
                    💳 Store Credit
                  </button>
                  <button class="btn-admin-action btn-investigate" data-id="${cmp.id}" data-action="Under Investigation">
                    🔍 Investigate
                  </button>
                  <button class="btn-admin-action btn-resolve" data-id="${cmp.id}" data-action="Resolved">
                    ✔️ Close & Resolve
                  </button>
                </div>
              </div>
            `).join('') : `
              <div class="empty-state-card">
                <span class="empty-state-title">No complaints found for this selection</span>
              </div>
            `}
          </div>
        </div>

        <!-- Section 2: All Users Verification Audit Feed -->
        <div class="content-section-card">
          <div class="section-title-row">
            <h3 class="section-main-title">Staff Verification Activity Stream (${allChecks.length})</h3>
          </div>

          <div class="admin-checks-table-wrap">
            <table class="admin-audit-table">
              <thead>
                <tr>
                  <th>Staff Member</th>
                  <th>Check Type</th>
                  <th>Product Name</th>
                  <th>Inspection Result</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                ${allChecks.map(chk => `
                  <tr>
                    <td>
                      <span class="user-name-cell">
                        <span class="mini-avatar-inline">${(chk.userName || 'U')[0]}</span>
                        ${chk.userName || 'Staff'}
                      </span>
                    </td>
                    <td><span class="record-type-badge">${chk.type}</span></td>
                    <td><strong>${chk.productName}</strong></td>
                    <td>
                      ${chk.type === 'Quantity' ? `
                        <span class="badge-status ${chk.status === 'Shortage' ? 'badge-shortage' : 'badge-match'}">
                          ${chk.difference < 0 ? `${chk.difference} ${chk.unit}` : 'Match'}
                        </span>
                      ` : `
                        <span class="badge-status ${chk.qualityScore >= 80 ? 'badge-fresh' : 'badge-shortage'}">
                          ${chk.qualityScore}% Quality
                        </span>
                      `}
                    </td>
                    <td><span class="text-subtle">${new Date(chk.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    // Filter dropdown
    const filterSelect = this.container.querySelector('#admin-user-filter');
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        this.selectedUserFilter = e.target.value;
        this.render();
        this.attachEvents();
      });
    }

    // Admin Complaint Action buttons
    const actionBtns = this.container.querySelectorAll('.btn-admin-action');
    actionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const newStatus = btn.getAttribute('data-action');
        store.updateComplaintStatus(id, newStatus);
        this.onShowToast(`Updated complaint status to "${newStatus}"!`, 'success');
        this.render();
        this.attachEvents();
      });
    });
  }
}
