import { store } from '../data/store.js';

function getPasswordInputWithToggle(id, placeholder, extraClass = '') {
  return `
    <div class="password-input-wrapper">
      <input 
        type="password" 
        id="${id}" 
        class="custom-text-input ${extraClass}" 
        placeholder="${placeholder}" 
        autocomplete="off"
        required 
      />
      <button type="button" class="btn-password-toggle" data-target="${id}" title="Show password" aria-label="Toggle password visibility">
        <svg class="eye-icon eye-open" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <svg class="eye-icon eye-closed hidden" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
      </button>
    </div>
  `;
}

export class LoginView {
  constructor(options = {}) {
    this.container = options.container;
    this.onLoginSuccess = options.onLoginSuccess || (() => {});
    this.onShowToast = options.onShowToast || (() => {});
    this.activeLoginTab = 'user'; // 'user' or 'admin'
    this.isRegistering = false;
    this.errorMessage = '';
  }

  mount() {
    this.render();
    this.attachEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="login-portal-wrapper">
        <div class="login-portal-card">
          <!-- Logo & Platform Branding -->
          <div class="login-brand-header">
            <div class="login-brand-icon">🌿</div>
            <h1 class="login-app-title">Food Verification Platform</h1>
            <p class="login-app-subtitle">Secure access to verify food quantities, quality, and reports.</p>
          </div>

          <!-- Two Separate Login Pathway Tabs -->
          <div class="login-tab-switcher">
            <button class="login-tab-btn ${this.activeLoginTab === 'user' ? 'active' : ''}" id="tab-user-login">
              <span>👤</span> User / Staff Login
            </button>
            <button class="login-tab-btn ${this.activeLoginTab === 'admin' ? 'active' : ''}" id="tab-admin-login">
              <span>👑</span> Administrator Login
            </button>
          </div>

          ${this.errorMessage ? `
            <div class="login-error-banner">
              <span>⚠️</span> <span>${this.errorMessage}</span>
            </div>
          ` : ''}

          <!-- Pathway 1: Regular User Login (Username & Password) -->
          <div class="login-pathway-content ${this.activeLoginTab === 'user' ? '' : 'hidden'}" id="user-login-section">
            ${!this.isRegistering ? `
              <!-- User Sign In Form -->
              <form id="user-login-form" class="auth-form-card" autocomplete="off">
                <div class="form-input-group">
                  <label class="input-label-text" for="user-identifier-input">Username or Email</label>
                  <input 
                    type="text" 
                    id="user-identifier-input" 
                    class="custom-text-input" 
                    placeholder="Enter your username or email" 
                    autocomplete="off"
                    required 
                  />
                </div>

                <div class="form-input-group">
                  <label class="input-label-text" for="user-password-input">Password</label>
                  ${getPasswordInputWithToggle('user-password-input', 'Enter your password')}
                </div>

                <button type="submit" class="btn-primary-mint btn-login-submit">
                  <span>🔐</span> Sign In to My Account
                </button>

                <div class="form-toggle-footer">
                  <span>Don't have an account?</span>
                  <button type="button" id="btn-toggle-signup" class="btn-link-action">Register New Account</button>
                </div>
              </form>
            ` : `
              <!-- User Registration Form -->
              <form id="user-register-form" class="auth-form-card" autocomplete="off">
                <h4 class="form-subheading">Create New Staff Account</h4>
                <div class="form-input-group">
                  <label class="input-label-text" for="reg-name-input">Full Name</label>
                  <input type="text" id="reg-name-input" class="custom-text-input" placeholder="Enter your full name" autocomplete="off" required />
                </div>

                <div class="form-input-group">
                  <label class="input-label-text" for="reg-username-input">Username</label>
                  <input type="text" id="reg-username-input" class="custom-text-input" placeholder="Choose a username" autocomplete="off" required />
                </div>

                <div class="form-input-group">
                  <label class="input-label-text" for="reg-email-input">Email Address</label>
                  <input type="email" id="reg-email-input" class="custom-text-input" placeholder="Enter your email address" autocomplete="off" required />
                </div>

                <div class="form-input-group">
                  <label class="input-label-text" for="reg-password-input">Password</label>
                  ${getPasswordInputWithToggle('reg-password-input', 'Create a secure password')}
                </div>

                <button type="submit" class="btn-primary-mint btn-login-submit">
                  <span>✨</span> Register & Sign In
                </button>

                <div class="form-toggle-footer">
                  <span>Already have an account?</span>
                  <button type="button" id="btn-toggle-signin" class="btn-link-action">Back to Sign In</button>
                </div>
              </form>
            `}
          </div>

          <!-- Pathway 2: Administrator Login (Dedicated Admin Credentials) -->
          <div class="login-pathway-content ${this.activeLoginTab === 'admin' ? '' : 'hidden'}" id="admin-login-section">
            <div class="admin-login-box">
              <div class="admin-login-header">
                <div class="admin-crown-large">👑</div>
                <h3 class="admin-login-heading">Administrator Portal</h3>
                <p class="admin-login-sub">Enter administrator credentials to access the Organization Overseer Hub.</p>
              </div>

              <form id="admin-login-form" autocomplete="off">
                <div class="form-input-group">
                  <label class="input-label-text" for="admin-identifier-input">Admin Username or Email</label>
                  <input 
                    type="text" 
                    id="admin-identifier-input" 
                    class="custom-text-input" 
                    placeholder="Enter admin username" 
                    autocomplete="off"
                    required 
                  />
                </div>

                <div class="form-input-group">
                  <label class="input-label-text" for="admin-password-input">Admin Security Password</label>
                  ${getPasswordInputWithToggle('admin-password-input', 'Enter admin password')}
                </div>

                <button type="submit" class="btn-admin-submit">
                  <span>👑 Sign In to Admin Overseer Hub</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    // Pathway Tabs
    const tabUser = this.container.querySelector('#tab-user-login');
    const tabAdmin = this.container.querySelector('#tab-admin-login');

    if (tabUser) {
      tabUser.addEventListener('click', () => {
        this.activeLoginTab = 'user';
        this.errorMessage = '';
        this.render();
        this.attachEvents();
      });
    }

    if (tabAdmin) {
      tabAdmin.addEventListener('click', () => {
        this.activeLoginTab = 'admin';
        this.errorMessage = '';
        this.render();
        this.attachEvents();
      });
    }

    // Toggle between user sign-in and registration
    const btnToggleSignup = this.container.querySelector('#btn-toggle-signup');
    if (btnToggleSignup) {
      btnToggleSignup.addEventListener('click', () => {
        this.isRegistering = true;
        this.errorMessage = '';
        this.render();
        this.attachEvents();
      });
    }

    const btnToggleSignin = this.container.querySelector('#btn-toggle-signin');
    if (btnToggleSignin) {
      btnToggleSignin.addEventListener('click', () => {
        this.isRegistering = false;
        this.errorMessage = '';
        this.render();
        this.attachEvents();
      });
    }

    // Attach Password Visibility Toggles ("See Password")
    const toggleBtns = this.container.querySelectorAll('.btn-password-toggle');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target');
        const input = this.container.querySelector(`#${targetId}`);
        if (!input) return;

        const eyeOpen = btn.querySelector('.eye-open');
        const eyeClosed = btn.querySelector('.eye-closed');

        if (input.type === 'password') {
          input.type = 'text';
          btn.setAttribute('title', 'Hide password');
          btn.setAttribute('aria-label', 'Hide password');
          if (eyeOpen) eyeOpen.classList.add('hidden');
          if (eyeClosed) eyeClosed.classList.remove('hidden');
        } else {
          input.type = 'password';
          btn.setAttribute('title', 'Show password');
          btn.setAttribute('aria-label', 'Show password');
          if (eyeOpen) eyeOpen.classList.remove('hidden');
          if (eyeClosed) eyeClosed.classList.add('hidden');
        }
        input.focus();
      });
    });

    // User Login Form Submit
    const userForm = this.container.querySelector('#user-login-form');
    if (userForm) {
      userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const identifier = this.container.querySelector('#user-identifier-input').value.trim();
        const password = this.container.querySelector('#user-password-input').value.trim();

        const res = store.authenticateUser(identifier, password);
        if (res.success) {
          this.errorMessage = '';
          this.onShowToast(`Welcome, ${res.user.name}! Accessing your account.`, 'success');
          this.onLoginSuccess(res.user);
        } else {
          this.errorMessage = res.error;
          this.render();
          this.attachEvents();
        }
      });
    }

    // User Register Form Submit
    const registerForm = this.container.querySelector('#user-register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = this.container.querySelector('#reg-name-input').value.trim();
        const username = this.container.querySelector('#reg-username-input').value.trim();
        const email = this.container.querySelector('#reg-email-input').value.trim();
        const password = this.container.querySelector('#reg-password-input').value.trim();

        const res = store.registerUser({ name, username, email, password });
        if (res.success) {
          this.errorMessage = '';
          this.onShowToast(`Account created for ${res.user.name}!`, 'success');
          this.onLoginSuccess(res.user);
        } else {
          this.errorMessage = res.error;
          this.render();
          this.attachEvents();
        }
      });
    }

    // Admin Login Form Submit
    const adminForm = this.container.querySelector('#admin-login-form');
    if (adminForm) {
      adminForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const identifier = this.container.querySelector('#admin-identifier-input').value.trim();
        const password = this.container.querySelector('#admin-password-input').value.trim();

        const res = store.authenticateAdmin(identifier, password);
        if (res.success) {
          this.errorMessage = '';
          this.onShowToast(`Authenticated as Administrator! Accessing Overseer Hub.`, 'success');
          this.onLoginSuccess(res.admin);
        } else {
          this.errorMessage = res.error;
          this.render();
          this.attachEvents();
        }
      });
    }
  }
}
