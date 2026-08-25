/* ========================================
   ImmersiMed v2 — Main Application Controller
   View routing, all module wiring, UI state
   ======================================== */

import { ParticleSystem } from './particles.js?v=13.0';
import { SimulationEngine } from './simulation.js?v=13.0';
import { InstrumentManager, INSTRUMENTS } from './instruments.js?v=13.0';
import { LessonManager } from './lessons.js?v=13.0';
import { ViewRouter, SUBJECTS, getSubject, getTopic, getAllTopics } from './portal.js?v=13.0';
import { AITutor } from './ai-tutor.js?v=13.0';
import { getAIConfig, saveAIConfig } from './ai-client.js';
import { AIView } from './ai-view.js?v=13.0';
import { NotesManager } from './notes.js?v=13.0';
import { ClinicalCases } from './cases.js?v=13.0';
import { PracticalSkills } from './skills.js?v=13.0';
import { VivaExams } from './viva.js?v=13.0';
import { QuizEngine } from './quiz.js?v=13.0';
import { ProgressTracker } from './progress.js?v=13.0';
import { IVCannulationSimulation } from './cannulation-sim.js?v=13.0';
import { MBDSRoadmapComponent } from './roadmap.js?v=13.0';
import { initScrollAnimations, initCounterAnimations, initSmoothScroll } from './animations.js?v=13.0';

/* ── Globals ── */
let router, sim, particles, instruments, lessonMgr, tutor, quiz, progress, aiFullView, notesMgr, casesMgr, skillsMgr, vivaMgr, ivSim, roadmapComp;
let currentSubjectId = null, currentTopicId = null;
let learningMode = 'beginner';

/* ══════════════════════════════════
   DOM Ready
   ══════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  router = new ViewRouter();
  instruments = new InstrumentManager();
  lessonMgr = new LessonManager();
  quiz = new QuizEngine();
  progress = new ProgressTracker();
  aiFullView = new AIView('aiContainer');
  notesMgr = new NotesManager('notesContainer');
  casesMgr = new ClinicalCases('casesContainer');
  skillsMgr = new PracticalSkills('skillsContainer');
  vivaMgr = new VivaExams('vivaContainer');
  
  // Expose to window for inline onclick handlers
  window.router = router;
  window.casesMgr = casesMgr;
  window.vivaMgr = vivaMgr;
  window.launchLab = launchLab;
  
  aiFullView.init();
  notesMgr.init();
  casesMgr.init();
  skillsMgr.init();
  vivaMgr.init();

  // Initialize 5-Year MBBS Roadmap
  roadmapComp = new MBDSRoadmapComponent('mbbsRoadmapContainer', {
    onLaunchSim: (topicId) => launchLab('clinical_skills', topicId),
    onLaunchSubject: (subjectId) => {
      renderTopics(subjectId);
      router.navigate('topics');
    }
  });
  roadmapComp.init();

  // Global Search Logic
  const searchInput = document.getElementById('globalSearch');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim().toLowerCase();
        if (query) {
          // If searching for cases
          if (query.includes('case') || query.includes('pain') || query.includes('patient')) {
            router.navigate('cases');
          } 
          // If searching for viva
          else if (query.includes('viva') || query.includes('exam') || query.includes('question')) {
            router.navigate('viva');
          }
          // Default to AI assistant
          else {
            router.navigate('ai');
            const aiInput = document.getElementById('aiFullInput');
            if (aiInput) {
              aiInput.value = query;
              document.getElementById('aiFullSendBtn')?.click();
            }
          }
        }
      }
    });
  }

  // Register views
  ['portal', 'topics', 'lab', 'quiz', 'dashboard', 'cases', 'skills', 'viva', 'ai', 'notes'].forEach(v => {
    const el = document.getElementById(v + 'View');
    if (el) router.register(v, el);
  });

  // Particles
  particles = new ParticleSystem('portalParticles');

  // Nav tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const view = tab.dataset.view;
      if (view === 'lab') {
        launchLab(currentSubjectId || 'clinical_skills', currentTopicId || 'iv_cannulation');
        return;
      }
      router.navigate(view);
    });
  });

  // Router change handlers
  router.onChange((view) => {
    if (view === 'portal') renderPortal();
    if (view === 'dashboard') renderDashboard();
    if (view === 'quiz') renderQuizView();
    if (view === 'topics') renderTopics();
    if (view === 'lab' && !currentTopicId) {
      launchLab('clinical_skills', 'iv_cannulation');
    }
    
    // Automatically trigger entry animations for the newly active view panel
    setTimeout(() => {
      const activePanel = document.getElementById(view + 'View');
      if (activePanel) {
        activePanel.querySelectorAll('.animate-in').forEach(el => {
          el.classList.add('visible');
        });
      }
    }, 50);
  });

  // Setup portal
  setupPortal();
  setupLabUI();
  setupQuizUI();
  setupSettingsModal();

  // Scroll animations for portal content
  initScrollAnimations();
  initCounterAnimations();
  initSmoothScroll();

  // Navigate to portal
  router.navigate('portal');
});

/* ══════════════════════════════════
   PORTAL VIEW
   ══════════════════════════════════ */
