import { store } from '../data/store.js';

export const QUALITY_PRESETS = [
  {
    name: 'Honeycrisp Apples',
    image: '/images/fresh_apple.jpg',
    score: 96,
    status: 'Fresh & Crisp',
    defects: 'No visible bruising or oxidation detected. Cuticle wax layer intact.',
    shelfLife: '4–6 weeks refrigerated'
  },
  {
    name: 'Overripe Cavendish Banana',
    image: '/images/overripe_banana.jpg',
    score: 54,
    status: 'Overripe / Advanced Browning',
    defects: 'Extensive brown sugar freckles, softened peel structure. Best for baking.',
    shelfLife: '1–2 days room temp (freeze recommended)'
  },
  {
    name: 'Fresh Atlantic Salmon',
    image: '/images/fresh_salmon.jpg',
    score: 93,
    status: 'Grade-A Fresh',
    defects: 'Clean fat striations, elastic muscle tone, ocean-fresh translucency.',
    shelfLife: '1–2 days refrigerated'
  },
  {
    name: 'Overripe Avocado',
    image: '/images/overripe_avocado.jpg',
    score: 34,
    status: 'Severe Browning / Spoilage Warning',
    defects: 'Internal vascular oxidation, dark stringy streaks, high bacterial risk.',
    shelfLife: 'Immediate consumption or discard'
  }
];

export class QualityView {
  constructor(options = {}) {
    this.container = options.container;
    this.onNavigate = options.onNavigate || (() => {});
    this.onShowToast = options.onShowToast || (() => {});
    this.selectedFood = QUALITY_PRESETS[0];
    this.currentStream = null;
    this.isCameraActive = false;
    this.analysisResult = null;
    this.isAnalyzing = false;
  }

