import { store } from '../data/store.js';

export class AuthModal {
  constructor(options = {}) {
    this.container = options.container;
    this.onLogout = options.onLogout || (() => {});
    this.onUserSwitched = options.onUserSwitched || (() => {});
    this.onShowToast = options.onShowToast || (() => {});
    this.isOpen = false;
  }

  mount() {
    this.render();
    this.attachEvents();
  }

  open() {
    this.isOpen = true;
    this.render();
    this.attachEvents();
  }

  close() {
    this.isOpen = false;
    const modal = document.getElementById('google-auth-modal');
    if (modal) modal.classList.add('hidden');
  }

  render() {
    const currentUser = store.getCurrentUser();
    if (!currentUser) return;

    const isAdmin = currentUser.role === 'admin';
    const allUsers = store.getAllUsers();

    let modalEl = document.getElementById('google-auth-modal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'google-auth-modal';
      modalEl.className = `modal-overlay ${this.isOpen ? '' : 'hidden'}`;
      document.body.appendChild(modalEl);
    } else {
      modalEl.className = `modal-overlay ${this.isOpen ? '' : 'hidden'}`;
    }

    modalEl.innerHTML = `
      <div class="modal-surface-card profile-security-card">
        <div class="google-modal-header">
          <div class="google-brand-row">
            <div class="google-user-avatar" style="background-color: ${currentUser.color || '#00a86b'}; width: 44px; height: 44px; font-size: 1.25rem;">
              ${currentUser.avatar}
            </div>
            <div>
              <h3 class="google-title">${currentUser.name}</h3>
              <span class="${isAdmin ? 'badge-admin' : 'badge-role'}">${isAdmin ? '👑 ADMIN OVERSEER' : currentUser.tag}</span>
            </div>
          </div>
          <button id="close-profile-modal-btn" class="btn-modal-close">&times;</button>
        </div>

        <div class="profile-details-list">
          <div class="profile-field-row">
            <span class="field-label">Current Active Account:</span>
            <strong class="field-val">@${currentUser.username || currentUser.name.toLowerCase()}</strong>
          </div>
          <div class="profile-field-row">
            <span class="field-label">Account Email:</span>
            <span class="field-val">${currentUser.email}</span>
          </div>
          <div class="profile-field-row">
            <span class="field-label">Data Privacy:</span>
            <span class="field-val text-green">${isAdmin ? 'Full Organization Visibility' : 'Private to This Account Only'}</span>
          </div>
        </div>

        <!-- Multiple User Accounts in One Time Switcher -->
        <div class="auth-accounts-section">
          <div class="auth-accounts-title">
            <span>Switch Active Account</span>
            <span style="font-size: 0.72rem; font-weight: normal; color: var(--text-muted);">${allUsers.length} available</span>
          </div>

          <div class="accounts-list-container">
            ${allUsers.map(u => {
              const isCurrent = u.id === currentUser.id;
              const isUserAdmin = u.role === 'admin';
              return `
                <div class="auth-user-card ${isCurrent ? 'active-user' : ''}">
                  <div class="auth-user-left">
                    <div class="auth-user-avatar" style="background-color: ${u.color || '#059669'};">
                      ${u.avatar}
                    </div>
                    <div class="auth-user-details">
                      <span class="auth-user-name">${u.name} ${isUserAdmin ? '👑' : ''}</span>
                      <span class="auth-user-sub">@${u.username}</span>
                    </div>
                  </div>
                  <div>
                    ${isCurrent ? `
                      <span class="badge-active-tag">Active</span>
                    ` : `
                      <button type="button" class="btn-switch-user" data-switch-id="${u.id}">
                        Switch
                      </button>
                    `}
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <button type="button" id="btn-add-account" class="btn-add-account-outline">
            <span>➕</span> Log In / Add Another Account
          </button>
        </div>

        <div class="profile-modal-actions">
          <button id="modal-logout-btn" class="btn-danger-solid btn-full-width">
            <span>🚪</span> Sign Out of Account
          </button>
        </div>
      </div>
    `;
  }

  attachEvents() {
    const modal = document.getElementById('google-auth-modal');
    if (!modal) return;

    const closeBtn = modal.querySelector('#close-profile-modal-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.close();
    });

    // Fast switch user
    const switchBtns = modal.querySelectorAll('.btn-switch-user');
    switchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const userId = btn.getAttribute('data-switch-id');
        const res = store.switchUser(userId);
        if (res.success) {
          this.close();
          this.onShowToast(`Switched account to ${res.user.name}`, 'success');
          this.onUserSwitched(res.user);
        }
      });
    });

    // Add another account
    const addAccountBtn = modal.querySelector('#btn-add-account');
    if (addAccountBtn) {
      addAccountBtn.addEventListener('click', () => {
        this.close();
        store.logout();
        this.onShowToast('Sign in or register another account.', 'info');
        this.onLogout();
      });
    }

    // Sign out
    const logoutBtn = modal.querySelector('#modal-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.close();
        store.logout();
        this.onLogout();
      });
    }
  }
}