function setupPortal() {
  // Subject cards
  const grid = document.getElementById('subjectGrid');
  if (!grid) return;

  SUBJECTS.forEach(sub => {
    const card = document.createElement('div');
    card.className = `subject-card animate-in${sub.topics.length === 0 ? ' locked' : ''}`;
    card.dataset.subject = sub.id;
    card.style.setProperty('--card-accent', `linear-gradient(90deg, ${sub.color}, ${sub.color}88)`);

    const prog = progress.getSubjectProgress(sub.id, sub.topics.length);
    card.innerHTML = `
      <span class="subject-icon">${sub.icon}</span>
      <h3>${sub.name}</h3>
      <p>${sub.description}</p>
      <div class="subject-progress-bar"><div class="subject-progress-fill" style="width:${prog}%;background:linear-gradient(90deg,${sub.color},${sub.color}88)"></div></div>
      <div class="subject-progress-label">${prog}% complete</div>
    `;

    card.addEventListener('click', () => {
      currentSubjectId = sub.id;
      renderTopics(sub.id);
      router.navigate('topics');
    });

    grid.appendChild(card);
  });
}

function renderPortal() {
  // Update progress on subject cards
  SUBJECTS.forEach(sub => {
    const card = document.querySelector(`.subject-card[data-subject="${sub.id}"]`);
    if (!card) return;
    const prog = progress.getSubjectProgress(sub.id, sub.topics.length);
    const fill = card.querySelector('.subject-progress-fill');
    const label = card.querySelector('.subject-progress-label');
    if (fill) fill.style.width = prog + '%';
    if (label) label.textContent = prog + '% complete';
  });

  // Update MEDSIM portal quick stats
  const stats = progress.getStats();
  const xpVal = stats.lessonsCompleted * 250 + (stats.avgScore || 0) * 5;
  const simsVal = stats.lessonsCompleted;
  const scoreVal = stats.avgScore ? stats.avgScore + '%' : '—';
  const skillsVal = Object.keys(progress.data.subjectLessons || {}).length;

  const portalMetrics = {
    qsXP: xpVal.toLocaleString() + ' XP',
    qsSims: simsVal,
    qsScore: scoreVal,
    qsSkills: skillsVal,
  };
  for (const [id, val] of Object.entries(portalMetrics)) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  // Trigger animations
  setTimeout(() => {
    document.querySelectorAll('#portalView .animate-in').forEach(el => el.classList.add('visible'));
  }, 100);
}

/* ══════════════════════════════════
   TOPICS VIEW
   ══════════════════════════════════ */
