/* ========================================
   MEDSIM — Live VR Demos & YouTube VR Manager
   ======================================== */

export const DEFAULT_VR_VIDEOS = [
  {
    id: 'vr_1',
    youtubeId: 'J8x1b3D65pM',
    title: '3D Heart Anatomy & Cardiac Tour (360° VR)',
    category: 'Anatomy',
    duration: '5:20',
    description: 'Immersive 360-degree virtual reality tour inside the human heart by Scientific Animations, showing blood flow, valve mechanics, and cardiac conduction.',
    thumbnail: 'https://img.youtube.com/vi/J8x1b3D65pM/hqdefault.jpg',
    isDefault: true
  },
  {
    id: 'vr_2',
    youtubeId: 'y2V8_JjT5q0',
    title: '360° VR Surgical OR Environment & Procedure',
    category: 'Surgery',
    duration: '8:45',
    description: 'Experience a live operating theatre environment during surgical procedure in 360° VR from the chief surgeon\'s perspective.',
    thumbnail: 'https://img.youtube.com/vi/y2V8_JjT5q0/hqdefault.jpg',
    isDefault: true
  },
  {
    id: 'vr_3',
    youtubeId: '0gBEw7K7MVo',
    title: 'Human Respiratory & Pulmonary Mechanics (360° VR)',
    category: 'Anatomy',
    duration: '6:15',
    description: 'Step inside the thoracic cavity and explore lungs, bronchial tree, alveolar ventilation, and diaphragm dynamics in 360° VR.',
    thumbnail: 'https://img.youtube.com/vi/0gBEw7K7MVo/hqdefault.jpg',
    isDefault: true
  },
  {
    id: 'vr_4',
    youtubeId: 'wXvV49w8jE8',
    title: 'Laparoscopic Abdominal Surgery 360° VR',
    category: 'Surgery',
    duration: '10:15',
    description: '360° view of minimally invasive laparoscopic abdominal surgery, port placements, and organ inspection.',
    thumbnail: 'https://img.youtube.com/vi/wXvV49w8jE8/hqdefault.jpg',
    isDefault: true
  }
];

export class LiveVRManager {
  constructor(containerId) {
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    this.storageKey = 'medsim_vr_custom_videos';
    this.activeFilter = 'All';
    this.searchQuery = '';
    this.videos = [];
  }

  init() {
    this.loadVideos();
    this.render();
  }

  loadVideos() {
    const saved = localStorage.getItem(this.storageKey);
    let customVideos = [];
    if (saved) {
      try {
        customVideos = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse custom VR videos', e);
      }
    }
    this.videos = [...DEFAULT_VR_VIDEOS, ...customVideos];
  }

  saveCustomVideos(customVideos) {
    localStorage.setItem(this.storageKey, JSON.stringify(customVideos));
  }

