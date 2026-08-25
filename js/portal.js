/* ========================================
   ImmersiMed v2 — Portal Navigation & Data
   Subject/topic definitions, view routing
   ======================================== */

export const SUBJECTS = [
  {
    id: 'anatomy', name: 'Anatomy', icon: '🦴', color: '#00d4ff',
    description: 'Study of body structures and their relationships',
    topics: [
      { id: 'heart', name: 'Heart Dissection', icon: '❤️', region: 'Thorax', difficulty: 'beginner', duration: '20 min', steps: 10, desc: 'Open the thoracic cavity and perform a complete heart dissection — identify chambers, valves, and great vessels.' },
      { id: 'lungs', name: 'Lung Examination', icon: '🫁', region: 'Thorax', difficulty: 'beginner', duration: '15 min', steps: 8, desc: 'Examine the lungs in situ, identify lobes, fissures, and bronchial tree.' },
      { id: 'liver', name: 'Liver & Hepatobiliary', icon: '🫘', region: 'Abdomen', difficulty: 'intermediate', duration: '25 min', steps: 9, desc: 'Dissect the hepatobiliary system — liver lobes, gallbladder, and biliary ducts.' },
      { id: 'brain', name: 'Brain & Cranial Nerves', icon: '🧠', region: 'Head', difficulty: 'advanced', duration: '30 min', steps: 12, desc: 'Perform craniotomy and examine cerebral hemispheres, ventricles, and cranial nerves.' },
      { id: 'kidney', name: 'Renal System', icon: '🫘', region: 'Retroperitoneum', difficulty: 'intermediate', duration: '20 min', steps: 8, desc: 'Explore the kidneys, ureters, and renal vasculature in the retroperitoneal space.' },
      { id: 'eye', name: 'Eye Anatomy', icon: '👁️', region: 'Head', difficulty: 'intermediate', duration: '15 min', steps: 7, desc: 'Dissect the globe of the eye and identify layers, chambers, and the optic nerve.' },
    ],
  },
  {
    id: 'physiology', name: 'Physiology', icon: '⚡', color: '#7c3aed',
    description: 'Study of body functions and mechanisms',
    topics: [
      { id: 'cardiac_cycle', name: 'Cardiac Cycle', icon: '💓', region: 'Cardiovascular', difficulty: 'beginner', duration: '15 min', steps: 6, desc: 'Visualize the cardiac cycle phases — systole, diastole, and valve mechanics.' },
      { id: 'respiratory', name: 'Respiratory Mechanics', icon: '🌬️', region: 'Pulmonary', difficulty: 'intermediate', duration: '20 min', steps: 7, desc: 'Explore the mechanics of breathing — diaphragm, lung compliance, and gas exchange.' },
    ],
  },
  {
    id: 'surgery', name: 'Surgery', icon: '🔪', color: '#ef4444',
    description: 'Surgical procedures and techniques',
    topics: [
      { id: 'appendectomy', name: 'Appendectomy', icon: '✂️', region: 'Abdomen', difficulty: 'intermediate', duration: '30 min', steps: 12, desc: 'Step-by-step appendix removal procedure with proper surgical technique.' },
    ],
  },
  {
    id: 'pathology', name: 'Pathology', icon: '🔬', color: '#f59e0b',
    description: 'Study of disease processes',
    topics: [
      { id: 'mi', name: 'Myocardial Infarction', icon: '💔', region: 'Cardiovascular', difficulty: 'advanced', duration: '25 min', steps: 8, desc: 'Examine pathological changes in myocardial infarction — necrosis, fibrosis, and remodeling.' },
    ],
  },
  {
    id: 'histology', name: 'Histology', icon: '🧫', color: '#10b981',
    description: 'Microscopic study of tissues',
    topics: [
      { id: 'cardiac_tissue', name: 'Cardiac Muscle Tissue', icon: '🔎', region: 'Cardiovascular', difficulty: 'beginner', duration: '10 min', steps: 5, desc: 'Examine cardiac muscle histology — intercalated discs, striations, and nuclei.' },
    ],
  },
  {
    id: 'forensic', name: 'Forensic Medicine', icon: '🕵️', color: '#f43f5e',
    description: 'Medico-legal examination techniques',
    topics: [
      { id: 'postmortem', name: 'Postmortem Examination', icon: '📋', region: 'Full Body', difficulty: 'advanced', duration: '40 min', steps: 15, desc: 'Complete postmortem examination protocol — external, internal, and systematic organ inspection.' },
    ],
  },
  {
    id: 'clinical_skills', name: 'Clinical Skills', icon: '🩺', color: '#10b981',
    description: 'Basic clinical examination and practical procedures',
    topics: [
      { id: 'hand_washing', name: 'Hand Washing & PPE', icon: '🧼', region: 'General', difficulty: 'beginner', duration: '5 min', steps: 7, desc: 'WHO protocol for effective hand washing and PPE donning/doffing.' },
      { id: 'bp_measurement', name: 'Blood Pressure Measurement', icon: '🩸', region: 'Arm', difficulty: 'beginner', duration: '10 min', steps: 6, desc: 'Accurate measurement of blood pressure using a sphygmomanometer.' },
      { id: 'iv_cannulation', name: 'IV Cannulation', icon: '💉', region: 'Arm', difficulty: 'intermediate', duration: '15 min', steps: 10, desc: 'Insert a peripheral intravenous cannula safely and effectively.' },
      { id: 'cpr', name: 'Basic Life Support (CPR)', icon: '🫀', region: 'Chest', difficulty: 'advanced', duration: '20 min', steps: 8, desc: 'Perform high-quality chest compressions and airway management.' },
      { id: 'suturing', name: 'Basic Suturing', icon: '🧵', region: 'Skin', difficulty: 'intermediate', duration: '25 min', steps: 9, desc: 'Perform simple interrupted sutures on a simulated laceration.' },
      { id: 'catheterization', name: 'Urinary Catheterization', icon: '🧪', region: 'Pelvis', difficulty: 'advanced', duration: '20 min', steps: 12, desc: 'Aseptic insertion of a Foley catheter.' }
    ],
  },
];