function renderTopics(subjectId) {
  const targetId = subjectId || currentSubjectId || 'anatomy';
  currentSubjectId = targetId;
  const subject = getSubject(targetId);
  if (!subject) return;

  const header = document.getElementById('topicsHeader');
  const grid = document.getElementById('topicGrid');
  const breadcrumb = document.getElementById('topicsBreadcrumb');

  if (breadcrumb) {
    breadcrumb.innerHTML = `
      <a href="#" class="bc-portal">Portal</a>
      <span class="sep">›</span>
      <span class="current">${subject.icon} ${subject.name}</span>
    `;
    breadcrumb.querySelector('.bc-portal').addEventListener('click', (e) => { e.preventDefault(); router.navigate('portal'); });
  }

  if (header) header.innerHTML = `<span class="subject-icon-sm">${subject.icon}</span> ${subject.name} Topics`;

  if (!grid) return;
  grid.innerHTML = '';

  subject.topics.forEach(topic => {
    const card = document.createElement('div');
    card.className = 'topic-card animate-in';
    card.dataset.topic = topic.id;
    const completed = progress.isTopicCompleted(targetId, topic.id);
    const score = progress.getTopicScore(targetId, topic.id);

    card.innerHTML = `
      ${completed ? '<div class="completion-check">✓</div>' : ''}
      <div class="topic-card-icon">${topic.icon}</div>
      <h4>${topic.name}</h4>
      <p>${topic.desc}</p>
      <div class="topic-meta">
        <span class="difficulty-badge difficulty-${topic.difficulty}">${topic.difficulty}</span>
        <span class="topic-meta-item">⏱ ${topic.duration}</span>
        <span class="topic-meta-item">📍 ${topic.region}</span>
        <span class="topic-meta-item">📝 ${topic.steps} steps</span>
        ${score !== null ? `<span class="topic-meta-item" style="color:var(--accent-medical)">🏆 ${score}%</span>` : ''}
      </div>
    `;

    card.addEventListener('click', (e) => {
      e.preventDefault();
      currentTopicId = topic.id;
      launchLab(targetId, topic.id);
    });

    grid.appendChild(card);
  });

  setTimeout(() => {
    document.querySelectorAll('#topicsView .animate-in').forEach(el => el.classList.add('visible'));
  }, 100);
}

/* ══════════════════════════════════
   SIMULATION LAB
   ══════════════════════════════════ */
function launchLab(subjectId, topicId) {
  const targetSubject = subjectId || currentSubjectId || 'anatomy';
  const targetTopic = topicId || currentTopicId || 'heart';
  currentSubjectId = targetSubject;
  currentTopicId = targetTopic;

  // Navigate to labView first so DOM elements are visible
  router.navigate('lab');

  const ivContainer = document.getElementById('ivSimContainer');
  const stdContainer = document.getElementById('standardLabContainer');

  if (targetTopic === 'iv_cannulation') {
    if (stdContainer) stdContainer.style.display = 'none';
    if (ivContainer) {
      ivContainer.style.display = 'block';
      ivSim = new IVCannulationSimulation('ivSimContainer', {
        onExit: () => router.navigate('portal'),
        onComplete: (res) => {
          if (progress) {
            progress.completeLession('clinical_skills', 'iv_cannulation', res.score, res.time);
          }
        }
      });
      ivSim.init();
    }
  } else {
    if (ivContainer) ivContainer.style.display = 'none';
    if (stdContainer) stdContainer.style.display = 'grid';

    // Initialize 3D simulation engine if not done
    if (!sim) {
      sim = new SimulationEngine('simViewport');
      setupLayerToggles();
      setupViewportControls();
      setupViewModes();

      // AI Tutor
      const msgContainer = document.getElementById('tutorMessages');
      tutor = new AITutor(msgContainer);
      tutor.init();
      setupTutorActions();

      // Wire organ select → tutor
      sim.onOrganSelect((name) => {
        tutor.setOrgan(name);
      });
    } else {
      sim.refreshAnatomy();
    }

    // Load lesson
    lessonMgr.loadLesson(targetTopic);
    updateLessonUI();
    applyLessonStep();

    // Force resize after view switch
    if (sim) sim._onResize();
    setTimeout(() => { if (sim) sim._onResize(); }, 50);
  }

  // Update lab breadcrumb
  const subject = getSubject(targetSubject);
  const topic = getTopic(targetSubject, targetTopic);
  const bc = document.getElementById('labBreadcrumb');
  if (bc && subject && topic) {
    bc.innerHTML = `
      <a href="#" class="bc-portal">Portal</a><span class="sep">›</span>
      <a href="#" class="bc-subject">${subject.icon} ${subject.name}</a><span class="sep">›</span>
      <span class="current">${topic.icon} ${topic.name}</span>
    `;
    const pLink = bc.querySelector('.bc-portal');
    const sLink = bc.querySelector('.bc-subject');
    if (pLink) pLink.onclick = (e) => { e.preventDefault(); router.navigate('portal'); };
    if (sLink) sLink.onclick = (e) => { e.preventDefault(); renderTopics(targetSubject); router.navigate('topics'); };
  }
}

