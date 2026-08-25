/* ========================================
   MEDSIM — Virtual IV Cannulation Simulation
   11-Step Interactive Procedure with Mistake Detection
   ======================================== */

export const CANNULATION_STEPS = [
  {
    id: 1,
    title: '1. Hand Hygiene',
    action: 'sanitizer',
    desc: 'Sanitize hands using alcohol hand rub or soap and water for 20 seconds.',
    correctMsg: '✓ Hands sanitized according to WHO 5 Moments protocol.',
    hint: 'Select the Hand Sanitizer dispenser from the equipment tray.'
  },
  {
    id: 2,
    title: '2. Wear Gloves',
    action: 'gloves',
    desc: 'Don clean, non-sterile nitrile examination gloves.',
    correctMsg: '✓ Gloves donned to maintain aseptic technique.',
    hint: 'Select the Surgical Gloves from the equipment dock.'
  },
  {
    id: 3,
    title: '3. Prepare Equipment',
    action: 'tray',
    desc: 'Inspect IV cannula (20G Pink), chlorhexidine swab, flush, and dressing.',
    correctMsg: '✓ All sterile equipment inspected and prepared.',
    hint: 'Click on the Equipment Tray to inspect your supplies.'
  },
  {
    id: 4,
    title: '4. Select Vein',
    action: 'vein',
    desc: 'Palpate and select a suitable vein in the cubital fossa (Cephalic or Median Cubital).',
    correctMsg: '✓ Median Cubital vein identified — straight, palpable, and well-supported.',
    hint: 'Click on the highlighted Vein on the patient 3D arm.'
  },
  {
    id: 5,
    title: '5. Apply Tourniquet',
    action: 'tourniquet',
    desc: 'Apply tourniquet 10-15 cm above the intended venipuncture site to engorge vein.',
    correctMsg: '✓ Tourniquet applied securely 10cm proximal to insertion site.',
    hint: 'Select the Tourniquet and apply it to the upper arm.'
  },
  {
    id: 6,
    title: '6. Clean Site',
    action: 'swab',
    desc: 'Clean site with 2% Chlorhexidine in 70% Alcohol swab in cross-hatch pattern for 30s. Allow to dry.',
    correctMsg: '✓ Insertion site sanitized and allowed to air dry completely.',
    hint: 'Select the Alcohol Swab to sanitize the skin.'
  },
  {
    id: 7,
    title: '7. Position Cannula',
    action: 'cannula',
    desc: 'Hold IV cannula with dominant hand, uncap, and position at a 15-30 degree angle to skin.',
    correctMsg: '✓ 20G IV Cannula uncapped and held at optimal 20° angle, bevel up.',
    hint: 'Select the 20G Cannula to uncap and position it.'
  },
  {
    id: 8,
    title: '8. Insert Cannula',
    action: 'insert',
    desc: 'Pierce skin and advance cannula needle smoothly into the vein lumen.',
    correctMsg: '✓ Needle entered vein lumen smoothly.',
    hint: 'Click the insertion point on the arm to advance the cannula.'
  },
  {
    id: 9,
    title: '9. Confirm Flashback',
    action: 'flashback',
    desc: 'Observe primary blood flashback in the indicator chamber, lower angle, advance catheter 2mm.',
    correctMsg: '✓ Primary & secondary blood flashback confirmed in chamber! Catheter fully advanced.',
    hint: 'Observe the blood flashback in the cannula chamber and click Flush Syringe to verify flow.'
  },
  {
    id: 10,
    title: '10. Secure Cannula',
    action: 'dressing',
    desc: 'Release tourniquet, apply digital pressure, remove stylet, attach saline flush & sterile transparent dressing.',
    correctMsg: '✓ Tourniquet released, port flushed, and sterile transparent dressing applied.',
    hint: 'Select the Transparent Sterile Dressing to secure the hub.'
  },
  {
    id: 11,
    title: '11. Sharps Disposal',
    action: 'sharps',
    desc: 'Dispose of introducer needle directly into yellow rigid Sharps Container immediately.',
    correctMsg: '✓ Needle stylet safely disposed in Sharps Container. Zero needle-stick risk!',
    hint: 'Click the Sharps Disposal Bin to safely discard the needle.'
  }
];

