import { store } from '../data/store.js';

export class HomeView {
  constructor(options = {}) {
    this.container = options.container;
    this.onNavigate = options.onNavigate || (() => {});
  }

  mount() {
    this.render();
    this.attachEvents();
  }

  render() {
    const stats = store.getStats();
    const recentChecks = store.getChecksForCurrentUser().slice(0, 3);

    this.container.innerHTML = `
      <div class="screen-view home-screen-view">
        <!-- Hero Green Card -->
        <div class="hero-banner-card">
          <div class="hero-badge">
            <span class="hero-badge-icon">🛡️</span>
            <span>Food Verification Platform</span>
          </div>
          <h2 class="hero-heading">Check what you<br/>actually received.</h2>
          <p class="hero-description">
            Verify food quantity, scan quality with AI, and build complaint reports — all in one place.
          </p>
        </div>

        <!-- 3 Stats Cards Row -->
        <div class="stats-cards-row">
          <!-- Card 1: Checks -->
          <div class="stat-box-card" id="stat-card-checks">
            <div class="stat-icon-wrapper">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div class="stat-number-val">${stats.totalChecks}</div>
            <div class="stat-title-label">Checks</div>
          </div>

          <!-- Card 2: Issues Found -->
          <div class="stat-box-card" id="stat-card-issues">
            <div class="stat-icon-wrapper icon-wrap-growth">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
            </div>
            <div class="stat-number-val">${stats.issuesCount}</div>
            <div class="stat-title-label">Issues Found</div>
          </div>

          <!-- Card 3: Avg Quality -->
          <div class="stat-box-card" id="stat-card-quality">
            <div class="stat-icon-wrapper icon-wrap-camera">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <div class="stat-number-val">${stats.avgQuality}</div>
            <div class="stat-title-label">Avg Quality</div>
          </div>
        </div>

        <!-- Quality Trend Section -->
        <div class="content-section-card">
          <div class="section-title-row">
            <h3 class="section-main-title">Quality Trend</h3>
            <button class="section-link-btn" id="view-all-trend-btn">View All Records &rarr;</button>
          </div>
          
          <!-- Quality Distribution Bars -->
          <div class="trend-visual-container">
            <div class="trend-bar-col">
              <div class="trend-bar-fill fill-peak" style="height: 85%;"></div>
              <span class="trend-bar-label">Mon</span>
            </div>
            <div class="trend-bar-col">
              <div class="trend-bar-fill fill-good" style="height: 60%;"></div>
              <span class="trend-bar-label">Tue</span>
            </div>
            <div class="trend-bar-col">
              <div class="trend-bar-fill fill-peak" style="height: 95%;"></div>
              <span class="trend-bar-label">Wed</span>
            </div>
            <div class="trend-bar-col">
              <div class="trend-bar-fill fill-defect" style="height: 45%;"></div>
              <span class="trend-bar-label">Thu</span>
            </div>
            <div class="trend-bar-col">
              <div class="trend-bar-fill fill-peak" style="height: 90%;"></div>
              <span class="trend-bar-label">Fri</span>
            </div>
            <div class="trend-bar-col">
              <div class="trend-bar-fill fill-good" style="height: 75%;"></div>
              <span class="trend-bar-label">Sat</span>
            </div>
            <div class="trend-bar-col">
              <div class="trend-bar-fill fill-peak" style="height: 92%;"></div>
              <span class="trend-bar-label">Today</span>
            </div>
          </div>

          <div class="trend-legend-row">
            <span class="legend-item"><span class="legend-dot dot-peak"></span> Fresh / Optimal (&gt;80%)</span>
            <span class="legend-item"><span class="legend-dot dot-good"></span> Acceptable (60-80%)</span>
            <span class="legend-item"><span class="legend-dot dot-defect"></span> Issue / Defect (&lt;60%)</span>
          </div>
        </div>

        <!-- Quick Start Action Tiles -->
        <div class="content-section-card">
          <h3 class="section-main-title">Quick Verifications</h3>
          <div class="quick-tiles-grid">
            <button class="quick-action-tile" data-nav="quantity">
              <div class="tile-icon-bg bg-emerald">⚖️</div>
              <div class="tile-info">
                <strong>Check Quantity</strong>
                <span>Weigh or count grocery items vs order bill</span>
              </div>
              <span class="tile-arrow">&rsaquo;</span>
            </button>

            <button class="quick-action-tile" data-nav="quality">
              <div class="tile-icon-bg bg-mint">📷</div>
              <div class="tile-info">
                <strong>Scan Quality with AI</strong>
                <span>Instant freshness, defects, & shelf-life scan</span>
              </div>
              <span class="tile-arrow">&rsaquo;</span>
            </button>

            <button class="quick-action-tile" data-nav="order">
              <div class="tile-icon-bg bg-cyan">📋</div>
              <div class="tile-info">
                <strong>Verify Delivery Order</strong>
                <span>Multi-item grocery order verification</span>
              </div>
              <span class="tile-arrow">&rsaquo;</span>
            </button>
          </div>
        </div>

        <!-- Recent Records Activity Feed -->
        <div class="content-section-card">
          <div class="section-title-row">
            <h3 class="section-main-title">Recent Activity</h3>
            <button class="section-link-btn" data-nav="history">History</button>
          </div>

          <div class="recent-list">
            ${recentChecks.map(chk => `
              <div class="recent-item-card">
                <div class="recent-item-left">
                  <span class="recent-type-icon">${chk.type === 'Quantity' ? '⚖️' : '📷'}</span>
                  <div>
                    <strong class="recent-item-name">${chk.productName}</strong>
                    <span class="recent-item-time">${new Date(chk.timestamp).toLocaleDateString()} • ${chk.type} Check</span>
                  </div>
                </div>
                <div class="recent-item-right">
                  ${chk.type === 'Quantity' ? `
                    <span class="badge-status ${chk.status === 'Shortage' ? 'badge-shortage' : 'badge-match'}">
                      ${chk.status === 'Shortage' ? `${chk.difference}${chk.unit}` : 'Matched'}
                    </span>
                  ` : `
                    <span class="badge-status ${chk.qualityScore >= 80 ? 'badge-fresh' : 'badge-shortage'}">
                      ${chk.qualityScore}% Quality
                    </span>
                  `}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    const navButtons = this.container.querySelectorAll('[data-nav]');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-nav');
        this.onNavigate(target);
      });
    });

    const viewAllTrend = this.container.querySelector('#view-all-trend-btn');
    if (viewAllTrend) {
      viewAllTrend.addEventListener('click', () => {
        this.onNavigate('history');
      });
    }
  }
}