function setupLabUI() {
  setupInstrumentUI();
  setupLessonNav();
  setupLearningModes();
}

/* ── Layer Toggles ── */
function setupLayerToggles() {
  document.querySelectorAll('.layer-toggle').forEach(btn => {
    const layer = btn.dataset.layer;
    if (!layer || !sim) return;
    btn.classList.toggle('active', sim.isLayerVisible(layer));
    btn.addEventListener('click', () => {
      const vis = sim.toggleLayer(layer);
      btn.classList.toggle('active', vis);
    });
  });
}

function syncLayerUI() {
  document.querySelectorAll('.layer-toggle').forEach(btn => {
    const layer = btn.dataset.layer;
    if (layer && sim) btn.classList.toggle('active', sim.isLayerVisible(layer));
  });
}

/* ── Instruments ── */
function setupInstrumentUI() {
  const list = document.getElementById('instrumentList');
  if (!list) return;

  INSTRUMENTS.forEach(tool => {
    const btn = document.createElement('button');
    btn.className = 'instrument-btn';
    btn.dataset.tool = tool.id;
    btn.innerHTML = `
      <span class="inst-icon">${tool.icon}</span>
      <span class="inst-info">
        <span class="inst-name">${tool.name}</span>
        <span class="inst-hint">${tool.desc}</span>
      </span>
    `;
    btn.addEventListener('click', () => {
      if (instruments.getCurrent()?.id === tool.id) {
        instruments.deselect();
      } else {
        instruments.select(tool.id);
        progress.recordToolUse(tool.id);
      }
      updateInstrumentUI();
      updateToolDetail();
    });
    list.appendChild(btn);
  });
}

function updateInstrumentUI() {
  const current = instruments.getCurrent();
  document.querySelectorAll('.instrument-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tool === current?.id);
  });
}

function updateToolDetail() {
  const detailEl = document.getElementById('toolDetail');
  if (!detailEl) return;
  const tool = instruments.getCurrent();
  if (!tool) { detailEl.innerHTML = ''; return; }
  detailEl.innerHTML = `
    <div class="tool-detail">
      <div class="tool-detail-name">${tool.icon} ${tool.name}</div>
      <div class="tool-detail-desc">${tool.desc}</div>
      <div class="tool-detail-grip"><strong>Grip:</strong> ${tool.grip}</div>
      <div class="tool-detail-warn">${tool.warning}</div>
    </div>
  `;
}

/* ── View Modes ── */
function setupViewModes() {
  document.querySelectorAll('.vm-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (!mode || !sim) return;
      sim.setViewMode(mode);
      document.querySelectorAll('.vm-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
    });
  });
}

function setViewModeUI(mode) {
  if (sim) sim.setViewMode(mode);
  document.querySelectorAll('.vm-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
}

/* ── Learning Modes ── */
function setupLearningModes() {
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      learningMode = btn.dataset.mode;
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === learningMode));
      updateLessonUI(); // Show/hide hints based on mode
    });
  });
}

