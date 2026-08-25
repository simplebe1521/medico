/* ========================================
   MEDSIM — 5-Year MBBS Interactive Roadmap
   ======================================== */

export const MBBS_ROADMAP = [
  {
    year: 1,
    title: 'YEAR 1: Foundation Stage',
    phase: 'Pre-Clinical',
    desc: 'Master human structural anatomy, organ function mechanics, and biochemical pathways.',
    subjects: [
      { id: 'anatomy', name: 'Gross & Microscopic Anatomy', icon: '🦴', topics: 'Heart Dissection, Brain, Lungs, Kidneys', target: 'topics', subjectId: 'anatomy' },
      { id: 'physiology', name: 'Human Physiology', icon: '⚡', topics: 'Cardiac Cycle, Respiratory Mechanics', target: 'topics', subjectId: 'physiology' },
      { id: 'biochemistry', name: 'Medical Biochemistry', icon: '🧪', topics: 'Enzyme Kinetics, Metabolic Pathways', target: 'topics', subjectId: 'physiology' }
    ]
  },
  {
    year: 2,
    title: 'YEAR 2: Para-Clinical Stage',
    phase: 'Para-Clinical',
    desc: 'Understand disease etiology, tissue pathology, drug actions, and medico-legal principles.',
    subjects: [
      { id: 'pathology', name: 'General & Systemic Pathology', icon: '🔬', topics: 'Myocardial Infarction, Tissue Necrosis', target: 'topics', subjectId: 'pathology' },
      { id: 'microbiology', name: 'Medical Microbiology', icon: '🧫', topics: 'Bacterial Staining, Viral Pathogenesis', target: 'topics', subjectId: 'histology' },
      { id: 'pharmacology', name: 'Pharmacology & Therapeutics', icon: '💊', topics: 'Drug Receptors, Pharmacokinetics', target: 'topics', subjectId: 'physiology' },
      { id: 'forensic', name: 'Forensic Medicine & Toxicology', icon: '🕵️', topics: 'Postmortem Autopsy Protocol', target: 'topics', subjectId: 'forensic' }
    ]
  },
  {
    year: 3,
    title: 'YEAR 3: Clinical Foundation Stage',
    phase: 'Clinical Foundation',
    desc: 'Transition to bed-side examination, public health, and specialized head/neck clinical skills.',
    subjects: [
      { id: 'community', name: 'Community Medicine & Epidemiology', icon: '🏥', topics: 'Outbreak Investigation, Immunization', target: 'topics', subjectId: 'clinical_skills' },
      { id: 'ent', name: 'Otorhinolaryngology (ENT)', icon: '👂', topics: 'Otoscopy, Tuning Fork Examinations', target: 'topics', subjectId: 'clinical_skills' },
      { id: 'ophthalmology', name: 'Ophthalmology', icon: '👁️', topics: 'Fundoscopy, Slit Lamp Inspection', target: 'topics', subjectId: 'anatomy' }
    ]
  },
  {
    year: 4,
    title: 'YEAR 4: Major Clinical Subjects Stage',
    phase: 'Major Clinical',
    desc: 'Diagnose complex diseases, perform inpatient care, obstetrical evaluations, and surgical procedures.',
    subjects: [
      { id: 'medicine', name: 'Internal Medicine', icon: '🩺', topics: 'Cardiovascular & Respiratory Exams', target: 'topics', subjectId: 'clinical_skills' },
      { id: 'surgery', name: 'General Surgery', icon: '🔪', topics: 'Appendectomy, Wound Suturing', target: 'topics', subjectId: 'surgery' },
      { id: 'obgyn', name: 'Obstetrics & Gynecology', icon: '👶', topics: 'Partogram, Fetal Monitoring', target: 'topics', subjectId: 'clinical_skills' },
      { id: 'pediatrics', name: 'Pediatrics & Child Health', icon: '🧸', topics: 'Neonatal Resuscitation, Growth Assessment', target: 'topics', subjectId: 'clinical_skills' }
    ]
  },
  {
    year: 5,
    title: 'YEAR 5: Advanced Clinical Practice (Internship)',
    phase: 'Internship & Rotation',
    desc: 'High-intensity rotational internship in trauma, emergency resuscitation, and practical bedside procedures.',
    subjects: [
      { id: 'iv_cannulation_sim', name: 'Peripheral IV Cannulation Protocol', icon: '💉', topics: '11-Step Interactive Simulation', target: 'sim_iv', subjectId: 'clinical_skills' },
      { id: 'cpr_sim', name: 'Basic Life Support (CPR)', icon: '🫀', topics: 'AHA Resuscitation Algorithm', target: 'topics', subjectId: 'clinical_skills' },
      { id: 'emergency', name: 'Emergency Medicine & Trauma', icon: '🚑', topics: 'Airway Management, Triage', target: 'topics', subjectId: 'clinical_skills' },
      { id: 'orthopedics', name: 'Orthopedics & Fracture Casting', icon: '🦴', topics: 'Splinting, Joint Dislocation', target: 'topics', subjectId: 'clinical_skills' }
    ]
  }
];

