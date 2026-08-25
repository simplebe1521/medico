export class ClinicalCases {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.cases = [
      {
        id: 'case_1', title: '55M with crushing chest pain', 
        history: 'A 55-year-old male presents to the ER with central crushing chest pain radiating to the left arm and jaw. He is diaphoretic and short of breath.',
        vitals: 'BP: 160/90, HR: 110, RR: 24, SpO2: 92%',
        options: [
          { text: 'Order ECG and Trop T', correct: true, feedback: 'Correct. This is the first step for suspected ACS.' },
          { text: 'Administer paracetamol', correct: false, feedback: 'Incorrect. Paracetamol will not help myocardial ischemia.' },
          { text: 'Discharge with reassurance', correct: false, feedback: 'Dangerous! This patient needs immediate evaluation for MI.' }
        ]
      },
      {
        id: 'case_2', title: '22F with right iliac fossa pain', 
        history: 'A 22-year-old female presents with 12 hours of periumbilical pain migrating to the right iliac fossa, accompanied by nausea and anorexia.',
        vitals: 'BP: 110/70, HR: 95, Temp: 37.8°C, RR: 16',
        options: [
          { text: 'Prescribe antibiotics and discharge', correct: false, feedback: 'Incorrect. She needs surgical evaluation.' },
          { text: 'Order Abdominal Ultrasound / CT', correct: true, feedback: 'Correct. Imaging confirms the suspicion of acute appendicitis.' },
          { text: 'Advise laxatives', correct: false, feedback: 'Incorrect. Laxatives are contraindicated in acute abdomen.' }
        ]
      }
    ];
  }

  init() {
    if (!this.container) return;
    this.renderList();
  }

  renderList() {
    let html = '<div class="cases-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:20px;">';
    this.cases.forEach((c, idx) => {
      html += `
        <div class="dash-card case-card" style="cursor:pointer;" onclick="window.casesMgr.startCase(${idx})">
          <h3>Case ${idx + 1}: ${c.title}</h3>
          <p style="color:var(--text-secondary); margin-top:10px; font-size:0.9rem;">${c.history.substring(0, 80)}...</p>
          <div style="margin-top:15px;"><span class="badge">Start Case</span></div>
        </div>
      `;
    });
    html += '</div>';
    this.container.innerHTML = html;
  }

  startCase(idx) {
    const c = this.cases[idx];
    let html = `
      <div class="dash-card">
        <button class="btn btn-secondary btn-sm" onclick="window.casesMgr.renderList()" style="margin-bottom:20px;">← Back to Cases</button>
        <h2>${c.title}</h2>
        
        <div class="case-section" style="margin-top:20px;">
          <h3>Clinical History</h3>
          <p style="padding:15px; background:rgba(255,255,255,0.05); border-radius:8px; border-left:4px solid var(--accent-medical);">${c.history}</p>
        </div>
        
        <div class="case-section" style="margin-top:20px;">
          <h3>Vitals</h3>
          <p style="padding:15px; background:rgba(255,255,255,0.05); border-radius:8px; border-left:4px solid #ef4444;">${c.vitals}</p>
        </div>

        <div class="case-section" style="margin-top:30px;">
          <h3>What is your next step in management?</h3>
          <div style="display:flex; flex-direction:column; gap:10px; margin-top:15px;" id="caseOptions">
            ${c.options.map((opt, oIdx) => `
              <button class="btn btn-secondary" style="text-align:left; padding:15px;" onclick="window.casesMgr.checkAnswer(${idx}, ${oIdx})">${opt.text}</button>
            `).join('')}
          </div>
          <div id="caseFeedback" style="margin-top:20px; font-weight:bold;"></div>
        </div>
      </div>
    `;
    this.container.innerHTML = html;
  }

  checkAnswer(cIdx, oIdx) {
    const c = this.cases[cIdx];
    const opt = c.options[oIdx];
    const fb = document.getElementById('caseFeedback');
    
    if (opt.correct) {
      fb.style.color = 'var(--accent-green)';
      fb.innerHTML = '✅ ' + opt.feedback;
    } else {
      fb.style.color = '#ef4444';
      fb.innerHTML = '❌ ' + opt.feedback;
    }
  }
}