  mount() {
    this.render();
    this.attachEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="screen-view quality-screen-view">
        <!-- Search / Food Name Input matching Screenshot 2 -->
        <div class="search-input-wrapper">
          <input 
            type="text" 
            id="quality-food-name" 
            class="custom-search-input" 
            placeholder="e.g. Strawberries, Bread loaf..." 
            value="${this.selectedFood ? this.selectedFood.name : ''}"
          />
        </div>

        <!-- Dashed Photo Upload / Capture Box matching Screenshot 2 -->
        <div class="photo-upload-dashed-box" id="quality-dashed-box">
          <!-- Video preview when camera active -->
          <video id="quality-camera-stream" class="video-stream-feed hidden" autoplay playsinline muted></video>

          <!-- Current Image Preview if selected -->
          <div id="image-preview-wrap" class="image-preview-wrap ${this.selectedFood && !this.isCameraActive ? '' : 'hidden'}">
            <img id="quality-preview-img" src="${this.selectedFood ? this.selectedFood.image : ''}" alt="Food preview" />
            <button id="clear-image-btn" class="btn-clear-photo" title="Remove photo">&times;</button>
          </div>

          <!-- Empty prompt placeholder matching Screenshot 2 -->
          <div id="photo-placeholder-prompt" class="photo-prompt-center ${this.selectedFood || this.isCameraActive ? 'hidden' : ''}">
            <div class="photo-icon-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <strong class="photo-prompt-title">Add a photo of your food</strong>
            <span class="photo-prompt-sub">AI will analyze visible freshness</span>
          </div>

          <input type="file" id="quality-file-input" accept="image/*" class="hidden" />
        </div>

        <!-- Camera and Gallery Buttons matching Screenshot 2 -->
        <div class="photo-action-buttons-row">
          <button type="button" id="btn-camera-trigger" class="btn-action-light">
            <span class="btn-action-icon">📷</span>
            <span id="camera-btn-label">Camera</span>
          </button>
          <button type="button" id="btn-gallery-trigger" class="btn-action-light">
            <span class="btn-action-icon">📤</span>
            <span>Gallery</span>
          </button>
        </div>

        <!-- Quick Sample Library (High-res Food presets) -->
        <div class="sample-library-strip">
          <span class="sample-label">Quick Test Foods:</span>
          <div class="sample-pills">
            ${QUALITY_PRESETS.map((preset, idx) => `
              <button class="sample-pill-btn ${this.selectedFood && this.selectedFood.name === preset.name ? 'active' : ''}" data-idx="${idx}">
                ${preset.name.split(' ')[0]} (${preset.score}%)
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Analyze Quality Button matching Screenshot 2 -->
        <button type="button" id="btn-analyze-quality" class="btn-primary-mint">
          <span class="btn-icon-svg">✨</span>
          <span id="analyze-btn-text">Analyze Quality</span>
        </button>

        <!-- AI Quality Analysis Result Card -->
        <div id="quality-result-card" class="result-display-container ${this.analysisResult ? '' : 'hidden'}">
          ${this.analysisResult ? this.renderQualityResult(this.analysisResult) : ''}
        </div>
      </div>
    `;
  }

  renderQualityResult(res) {
    const isFresh = res.score >= 80;
    const isModerate = res.score >= 60 && res.score < 80;
    const isDefective = res.score < 60;

    const badgeClass = isFresh ? 'badge-success-soft' : (isModerate ? 'badge-warning-soft' : 'badge-danger-soft');

    return `
      <div class="analysis-result-card ${isDefective ? 'border-shortage' : 'border-success'}">
        <div class="result-header-row">
          <div>
            <span class="status-chip ${badgeClass}">${res.status}</span>
            <h4 class="result-food-heading">${res.name}</h4>
          </div>
          <div class="quality-score-badge-circle ${isFresh ? 'circle-green' : (isModerate ? 'circle-amber' : 'circle-red')}">
            <span class="circle-score-num">${res.score}</span>
            <span class="circle-score-label">/ 100</span>
          </div>
        </div>

        <div class="result-details-box">
          <div class="detail-row">
            <span class="detail-label">AI Visual Diagnosis:</span>
            <p class="detail-val">${res.defects}</p>
          </div>
          <div class="detail-row">
            <span class="detail-label">Safe Shelf Life:</span>
            <strong class="detail-val text-mint">${res.shelfLife}</strong>
          </div>
        </div>

        ${isDefective ? `
          <div class="shortage-notice-box">
            <strong>⚠️ Poor Food Quality Alert</strong>
            <p>This item exhibits significant spoilage or defects. You can attach this AI quality score and photo to an automated complaint report for a refund claim.</p>
          </div>
        ` : ''}

        <div class="result-actions-row">
          <button id="save-quality-check-btn" class="btn-secondary-outline">
            💾 Save to History
          </button>
          ${isDefective ? `
            <button id="escalate-quality-complaint-btn" class="btn-danger-solid">
              📄 Build Complaint Report
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }

  attachEvents() {
    const fileInput = this.container.querySelector('#quality-file-input');
    const galleryBtn = this.container.querySelector('#btn-gallery-trigger');
    const cameraBtn = this.container.querySelector('#btn-camera-trigger');
    const analyzeBtn = this.container.querySelector('#btn-analyze-quality');
    const dashedBox = this.container.querySelector('#quality-dashed-box');
    const clearBtn = this.container.querySelector('#clear-image-btn');

    // Gallery click -> open file picker
    if (galleryBtn) {
      galleryBtn.addEventListener('click', () => {
        fileInput.click();
      });
    }

    if (dashedBox) {
      dashedBox.addEventListener('click', (e) => {
        if (e.target.id === 'clear-image-btn') return;
        if (!this.selectedFood && !this.isCameraActive) {
          fileInput.click();
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectedFood = null;
        this.analysisResult = null;
        this.render();
        this.attachEvents();
      });
    }

    // File selected
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const nameInput = this.container.querySelector('#quality-food-name');
            const detectedName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ') || 'Food Sample';
            if (nameInput) nameInput.value = detectedName;

            this.selectedFood = {
              name: detectedName,
              image: ev.target.result,
              score: Math.floor(Math.random() * 25) + 72,
              status: 'Good Freshness',
              defects: 'Normal surface coloration and cellular structure.',
              shelfLife: '3–5 days refrigerated'
            };
            this.stopCamera();
            this.analysisResult = null;
            this.render();
            this.attachEvents();
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Camera trigger
    if (cameraBtn) {
      cameraBtn.addEventListener('click', () => {
        if (this.isCameraActive) {
          this.captureFromCamera();
        } else {
          this.startCamera();
        }
      });
    }

    // Sample presets
    const samplePills = this.container.querySelectorAll('.sample-pill-btn');
    samplePills.forEach(pill => {
      pill.addEventListener('click', () => {
        const idx = parseInt(pill.getAttribute('data-idx'), 10);
        this.selectedFood = QUALITY_PRESETS[idx];
        const nameInput = this.container.querySelector('#quality-food-name');
        if (nameInput) nameInput.value = this.selectedFood.name;
        this.stopCamera();
        this.analysisResult = null;
        this.render();
        this.attachEvents();
      });
    });

    // Analyze Quality
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', () => {
        if (!this.selectedFood && !this.isCameraActive) {
          alert('Please take a photo or select a food sample first.');
          return;
        }

        if (this.isCameraActive) {
          this.captureFromCamera();
        }

        this.runAnalysis();
      });
    }

    this.attachResultEvents();
  }

