import './style.css';
import { store } from './data/store.js';
import { LoginView } from './modules/loginView.js';
import { HomeView } from './modules/homeView.js';
import { QuantityView } from './modules/quantityView.js';
import { QualityView } from './modules/qualityView.js';
import { OrderView } from './modules/orderView.js';
import { HistoryView } from './modules/historyView.js';
import { ComplaintsView } from './modules/complaintsView.js';
import { AdminView } from './modules/adminView.js';
import { AuthModal } from './modules/authModal.js';

class App {
  constructor() {
    this.activeTab = 'home';
    this.views = {};
    this.authModal = null;
    this.loginView = null;
    this.toastContainer = null;
  }

  init() {
    const initialTheme = store.getTheme();
    document.documentElement.setAttribute('data-theme', initialTheme);

    this.checkSessionAndRender();

    // Subscribe to store updates
    store.subscribe(() => {
      this.checkSessionAndRender();
    });
  }

  checkSessionAndRender() {
    if (!store.isLoggedIn()) {
      this.renderLoginScreen();
    } else {
      this.renderAuthenticatedApp();
    }
  }

  renderLoginScreen() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div id="login-container"></div>
      <div id="toast-container" class="toast-msg-container"></div>
    `;

    this.toastContainer = document.getElementById('toast-container');
    this.loginView = new LoginView({
      container: document.getElementById('login-container'),
      onLoginSuccess: (user) => {
        this.activeTab = user.role === 'admin' ? 'admin' : 'home';
        this.checkSessionAndRender();
      },
      onShowToast: (msg, type) => this.showToast(msg, type)
    });
    this.loginView.mount();
  }

  renderAuthenticatedApp() {
    const user = store.getCurrentUser();
    const isAdmin = store.isAdmin();

    const app = document.getElementById('app');
    app.innerHTML = `
      <!-- Top Platform Header matching Screenshots -->
      <header class="platform-header">
        <div class="header-inner-row">
          <!-- Left Slot: Profile (on Home) or Back Arrow + Title (on Subpages) -->
          <div class="header-left-slot" id="header-left-content"></div>

          <!-- Right Slot: Dark Mode Moon Icon, Account Switcher, and Logout -->
          <div class="header-right-slot">
            <button id="theme-toggle-btn" class="icon-header-btn" title="Toggle Dark/Light Mode">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </button>
            <button id="profile-btn" class="icon-header-btn" title="Switch User Profile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
            <button id="logout-btn" class="btn-header-logout" title="Sign Out">
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content Scroll Area -->
      <main class="main-content-scroll">
        <div id="view-home" class="screen-view active"></div>
        <div id="view-quantity" class="screen-view hidden"></div>
        <div id="view-quality" class="screen-view hidden"></div>
        <div id="view-order" class="screen-view hidden"></div>
        <div id="view-history" class="screen-view hidden"></div>
        <div id="view-complaints" class="screen-view hidden"></div>
        <div id="view-admin" class="screen-view hidden"></div>
      </main>

      <!-- Fixed Bottom Navigation Bar -->
      <nav class="fixed-bottom-nav">
        <div class="bottom-nav-inner" id="bottom-nav-inner-container"></div>
      </nav>

      <!-- Toast Container -->
      <div id="toast-container" class="toast-msg-container"></div>
    `;

    this.toastContainer = document.getElementById('toast-container');
    this.renderBottomNav();
    this.initViews();
    this.attachNavigation();
    this.updateHeader();

    // Default view
    if (isAdmin && this.activeTab !== 'admin') {
      this.switchTab('admin');
    } else if (!isAdmin && this.activeTab === 'admin') {
      this.switchTab('home');
    } else {
      this.switchTab(this.activeTab);
    }
  }

  renderBottomNav() {
    const navInner = document.getElementById('bottom-nav-inner-container');
    if (!navInner) return;

    const isAdmin = store.isAdmin();

    navInner.innerHTML = `
      <button class="bottom-nav-item ${this.activeTab === 'home' ? 'active' : ''}" data-tab="home">
        <div class="nav-icon-pill">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <span class="nav-item-label">Home</span>
      </button>