/* ── Lesson Nav ── */
function setupLessonNav() {
  const prevBtn = document.getElementById('lessonPrev');
  const nextBtn = document.getElementById('lessonNext');
  const completeBtn = document.getElementById('lessonComplete');

  if (prevBtn) prevBtn.addEventListener('click', () => { lessonMgr.prevStep(); updateLessonUI(); applyLessonStep(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { lessonMgr.nextStep(); updateLessonUI(); applyLessonStep(); });
  if (completeBtn) completeBtn.addEventListener('click', () => launchQuiz());
}

function updateLessonUI() {
  const lesson = lessonMgr.currentLesson;
  const step = lessonMgr.getCurrentStep();

  const nameEl = document.getElementById('lessonName');
  const stepEl = document.getElementById('lessonStep');
  const badgeEl = document.getElementById('lessonBadge');
  const fillEl = document.getElementById('lessonProgressFill');
  const labelEl = document.getElementById('lessonProgressLabel');
  const prevBtn = document.getElementById('lessonPrev');
  const nextBtn = document.getElementById('lessonNext');
  const completeBtn = document.getElementById('lessonComplete');

  if (lesson && nameEl) nameEl.textContent = lesson.title;
  if (step && stepEl) {
    let text = step.instruction;
    if (learningMode === 'expert') {
      // Strip hints for expert mode
      text = text.replace(/—.*$/, '').replace(/\..*Click.*$/, '.').trim();
    }
    stepEl.textContent = text;
  }
  if (badgeEl) badgeEl.textContent = lessonMgr.getStepLabel();
  if (fillEl) fillEl.style.width = lessonMgr.getProgress() + '%';
  if (labelEl) labelEl.textContent = Math.round(lessonMgr.getProgress()) + '%';
  if (prevBtn) prevBtn.disabled = lessonMgr.isFirstStep();

  // Show complete button on last step, next otherwise
  const isLast = lessonMgr.isLastStep();
  if (nextBtn) nextBtn.style.display = isLast ? 'none' : 'flex';
  if (completeBtn) completeBtn.style.display = isLast ? 'flex' : 'none';
}

function applyLessonStep() {
  if (!sim || !lessonMgr.currentLesson) return;
  const step = lessonMgr.getCurrentStep();
  if (!step) return;

  // Layers
  if (step.layers) {
    for (const [layer, visible] of Object.entries(step.layers)) {
      sim.setLayerVisible(layer, visible);
    }
    syncLayerUI();
  }

  // Tool
  if (step.tool) { instruments.select(step.tool); } else { instruments.deselect(); }
  updateInstrumentUI();
  updateToolDetail();

  // View mode
  if (step.viewMode) setViewModeUI(step.viewMode);

  // Highlight
  if (step.highlight && sim) sim.highlightOrgan(step.highlight);

  // AI Tutor message
  if (tutor && step.action) tutor.onLessonStep(step.action);
}

/* ── Viewport Controls ── */
function setupViewportControls() {
  document.getElementById('vpZoomIn')?.addEventListener('click', () => sim?.zoomIn());
  document.getElementById('vpZoomOut')?.addEventListener('click', () => sim?.zoomOut());
  document.getElementById('vpReset')?.addEventListener('click', () => { sim?.resetView(); setViewModeUI('normal'); });
}

/* ── AI Tutor Actions ── */
function setupTutorActions() {
  document.getElementById('askWhatIsThis')?.addEventListener('click', () => tutor?.askWhatIsThis());
  document.getElementById('askWhy')?.addEventListener('click', () => {
    if (tutor) tutor.addMessage('user', 'Tell me more about this structure.');
    tutor?.askWhatIsThis();
  });
  document.getElementById('toggleVoice')?.addEventListener('click', (e) => {
    const on = tutor?.toggleSpeech();
    e.target.classList.toggle('active', on);
    e.target.textContent = on ? '🔊 Voice On' : '🔇 Voice Off';
  });

  const chatInput = document.getElementById('tutorChatInput');
  const chatSend = document.getElementById('tutorChatSend');
  const sendChat = () => {
    const val = chatInput.value;
    if (!val || !val.trim()) return;
    chatInput.value = '';
    tutor?.askFreeform(val);
  };
  chatSend?.addEventListener('click', sendChat);
  chatInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); sendChat(); }
  });
}

