import { RESCUE_RECIPES, findRecipesForIngredients } from '../data/recipesData.js';
import { sound } from '../utils/audio.js';

export class PantryTracker {
  constructor(options = {}) {
    this.container = options.container;
    this.currentFilter = 'all';
    this.items = this.loadPantryItems();
  }

  loadPantryItems() {
    try {
      const saved = localStorage.getItem('smartfood_pantry_items');
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    // Default rich starter pantry items with varied expiration dates
    const now = new Date();
    const addDays = (d) => new Date(now.getTime() + d * 86400000).toISOString().split('T')[0];

    return [
      {
        id: 'pantry-1',
        name: 'Atlantic Salmon Fillet',
        category: 'Meat & Seafood',
        storage: 'Refrigerator',
        quantity: '2 fillets (400g)',
        expiryDate: addDays(1), // Expires in 1 day
        addedDate: addDays(-1),
        freshnessScore: 92,
        consumed: false
      },
      {
        id: 'pantry-2',
        name: 'Organic Cavendish Bananas',
        category: 'Produce',
        storage: 'Countertop',
        quantity: '3 bananas',
        expiryDate: addDays(2), // Expires in 2 days
        addedDate: addDays(-4),
        freshnessScore: 56,
        consumed: false
      },
      {
        id: 'pantry-3',
        name: 'Artisan Plain Greek Yogurt',
        category: 'Dairy & Eggs',
        storage: 'Refrigerator',
        quantity: '500g tub',
        expiryDate: addDays(3), // Expires in 3 days
        addedDate: addDays(-6),
        freshnessScore: 84,
        consumed: false
      },
      {
        id: 'pantry-4',
        name: 'Fresh Baby Spinach',
        category: 'Produce',
        storage: 'Refrigerator',
        quantity: '1 bag (250g)',
        expiryDate: addDays(1), // Expires tomorrow!
        addedDate: addDays(-3),
        freshnessScore: 65,
        consumed: false
      },
      {
        id: 'pantry-5',
        name: 'Honeycrisp Apples',
        category: 'Produce',
        storage: 'Refrigerator',
        quantity: '4 apples',
        expiryDate: addDays(14),
        addedDate: addDays(-2),
        freshnessScore: 96,
        consumed: false
      },
      {
        id: 'pantry-6',
        name: 'Rolled Oats & Granola',
        category: 'Pantry Staples',
        storage: 'Pantry Shelf',
        quantity: '1 box (750g)',
        expiryDate: addDays(90),
        addedDate: addDays(-10),
        freshnessScore: 98,
        consumed: false
      }
    ];
  }

  savePantryItems() {
    try {
      localStorage.setItem('smartfood_pantry_items', JSON.stringify(this.items));
    } catch (e) {}
  }

  addItem(newItem) {
    const now = new Date();
    const expiry = newItem.expiryDate || new Date(now.getTime() + 4 * 86400000).toISOString().split('T')[0];

    const itemObj = {
      id: 'pantry-' + Date.now(),
      name: newItem.name,
      category: newItem.category || 'Produce',
      storage: newItem.storage || 'Refrigerator',
      quantity: newItem.quantity || '1 pack',
      expiryDate: expiry,
      addedDate: now.toISOString().split('T')[0],
      freshnessScore: newItem.score || 85,
      consumed: false
    };

    this.items.unshift(itemObj);
    this.savePantryItems();
    this.render();
    this.attachEvents();
  }

  mount() {
    this.render();
    this.attachEvents();
  }

  render() {
    const urgentItems = this.getUrgentItems();
    const filteredItems = this.getFilteredItems();
    const rescueRecipes = findRecipesForIngredients(urgentItems.map(i => i.name));

    // Stats calculations
    const activeItemsCount = this.items.filter(i => !i.consumed).length;
    const consumedCount = this.items.filter(i => i.consumed).length;
    const estimatedSavedMoney = (consumedCount * 4.85 + activeItemsCount * 2.2).toFixed(2);
    const estimatedWastePreventedKg = (consumedCount * 0.45 + activeItemsCount * 0.25).toFixed(1);

    this.container.innerHTML = `
      <div class="pantry-layout">
        <!-- Top Stats Row: Eco & Financial Impact -->
        <div class="pantry-stats-grid">
          <div class="glass-panel stat-card">
            <div class="stat-icon-wrap bg-emerald-dim">🥗</div>
            <div class="stat-content">
              <span class="stat-label">Active Pantry Items</span>
              <strong class="stat-val">${activeItemsCount}</strong>
              <span class="stat-subtext">${urgentItems.length} require prompt attention</span>
            </div>
          </div>
          <div class="glass-panel stat-card">
            <div class="stat-icon-wrap bg-cyan-dim">💰</div>
            <div class="stat-content">
              <span class="stat-label">Food Value Preserved</span>
              <strong class="stat-val text-cyan">$${estimatedSavedMoney}</strong>
              <span class="stat-subtext">Prevented from waste bin</span>
            </div>
          </div>
          <div class="glass-panel stat-card">
            <div class="stat-icon-wrap bg-amber-dim">🌱</div>
            <div class="stat-content">
              <span class="stat-label">Food Saved / Diverted</span>
              <strong class="stat-val text-emerald">${estimatedWastePreventedKg} kg</strong>
              <span class="stat-subtext">~${(estimatedWastePreventedKg * 2.5).toFixed(1)} kg CO2e reduced</span>
            </div>
          </div>
          <div class="glass-panel stat-card">
            <div class="stat-icon-wrap ${urgentItems.length > 0 ? 'bg-danger-dim' : 'bg-emerald-dim'}">⏳</div>
            <div class="stat-content">
              <span class="stat-label">Urgent Expiry (<48h)</span>
              <strong class="stat-val ${urgentItems.length > 0 ? 'text-danger' : 'text-emerald'}">${urgentItems.length} items</strong>
              <span class="stat-subtext">Cook with Rescue Chef</span>
            </div>
          </div>
        </div>

        <!-- Main Pantry Content: Inventory + Zero-Waste Recipe Engine -->
        <div class="pantry-split-grid">
          <!-- Left Column: Inventory List & Filters -->
          <div class="glass-panel inventory-card">
            <div class="panel-header">
              <div>
                <span class="badge badge-emerald">INVENTORY VAULT</span>
                <h2 class="panel-title">Smart Pantry Shelf-Life Queue</h2>
              </div>
              <button id="open-add-modal-btn" class="btn btn-sm btn-primary">
                <span class="btn-icon">➕</span> Log Food Item
              </button>
            </div>

            <!-- Filter Tabs Bar -->
            <div class="filter-tabs-row">
              <button class="filter-chip ${this.currentFilter === 'all' ? 'active' : ''}" data-filter="all">
                All (${this.items.length})
              </button>
              <button class="filter-chip chip-urgent ${this.currentFilter === 'urgent' ? 'active' : ''}" data-filter="urgent">
                ⚠️ Urgent (<48h) (${urgentItems.length})
              </button>
              <button class="filter-chip ${this.currentFilter === 'Refrigerator' ? 'active' : ''}" data-filter="Refrigerator">
                ❄️ Fridge
              </button>
              <button class="filter-chip ${this.currentFilter === 'Pantry Shelf' ? 'active' : ''}" data-filter="Pantry Shelf">
                🥫 Pantry
              </button>
              <button class="filter-chip ${this.currentFilter === 'Countertop' ? 'active' : ''}" data-filter="Countertop">
                🍎 Countertop
              </button>
            </div>

            <!-- Inventory Grid / Cards -->
            <div class="inventory-items-container" id="inventory-container">
              ${filteredItems.length > 0 ? filteredItems.map(item => this.renderItemCard(item)).join('') : `
                <div class="empty-inventory-notice">
                  <span class="empty-icon">🥦</span>
                  <h3>No items found in this section</h3>
                  <p>Add new foods or scan items with the AI Freshness detector.</p>
                </div>
              `}
            </div>
          </div>

          <!-- Right Column: Zero Waste "Rescue Chef" -->
          <div class="glass-panel rescue-card">
            <div class="panel-header">
              <div>
                <span class="badge badge-tech"><i class="icon-flame"></i> ZERO-WASTE CHEF</span>
                <h2 class="panel-title">Smart Rescue Recipes</h2>
                <p class="panel-subtitle">Automatically matched to prioritize items expiring within 48 hours.</p>
              </div>
            </div>

            <!-- Matched Recipes Stream -->
            <div class="rescue-recipes-stream">
              ${rescueRecipes.map(recipe => `
                <div class="recipe-card" data-recipe-id="${recipe.id}">
                  <div class="recipe-header">
                    <span class="recipe-badge">⚡ ${recipe.time} • ${recipe.difficulty}</span>
                    <span class="recipe-hero">Saves: <strong>${recipe.heroIngredient}</strong></span>
                  </div>
                  <h3 class="recipe-title">${recipe.title}</h3>
                  <p class="recipe-desc">${recipe.description}</p>
                  
                  <div class="recipe-details-collapsible">
                    <strong class="rec-subhead">Ingredients:</strong>
                    <ul class="rec-ing-list">
                      ${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}
                    </ul>
                    <strong class="rec-subhead">Chef Cooking Steps:</strong>
                    <ol class="rec-step-list">
                      ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                    <div class="recipe-pro-tip">
                      <span>💡 <strong>Zero-Waste Tip:</strong> ${recipe.wasteTip}</span>
                    </div>
                  </div>

                  <button class="btn btn-sm btn-glass btn-cook-recipe" data-recipe-id="${recipe.id}">
                    <span class="btn-icon">👨‍🍳</span> Cook & Mark Items Used
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Add Item Modal -->
      <div id="add-food-modal" class="modal-backdrop hidden">
        <div class="modal-dialog glass-panel">
          <div class="modal-header">
            <h3>Add Item to Smart Pantry</h3>
            <button id="close-modal-btn" class="btn-close">&times;</button>
          </div>
          <form id="add-food-form">
            <div class="form-group">
              <label class="form-label" for="food-name-input">Food / Product Name:</label>
              <input type="text" id="food-name-input" class="form-input" required placeholder="e.g. Fresh Strawberries, Cheddar Cheese..." />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="food-cat-input">Category:</label>
                <select id="food-cat-input" class="form-select">
                  <option value="Produce">Produce (Fruit/Veg)</option>
                  <option value="Dairy & Eggs">Dairy & Eggs</option>
                  <option value="Meat & Seafood">Meat & Seafood</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Pantry Staples">Pantry Staples</option>
                  <option value="Frozen">Frozen</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="food-loc-input">Storage Location:</label>
                <select id="food-loc-input" class="form-select">
                  <option value="Refrigerator">Refrigerator</option>
                  <option value="Pantry Shelf">Pantry Shelf</option>
                  <option value="Countertop">Countertop</option>
                  <option value="Freezer">Freezer</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="food-expiry-input">Expiration Date:</label>
                <input type="date" id="food-expiry-input" class="form-input" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="food-qty-input">Quantity / Portion:</label>
                <input type="text" id="food-qty-input" class="form-input" placeholder="e.g. 500g, 1 pack, 4 pieces" />
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" id="cancel-modal-btn" class="btn btn-glass">Cancel</button>
              <button type="submit" class="btn btn-primary glow-emerald">Save to Pantry</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  renderItemCard(item) {
    const daysRemaining = this.calcDaysRemaining(item.expiryDate);
    let statusClass = 'status-fresh';
    let statusLabel = `${daysRemaining} days left`;

    if (daysRemaining < 0) {
      statusClass = 'status-expired';
      statusLabel = `Expired ${Math.abs(daysRemaining)}d ago`;
    } else if (daysRemaining === 0) {
      statusClass = 'status-urgent';
      statusLabel = `Expires Today!`;
    } else if (daysRemaining <= 2) {
      statusClass = 'status-urgent';
      statusLabel = `Expires in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}`;
    }

    const maxDays = 14;
    const progressPercent = Math.max(5, Math.min(100, Math.round((Math.max(0, daysRemaining) / maxDays) * 100)));

    return `
      <div class="inventory-card-item ${item.consumed ? 'item-consumed' : ''}" data-id="${item.id}">
        <div class="item-main-row">
          <div class="item-left-col">
            <span class="storage-icon-tag">${this.getStorageIcon(item.storage)}</span>
            <div class="item-names-box">
              <strong class="item-title">${item.name}</strong>
              <span class="item-meta-sub">${item.category} • ${item.quantity} • ${item.storage}</span>
            </div>
          </div>
          <div class="item-right-col">
            <span class="shelf-pill ${statusClass}">${statusLabel}</span>
            <div class="item-action-btns">
              <button class="action-btn btn-consume" title="Mark as Eaten / Rescued" data-id="${item.id}">
                ${item.consumed ? '✅' : '🍽️'}
              </button>
              <button class="action-btn btn-delete" title="Remove Item" data-id="${item.id}">
                🗑️
              </button>
            </div>
          </div>
        </div>

        <!-- Shelf Life Progress Bar -->
        <div class="shelf-progress-track">
          <div class="shelf-progress-fill ${statusClass}" style="width: ${progressPercent}%;"></div>
        </div>
      </div>
    `;
  }

  calcDaysRemaining(expiryDateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDateStr);
    expiry.setHours(0, 0, 0, 0);
    const diffMs = expiry.getTime() - today.getTime();
    return Math.ceil(diffMs / 86400000);
  }

  getUrgentItems() {
    return this.items.filter(item => {
      if (item.consumed) return false;
      const days = this.calcDaysRemaining(item.expiryDate);
      return days <= 2;
    });
  }

  getFilteredItems() {
    if (this.currentFilter === 'all') return this.items;
    if (this.currentFilter === 'urgent') return this.getUrgentItems();
    return this.items.filter(item => item.storage === this.currentFilter);
  }

  getStorageIcon(storage) {
    switch (storage) {
      case 'Refrigerator': return '❄️';
      case 'Freezer': return '🧊';
      case 'Countertop': return '🍎';
      default: return '🥫';
    }
  }

  attachEvents() {
    // Filter chips
    const filterChips = this.container.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        sound.playClick();
        this.currentFilter = chip.getAttribute('data-filter');
        this.render();
        this.attachEvents();
      });
    });

    // Consume buttons
    const consumeBtns = this.container.querySelectorAll('.btn-consume');
    consumeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = this.items.find(i => i.id === id);
        if (item) {
          sound.playSuccessChime();
          item.consumed = !item.consumed;
          this.savePantryItems();
          this.render();
          this.attachEvents();
        }
      });
    });

    // Delete buttons
    const deleteBtns = this.container.querySelectorAll('.btn-delete');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        sound.playClick();
        this.items = this.items.filter(i => i.id !== id);
        this.savePantryItems();
        this.render();
        this.attachEvents();
      });
    });

    // Modal events
    const modal = this.container.querySelector('#add-food-modal');
    const openModalBtn = this.container.querySelector('#open-add-modal-btn');
    const closeModalBtn = this.container.querySelector('#close-modal-btn');
    const cancelModalBtn = this.container.querySelector('#cancel-modal-btn');
    const addFoodForm = this.container.querySelector('#add-food-form');
    const expiryInput = this.container.querySelector('#food-expiry-input');

    // Default expiry date: 5 days from today
    if (expiryInput) {
      const defaultExp = new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0];
      expiryInput.value = defaultExp;
    }

    if (openModalBtn) {
      openModalBtn.addEventListener('click', () => {
        sound.playClick();
        modal.classList.remove('hidden');
      });
    }

    const closeModal = () => {
      sound.playClick();
      modal.classList.add('hidden');
    };

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

    if (addFoodForm) {
      addFoodForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sound.playSuccessChime();
        const name = this.container.querySelector('#food-name-input').value.trim();
        const category = this.container.querySelector('#food-cat-input').value;
        const storage = this.container.querySelector('#food-loc-input').value;
        const expiryDate = this.container.querySelector('#food-expiry-input').value;
        const quantity = this.container.querySelector('#food-qty-input').value.trim() || '1 pack';

        this.addItem({
          name,
          category,
          storage,
          expiryDate,
          quantity,
          score: 95
        });

        modal.classList.add('hidden');
      });
    }

    // Cook recipe buttons
    const cookRecipeBtns = this.container.querySelectorAll('.btn-cook-recipe');
    cookRecipeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playSuccessChime();
        const recipeId = btn.getAttribute('data-recipe-id');
        const recipe = RESCUE_RECIPES.find(r => r.id === recipeId);
        if (recipe) {
          // Mark matched items as consumed
          let marked = 0;
          this.items.forEach(item => {
            if (!item.consumed && recipe.matchKeywords.some(kw => item.name.toLowerCase().includes(kw))) {
              item.consumed = true;
              marked++;
            }
          });
          this.savePantryItems();
          alert(`Bon Appetit! 🎉 You cooked "${recipe.title}". Marked ${marked} item(s) as rescued and consumed!`);
          this.render();
          this.attachEvents();
        }
      });
    });
  }
}