  static extractYouTubeId(urlOrId) {
    if (!urlOrId) return '';
    const trimmed = urlOrId.trim();
    if (trimmed.length === 11 && !trimmed.includes('/') && !trimmed.includes('.')) {
      return trimmed;
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = trimmed.match(regExp);
    return (match && match[2].length === 11) ? match[2] : trimmed;
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="vr-container animate-in">
        
        <!-- Header -->
        <div class="vr-header">
          <div class="vr-header-text">
            <h1>🥽 Live VR Demos & YouTube 360°</h1>
            <p>Experience real medical procedures, 3D anatomical dissections, and surgical suites in immersive 360° VR. Use VR headsets, Google Cardboard VR Box, or pan around in 360° interactive view.</p>
          </div>
        </div>

        <!-- Toolbar & Filters -->
        <div class="vr-toolbar">
          <div class="vr-filters">
            ${['All', 'Anatomy', 'Surgery', 'Clinical Skills', 'Emergency', 'Custom'].map(cat => `
              <button class="vr-filter-btn ${this.activeFilter === cat ? 'active' : ''}" data-category="${cat}">
                ${cat === 'Custom' ? '⭐ Added Links' : cat}
              </button>
            `).join('')}
          </div>

          <div class="vr-actions">
            <input type="text" id="vrSearchInput" class="vr-search-input" placeholder="🔍 Search VR demos..." value="${this.escapeHtml(this.searchQuery)}">
            <button class="btn-vr-add" id="btnOpenAddVRModal">
              <span>➕</span> Add YouTube VR Link
            </button>
          </div>
        </div>

        <!-- VR Cards Grid -->
        <div class="vr-grid" id="vrGrid">
          <!-- Rendered dynamically -->
        </div>
      </div>
    `;

    this.attachEvents();
    this.renderGrid();
  }

  attachEvents() {
    // Category filters
    const filterBtns = this.container.querySelectorAll('.vr-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeFilter = btn.dataset.category;
        this.renderGrid();
      });
    });

    // Search input
    const searchInput = this.container.querySelector('#vrSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderGrid();
      });
    }

    // Add VR button
    const addBtn = this.container.querySelector('#btnOpenAddVRModal');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.openAddVRModal());
    }
  }

  renderGrid() {
    const grid = this.container.querySelector('#vrGrid');
    if (!grid) return;

    let filtered = this.videos.filter(v => {
      // Category filter
      if (this.activeFilter === 'Custom') {
        if (v.isDefault) return false;
      } else if (this.activeFilter !== 'All' && v.category.toLowerCase() !== this.activeFilter.toLowerCase()) {
        return false;
      }

      // Search query
      if (this.searchQuery) {
        const titleMatch = v.title.toLowerCase().includes(this.searchQuery);
        const descMatch = v.description.toLowerCase().includes(this.searchQuery);
        const catMatch = v.category.toLowerCase().includes(this.searchQuery);
        return titleMatch || descMatch || catMatch;
      }

      return true;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="vr-empty-state" style="grid-column: 1 / -1;">
          <div style="font-size:3rem; margin-bottom:12px;">🥽</div>
          <h3 style="color:#fff; margin-bottom:8px;">No VR Videos Found</h3>
          <p style="color:var(--text-secondary); max-width:400px; margin:0 auto 16px auto;">No YouTube VR demos match your filter. You can add your own YouTube VR link easily!</p>
          <button class="btn-vr-add" onclick="window.vrMgr.openAddVRModal()">➕ Add YouTube VR Link</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(v => `
      <div class="vr-card">
        <div class="vr-card-thumb" onclick="window.vrMgr.openVRPlayer('${v.youtubeId}', '${this.escapeHtml(v.title)}')">
          <img src="${v.thumbnail || `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}" alt="${this.escapeHtml(v.title)}" onerror="this.src='https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg'">
          <div class="vr-badge-360"><span>🕶️</span> 360° VR</div>
          <div class="vr-badge-category">${this.escapeHtml(v.category)}</div>
          <div class="vr-play-overlay">
            <div class="vr-play-btn-circle">▶</div>
          </div>
        </div>

        <div class="vr-card-content">
          <h3 class="vr-card-title">${this.escapeHtml(v.title)}</h3>
          <p class="vr-card-desc">${this.escapeHtml(v.description)}</p>
          
          <div class="vr-card-meta">
            <span>⏱️ ${v.duration || 'VR Demo'}</span>
            <span>📹 YouTube VR</span>
          </div>

          <div class="vr-card-actions">
            <button class="btn-vr-launch-embed" onclick="window.vrMgr.openVRPlayer('${v.youtubeId}', '${this.escapeHtml(v.title)}')">
              <span>▶</span> Play 360° VR
            </button>
            <button class="btn-vr-launch-box" onclick="window.vrMgr.openYouTubeVRBox('${v.youtubeId}')" title="Open YouTube with VR Headset / Google Cardboard Box mode">
              <span>🥽</span> VR Box Mode
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  openVRPlayer(youtubeId, title) {
    // Remove existing modal if any
    const existing = document.getElementById('vrModalOverlay');
    if (existing) existing.remove();

    const origin = encodeURIComponent(window.location.origin);
    const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&enablejsapi=1&rel=0&origin=${origin}`;

    const modal = document.createElement('div');
    modal.id = 'vrModalOverlay';
    modal.className = 'vr-modal-overlay';
    modal.innerHTML = `
      <div class="vr-modal-content">
        <div class="vr-modal-header">
          <div class="vr-modal-title">
            <span>🥽</span> <span>${this.escapeHtml(title)}</span>
          </div>
          <button class="vr-modal-close" onclick="document.getElementById('vrModalOverlay').remove()">✕</button>
        </div>

        <div class="vr-player-wrapper">
          <div id="vrPlayerOverlay" style="position:absolute; inset:0; background:linear-gradient(135deg, rgba(10,14,23,0.94), rgba(17,24,39,0.94)); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:24px; text-align:center; z-index:5; backdrop-filter:blur(10px);">
            <div style="font-size:3.5rem; margin-bottom:12px; filter:drop-shadow(0 0 15px rgba(0,212,255,0.6));">🥽</div>
            <h3 style="color:#fff; font-size:1.3rem; margin-bottom:8px; font-weight:700;">Launch YouTube VR Box & 360° Mode</h3>
            <p style="color:var(--text-secondary); max-width:520px; margin-bottom:20px; font-size:0.88rem; line-height:1.5;">
              For the best immersive 360° stereo playback (Google Cardboard & VR Headsets), launch directly in YouTube VR Box mode, or switch to the embedded web player below.
            </p>
            <div style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center;">
              <button class="btn-vr-add" style="font-size:0.95rem; padding:10px 22px;" onclick="window.vrMgr.openYouTubeVRBox('${youtubeId}')">
                <span>🥽</span> Open in YouTube VR Box Mode ➔
              </button>
              <button class="btn btn-secondary" style="font-size:0.9rem; padding:10px 18px;" onclick="document.getElementById('vrPlayerOverlay').style.display='none'">
                <span>👁️</span> Load Embedded 360° Player
              </button>
            </div>
          </div>
          <iframe id="vrIframe" src="${embedUrl}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>

        <!-- YouTube Embedding Fallback Notice -->
        <div style="background: rgba(0, 212, 255, 0.1); border: 1px solid rgba(0, 212, 255, 0.25); border-radius: 8px; margin: 12px 24px 0 24px; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
          <div style="font-size: 0.82rem; color: #93c5fd; display: flex; align-items: center; gap: 8px;">
            <span>💡</span> <span>If embedding is restricted by YouTube for this video, click <strong>VR Box Mode</strong> to open directly in YouTube 360°/Cardboard mode.</span>
          </div>
          <button class="btn-vr-launch-box" onclick="window.vrMgr.openYouTubeVRBox('${youtubeId}')" style="white-space: nowrap; padding: 6px 14px;">
            <span>🥽</span> Open YouTube VR Box ➔
          </button>
        </div>

        <div class="vr-modal-footer">
          <div class="vr-instructions">
            <span class="vr-instructions-icon">💡</span>
            <div>
              <strong>360° Navigation:</strong> Click & drag video or tilt device to look around in 360°.
            </div>
          </div>
          <div style="display:flex; gap:10px;">
            <button class="btn btn-secondary btn-sm" onclick="document.getElementById('vrIframe').requestFullscreen?.() || document.getElementById('vrModalOverlay').requestFullscreen?.()">
              <span>⛶</span> Full Screen
            </button>
            <button class="btn-vr-launch-box" onclick="window.vrMgr.openYouTubeVRBox('${youtubeId}')">
              <span>🥽</span> Open in YouTube VR Box Mode
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Close on overlay backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  openYouTubeVRBox(youtubeId) {
    // YouTube link for 360/VR Box mode
    const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
    window.open(youtubeUrl, '_blank');
  }

  openAddVRModal() {
    const existing = document.getElementById('addVrModalOverlay');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'addVrModalOverlay';
    modal.className = 'vr-modal-overlay';
    modal.innerHTML = `
      <div class="vr-modal-content" style="max-width: 550px;">
        <div class="vr-modal-header">
          <div class="vr-modal-title">
            <span>➕</span> <span>Add YouTube VR Link</span>
          </div>
          <button class="vr-modal-close" onclick="document.getElementById('addVrModalOverlay').remove()">✕</button>
        </div>

        <div style="padding: 24px; display: flex; flex-direction: column; gap: 16px;">
          <div>
            <label style="font-size:0.85rem; color:var(--text-secondary); display:block; margin-bottom:6px; font-weight:600;">YouTube Video Link or Video ID *</label>
            <input type="text" id="addVrUrl" class="vr-search-input" style="width:100%; font-size:0.9rem; padding:10px;" placeholder="https://www.youtube.com/watch?v=... or Video ID" required>
          </div>

          <div>
            <label style="font-size:0.85rem; color:var(--text-secondary); display:block; margin-bottom:6px; font-weight:600;">Title *</label>
            <input type="text" id="addVrTitle" class="vr-search-input" style="width:100%; font-size:0.9rem; padding:10px;" placeholder="e.g. Surgical VR - Knee Replacement 360" required>
          </div>

          <div style="display:flex; gap:16px;">
            <div style="flex:1;">
              <label style="font-size:0.85rem; color:var(--text-secondary); display:block; margin-bottom:6px; font-weight:600;">Category</label>
              <select id="addVrCategory" style="width:100%; padding:10px; border-radius:var(--radius-sm); background:var(--bg-tertiary); color:var(--text-primary); border:1px solid var(--border-subtle);">
                <option value="Anatomy">Anatomy</option>
                <option value="Surgery">Surgery</option>
                <option value="Clinical Skills">Clinical Skills</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
            <div style="flex:1;">
              <label style="font-size:0.85rem; color:var(--text-secondary); display:block; margin-bottom:6px; font-weight:600;">Duration (e.g. 5:30)</label>
              <input type="text" id="addVrDuration" class="vr-search-input" style="width:100%; font-size:0.9rem; padding:10px;" placeholder="5:30">
            </div>
          </div>

          <div>
            <label style="font-size:0.85rem; color:var(--text-secondary); display:block; margin-bottom:6px; font-weight:600;">Description</label>
            <textarea id="addVrDesc" rows="3" class="vr-search-input" style="width:100%; font-size:0.9rem; padding:10px; height:auto;" placeholder="Brief description of what this VR video demonstrates..."></textarea>
          </div>
        </div>

        <div class="vr-modal-footer">
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('addVrModalOverlay').remove()">Cancel</button>
          <button class="btn-vr-add" id="btnSaveCustomVR">Save VR Video</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const saveBtn = modal.querySelector('#btnSaveCustomVR');
    saveBtn.addEventListener('click', () => {
      const urlVal = modal.querySelector('#addVrUrl').value;
      const titleVal = modal.querySelector('#addVrTitle').value;
      const catVal = modal.querySelector('#addVrCategory').value;
      const durVal = modal.querySelector('#addVrDuration').value;
      const descVal = modal.querySelector('#addVrDesc').value;

      if (!urlVal || !titleVal) {
        alert('Please enter both YouTube Link/ID and Title.');
        return;
      }

      const youtubeId = LiveVRManager.extractYouTubeId(urlVal);
      const newVid = {
        id: 'vr_custom_' + Date.now(),
        youtubeId: youtubeId,
        title: titleVal,
        category: catVal || 'Custom',
        duration: durVal || 'VR Demo',
        description: descVal || 'Custom user added YouTube 360° VR video.',
        thumbnail: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
        isDefault: false
      };

      const saved = localStorage.getItem(this.storageKey);
      let customVideos = saved ? JSON.parse(saved) : [];
      customVideos.unshift(newVid);
      this.saveCustomVideos(customVideos);

      this.videos.unshift(newVid);
      modal.remove();
      this.renderGrid();
    });
  }

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }
}