export class IVCannulationSimulation {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = options;
    this.currentStep = 0;
    this.mistakes = [];
    this.score = 100;
    this.startTime = null;
    this.timerInterval = null;
    this.elapsedSeconds = 0;
    this.hintsUsed = 0;
    this.completed = false;
    this.onProgressUpdate = options.onProgressUpdate || null;
    this.onComplete = options.onComplete || null;
  }

  init() {
    if (!this.container) return;
    this.currentStep = 0;
    this.mistakes = [];
    this.score = 100;
    this.elapsedSeconds = 0;
    this.hintsUsed = 0;
    this.completed = false;
    this.startTimer();
    this.render();
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
      this.elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
      const timerEl = document.getElementById('simTimerDisplay');
      if (timerEl) {
        const mins = String(Math.floor(this.elapsedSeconds / 60)).padStart(2, '0');
        const secs = String(this.elapsedSeconds % 60).padStart(2, '0');
        timerEl.textContent = `${mins}:${secs}`;
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  render() {
    const step = CANNULATION_STEPS[this.currentStep];
    const mins = String(Math.floor(this.elapsedSeconds / 60)).padStart(2, '0');
    const secs = String(this.elapsedSeconds % 60).padStart(2, '0');

    this.container.innerHTML = `
      <div class="cannulation-sim-wrapper" style="display:flex; flex-direction:column; gap:12px; height:calc(100vh - var(--nav-height) - 15px); overflow:hidden; box-sizing:border-box;">
        
        <!-- Header Bar -->
        <div class="sim-header-bar" style="display:flex; justify-content:space-between; align-items:center; background:rgba(10, 16, 28, 0.85); padding:10px 20px; border-radius:10px; border:1px solid var(--border-subtle); backdrop-filter:blur(10px); flex-shrink:0;">
          <div style="display:flex; align-items:center; gap:15px;">
            <span class="badge" style="background:rgba(0, 212, 255, 0.2); color:#00d4ff; font-weight:600; border:1px solid rgba(0, 212, 255, 0.4); font-size:0.7rem;">Virtual Clinical Procedure</span>
            <h2 style="margin:0; font-size:1.15rem; color:#fff;">Peripheral IV Cannulation (20G)</h2>
            <span style="font-size:0.78rem; color:var(--text-secondary);">Patient: Male, 45 Yrs · Target: Cephalic / Median Cubital Vein</span>
          </div>
          <div style="display:flex; gap:16px; align-items:center;">
            <div style="text-align:right;">
              <span style="font-size:0.68rem; color:var(--text-secondary); text-transform:uppercase;">Time: </span>
              <span id="simTimerDisplay" style="font-family:var(--font-mono); font-size:1.05rem; font-weight:700; color:#00d4ff;">${mins}:${secs}</span>
            </div>
            <div style="text-align:right;">
              <span style="font-size:0.68rem; color:var(--text-secondary); text-transform:uppercase;">Score: </span>
              <span style="font-family:var(--font-mono); font-size:1.05rem; font-weight:700; color:${this.score > 80 ? '#10b981' : '#f59e0b'};">${this.score}%</span>
            </div>
            <button id="btnSimHint" class="btn btn-secondary btn-sm" style="display:flex; align-items:center; gap:4px; padding:4px 10px; font-size:0.75rem;">💡 Hint</button>
          </div>
        </div>

        <!-- Main Body Grid (100% Single Page Fit) -->
        <div style="display:grid; grid-template-columns: 1fr 320px; gap:12px; flex:1; min-height:0; overflow:hidden;">
          
          <!-- 3D Interactive Viewport & Floating Equipment Bar -->
          <div id="cannulation3DViewport" style="position:relative; height:100%; min-height:0; background:radial-gradient(circle at center, #111b2b 0%, #060a12 100%); border-radius:10px; border:1px solid var(--border-subtle); overflow:hidden; display:flex; align-items:center; justify-content:center;">
            
            <!-- Simulated 3D Patient Arm Visual Canvas -->
            <div class="patient-arm-stage" style="position:relative; width:100%; height:100%; display:flex; align-items:center; justify-content:center;">
              
              <!-- Arm SVG Graphics Representation -->
              <svg viewBox="0 0 600 250" preserveAspectRatio="xMidYMid meet" style="width:92%; height:82%;">
                <!-- Upper Arm & Forearm -->
                <path d="M 40 125 C 100 70, 220 75, 360 85 C 440 92, 510 100, 560 125 C 510 150, 440 158, 360 165 C 220 175, 100 180, 40 125 Z" fill="#e0ab91" stroke="#c48a70" stroke-width="3"/>
                
                <!-- Tourniquet Overlay -->
                <rect id="tourniquetGraphic" x="110" y="74" width="26" height="102" rx="5" fill="#2563eb" opacity="${this.currentStep >= 4 ? '1' : '0.2'}" style="transition:all 0.5s; cursor:pointer;" />
                
                <!-- Veins (Median Cubital & Cephalic) -->
                <path id="veinGraphic" d="M 170 125 C 240 112, 320 132, 420 125 C 460 122, 500 124, 540 125" fill="none" stroke="#2563eb" stroke-width="${this.currentStep >= 4 ? '10' : '6'}" opacity="0.85" style="cursor:pointer; filter:drop-shadow(0 0 6px rgba(37,99,235,0.8)); transition:all 0.4s;"/>
                
                <!-- Sanitized Swab Moisture Effect -->
                <ellipse id="swabAreaGraphic" cx="330" cy="125" rx="45" ry="30" fill="url(#swabGlow)" opacity="${this.currentStep >= 5 ? '0.7' : '0'}" style="transition:all 0.5s;"/>
                
                <!-- Insertion Point Marker -->
                <circle id="insertionPoint" cx="340" cy="125" r="14" fill="none" stroke="#00d4ff" stroke-dasharray="4" stroke-width="2" style="cursor:pointer; animation:spin 4s linear infinite;">
                  <animate attributeName="r" values="10;16;10" dur="2s" repeatCount="indefinite"/>
                </circle>

                <!-- Cannula Hub & Flashback Graphic -->
                <g id="cannulaGraphic" transform="translate(320, 105)" opacity="${this.currentStep >= 7 ? '1' : '0'}" style="transition:all 0.5s;">
                  <rect x="0" y="15" width="50" height="10" rx="3" fill="#ec4899"/>
                  <polygon points="50,15 75,20 50,25" fill="#cbd5e1"/>
                  <!-- Flashback indicator blood tube -->
                  <rect x="-20" y="17" width="20" height="6" fill="${this.currentStep >= 8 ? '#dc2626' : '#94a3b8'}"/>
                </g>

                <!-- Sterile Dressing Graphic -->
                <rect id="dressingGraphic" x="300" y="105" width="75" height="40" rx="6" fill="rgba(255,255,255,0.7)" stroke="#00d4ff" stroke-width="2" opacity="${this.currentStep >= 9 ? '1' : '0'}" style="transition:all 0.5s;"/>

                <defs>
                  <radialGradient id="swabGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#00d4ff" stop-opacity="0.6"/>
                    <stop offset="100%" stop-color="#00d4ff" stop-opacity="0"/>
                  </radialGradient>
                </defs>
              </svg>
            </div>

            <!-- Real-time Action Feedback Banner -->
            <div id="simFeedbackBanner" style="position:absolute; top:12px; left:50%; transform:translateX(-50%); width:85%; display:none; padding:8px 16px; border-radius:6px; font-size:0.82rem; font-weight:600; text-align:center; z-index:15; box-shadow:0 8px 20px rgba(0,0,0,0.5);"></div>

            <!-- Sleek Floating Horizontal Equipment Dock (No Scroll Needed) -->
            <div class="equipment-dock" style="position:absolute; bottom:10px; left:50%; transform:translateX(-50%); width:94%; background:rgba(10, 16, 28, 0.92); backdrop-filter:blur(12px); padding:8px 12px; border-radius:12px; border:1px solid var(--border-glow); z-index:10; box-shadow:0 8px 25px rgba(0,0,0,0.6);">
              <div style="display:flex; justify-content:center; align-items:center; gap:6px; flex-wrap:nowrap; overflow-x:auto;" id="equipmentGrid">
                
                <button class="equip-btn ${this.currentStep === 0 ? 'pulse-highlight' : ''}" data-action="sanitizer" title="Hand Sanitizer" style="display:flex; align-items:center; gap:4px; padding:5px 9px; background:rgba(255,255,255,0.05); border:1px solid var(--border-subtle); border-radius:6px; color:#fff; cursor:pointer; white-space:nowrap; font-size:0.72rem;">
                  <span>🧼</span> <span>Sanitizer</span>
                </button>

                <button class="equip-btn ${this.currentStep === 1 ? 'pulse-highlight' : ''}" data-action="gloves" title="Gloves" style="display:flex; align-items:center; gap:4px; padding:5px 9px; background:rgba(255,255,255,0.05); border:1px solid var(--border-subtle); border-radius:6px; color:#fff; cursor:pointer; white-space:nowrap; font-size:0.72rem;">
                  <span>🧤</span> <span>Gloves</span>
                </button>

                <button class="equip-btn ${this.currentStep === 2 ? 'pulse-highlight' : ''}" data-action="tray" title="Equipment Tray" style="display:flex; align-items:center; gap:4px; padding:5px 9px; background:rgba(255,255,255,0.05); border:1px solid var(--border-subtle); border-radius:6px; color:#fff; cursor:pointer; white-space:nowrap; font-size:0.72rem;">
                  <span>📋</span> <span>Tray</span>
                </button>

                <button class="equip-btn ${this.currentStep === 3 ? 'pulse-highlight' : ''}" data-action="vein" title="Select Vein" style="display:flex; align-items:center; gap:4px; padding:5px 9px; background:rgba(255,255,255,0.05); border:1px solid var(--border-subtle); border-radius:6px; color:#fff; cursor:pointer; white-space:nowrap; font-size:0.72rem;">
                  <span>🩸</span> <span>Select Vein</span>
                </button>

                <button class="equip-btn ${this.currentStep === 4 ? 'pulse-highlight' : ''}" data-action="tourniquet" title="Tourniquet" style="display:flex; align-items:center; gap:4px; padding:5px 9px; background:rgba(255,255,255,0.05); border:1px solid var(--border-subtle); border-radius:6px; color:#fff; cursor:pointer; white-space:nowrap; font-size:0.72rem;">
                  <span>🎗️</span> <span>Tourniquet</span>
                </button>

                <button class="equip-btn ${this.currentStep === 5 ? 'pulse-highlight' : ''}" data-action="swab" title="Alcohol Swab" style="display:flex; align-items:center; gap:4px; padding:5px 9px; background:rgba(255,255,255,0.05); border:1px solid var(--border-subtle); border-radius:6px; color:#fff; cursor:pointer; white-space:nowrap; font-size:0.72rem;">
                  <span>🧻</span> <span>Swab</span>
                </button>

                <button class="equip-btn ${this.currentStep === 6 ? 'pulse-highlight' : ''}" data-action="cannula" title="20G Cannula" style="display:flex; align-items:center; gap:4px; padding:5px 9px; background:rgba(255,255,255,0.05); border:1px solid var(--border-subtle); border-radius:6px; color:#fff; cursor:pointer; white-space:nowrap; font-size:0.72rem;">
                  <span>💉</span> <span>Cannula</span>
                </button>

                <button class="equip-btn ${this.currentStep === 7 ? 'pulse-highlight' : ''}" data-action="insert" title="Insert Cannula" style="display:flex; align-items:center; gap:4px; padding:5px 9px; background:rgba(255,255,255,0.05); border:1px solid var(--border-subtle); border-radius:6px; color:#fff; cursor:pointer; white-space:nowrap; font-size:0.72rem;">
                  <span>🎯</span> <span>Insert</span>
                </button>

                <button class="equip-btn ${this.currentStep === 8 ? 'pulse-highlight' : ''}" data-action="flashback" title="Flush / Check" style="display:flex; align-items:center; gap:4px; padding:5px 9px; background:rgba(255,255,255,0.05); border:1px solid var(--border-subtle); border-radius:6px; color:#fff; cursor:pointer; white-space:nowrap; font-size:0.72rem;">
                  <span>🧪</span> <span>Flush</span>
                </button>

                <button class="equip-btn ${this.currentStep === 9 ? 'pulse-highlight' : ''}" data-action="dressing" title="Dressing" style="display:flex; align-items:center; gap:4px; padding:5px 9px; background:rgba(255,255,255,0.05); border:1px solid var(--border-subtle); border-radius:6px; color:#fff; cursor:pointer; white-space:nowrap; font-size:0.72rem;">
                  <span>🩹</span> <span>Dressing</span>
                </button>

                <button class="equip-btn ${this.currentStep === 10 ? 'pulse-highlight' : ''}" data-action="sharps" title="Sharps Bin" style="display:flex; align-items:center; gap:4px; padding:5px 9px; background:rgba(255,255,255,0.05); border:1px solid var(--border-subtle); border-radius:6px; color:#fff; cursor:pointer; white-space:nowrap; font-size:0.72rem;">
                  <span>🗑️</span> <span>Sharps</span>
                </button>

              </div>
            </div>

          </div>

          <!-- Right Sidebar: Step Checklist & Active Instruction -->
          <div style="display:flex; flex-direction:column; gap:10px; height:100%; min-height:0; overflow:hidden;">
            
            <!-- Active Step Box -->
            <div style="background:rgba(10, 16, 28, 0.85); padding:12px 15px; border-radius:10px; border:1px solid rgba(0, 212, 255, 0.3); flex-shrink:0;">
              <div style="font-size:0.68rem; font-weight:700; color:#00d4ff; text-transform:uppercase; letter-spacing:0.05em;">Active Step</div>
              <h3 style="margin:4px 0; font-size:1.05rem; color:#fff;">${step ? step.title : 'Procedure Completed'}</h3>
              <p style="margin:0; font-size:0.78rem; color:var(--text-secondary); line-height:1.4;">${step ? step.desc : 'All 11 steps completed cleanly.'}</p>
            </div>

            <!-- 11-Step Progress Checklist (Fitting Panel Height) -->
            <div style="flex:1; min-height:0; background:rgba(10, 16, 28, 0.85); padding:12px; border-radius:10px; border:1px solid var(--border-subtle); display:flex; flex-direction:column; overflow:hidden;">
              <div style="font-size:0.72rem; font-weight:700; color:var(--text-secondary); text-transform:uppercase; margin-bottom:8px; flex-shrink:0;">Step Checklist (11 Steps)</div>
              
              <div style="flex:1; min-height:0; overflow-y:auto; display:flex; flex-direction:column; gap:6px;" id="stepChecklist">
                ${CANNULATION_STEPS.map((s, idx) => {
                  let statusClass = 'pending';
                  let icon = '⭕';
                  if (idx < this.currentStep) { statusClass = 'completed'; icon = '✅'; }
                  else if (idx === this.currentStep) { statusClass = 'active'; icon = '▶️'; }
                  return `
                    <div style="display:flex; align-items:center; gap:8px; padding:6px 8px; border-radius:6px; background:${idx === this.currentStep ? 'rgba(0, 212, 255, 0.1)' : 'rgba(255,255,255,0.02)'}; border:1px solid ${idx === this.currentStep ? 'rgba(0,212,255,0.3)' : 'transparent'}; font-size:0.78rem;">
                      <span>${icon}</span>
                      <span style="color:${idx <= this.currentStep ? '#fff' : 'var(--text-secondary)'}; font-weight:${idx === this.currentStep ? '700' : '400'};">${s.title}</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

          </div>
        </div>

        <!-- Mistake Warning Modal Dialog -->
        <div id="simMistakeModal" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.75); z-index:9999; backdrop-filter:blur(6px); align-items:center; justify-content:center;">
          <div style="background:#0f172a; border:2px solid #ef4444; border-radius:16px; width:90%; max-width:520px; padding:28px; box-shadow:0 25px 50px -12px rgba(239,68,68,0.3); text-align:center;">
            <div style="font-size:3rem; margin-bottom:10px;">⚠️</div>
            <div style="font-family:var(--font-heading); font-size:1.4rem; font-weight:800; color:#ef4444; text-transform:uppercase; letter-spacing:0.05em;">Procedure Error Detected</div>
            <h3 id="mistakeModalTitle" style="margin:12px 0 6px 0; color:#fff; font-size:1.15rem;">Incorrect Procedure Order</h3>
            <p id="mistakeModalDesc" style="color:var(--text-secondary); font-size:0.9rem; line-height:1.5; margin-bottom:20px;"></p>
            
            <div style="background:rgba(239, 68, 68, 0.1); border:1px solid rgba(239,68,68,0.3); padding:12px 16px; border-radius:8px; text-align:left; margin-bottom:20px;">
              <div style="font-size:0.75rem; font-weight:700; color:#ef4444; text-transform:uppercase;">Correct Action Required</div>
              <div id="mistakeModalCorrect" style="font-size:0.85rem; color:#fff; margin-top:4px; font-weight:600;"></div>
            </div>

            <button id="btnRetryMistake" class="btn btn-primary" style="width:100%; background:#ef4444; border-color:#ef4444;">Retry Action (-10 Pts)</button>
          </div>
        </div>

        <!-- End of Simulation Score Modal -->
        <div id="simScoreModal" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.85); z-index:9999; backdrop-filter:blur(10px); align-items:center; justify-content:center;">
          <div style="background:#0b1329; border:1px solid var(--accent-medical); border-radius:20px; width:90%; max-width:650px; padding:32px; box-shadow:0 25px 50px rgba(0,212,255,0.2); text-align:center;">
            <div style="font-size:3rem; margin-bottom:5px;">🎉</div>
            <div style="font-family:var(--font-heading); font-size:1.8rem; font-weight:800; color:#00d4ff; letter-spacing:0.05em;">Simulation Complete</div>
            <p style="color:var(--text-secondary); margin-top:4px; font-size:0.95rem;">Peripheral IV Cannulation Protocol Executed Successfully</p>

            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; margin:24px 0;">
              <div style="background:rgba(255,255,255,0.04); padding:14px; border-radius:10px; border:1px solid var(--border-subtle);">
                <div style="font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase;">Accuracy</div>
                <div id="scoreAccuracy" style="font-size:1.4rem; font-weight:800; color:#10b981; margin-top:4px;">95%</div>
              </div>
              <div style="background:rgba(255,255,255,0.04); padding:14px; border-radius:10px; border:1px solid var(--border-subtle);">
                <div style="font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase;">Safety</div>
                <div id="scoreSafety" style="font-size:1.4rem; font-weight:800; color:#00d4ff; margin-top:4px;">98%</div>
              </div>
              <div style="background:rgba(255,255,255,0.04); padding:14px; border-radius:10px; border:1px solid var(--border-subtle);">
                <div style="font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase;">Procedure</div>
                <div id="scoreProc" style="font-size:1.4rem; font-weight:800; color:#7c3aed; margin-top:4px;">92%</div>
              </div>
              <div style="background:rgba(255,255,255,0.04); padding:14px; border-radius:10px; border:1px solid var(--border-subtle);">
                <div style="font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase;">XP Earned</div>
                <div id="scoreXP" style="font-size:1.4rem; font-weight:800; color:#f59e0b; margin-top:4px;">+350 XP</div>
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; text-align:left; margin-bottom:24px;">
              <div style="background:rgba(16, 185, 129, 0.08); border:1px solid rgba(16, 185, 129, 0.3); padding:14px; border-radius:10px;">
                <div style="font-size:0.75rem; font-weight:700; color:#10b981; text-transform:uppercase;">💪 Strong Areas</div>
                <div style="font-size:0.85rem; color:#fff; margin-top:6px;">Aseptic Technique, Sharps Safety, Vein Selection</div>
              </div>
              <div style="background:rgba(245, 158, 11, 0.08); border:1px solid rgba(245, 158, 11, 0.3); padding:14px; border-radius:10px;">
                <div style="font-size:0.75rem; font-weight:700; color:#f59e0b; text-transform:uppercase;">🎯 Needs Practice</div>
                <div style="font-size:0.85rem; color:#fff; margin-top:6px;">Insertion Angle Alignment (Keep strictly at 15-30°)</div>
              </div>
            </div>

            <div style="display:flex; gap:15px;">
              <button id="btnRepeatSim" class="btn btn-secondary" style="flex:1;">Repeat Simulation</button>
              <button id="btnExitSim" class="btn btn-primary" style="flex:1;">Return to Dashboard</button>
            </div>
          </div>
        </div>

      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    // Equipment buttons
    const equipBtns = this.container.querySelectorAll('.equip-btn');
    equipBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        this.handleAction(action);
      });
    });

    // 3D Arm Click Targets
    const veinG = this.container.querySelector('#veinGraphic');
    const insertPt = this.container.querySelector('#insertionPoint');
    const tournG = this.container.querySelector('#tourniquetGraphic');

    if (veinG) veinG.addEventListener('click', () => this.handleAction('vein'));
    if (insertPt) insertPt.addEventListener('click', () => this.handleAction('insert'));
    if (tournG) tournG.addEventListener('click', () => this.handleAction('tourniquet'));

    // Hint Button
    const btnHint = this.container.querySelector('#btnSimHint');
    if (btnHint) {
      btnHint.addEventListener('click', () => {
        this.hintsUsed++;
        const step = CANNULATION_STEPS[this.currentStep];
        this.showFeedback('info', `💡 HINT: ${step ? step.hint : 'Follow the step checklist.'}`);
      });
    }

    // Modal Buttons
    const btnRetry = this.container.querySelector('#btnRetryMistake');
    if (btnRetry) {
      btnRetry.addEventListener('click', () => {
        const modal = this.container.querySelector('#simMistakeModal');
        if (modal) modal.style.display = 'none';
      });
    }

    const btnRepeat = this.container.querySelector('#btnRepeatSim');
    if (btnRepeat) {
      btnRepeat.addEventListener('click', () => {
        const modal = this.container.querySelector('#simScoreModal');
        if (modal) modal.style.display = 'none';
        this.init();
      });
    }

    const btnExit = this.container.querySelector('#btnExitSim');
    if (btnExit) {
      btnExit.addEventListener('click', () => {
        const modal = this.container.querySelector('#simScoreModal');
        if (modal) modal.style.display = 'none';
        if (this.options.onExit) this.options.onExit();
      });
    }
  }

  handleAction(action) {
    if (this.completed) return;
    const step = CANNULATION_STEPS[this.currentStep];

    if (action === step.action) {
      // Correct Step Executed
      this.showFeedback('success', step.correctMsg);
      this.currentStep++;

      if (this.currentStep >= CANNULATION_STEPS.length) {
        this.completeSimulation();
      } else {
        this.render();
      }
    } else {
      // Mistake Triggered!
      this.triggerMistake(action, step);
    }
  }

  triggerMistake(attemptedAction, expectedStep) {
    this.score = Math.max(0, this.score - 10);
    this.mistakes.push({
      attempted: attemptedAction,
      expected: expectedStep.action,
      time: this.elapsedSeconds
    });

    let desc = `You attempted to perform "${attemptedAction.toUpperCase()}" before completing "${expectedStep.title}".`;
    if (attemptedAction === 'cannula' || attemptedAction === 'insert') {
      desc = `You attempted to insert the IV cannula before sanitizing the site or applying the tourniquet. This risks severe intravascular contamination!`;
    } else if (attemptedAction === 'tourniquet' && this.currentStep < 1) {
      desc = `You must perform hand hygiene and wear gloves before touching the patient or equipment.`;
    }

    const modal = this.container.querySelector('#simMistakeModal');
    const titleEl = this.container.querySelector('#mistakeModalTitle');
    const descEl = this.container.querySelector('#mistakeModalDesc');
    const correctEl = this.container.querySelector('#mistakeModalCorrect');

    if (modal && titleEl && descEl && correctEl) {
      titleEl.textContent = `Aseptic / Procedural Mistake`;
      descEl.textContent = desc;
      correctEl.textContent = expectedStep.hint;
      modal.style.display = 'flex';
    }

    this.render();
  }

  showFeedback(type, message) {
    const banner = this.container.querySelector('#simFeedbackBanner');
    if (!banner) return;

    banner.style.display = 'block';
    if (type === 'success') {
      banner.style.background = 'rgba(16, 185, 129, 0.95)';
      banner.style.color = '#fff';
    } else if (type === 'info') {
      banner.style.background = 'rgba(0, 212, 255, 0.95)';
      banner.style.color = '#000';
    } else {
      banner.style.background = 'rgba(239, 68, 68, 0.95)';
      banner.style.color = '#fff';
    }
    banner.textContent = message;

    setTimeout(() => {
      if (banner) banner.style.display = 'none';
    }, 3500);
  }

  completeSimulation() {
    this.completed = true;
    this.stopTimer();

    const scoreModal = this.container.querySelector('#simScoreModal');
    const accEl = this.container.querySelector('#scoreAccuracy');
    const safeEl = this.container.querySelector('#scoreSafety');
    const procEl = this.container.querySelector('#scoreProc');

    if (scoreModal) {
      if (accEl) accEl.textContent = `${Math.max(70, this.score)}%`;
      if (safeEl) safeEl.textContent = `${100 - (this.mistakes.length * 5)}%`;
      if (procEl) procEl.textContent = `${Math.max(65, this.score - 5)}%`;
      scoreModal.style.display = 'flex';
    }

    if (this.onComplete) {
      this.onComplete({
        score: this.score,
        time: this.elapsedSeconds,
        mistakes: this.mistakes.length
      });
    }
  }
}