function showToast(message, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

function setupSettingsModal() {
  const modal = document.getElementById('settingsModal');
  const btn = document.getElementById('btnSettings');
  const providerSel = document.getElementById('settingsProvider');
  const keyInput = document.getElementById('settingsApiKey');
  const modelInput = document.getElementById('settingsModel');

  const open = () => {
    const cfg = getAIConfig();
    providerSel.value = cfg.provider || 'openai';
    keyInput.value = cfg.apiKey || '';
    modelInput.value = cfg.model || '';
    modal.style.display = 'flex';
  };
  const close = () => { modal.style.display = 'none'; };

  btn?.addEventListener('click', open);
  document.getElementById('settingsCancel')?.addEventListener('click', close);
  modal?.addEventListener('click', (e) => { if (e.target === modal) close(); });

  document.getElementById('settingsSave')?.addEventListener('click', () => {
    saveAIConfig({
      provider: providerSel.value,
      apiKey: keyInput.value.trim(),
      model: modelInput.value.trim(),
    });
    close();
    showToast('AI Tutor settings saved', 'success');
  });
}

/* ══════════════════════════════════
   QUIZ VIEW
   ══════════════════════════════════ */
function launchQuiz() {
  const lesson = lessonMgr.currentLesson;
  const quizId = lesson?.quizId || currentTopicId || 'thoracic';
  const loaded = quiz.loadQuiz(quizId);
  if (!loaded) return;

  renderQuizQuestion();
  router.navigate('quiz');
}

function setupQuizUI() {
  // handled dynamically
}

function renderQuizView() {
  if (quiz && quiz.quiz && !quiz.isComplete()) {
    renderQuizQuestion();
  } else {
    renderQuizHub();
  }
}

function renderQuizHub() {
  const container = document.getElementById('quizBody');
  const headerEl = document.getElementById('quizTitle');
  const counterEl = document.getElementById('quizCounter');
  const progressFill = document.getElementById('quizProgressFill');

  if (headerEl) headerEl.textContent = 'Knowledge Assessment Hub';
  if (counterEl) counterEl.textContent = 'Select Quiz Module';
  if (progressFill) progressFill.style.width = '100%';

  if (!container) return;

  const quizList = [
    { id: 'iv_cannulation', title: 'Peripheral IV Cannulation Protocol', icon: '💉', count: 4, category: 'Clinical Skills' },
    { id: 'heart', title: 'Heart Anatomy & Cardiac Function', icon: '🫀', count: 5, category: 'Gross Anatomy' },
    { id: 'lungs', title: 'Lung Examination & Respiration', icon: '🫁', count: 3, category: 'Pulmonology' },
    { id: 'brain', title: 'Brain & Cranial Nerves', icon: '🧠', count: 3, category: 'Neuroanatomy' },
    { id: 'liver', title: 'Liver & Hepatobiliary System', icon: '🧪', count: 3, category: 'Gastroenterology' },
    { id: 'kidney', title: 'Renal & Urinary System', icon: '🩺', count: 2, category: 'Nephrology' },
    { id: 'cardiac_cycle', title: 'Cardiac Cycle & Sound Mechanics', icon: '⚡', count: 2, category: 'Physiology' },
    { id: 'appendectomy', title: 'Surgical Appendectomy Protocol', icon: '🔪', count: 2, category: 'General Surgery' },
    { id: 'mi', title: 'Myocardial Infarction Pathology', icon: '🔬', count: 2, category: 'Pathology' },
    { id: 'postmortem', title: 'Postmortem Autopsy Examination', icon: '🕵️', count: 2, category: 'Forensic Medicine' },
  ];

  container.innerHTML = `
    <div style="padding:10px 0;">
      <p style="color:var(--text-secondary); margin-bottom:24px; font-size:0.95rem;">Select an MBBS knowledge assessment module below to test your clinical and anatomical recall.</p>
      
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); gap:18px;">
        ${quizList.map(q => `
          <div class="quiz-hub-card" data-quiz="${q.id}" style="background:rgba(10, 16, 28, 0.7); border:1px solid var(--border-subtle); border-radius:14px; padding:20px; cursor:pointer; transition:all 0.25s ease; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <span style="font-size:2rem;">${q.icon}</span>
                <span class="badge" style="background:rgba(0,212,255,0.12); color:#00d4ff;">${q.category}</span>
              </div>
              <h4 style="margin:0 0 8px 0; font-size:1.05rem; color:#fff;">${q.title}</h4>
              <div style="font-size:0.8rem; color:var(--text-secondary);">${q.count} Multiple Choice Questions</div>
            </div>
            
            <div style="margin-top:20px; display:flex; align-items:center; justify-content:space-between; font-size:0.85rem; font-weight:700; color:#00d4ff;">
              <span>Start Assessment</span>
              <span>➔</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('.quiz-hub-card').forEach(card => {
    card.addEventListener('click', () => {
      const qId = card.dataset.quiz;
      quiz.loadQuiz(qId);
      renderQuizQuestion();
    });
  });
}

function renderQuizQuestion() {
  const container = document.getElementById('quizBody');
  const headerEl = document.getElementById('quizTitle');
  const counterEl = document.getElementById('quizCounter');
  const progressFill = document.getElementById('quizProgressFill');

  if (!container || !quiz.quiz) return;

  const q = quiz.getCurrentQuestion();
  if (!q) { renderQuizResults(); return; }

  if (headerEl) headerEl.textContent = quiz.quiz.title;
  if (counterEl) counterEl.textContent = `Question ${quiz.getQuestionNumber()} / ${quiz.getTotalQuestions()}`;
  if (progressFill) progressFill.style.width = quiz.getProgress() + '%';

  const letters = ['A', 'B', 'C', 'D', 'E'];
  container.innerHTML = `
    <div class="quiz-question">
      <p>${q.q}</p>
    </div>
    <div class="quiz-options">
      ${q.options.map((opt, i) => `
        <button class="quiz-option" data-index="${i}">
          <span class="opt-letter">${letters[i]}</span>
          ${opt}
        </button>
      `).join('')}
    </div>
    <div class="quiz-feedback" id="quizFeedback"></div>
    <div class="quiz-nav">
      <button class="btn btn-primary btn-sm" id="quizNextBtn" style="display:none;">
        ${quiz.isLastQuestion() ? '📊 View Results' : 'Next Question →'}
      </button>
    </div>
  `;

  // Option click handlers
  container.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      const result = quiz.submitAnswer(idx);
      if (!result) return;

      // Show correct/incorrect
      container.querySelectorAll('.quiz-option').forEach((b, i) => {
        b.classList.add('disabled');
        if (i === result.correctIndex) b.classList.add('correct');
        if (i === idx && !result.isCorrect) b.classList.add('incorrect');
      });

      // Feedback
      const fb = document.getElementById('quizFeedback');
      if (fb) {
        fb.className = `quiz-feedback show ${result.isCorrect ? 'correct-feedback' : 'incorrect-feedback'}`;
        fb.innerHTML = `
          <div class="feedback-title">${result.isCorrect ? '✅ Correct!' : '❌ Incorrect'}</div>
          <div class="feedback-text">${result.explanation}</div>
        `;
      }

      // Show next button
      const nextBtn = document.getElementById('quizNextBtn');
      if (nextBtn) {
        nextBtn.style.display = 'inline-flex';
        nextBtn.addEventListener('click', () => {
          if (quiz.isComplete()) {
            renderQuizResults();
          } else {
            quiz.nextQuestion();
            renderQuizQuestion();
          }
        }, { once: true });
      }
    });
  });
}