export function getSubject(id) {
  if (!id) return SUBJECTS[0];
  return SUBJECTS.find(s => s.id === id) || SUBJECTS[0];
}

export function getTopic(subjectId, topicId) {
  if (subjectId) {
    const subject = getSubject(subjectId);
    if (subject && subject.topics) {
      const found = subject.topics.find(t => t.id === topicId);
      if (found) return found;
    }
  }
  // Fallback: search all subjects for topicId
  for (const s of SUBJECTS) {
    const t = s.topics.find(top => top.id === topicId);
    if (t) return t;
  }
  return null;
}

export function getAllTopics() {
  const topics = [];
  for (const s of SUBJECTS) {
    for (const t of s.topics) {
      topics.push({ ...t, subjectId: s.id, subjectName: s.name });
    }
  }
  return topics;
}

/* ══ View Router ══ */
export class ViewRouter {
  constructor() {
    this.views = {};
    this.current = null;
    this.listeners = [];
    this.history = [];
  }

  register(name, element) {
    this.views[name] = element;
  }

  navigate(name, params = {}) {
    if (this.current) {
      const prev = this.views[this.current];
      if (prev) prev.classList.remove('active');
    }

    this.history.push({ view: this.current, params });
    this.current = name;

    const next = this.views[name];
    if (next) {
      next.classList.add('active');
      // Scroll to top
      next.scrollTop = 0;
    }

    // Update nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.view === name);
    });

    this._notify(name, params);
  }

  back() {
    if (this.history.length > 1) {
      this.history.pop();
      const prev = this.history[this.history.length - 1];
      if (prev) {
        this.current = null; // prevent double push
        this.navigate(prev.view, prev.params);
      }
    }
  }

  onChange(fn) {
    this.listeners.push(fn);
  }

  _notify(view, params) {
    this.listeners.forEach(fn => fn(view, params));
  }
}