export class MBDSRoadmapComponent {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = options;
  }

  init() {
    if (!this.container) return;
    this.render();
  }

  render() {
    let html = `
      <div class="mbbs-roadmap-wrapper" style="padding:10px 0;">
        <div style="margin-bottom:25px; text-align:left;">
          <h2 style="font-size:1.6rem; color:#fff; font-weight:800; font-family:var(--font-heading);">5-Year MBBS Academic Progression</h2>
          <p style="color:var(--text-secondary); font-size:0.95rem; margin-top:4px;">Interactive medical curriculum timeline from Foundation Stage to Rotational Clinical Internship.</p>
        </div>

        <div class="timeline-container" style="display:flex; flex-direction:column; gap:25px; position:relative;">
          
          ${MBBS_ROADMAP.map((yearData, idx) => `
            <div class="roadmap-year-card" style="background:rgba(10, 16, 28, 0.7); border:1px solid var(--border-subtle); border-radius:16px; padding:24px; transition:all 0.3s ease; position:relative; overflow:hidden;">
              <div style="position:absolute; top:0; left:0; width:6px; height:100%; background:linear-gradient(180deg, #00d4ff, #7c3aed);"></div>
              
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; flex-wrap:wrap; gap:10px;">
                <div>
                  <span class="badge" style="background:rgba(0,212,255,0.15); color:#00d4ff; font-weight:700; border:1px solid rgba(0,212,255,0.3);">${yearData.phase}</span>
                  <h3 style="margin:6px 0 0 0; font-size:1.3rem; color:#fff;">${yearData.title}</h3>
                </div>
                <div style="font-size:0.85rem; color:var(--text-secondary);">${yearData.subjects.length} Core Disciplines</div>
              </div>

              <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:20px; line-height:1.5;">${yearData.desc}</p>

              <!-- Subjects Grid for this Year -->
              <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(240px, 1fr)); gap:15px;">
                ${yearData.subjects.map(s => `
                  <div class="roadmap-subject-chip" data-target="${s.target}" data-subject="${s.subjectId}" style="background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:12px; padding:15px; cursor:pointer; transition:all 0.25s; display:flex; flex-direction:column; justify-content:space-between;">
                    <div>
                      <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                        <span style="font-size:1.5rem;">${s.icon}</span>
                        <span style="font-weight:700; color:#fff; font-size:0.95rem;">${s.name}</span>
                      </div>
                      <div style="font-size:0.8rem; color:var(--text-secondary);">${s.topics}</div>
                    </div>
                    <div style="margin-top:15px; display:flex; align-items:center; justify-content:space-between; font-size:0.75rem; color:#00d4ff; font-weight:600;">
                      <span>Launch Module</span>
                      <span>➔</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}

        </div>
      </div>
    `;

    this.container.innerHTML = html;
    this.attachEvents();
  }

  attachEvents() {
    const chips = this.container.querySelectorAll('.roadmap-subject-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const target = chip.dataset.target;
        const subjectId = chip.dataset.subject;
        if (target === 'sim_iv') {
          if (this.options.onLaunchSim) this.options.onLaunchSim('iv_cannulation');
        } else {
          if (this.options.onLaunchSubject) this.options.onLaunchSubject(subjectId);
        }
      });
    });
  }
}