function renderQuizResults() {
  const container = document.getElementById('quizBody');
  const results = quiz.getResults();
  if (!container || !results) return;

  // Save progress
  progress.completeLession(currentSubjectId, currentTopicId, results.accuracy, results.time);

  const passClass = results.passed ? 'pass' : 'fail';
  const icon = results.passed ? '🎉' : '📖';

  container.innerHTML = `
    <div class="quiz-results">
      <div class="results-icon">${icon}</div>
      <div class="results-score ${passClass}">${results.accuracy}%</div>
      <div class="results-label">${results.passed ? 'Congratulations! You passed!' : 'Keep studying — you\'ll get there!'}</div>
      <div class="results-stats">
        <div class="result-stat"><div class="rs-value">${results.correct}/${results.total}</div><div class="rs-label">Correct</div></div>
        <div class="result-stat"><div class="rs-value">${results.timeFormatted}</div><div class="rs-label">Time</div></div>
        <div class="result-stat"><div class="rs-value">${results.accuracy}%</div><div class="rs-label">Accuracy</div></div>
      </div>
      <div class="results-actions">
        <button class="btn btn-secondary" id="quizRetry">🔄 Retry Quiz</button>
        <button class="btn btn-primary" id="quizToDash">📊 View Dashboard</button>
        <button class="btn btn-secondary" id="quizToPortal">🏠 Back to Portal</button>
      </div>
    </div>
  `;

  document.getElementById('quizRetry')?.addEventListener('click', () => launchQuiz());
  document.getElementById('quizToDash')?.addEventListener('click', () => router.navigate('dashboard'));
  document.getElementById('quizToPortal')?.addEventListener('click', () => router.navigate('portal'));

  // Update counter/progress
  const counterEl = document.getElementById('quizCounter');
  const progressFill = document.getElementById('quizProgressFill');
  if (counterEl) counterEl.textContent = 'Complete!';
  if (progressFill) progressFill.style.width = '100%';
}