      <button class="bottom-nav-item ${this.activeTab === 'quantity' ? 'active' : ''}" data-tab="quantity">
        <div class="nav-icon-pill">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
            <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
            <path d="M7 21h10"/>
            <path d="M12 3v18"/>
            <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
          </svg>
        </div>
        <span class="nav-item-label">Quantity</span>
      </button>

      <button class="bottom-nav-item ${this.activeTab === 'quality' ? 'active' : ''}" data-tab="quality">
        <div class="nav-icon-pill">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </div>
        <span class="nav-item-label">Quality</span>
      </button>

      <button class="bottom-nav-item ${this.activeTab === 'order' ? 'active' : ''}" data-tab="order">
        <div class="nav-icon-pill">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            <line x1="9" y1="12" x2="15" y2="12"/>
            <line x1="9" y1="16" x2="13" y2="16"/>
          </svg>
        </div>
        <span class="nav-item-label">Order</span>
      </button>

      <button class="bottom-nav-item ${this.activeTab === 'history' ? 'active' : ''}" data-tab="history">
        <div class="nav-icon-pill">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
            <polyline points="12 7 12 12 15 15"/>
          </svg>
        </div>
        <span class="nav-item-label">History</span>
      </button>

      <button class="bottom-nav-item ${this.activeTab === 'complaints' ? 'active' : ''}" data-tab="complaints">
        <div class="nav-icon-pill">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="12" y1="18" x2="12" y2="12"/>
            <line x1="12" y1="9" x2="12.01" y2="9"/>
          </svg>
        </div>
        <span class="nav-item-label">Complaints</span>
      </button>