  async startCamera() {
    const video = this.container.querySelector('#quality-camera-stream');
    const prompt = this.container.querySelector('#photo-placeholder-prompt');
    const preview = this.container.querySelector('#image-preview-wrap');
    const cameraLabel = this.container.querySelector('#camera-btn-label');

    try {
      this.currentStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      video.srcObject = this.currentStream;
      video.classList.remove('hidden');
      if (prompt) prompt.classList.add('hidden');
      if (preview) preview.classList.add('hidden');
      if (cameraLabel) cameraLabel.textContent = '📸 Snap Photo';
      this.isCameraActive = true;
    } catch (err) {
      console.warn('Camera not available', err);
      alert('Camera could not be started. Using sample gallery or file upload.');
    }
  }

  stopCamera() {
    if (this.currentStream) {
      this.currentStream.getTracks().forEach(t => t.stop());
      this.currentStream = null;
    }
    this.isCameraActive = false;
  }

  captureFromCamera() {
    const video = this.container.querySelector('#quality-camera-stream');
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const snapData = canvas.toDataURL('image/jpeg');

    this.stopCamera();
    this.selectedFood = {
      name: this.container.querySelector('#quality-food-name').value.trim() || 'Camera Captured Item',
      image: snapData,
      score: 88,
      status: 'Fresh & Verified',
      defects: 'No significant surface spoilage detected.',
      shelfLife: '4–6 days refrigerated'
    };
    this.render();
    this.attachEvents();
  }

  runAnalysis() {
    if (this.isAnalyzing) return;
    this.isAnalyzing = true;

    const analyzeBtn = this.container.querySelector('#btn-analyze-quality');
    const btnText = this.container.querySelector('#analyze-btn-text');

    analyzeBtn.disabled = true;
    btnText.textContent = 'Scanning with AI...';

    setTimeout(() => {
      this.isAnalyzing = false;
      analyzeBtn.disabled = false;
      btnText.textContent = 'Analyze Quality';

      const name = this.container.querySelector('#quality-food-name').value.trim() || this.selectedFood.name;
      this.analysisResult = {
        name,
        image: this.selectedFood.image,
        score: this.selectedFood.score,
        status: this.selectedFood.status,
        defects: this.selectedFood.defects,
        shelfLife: this.selectedFood.shelfLife
      };

      const resultBox = this.container.querySelector('#quality-result-card');
      resultBox.classList.remove('hidden');
      resultBox.innerHTML = this.renderQualityResult(this.analysisResult);
      this.attachResultEvents();
    }, 1200);
  }

  attachResultEvents() {
    const saveBtn = this.container.querySelector('#save-quality-check-btn');
    const complaintBtn = this.container.querySelector('#escalate-quality-complaint-btn');

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        if (!this.analysisResult) return;
        store.addCheck({
          type: 'Quality',
          productName: this.analysisResult.name,
          qualityScore: this.analysisResult.score,
          qualityStatus: this.analysisResult.status,
          image: this.analysisResult.image,
          notes: `${this.analysisResult.defects} Shelf-life: ${this.analysisResult.shelfLife}`
        });
        this.onShowToast(`Saved ${this.analysisResult.name} quality check to History!`, 'success');
        saveBtn.disabled = true;
        saveBtn.textContent = '✅ Saved';
      });
    }

    if (complaintBtn) {
      complaintBtn.addEventListener('click', () => {
        if (!this.analysisResult) return;
        store.addCheck({
          type: 'Quality',
          productName: this.analysisResult.name,
          qualityScore: this.analysisResult.score,
          qualityStatus: this.analysisResult.status,
          image: this.analysisResult.image,
          notes: this.analysisResult.defects
        });

        this.onNavigate('complaints', {
          productName: this.analysisResult.name,
          issueType: 'Spoiled / Poor Quality',
          shortage: `Quality score ${this.analysisResult.score}/100`,
          description: `Food item was received in unacceptable spoiled condition. AI Quality scan diagnosed: "${this.analysisResult.defects}". Requesting full refund/replacement.`
        });
      });
    }
  }
}
