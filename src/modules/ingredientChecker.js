import { ALLERGENS, PRESET_PACKAGED_FOODS } from '../data/allergensData.js';
import { ADDITIVES_DB, findAdditive } from '../data/additivesData.js';
import { sound } from '../utils/audio.js';

export class IngredientChecker {
  constructor(options = {}) {
    this.container = options.container;
    this.onAddToPantry = options.onAddToPantry || (() => {});
    
    // Default user allergen profile from localStorage or defaults
    this.userPreferences = this.loadPreferences();
    this.currentFood = PRESET_PACKAGED_FOODS[0];
  }

  loadPreferences() {
    try {
      const saved = localStorage.getItem('smartfood_allergen_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      gluten: true,
      dairy: false,
      peanuts: true,
      tree_nuts: false,
      soy: false,
      eggs: false,
      fish_shellfish: false,
      vegan: false
    };
  }

  savePreferences() {
    try {
      localStorage.setItem('smartfood_allergen_profile', JSON.stringify(this.userPreferences));
    } catch (e) {}
  }

  mount() {
    this.render();
    this.attachEvents();
    this.analyzeCurrentFood();
  }

  render() {
    this.container.innerHTML = `
      <div class="checker-layout">
        <!-- Top Banner: User Dietary Profile & Allergen Filter -->
        <div class="glass-panel profile-banner-card">
          <div class="profile-header">
            <div>
              <span class="badge badge-tech"><i class="icon-shield"></i> PERSONALIZED SAFETY</span>
              <h2 class="panel-title">My Allergen & Dietary Safeguards</h2>
              <p class="panel-subtitle">Toggle your allergies and dietary goals. Products with matching ingredients will be flagged immediately.</p>
            </div>
          </div>
          <div class="profile-toggles-grid" id="profile-toggles">
            ${ALLERGENS.slice(0, 7).map(allergen => `
              <button class="allergen-toggle-btn ${this.userPreferences[allergen.id] ? 'active' : ''}" data-allergen="${allergen.id}">
                <span class="allergen-icon">${allergen.icon}</span>
                <span class="allergen-name">${allergen.name}</span>
                <span class="toggle-indicator">${this.userPreferences[allergen.id] ? 'AVOID' : 'ALLOW'}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Main Workspace: Scanner / Input & Presets on Left, Detailed Health Report on Right -->
        <div class="checker-grid">
          <!-- Left Column: Input and Preset Selector -->
          <div class="glass-panel input-panel-card">
            <div class="panel-header">
              <div>
                <span class="badge badge-emerald">BARCODE & OCR INPUT</span>
                <h3 class="panel-title">Inspect Ingredients</h3>
              </div>
            </div>

            <!-- Preset Packaged Products Carousel/Buttons -->
            <div class="preset-products-section">
              <label class="form-label">Select Packaged Food to Inspect:</label>
              <div class="product-selector-list">
                ${PRESET_PACKAGED_FOODS.map(item => `
                  <button class="product-select-card ${item.id === this.currentFood.id ? 'active' : ''}" data-id="${item.id}">
                    <div class="prod-badge-row">
                      <span class="score-badge score-${item.nutriScore.toLowerCase()}">Nutri-Score ${item.nutriScore}</span>
                      <span class="nova-badge">NOVA ${item.novaGroup}</span>
                    </div>
                    <div class="prod-info">
                      <strong class="prod-name">${item.name}</strong>
                      <span class="prod-brand">${item.brand}</span>
                    </div>
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="divider-text"><span>OR PASTE INGREDIENT LIST</span></div>

            <!-- Custom Ingredient Text Area -->
            <div class="form-group">
              <label for="custom-ingredients-input" class="form-label">Ingredient Label OCR / Text:</label>
              <textarea id="custom-ingredients-input" class="form-textarea" rows="4" placeholder="Paste ingredients list (e.g. Wheat flour, sugar, sodium nitrite E250, soy lecithin...)">${this.currentFood.ingredientsText}</textarea>
            </div>

            <div class="input-actions-row">
              <button id="scan-ingredients-btn" class="btn btn-primary glow-cyan">
                <span class="btn-icon">🔍</span> Scan & Verify Safety
              </button>
              <button id="clear-ingredients-btn" class="btn btn-glass">Clear</button>
            </div>

            <!-- Quick Additive Lookup Bar -->
            <div class="additive-search-box">
              <label class="form-label">Additive / E-Number Instant Dictionary:</label>
              <div class="search-input-wrap">
                <input type="text" id="additive-search-input" class="form-input" placeholder="Search E250, MSG, Aspartame, E407..." />
                <button id="additive-search-btn" class="btn btn-sm btn-glass">Lookup</button>
              </div>
              <div id="additive-lookup-result" class="additive-quick-card hidden"></div>
            </div>
          </div>

          <!-- Right Column: Safety Diagnostic & Classification -->
          <div class="glass-panel results-panel-card" id="checker-results-panel">
            <div class="panel-header">
              <div>
                <span class="badge badge-accent">SAFETY EVALUATION</span>
                <h2 class="panel-title" id="food-product-title">${this.currentFood.name}</h2>
                <span class="text-muted" id="food-product-brand">${this.currentFood.brand}</span>
              </div>
              <button id="add-packaged-pantry-btn" class="btn btn-sm btn-accent">
                <span class="btn-icon">➕</span> Add to Pantry
              </button>
            </div>

            <!-- Scores Overview: Nutri-Score & NOVA System -->
            <div class="classification-scores-row">
              <!-- Nutri-Score Gauge -->
              <div class="nutri-score-card">
                <span class="score-card-title">Nutri-Score Rating</span>
                <div class="nutri-bar">
                  <span class="nutri-step step-a ${this.currentFood.nutriScore === 'A' ? 'active' : ''}">A</span>
                  <span class="nutri-step step-b ${this.currentFood.nutriScore === 'B' ? 'active' : ''}">B</span>
                  <span class="nutri-step step-c ${this.currentFood.nutriScore === 'C' ? 'active' : ''}">C</span>
                  <span class="nutri-step step-d ${this.currentFood.nutriScore === 'D' ? 'active' : ''}">D</span>
                  <span class="nutri-step step-e ${this.currentFood.nutriScore === 'E' ? 'active' : ''}">E</span>
                </div>
                <span class="score-desc" id="nutri-desc">Overall nutritional quality score based on sugar, salt, and fat profiles.</span>
              </div>

              <!-- NOVA Ultra-Processing Gauge -->
              <div class="nova-card">
                <span class="score-card-title">NOVA Processing Index</span>
                <div class="nova-hero-box">
                  <span class="nova-num" id="nova-num">Group ${this.currentFood.novaGroup}</span>
                  <span class="nova-desc" id="nova-desc">${this.currentFood.novaLabel}</span>
                </div>
              </div>
            </div>

            <!-- Allergen Alerts Warning Box -->
            <div class="alert-box-container" id="allergen-alerts-container">
              <!-- Dynamically populated -->
            </div>

            <!-- Additive & E-Number Findings Breakdown -->
            <div class="diagnostic-section">
              <h3 class="section-heading">Detected Additives & Chemical Preservatives</h3>
              <div class="additives-list" id="additives-detected-list">
                <!-- Dynamically populated -->
              </div>
            </div>

            <!-- Nutrition Highlights -->
            <div class="diagnostic-section" id="nutrition-facts-section">
              <h3 class="section-heading">Key Nutrition per 100g</h3>
              <div class="nutrition-pill-grid" id="nutrition-pills">
                <!-- Dynamically populated -->
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    // Allergen toggles
    const toggleBtns = this.container.querySelectorAll('.allergen-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        const id = btn.getAttribute('data-allergen');
        this.userPreferences[id] = !this.userPreferences[id];
        this.savePreferences();

        btn.classList.toggle('active', this.userPreferences[id]);
        btn.querySelector('.toggle-indicator').textContent = this.userPreferences[id] ? 'AVOID' : 'ALLOW';
        this.analyzeCurrentFood();
      });
    });

    // Preset selector
    const productCards = this.container.querySelectorAll('.product-select-card');
    productCards.forEach(card => {
      card.addEventListener('click', () => {
        sound.playClick();
        const id = card.getAttribute('data-id');
        const found = PRESET_PACKAGED_FOODS.find(p => p.id === id);
        if (found) {
          this.currentFood = found;
          productCards.forEach(c => c.classList.remove('active'));
          card.classList.add('active');

          const textarea = this.container.querySelector('#custom-ingredients-input');
          textarea.value = found.ingredientsText;

          this.analyzeCurrentFood();
        }
      });
    });

    // Custom scan button
    const scanBtn = this.container.querySelector('#scan-ingredients-btn');
    const textarea = this.container.querySelector('#custom-ingredients-input');
    scanBtn.addEventListener('click', () => {
      sound.playClick();
      const text = textarea.value.trim();
      if (!text) {
        alert('Please paste or type ingredients into the box first.');
        return;
      }
      this.currentFood = {
        id: 'custom-' + Date.now(),
        name: 'Custom Scanned Product',
        brand: 'User Custom Scan',
        barcode: 'N/A',
        category: 'Scanned Item',
        novaGroup: this.estimateNovaGroup(text),
        novaLabel: this.getNovaLabel(this.estimateNovaGroup(text)),
        nutriScore: this.estimateNutriScore(text),
        ingredientsText: text,
        nutritionPer100g: null,
        warnings: []
      };
      this.analyzeCurrentFood();
    });

    // Clear button
    const clearBtn = this.container.querySelector('#clear-ingredients-btn');
    clearBtn.addEventListener('click', () => {
      sound.playClick();
      textarea.value = '';
      textarea.focus();
    });

    // Additive search
    const addSearchInput = this.container.querySelector('#additive-search-input');
    const addSearchBtn = this.container.querySelector('#additive-search-btn');
    const addResultBox = this.container.querySelector('#additive-lookup-result');

    const handleLookup = () => {
      const q = addSearchInput.value.trim();
      if (!q) return;
      sound.playClick();
      const found = findAdditive(q);
      if (found) {
        addResultBox.classList.remove('hidden');
        addResultBox.innerHTML = `
          <div class="additive-header">
            <span class="risk-badge risk-${found.risk.toLowerCase()}">${found.risk} Risk</span>
            <strong>${found.code} • ${found.name}</strong>
          </div>
          <p class="add-desc">${found.description}</p>
          <p class="add-warn"><strong>⚠️ Health Note:</strong> ${found.warning}</p>
          <div class="add-meta">
            <span>Category: ${found.category}</span> • <span>${found.regulatory}</span>
          </div>
        `;
      } else {
        addResultBox.classList.remove('hidden');
        addResultBox.innerHTML = `<p class="text-muted">No specific regulatory warning found for "${q}". Try an E-number like E250, E621, E407 or Aspartame.</p>`;
      }
    };

    addSearchBtn.addEventListener('click', handleLookup);
    addSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleLookup();
    });

    // Add to pantry
    const addToPantryBtn = this.container.querySelector('#add-packaged-pantry-btn');
    addToPantryBtn.addEventListener('click', () => {
      sound.playSuccessChime();
      this.onAddToPantry({
        name: this.currentFood.name,
        category: this.currentFood.category || 'Pantry Staples',
        score: this.currentFood.nutriScore === 'A' ? 95 : (this.currentFood.nutriScore === 'B' ? 85 : 70),
        status: `Nutri-Score ${this.currentFood.nutriScore}`,
        shelfLife: '1–2 months'
      });
    });
  }

  estimateNovaGroup(text) {
    const lower = text.toLowerCase();
    if (lower.includes('flavor') || lower.includes('emulsifier') || lower.includes('sweetener') || lower.includes('syrup') || lower.includes('nitrite') || lower.includes('isolate')) {
      return 4;
    }
    if (lower.includes('salt') || lower.includes('sugar') || lower.includes('oil')) {
      return 3;
    }
    return 1;
  }

  getNovaLabel(group) {
    switch (group) {
      case 1: return 'Unprocessed or Minimally Processed';
      case 2: return 'Processed Culinary Ingredients';
      case 3: return 'Processed Food';
      default: return 'Ultra-Processed Food Formulation';
    }
  }

  estimateNutriScore(text) {
    const lower = text.toLowerCase();
    if (lower.includes('sugar') && (lower.includes('palm oil') || lower.includes('syrup'))) return 'D';
    if (lower.includes('sodium') && lower.includes('nitrite')) return 'E';
    if (lower.includes('protein') && !lower.includes('sugar')) return 'B';
    return 'C';
  }

  analyzeCurrentFood() {
    const food = this.currentFood;
    const text = food.ingredientsText.toLowerCase();

    // 1. Check Allergens
    const detectedAllergens = [];
    const conflictAllergens = [];

    ALLERGENS.forEach(allergen => {
      const isDetected = allergen.keywords.some(kw => text.includes(kw));
      if (isDetected) {
        detectedAllergens.push(allergen);
        if (this.userPreferences[allergen.id]) {
          conflictAllergens.push(allergen);
        }
      }
    });

    // 2. Check Additives
    const detectedAdditives = [];
    ADDITIVES_DB.forEach(additive => {
      const codeRegex = new RegExp(`\\b${additive.code.toLowerCase()}\\b`, 'i');
      const nameParts = additive.name.toLowerCase().split(/[\s(]/);
      const isCodePresent = codeRegex.test(text);
      const isNamePresent = nameParts.some(part => part.length > 4 && text.includes(part));

      if (isCodePresent || isNamePresent) {
        detectedAdditives.push(additive);
      }
    });

    // Sound cue based on conflict
    if (conflictAllergens.length > 0) {
      sound.playDangerAlert();
    } else {
      sound.playSuccessChime();
    }

    // Update UI Elements
    this.container.querySelector('#food-product-title').textContent = food.name;
    this.container.querySelector('#food-product-brand').textContent = `${food.brand} • ${food.category}`;

    // Update Nutri-Score UI
    const nutriSteps = this.container.querySelectorAll('.nutri-step');
    nutriSteps.forEach(step => step.classList.remove('active'));
    const activeStep = this.container.querySelector(`.step-${food.nutriScore.toLowerCase()}`);
    if (activeStep) activeStep.classList.add('active');

    // Update NOVA
    this.container.querySelector('#nova-num').textContent = `Group ${food.novaGroup}`;
    this.container.querySelector('#nova-desc').textContent = food.novaLabel;

    // Update Allergen Box
    const allergenContainer = this.container.querySelector('#allergen-alerts-container');
    if (conflictAllergens.length > 0) {
      allergenContainer.innerHTML = `
        <div class="safety-alert alert-danger">
          <div class="alert-icon-wrap">⚠️</div>
          <div class="alert-content">
            <h4>ALLERGEN WARNING CONFLICT</h4>
            <p>This product contains <strong>${conflictAllergens.map(a => a.name).join(', ')}</strong>, which you have flagged to avoid in your safeguards profile.</p>
            <div class="tags-row">
              ${conflictAllergens.map(a => `<span class="tag tag-danger">${a.icon} ${a.name} Detected</span>`).join('')}
            </div>
          </div>
        </div>
      `;
    } else if (detectedAllergens.length > 0) {
      allergenContainer.innerHTML = `
        <div class="safety-alert alert-neutral">
          <div class="alert-icon-wrap">ℹ️</div>
          <div class="alert-content">
            <h4>Allergens Present (No Conflict with Your Profile)</h4>
            <p>Contains: ${detectedAllergens.map(a => a.name).join(', ')}.</p>
            <div class="tags-row">
              ${detectedAllergens.map(a => `<span class="tag tag-neutral">${a.icon} ${a.name}</span>`).join('')}
            </div>
          </div>
        </div>
      `;
    } else {
      allergenContainer.innerHTML = `
        <div class="safety-alert alert-safe">
          <div class="alert-icon-wrap">✅</div>
          <div class="alert-content">
            <h4>Safe from Monitored Allergens</h4>
            <p>No primary declared allergens detected in this ingredient statement.</p>
          </div>
        </div>
      `;
    }

    // Update Additives list
    const additivesContainer = this.container.querySelector('#additives-detected-list');
    if (detectedAdditives.length > 0) {
      additivesContainer.innerHTML = detectedAdditives.map(add => `
        <div class="additive-item-card">
          <div class="add-item-header">
            <span class="risk-badge risk-${add.risk.toLowerCase()}">${add.risk} Risk</span>
            <strong>${add.code} • ${add.name}</strong>
          </div>
          <p class="add-sub">${add.category} — ${add.description}</p>
          <p class="add-warning-text"><strong>Health Context:</strong> ${add.warning}</p>
        </div>
      `).join('');
    } else {
      additivesContainer.innerHTML = `
        <div class="empty-state-notice">
          <span class="icon-clean">🌿</span>
          <p>No synthetic preservatives or flagged E-numbers found in this ingredient text.</p>
        </div>
      `;
    }

    // Update Nutrition Facts
    const nutritionSection = this.container.querySelector('#nutrition-facts-section');
    const pillsContainer = this.container.querySelector('#nutrition-pills');
    if (food.nutritionPer100g) {
      nutritionSection.classList.remove('hidden');
      pillsContainer.innerHTML = Object.entries(food.nutritionPer100g).map(([k, v]) => `
        <div class="nutri-pill">
          <span class="nutri-label">${k.replace(/([A-Z])/g, ' $1').toUpperCase()}</span>
          <span class="nutri-val">${v}</span>
        </div>
      `).join('');
    } else {
      nutritionSection.classList.add('hidden');
    }
  }
}
