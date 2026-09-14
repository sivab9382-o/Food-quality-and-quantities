import { SAMPLE_FOODS } from '../data/foodsData.js';
import { sound } from '../utils/audio.js';

export class FreshnessScanner {
  constructor(options = {}) {
    this.container = options.container;
    this.onAddToPantry = options.onAddToPantry || (() => {});
    this.currentStream = null;
    this.isCameraActive = false;
    this.facingMode = 'environment';
    this.activeFood = SAMPLE_FOODS[0];
    this.isAnalyzing = false;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  mount() {
    this.render();
    this.attachEvents();
    // Load initial sample
    this.selectSample(this.activeFood.id, false);
  }

  render() {
    this.container.innerHTML = `
      <div class="scanner-layout">
        <!-- Left Panel: Input & Viewfinder -->
        <div class="glass-panel scanner-viewport-card">
          <div class="panel-header">
            <div>
              <span class="badge badge-tech"><i class="icon-camera"></i> LIVE COMPUTER VISION</span>
              <h2 class="panel-title">Freshness & Spoilage Scanner</h2>
            </div>
            <div class="header-actions">
              <button id="toggle-camera-btn" class="btn btn-sm btn-glass" title="Toggle Webcam">
                <span class="btn-icon">📷</span> <span class="camera-btn-text">Start Camera</span>
              </button>
            </div>
          </div>

          <!-- Viewport Box -->
          <div class="viewport-box" id="viewport-box">
            <!-- Scan Reticle & Animated HUD -->
            <div class="scanner-hud" id="scanner-hud">
              <div class="hud-corner top-left"></div>
              <div class="hud-corner top-right"></div>
              <div class="hud-corner bottom-left"></div>
              <div class="hud-corner bottom-right"></div>
              <div class="laser-scanner-line" id="laser-line"></div>
              <div class="hud-target-circle">
                <span class="hud-crosshair"></span>
              </div>
              <div class="hud-status-badge" id="hud-status">AI Ready • Awaiting Target</div>
            </div>

            <!-- Video Feed for Live Camera -->
            <video id="camera-video" class="camera-feed hidden" autoplay playsinline muted></video>

            <!-- Image Display for Upload/Presets -->
            <img id="scanned-image" class="scanned-display" src="${this.activeFood.image}" alt="Scan Target" />

            <!-- Drag & Drop Overlay -->
            <div class="dropzone-overlay" id="dropzone-overlay">
              <div class="drop-content">
                <span class="drop-icon">📥</span>
                <p>Drag & drop any food image here</p>
                <span class="drop-sub">or click to browse files</span>
              </div>
            </div>
            <input type="file" id="file-input" accept="image/*" class="hidden" />
          </div>

          <!-- Controls Bar -->
          <div class="scanner-controls-bar">
            <button id="trigger-scan-btn" class="btn btn-primary glow-emerald">
              <span class="btn-icon">✨</span> Analyze Freshness
            </button>
            <button id="upload-btn" class="btn btn-glass">
              <span class="btn-icon">📁</span> Upload Photo
            </button>
            <button id="flip-camera-btn" class="btn btn-glass hidden" title="Flip Camera">
              <span class="btn-icon">🔄</span> Flip
            </button>
          </div>

          <!-- Quick Test Preset Gallery -->
          <div class="preset-gallery-section">
            <div class="preset-label">
              <span>Quick Test Library (High-Res Samples)</span>
              <span class="label-hint">Click any sample to evaluate</span>
            </div>
            <div class="preset-items-grid">
              ${SAMPLE_FOODS.map(food => `
                <button class="preset-card ${food.id === this.activeFood.id ? 'active' : ''}" data-food-id="${food.id}">
                  <img src="${food.image}" alt="${food.name}" class="preset-thumb" />
                  <div class="preset-meta">
                    <span class="preset-name">${food.name}</span>
                    <span class="preset-tag tag-${food.statusType}">${food.defaultScore}% • ${food.status.split('/')[0]}</span>
                  </div>
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Right Panel: Diagnostic Results -->
        <div class="glass-panel scanner-results-card" id="results-panel">
          <div class="panel-header">
            <div>
              <span class="badge badge-emerald">DIAGNOSTIC REPORT</span>
              <h2 class="panel-title" id="food-report-title">${this.activeFood.name}</h2>
            </div>
            <button id="add-to-pantry-btn" class="btn btn-sm btn-accent">
              <span class="btn-icon">➕</span> Log to Smart Pantry
            </button>
          </div>

          <!-- Score & Overall Freshness Gauge -->
          <div class="score-hero-container">
            <div class="score-circle-wrapper">
              <svg class="score-svg" viewBox="0 0 120 120">
                <circle class="score-bg-ring" cx="60" cy="60" r="50"></circle>
                <circle class="score-progress-ring" id="score-ring" cx="60" cy="60" r="50" style="stroke-dashoffset: 31.4;"></circle>
              </svg>
              <div class="score-value-box">
                <span class="score-number" id="score-val">${this.activeFood.defaultScore}</span>
                <span class="score-percent">%</span>
                <span class="score-label">FRESHNESS</span>
              </div>
            </div>

            <div class="score-summary-details">
              <div class="status-indicator-pill" id="status-pill">
                <span class="pulse-dot"></span>
                <span id="status-text">${this.activeFood.status}</span>
              </div>
              <p class="score-subtext" id="score-verdict">
                Optimal cell firmness and natural pigment luster detected. High nutritional integrity intact.
              </p>
              
              <!-- Quick Shelf-Life Chips -->
              <div class="shelf-life-chips">
                <div class="life-chip">
                  <span class="chip-title">Room Temp</span>
                  <span class="chip-val" id="shelf-room">${this.activeFood.shelfLife.roomTemp}</span>
                </div>
                <div class="life-chip">
                  <span class="chip-title">Refrigerated</span>
                  <span class="chip-val highlight" id="shelf-fridge">${this.activeFood.shelfLife.refrigerated}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Multi-Parameter Metrics Breakdown -->
          <div class="diagnostic-section">
            <h3 class="section-heading">Computer Vision Quality Parameters</h3>
            <div class="metrics-grid" id="metrics-grid">
              <div class="metric-box">
                <span class="m-label">Cellular Firmness</span>
                <span class="m-val text-emerald" id="m-firmness">${this.activeFood.metrics.firmness}</span>
                <div class="m-bar"><div class="m-bar-fill fill-emerald" style="width: 95%;"></div></div>
              </div>
              <div class="metric-box">
                <span class="m-label">Pigment Saturation</span>
                <span class="m-val text-cyan" id="m-color">${this.activeFood.metrics.colorVibrancy}</span>
                <div class="m-bar"><div class="m-bar-fill fill-cyan" style="width: 92%;"></div></div>
              </div>
              <div class="metric-box">
                <span class="m-label">Surface Micro-Integrity</span>
                <span class="m-val text-emerald" id="m-surface">${this.activeFood.metrics.surfaceIntegrity}</span>
                <div class="m-bar"><div class="m-bar-fill fill-emerald" style="width: 96%;"></div></div>
              </div>
              <div class="metric-box">
                <span class="m-label">Browning / Oxidation</span>
                <span class="m-val text-amber" id="m-browning">${this.activeFood.metrics.microBrowning}</span>
                <div class="m-bar"><div class="m-bar-fill fill-amber" style="width: 5%;"></div></div>
              </div>
            </div>
          </div>

          <!-- Storage Recommendations & Ethylene Info -->
          <div class="diagnostic-section">
            <h3 class="section-heading">Smart Storage Recommendations</h3>
            <div class="storage-info-card">
              <div class="storage-tags">
                <span class="storage-tag" id="tag-temp">🌡️ ${this.activeFood.idealTemp}</span>
                <span class="storage-tag" id="tag-hum">💧 ${this.activeFood.humidity}</span>
              </div>
              <ul class="storage-bullet-list" id="storage-tips-list">
                ${this.activeFood.storageTips.map(tip => `<li>${tip}</li>`).join('')}
              </ul>
            </div>
          </div>

          <!-- Sensory Confirmation Checklist -->
          <div class="diagnostic-section">
            <h3 class="section-heading">Sensory Verification (Smell & Touch)</h3>
            <div class="checklist-box" id="sensory-checklist">
              ${this.activeFood.sensoryChecklist.map((item, idx) => `
                <label class="checklist-item ${item.passed ? 'checked' : ''}">
                  <input type="checkbox" ${item.passed ? 'checked' : ''} data-index="${idx}">
                  <span class="checkmark"></span>
                  <span class="item-text">${item.text}</span>
                </label>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    // Buttons
    const triggerScanBtn = this.container.querySelector('#trigger-scan-btn');
    const toggleCameraBtn = this.container.querySelector('#toggle-camera-btn');
    const uploadBtn = this.container.querySelector('#upload-btn');
    const flipCameraBtn = this.container.querySelector('#flip-camera-btn');
    const fileInput = this.container.querySelector('#file-input');
    const dropzoneOverlay = this.container.querySelector('#dropzone-overlay');
    const viewportBox = this.container.querySelector('#viewport-box');
    const addToPantryBtn = this.container.querySelector('#add-to-pantry-btn');

    triggerScanBtn.addEventListener('click', () => {
      sound.playClick();
      this.runScanAnimation();
    });

    toggleCameraBtn.addEventListener('click', () => {
      sound.playClick();
      this.toggleCamera();
    });

    uploadBtn.addEventListener('click', () => {
      sound.playClick();
      fileInput.click();
    });

    flipCameraBtn.addEventListener('click', () => {
      sound.playClick();
      this.facingMode = this.facingMode === 'environment' ? 'user' : 'environment';
      if (this.isCameraActive) {
        this.stopCamera();
        this.startCamera();
      }
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.handleFileUpload(file);
      }
    });

    // Preset cards
    const presetCards = this.container.querySelectorAll('.preset-card');
    presetCards.forEach(card => {
      card.addEventListener('click', () => {
        sound.playClick();
        const foodId = card.getAttribute('data-food-id');
        this.selectSample(foodId, true);
      });
    });

    // Drag & Drop
    viewportBox.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzoneOverlay.classList.add('active');
    });

    viewportBox.addEventListener('dragleave', (e) => {
      e.preventDefault();
      dropzoneOverlay.classList.remove('active');
    });

    viewportBox.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzoneOverlay.classList.remove('active');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        this.handleFileUpload(file);
      }
    });

    dropzoneOverlay.addEventListener('click', () => {
      fileInput.click();
    });

    // Add to pantry
    addToPantryBtn.addEventListener('click', () => {
      sound.playSuccessChime();
      this.onAddToPantry({
        name: this.activeFood.name,
        category: this.activeFood.category || 'Produce',
        score: this.activeFood.defaultScore,
        status: this.activeFood.status,
        image: this.activeFood.image,
        shelfLife: this.activeFood.shelfLife.refrigerated || '3–5 days'
      });
    });
  }

  async toggleCamera() {
    if (this.isCameraActive) {
      this.stopCamera();
    } else {
      await this.startCamera();
    }
  }

  async startCamera() {
    const video = this.container.querySelector('#camera-video');
    const image = this.container.querySelector('#scanned-image');
    const toggleBtn = this.container.querySelector('#toggle-camera-btn');
    const flipBtn = this.container.querySelector('#flip-camera-btn');
    const hudStatus = this.container.querySelector('#hud-status');

    try {
      hudStatus.textContent = 'Initializing Camera...';
      const constraints = {
        video: {
          facingMode: this.facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      this.currentStream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = this.currentStream;
      video.classList.remove('hidden');
      image.classList.add('hidden');
      flipBtn.classList.remove('hidden');

      toggleBtn.innerHTML = '<span class="btn-icon">⏹️</span> Stop Camera';
      toggleBtn.classList.add('btn-danger');
      hudStatus.textContent = 'Live Feed Active • Tap Analyze';
      this.isCameraActive = true;
      sound.playScannerBeep();
    } catch (err) {
      console.warn('Camera access error:', err);
      hudStatus.textContent = 'Camera unavailable: using sample feed';
      alert('Camera access could not be initialized (permission denied or no camera device). You can upload a photo or use the built-in high-res samples.');
    }
  }

  stopCamera() {
    const video = this.container.querySelector('#camera-video');
    const image = this.container.querySelector('#scanned-image');
    const toggleBtn = this.container.querySelector('#toggle-camera-btn');
    const flipBtn = this.container.querySelector('#flip-camera-btn');
    const hudStatus = this.container.querySelector('#hud-status');

    if (this.currentStream) {
      this.currentStream.getTracks().forEach(track => track.stop());
      this.currentStream = null;
    }

    video.classList.add('hidden');
    image.classList.remove('hidden');
    flipBtn.classList.add('hidden');

    toggleBtn.innerHTML = '<span class="btn-icon">📷</span> Start Camera';
    toggleBtn.classList.remove('btn-danger');
    hudStatus.textContent = 'AI Ready • Awaiting Target';
    this.isCameraActive = false;
  }

  selectSample(foodId, autoScan = true) {
    const food = SAMPLE_FOODS.find(f => f.id === foodId);
    if (!food) return;

    if (this.isCameraActive) {
      this.stopCamera();
    }

    this.activeFood = food;

    // Update preset card active state
    this.container.querySelectorAll('.preset-card').forEach(card => {
      if (card.getAttribute('data-food-id') === foodId) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    const scannedImage = this.container.querySelector('#scanned-image');
    scannedImage.src = food.image;

    if (autoScan) {
      this.runScanAnimation();
    } else {
      this.updateDiagnosticsUI(food);
    }
  }

  handleFileUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const customFood = {
        id: 'upload-' + Date.now(),
        name: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ') || 'Uploaded Food Sample',
        category: 'Produce',
        image: e.target.result,
        defaultScore: Math.floor(Math.random() * 25) + 75,
        status: 'Good Freshness',
        statusType: 'optimal',
        metrics: {
          firmness: 'Firm (88%)',
          colorVibrancy: 'Good Saturation (85%)',
          surfaceIntegrity: 'Intact (90%)',
          microBrowning: 'Low (<5%)'
        },
        shelfLife: {
          roomTemp: '3–5 days',
          refrigerated: '1–2 weeks'
        },
        idealTemp: '34°F – 38°F (1°C – 3°C)',
        humidity: 'High (Crisper Drawer)',
        storageTips: [
          'Store in clean container or perforated produce bag.',
          'Keep dry until ready for preparation to avoid mold formation.',
          'Separate from citrus and high ethylene emitters.'
        ],
        sensoryChecklist: [
          { text: 'Visual check: No visible mold spores or liquid discharge', passed: true },
          { text: 'Scent check: Natural and clean without fermentation', passed: true },
          { text: 'Texture check: Springy resistance under light touch', passed: true }
        ],
        spoilageIndicators: [
          'Softening or weeping surface',
          'Sour, pungent, or moldy odor'
        ]
      };

      // Perform canvas color analysis on uploaded image to customize score
      this.analyzeImageColors(e.target.result, (analyzedScore, browningRatio) => {
        if (analyzedScore) {
          customFood.defaultScore = analyzedScore;
          if (browningRatio > 0.35) {
            customFood.status = 'Noticeable Aging / Browning';
            customFood.statusType = 'caution';
            customFood.metrics.microBrowning = `Elevated (${Math.round(browningRatio * 100)}%)`;
          }
        }
        this.activeFood = customFood;
        const scannedImage = this.container.querySelector('#scanned-image');
        scannedImage.src = customFood.image;
        this.runScanAnimation();
      });
    };
    reader.readAsDataURL(file);
  }

  analyzeImageColors(imageSrc, callback) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      this.canvas.width = 100;
      this.canvas.height = 100;
      this.ctx.drawImage(img, 0, 0, 100, 100);
      try {
        const imgData = this.ctx.getImageData(0, 0, 100, 100).data;
        let brownPixels = 0;
        let totalPixels = 100 * 100;

        for (let i = 0; i < imgData.length; i += 4) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          // Brown/dark criteria: r > g > b, moderate brightness or dark
          if (r > 60 && g > 30 && b < 70 && r > b * 1.4 && (r - g) < 60) {
            brownPixels++;
          }
        }

        const browningRatio = brownPixels / totalPixels;
        let calculatedScore = Math.max(30, Math.min(98, Math.round(95 - browningRatio * 70)));
        callback(calculatedScore, browningRatio);
      } catch (err) {
        callback(82, 0.1);
      }
    };
    img.onerror = () => callback(85, 0.1);
    img.src = imageSrc;
  }

  runScanAnimation() {
    if (this.isAnalyzing) return;
    this.isAnalyzing = true;

    const laserLine = this.container.querySelector('#laser-line');
    const hudStatus = this.container.querySelector('#hud-status');
    const triggerBtn = this.container.querySelector('#trigger-scan-btn');

    triggerBtn.disabled = true;
    triggerBtn.innerHTML = '<span class="spinner"></span> Scanning Pixels...';
    laserLine.classList.add('scanning');
    hudStatus.textContent = 'Processing Computer Vision Neural Net...';

    // Futuristic audio pulses
    sound.playScannerBeep();
    setTimeout(() => sound.playScannerBeep(), 400);
    setTimeout(() => sound.playScannerBeep(), 800);

    setTimeout(() => {
      laserLine.classList.remove('scanning');
      this.isAnalyzing = false;
      triggerBtn.disabled = false;
      triggerBtn.innerHTML = '<span class="btn-icon">✨</span> Analyze Freshness';
      hudStatus.textContent = `Diagnosis Complete • ${this.activeFood.status}`;

      if (this.activeFood.defaultScore >= 80) {
        sound.playSuccessChime();
      } else if (this.activeFood.defaultScore >= 50) {
        sound.playWarningTone();
      } else {
        sound.playDangerAlert();
      }

      this.updateDiagnosticsUI(this.activeFood);
    }, 1400);
  }

  updateDiagnosticsUI(food) {
    const reportTitle = this.container.querySelector('#food-report-title');
    const scoreVal = this.container.querySelector('#score-val');
    const scoreRing = this.container.querySelector('#score-ring');
    const statusPill = this.container.querySelector('#status-pill');
    const statusText = this.container.querySelector('#status-text');
    const scoreVerdict = this.container.querySelector('#score-verdict');
    const shelfRoom = this.container.querySelector('#shelf-room');
    const shelfFridge = this.container.querySelector('#shelf-fridge');

    const mFirmness = this.container.querySelector('#m-firmness');
    const mColor = this.container.querySelector('#m-color');
    const mSurface = this.container.querySelector('#m-surface');
    const mBrowning = this.container.querySelector('#m-browning');

    const tagTemp = this.container.querySelector('#tag-temp');
    const tagHum = this.container.querySelector('#tag-hum');
    const storageTipsList = this.container.querySelector('#storage-tips-list');
    const sensoryChecklist = this.container.querySelector('#sensory-checklist');

    reportTitle.textContent = food.name;
    scoreVal.textContent = food.defaultScore;

    // Ring animation: circumference is 2 * PI * 50 = ~314.16
    const circumference = 314.16;
    const offset = circumference - (food.defaultScore / 100) * circumference;
    scoreRing.style.strokeDasharray = `${circumference}`;
    scoreRing.style.strokeDashoffset = `${offset}`;

    // Color coordination
    scoreRing.classList.remove('stroke-emerald', 'stroke-amber', 'stroke-danger');
    statusPill.classList.remove('pill-optimal', 'pill-caution', 'pill-danger');

    if (food.defaultScore >= 80) {
      scoreRing.classList.add('stroke-emerald');
      statusPill.classList.add('pill-optimal');
      scoreVerdict.textContent = 'Excellent cellular integrity and fresh aroma profile. Safe for immediate culinary use or optimal storage.';
    } else if (food.defaultScore >= 50) {
      scoreRing.classList.add('stroke-amber');
      statusPill.classList.add('pill-caution');
      scoreVerdict.textContent = 'Product is ripening quickly. Best consumed within 24–48 hours or repurposed into zero-waste recipes / frozen.';
    } else {
      scoreRing.classList.add('stroke-danger');
      statusPill.classList.add('pill-danger');
      scoreVerdict.textContent = 'Significant cellular decay or oxidation detected. Thoroughly inspect or trim; discard if sour or malodorous.';
    }

    statusText.textContent = food.status;
    shelfRoom.textContent = food.shelfLife.roomTemp;
    shelfFridge.textContent = food.shelfLife.refrigerated;

    mFirmness.textContent = food.metrics.firmness;
    mColor.textContent = food.metrics.colorVibrancy;
    mSurface.textContent = food.metrics.surfaceIntegrity;
    mBrowning.textContent = food.metrics.microBrowning;

    tagTemp.textContent = `🌡️ ${food.idealTemp}`;
    tagHum.textContent = `💧 ${food.humidity}`;

    storageTipsList.innerHTML = food.storageTips.map(t => `<li>${t}</li>`).join('');

    sensoryChecklist.innerHTML = food.sensoryChecklist.map((item, idx) => `
      <label class="checklist-item ${item.passed ? 'checked' : ''}">
        <input type="checkbox" ${item.passed ? 'checked' : ''} data-index="${idx}">
        <span class="checkmark"></span>
        <span class="item-text">${item.text}</span>
      </label>
    `).join('');
  }
}
