export class VivaExams {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.exams = [
      {
        id: 'viva_1', title: 'Upper Limb Anatomy Spotter', 
        questions: [
          { q: 'Identify the nerve that wraps around the surgical neck of the humerus.', a: 'Axillary nerve' },
          { q: 'Which muscle initiates abduction of the arm (first 15 degrees)?', a: 'Supraspinatus' },
          { q: 'What structure passes through the carpal tunnel along with the flexor tendons?', a: 'Median nerve' }
        ]
      },
      {
        id: 'viva_2', title: 'Cardiovascular Physiology', 
        questions: [
          { q: 'What does the QRS complex represent on an ECG?', a: 'Ventricular depolarization' },
          { q: 'Which heart sound corresponds to the closure of the AV valves?', a: 'S1 (lub)' },
          { q: 'According to the Frank-Starling law, what increases stroke volume?', a: 'Increased end-diastolic volume (preload)' }
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
    this.exams.forEach((e, idx) => {
      html += `
        <div class="dash-card case-card" style="cursor:pointer;" onclick="window.vivaMgr.startExam(${idx})">
          <h3>Exam ${idx + 1}: ${e.title}</h3>
          <p style="color:var(--text-secondary); margin-top:10px; font-size:0.9rem;">${e.questions.length} Questions</p>
          <div style="margin-top:15px;"><span class="badge" style="background:var(--accent-blue);">Start Viva</span></div>
        </div>
      `;
    });
    html += '</div>';
    this.container.innerHTML = html;
  }

  startExam(idx) {
    const e = this.exams[idx];
    let html = `
      <div class="dash-card">
        <button class="btn btn-secondary btn-sm" onclick="window.vivaMgr.renderList()" style="margin-bottom:20px;">← Back to Exams</button>
        <h2>${e.title}</h2>
        <div style="margin-top:20px;">
    `;
    
    e.questions.forEach((q, qIdx) => {
      html += `
        <div class="case-section" style="margin-top:20px; padding:15px; background:rgba(255,255,255,0.05); border-radius:8px;">
          <h4>Q${qIdx + 1}: ${q.q}</h4>
          <button class="btn btn-secondary btn-sm" style="margin-top:10px;" onclick="document.getElementById('ans_${idx}_${qIdx}').style.display='block'; this.style.display='none';">Show Answer</button>
          <div id="ans_${idx}_${qIdx}" style="display:none; margin-top:10px; padding:10px; background:rgba(16, 185, 129, 0.1); border-left:4px solid var(--accent-green); border-radius:4px;">
            <strong>Answer:</strong> ${q.a}
          </div>
        </div>
      `;
    });
    
    html += `</div></div>`;
    this.container.innerHTML = html;
  }
}