      ${isAdmin ? `
        <button class="bottom-nav-item ${this.activeTab === 'admin' ? 'active' : ''}" data-tab="admin">
          <div class="nav-icon-pill" style="color: #8b5cf6;">
            👑
          </div>
          <span class="nav-item-label" style="color: #8b5cf6; font-weight: 700;">Admin Hub</span>
        </button>
      ` : ''}
    `;

    // Attach click events
    const navButtons = navInner.querySelectorAll('.bottom-nav-item');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });
  }

  initViews() {
    const handleNavigate = (tabName, prefillData = null) => {
      this.switchTab(tabName, prefillData);
    };

    const handleToast = (msg, type = 'info') => {
      this.showToast(msg, type);
    };

    this.authModal = new AuthModal({
      onUserSwitched: (user) => {
        this.updateHeader();
        this.renderBottomNav();
        if (user.role === 'admin') {
          this.switchTab('admin');
        } else {
          this.switchTab('home');
        }
      },
      onLogout: () => {
        this.checkSessionAndRender();
      },
      onShowToast: handleToast
    });
    this.authModal.mount();

    this.views = {
      home: new HomeView({
        container: document.getElementById('view-home'),
        onNavigate: handleNavigate
      }),
      quantity: new QuantityView({
        container: document.getElementById('view-quantity'),
        onNavigate: handleNavigate,
        onShowToast: handleToast
      }),
      quality: new QualityView({
        container: document.getElementById('view-quality'),
        onNavigate: handleNavigate,
        onShowToast: handleToast
      }),
      order: new OrderView({
        container: document.getElementById('view-order'),
        onNavigate: handleNavigate,
        onShowToast: handleToast
      }),
      history: new HistoryView({
        container: document.getElementById('view-history'),
        onNavigate: handleNavigate,
        onShowToast: handleToast
      }),
      complaints: new ComplaintsView({
        container: document.getElementById('view-complaints'),
        onNavigate: handleNavigate,
        onShowToast: handleToast
      }),
      admin: new AdminView({
        container: document.getElementById('view-admin'),
        onNavigate: handleNavigate,
        onShowToast: handleToast
      })
    };

    // Mount all views
    Object.values(this.views).forEach(v => v.mount());
  }

  attachNavigation() {
    // Theme toggle button
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const nextTheme = store.toggleTheme();
        this.showToast(`Switched to ${nextTheme} mode`, 'info');
      });
    }

    // Profile button (opens Google account switcher)
    const profileBtn = document.getElementById('profile-btn');
    if (profileBtn) {
      profileBtn.addEventListener('click', () => {
        this.authModal.open();
      });
    }

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        store.logout();
        this.showToast('Logged out successfully', 'info');
      });
    }
  }

  updateHeader() {
    const headerLeft = document.getElementById('header-left-content');
    if (!headerLeft) return;

    const user = store.getCurrentUser();
    const isAdmin = user.role === 'admin';

    if (this.activeTab === 'home' || this.activeTab === 'admin') {
      headerLeft.innerHTML = `
        <div class="user-avatar-circle" style="background-color: ${user.color || '#00a86b'}; cursor: pointer;" id="avatar-click-target" title="Switch User Account">
          ${user.avatar}
        </div>
        <div class="user-text-meta" style="cursor: pointer;" id="meta-click-target" title="Switch User Account">
          <span class="user-name-title">${user.name}</span>
          <span class="user-sub-label" style="color: ${isAdmin ? '#8b5cf6' : 'var(--brand-green-primary)'}">
            ${isAdmin ? '👑 ADMIN OVERSEER' : user.tag}
          </span>
        </div>
      `;

      const avatarTarget = document.getElementById('avatar-click-target');
      const metaTarget = document.getElementById('meta-click-target');
      const openModal = () => this.authModal.open();
      if (avatarTarget) avatarTarget.addEventListener('click', openModal);
      if (metaTarget) metaTarget.addEventListener('click', openModal);
    } else {
      const titles = {
        quantity: 'Quantity',
        quality: 'Quality',
        order: 'Order',
        history: 'History',
        complaints: 'Complaints',
        admin: 'Admin Overseer Hub'
      };
      const title = titles[this.activeTab] || 'Verification';

      headerLeft.innerHTML = `
        <button id="header-back-btn" class="subpage-back-arrow" title="Back to Home">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
        </button>
        <h3 class="subpage-header-title">${title}</h3>
      `;

      const backBtn = document.getElementById('header-back-btn');
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          this.switchTab(isAdmin ? 'admin' : 'home');
        });
      }
    }
  }

  switchTab(tabName, prefillData = null) {
    if (!this.views[tabName]) return;

    if (this.activeTab === 'quality' && tabName !== 'quality') {
      this.views.quality.stopCamera();
    }

    this.activeTab = tabName;

    // Update bottom nav active state
    const navButtons = document.querySelectorAll('.bottom-nav-item');
    navButtons.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Switch view containers
    const viewContainers = {
      home: document.getElementById('view-home'),
      quantity: document.getElementById('view-quantity'),
      quality: document.getElementById('view-quality'),
      order: document.getElementById('view-order'),
      history: document.getElementById('view-history'),
      complaints: document.getElementById('view-complaints'),
      admin: document.getElementById('view-admin')
    };

    Object.keys(viewContainers).forEach(k => {
      if (viewContainers[k]) {
        if (k === tabName) {
          viewContainers[k].classList.remove('hidden');
          viewContainers[k].classList.add('active');
        } else {
          viewContainers[k].classList.add('hidden');
          viewContainers[k].classList.remove('active');
        }
      }
    });

    if (tabName === 'complaints' && prefillData) {
      this.views.complaints.setPrefill(prefillData);
    } else {
      this.views[tabName].render();
      this.views[tabName].attachEvents();
    }

    this.updateHeader();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showToast(message, type = 'info') {
    if (!this.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast-item';
    const icon = type === 'success' ? '✅' : (type === 'warn' ? '⚠️' : 'ℹ️');
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