/* ══════════════════════════════════
   DASHBOARD VIEW
   ══════════════════════════════════ */
function renderDashboard() {
  const stats = progress.getStats();
  const achievements = progress.getAchievements();
  const allTopics = getAllTopics();
  const overall = progress.getOverallProgress(allTopics.length);

  // Overview cards
  setDashVal('dashLessons', stats.lessonsCompleted);
  setDashVal('dashQuizzes', stats.quizzesTaken);
  setDashVal('dashAvgScore', stats.avgScore ? stats.avgScore + '%' : '—');
  setDashVal('dashTime', stats.studyTime);

  // Performance ring
  const ring = document.getElementById('perfRingFill');
  if (ring) {
    const circumference = 2 * Math.PI * 52;
    const offset = circumference - (overall / 100) * circumference;
    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = offset;
  }
  setDashVal('perfRingLabel', overall + '%');

  // Subject progress
  const spList = document.getElementById('subjectProgressList');
  if (spList) {
    spList.innerHTML = '';
    SUBJECTS.forEach(sub => {
      const p = progress.getSubjectProgress(sub.id, sub.topics.length);
      const item = document.createElement('div');
      item.className = 'sp-item';
      item.innerHTML = `
        <span class="sp-icon">${sub.icon}</span>
        <div class="sp-info">
          <div class="sp-name">${sub.name}</div>
          <div class="sp-bar"><div class="sp-bar-fill ${sub.id}" style="width:${p}%"></div></div>
        </div>
        <span class="sp-pct">${p}%</span>
      `;
      spList.appendChild(item);
    });
  }

  // Achievements
  const achGrid = document.getElementById('achievementGrid');
  if (achGrid) {
    achGrid.innerHTML = '';
    achievements.forEach(a => {
      const badge = document.createElement('div');
      badge.className = `achievement-badge ${a.earned ? 'earned' : 'locked'}`;
      badge.innerHTML = `<span class="badge-icon">${a.icon}</span><span class="badge-name">${a.name}</span>`;
      badge.title = a.desc;
      achGrid.appendChild(badge);
    });
  }

  // History
  const histList = document.getElementById('historyList');
  if (histList) {
    histList.innerHTML = '';
    if (stats.history.length === 0) {
      histList.innerHTML = '<div class="dash-empty"><span class="empty-icon">📚</span><p>No study history yet. Start a lesson!</p></div>';
    } else {
      stats.history.slice(0, 8).forEach(h => {
        const subject = getSubject(h.subject);
        const topic = getTopic(h.subject, h.topic);
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
          <span class="history-dot ${h.score >= 60 ? 'completed' : 'failed'}"></span>
          <div class="history-info">
            <div class="history-title">${topic?.name || h.topic}</div>
            <div class="history-time">${subject?.name || h.subject} · ${new Date(h.date).toLocaleDateString()}</div>
          </div>
          <span class="history-score" style="color:${h.score >= 60 ? 'var(--accent-medical)' : 'var(--accent-danger)'}">${h.score}%</span>
        `;
        histList.appendChild(item);
      });
    }
  }
}

function setDashVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
