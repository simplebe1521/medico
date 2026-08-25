/* ========================================
   ImmersiMed v2 — AI Tutor System
   Pre-scripted medical responses + speech
   ======================================== */

const ORGAN_KNOWLEDGE = {
  heart: {
    whatIsThis: `This is the <strong>Heart (Cor)</strong> — a hollow muscular organ approximately the size of your fist. It has 4 chambers: 2 atria (receiving chambers) and 2 ventricles (pumping chambers). It beats ~100,000 times/day, pumping ~7,500 liters of blood.`,
    followUps: {
      'Why is the left ventricle thicker?': `The <strong>left ventricle</strong> wall is 3× thicker (~15mm) than the right ventricle (~5mm). This is because the left ventricle must generate <strong>5× more pressure</strong> to pump blood through the entire systemic circulation (all body organs), while the right ventricle only pumps to the nearby lungs (pulmonary circulation).`,
      'What are the valves?': `The heart has <strong>4 valves</strong>: Tricuspid (right AV), Mitral/Bicuspid (left AV), Pulmonary (right semilunar), and Aortic (left semilunar). They ensure <strong>unidirectional blood flow</strong> and produce the "lub-dub" heart sounds.`,
      'What supplies blood to the heart?': `The heart receives its own blood via <strong>coronary arteries</strong>. The Left Coronary Artery (LCA) branches into LAD and Circumflex. The Right Coronary Artery (RCA) supplies the right side. Blockage of these causes <strong>myocardial infarction</strong> (heart attack).`,
    },
    funFact: `💡 Your heart generates enough pressure to squirt blood 30 feet!`,
  },
  leftLung: {
    whatIsThis: `This is the <strong>Left Lung (Pulmo sinister)</strong> — it has <strong>2 lobes</strong> (superior and inferior) separated by the oblique fissure. It's slightly smaller than the right lung due to the <strong>cardiac notch</strong>, which accommodates the heart.`,
    followUps: {
      'Why only 2 lobes?': `The left lung has only 2 lobes because the <strong>heart</strong> takes up space on the left side. The cardiac notch and lingula are adaptations to accommodate the heart's position.`,
    },
    funFact: `💡 If spread flat, your lungs would cover an area the size of a tennis court!`,
  },
  rightLung: {
    whatIsThis: `This is the <strong>Right Lung (Pulmo dexter)</strong> — it has <strong>3 lobes</strong> (superior, middle, and inferior) separated by the oblique and horizontal fissures. It's slightly larger and heavier than the left lung.`,
    followUps: {
      'Why is it larger?': `The right lung is wider because the heart is positioned slightly to the <strong>left</strong>, giving the right lung more space. However, it's shorter due to the liver pushing the right diaphragm upward.`,
    },
    funFact: `💡 You take about 20,000 breaths per day, exchanging ~10,000 liters of air!`,
  },
  liver: {
    whatIsThis: `This is the <strong>Liver (Hepar)</strong> — the largest internal organ, weighing ~1.5 kg. It has <strong>4 lobes</strong> (right, left, caudate, quadrate). It performs 500+ functions including detoxification, bile production, protein synthesis, and glucose storage.`,
    followUps: {
      'Can it regenerate?': `Yes! The liver has remarkable <strong>regenerative capacity</strong>. It can regrow to full size from as little as 25% of remaining tissue. This makes liver transplants from living donors possible.`,
    },
    funFact: `💡 Your liver filters ~1.4 liters of blood every minute!`,
  },
  stomach: {
    whatIsThis: `This is the <strong>Stomach (Ventriculus)</strong> — a J-shaped muscular organ that mixes food with gastric juices. It has 4 regions: cardia, fundus, body, and pylorus. It produces <strong>hydrochloric acid (pH ~2)</strong> and digestive enzymes.`,
    followUps: {
      'Why doesn\'t it digest itself?': `The stomach lining secretes a thick <strong>mucus barrier</strong> and bicarbonate that protects the epithelium from the acid. When this barrier fails, it causes <strong>peptic ulcers</strong>.`,
    },
    funFact: `💡 Your stomach acid is strong enough to dissolve metal!`,
  },
  brain: {
    whatIsThis: `This is the <strong>Brain (Cerebrum)</strong> — the central organ of the nervous system containing ~86 billion neurons. It weighs ~1.4 kg and consumes 20% of the body's oxygen despite being only 2% of body weight. The cerebral cortex has gyri (ridges) and sulci (grooves).`,
    followUps: {
      'What are the main parts?': `The brain has 3 major parts: <strong>Cerebrum</strong> (higher functions, 2 hemispheres), <strong>Cerebellum</strong> (coordination, balance), and <strong>Brainstem</strong> (vital functions: breathing, heart rate). The cerebrum is divided into frontal, parietal, temporal, and occipital lobes.`,
    },
    funFact: `💡 Your brain generates about 20 watts of electrical power — enough to light a dim bulb!`,
  },
  intestines: {
    whatIsThis: `These are the <strong>Intestines (Intestinum)</strong>. The small intestine (~6m) has 3 parts: duodenum, jejunum, ileum. The large intestine (~1.5m) includes cecum, colon, and rectum. The small intestine is the primary site of <strong>nutrient absorption</strong>.`,
    followUps: {
      'Why is it so long?': `The extreme length provides a <strong>massive surface area</strong> for nutrient absorption. With villi and microvilli, the total absorptive surface area is ~250 m² — roughly the size of a tennis court!`,
    },
    funFact: `💡 Food travels through your intestines via peristalsis — wave-like muscle contractions!`,
  },
  leftKidney: {
    whatIsThis: `This is the <strong>Left Kidney (Ren sinister)</strong> — a bean-shaped organ about 12cm long. Each kidney contains ~1 million <strong>nephrons</strong> (filtering units). Together they filter ~180 liters of blood daily, producing ~1.5 liters of urine.`,
    followUps: {},
    funFact: `💡 Your kidneys filter your entire blood volume ~40 times per day!`,
  },
  rightKidney: {
    whatIsThis: `This is the <strong>Right Kidney (Ren dexter)</strong> — positioned slightly lower than the left due to the liver above it. It's structurally identical to the left kidney and performs the same filtration functions.`,
    followUps: {},
    funFact: `💡 A single kidney can sustain life perfectly well — that's why kidney donation is possible!`,
  },
  spine: {
    whatIsThis: `This is the <strong>Vertebral Column (Columna vertebralis)</strong> — composed of 33 vertebrae: 7 cervical, 12 thoracic, 5 lumbar, 5 sacral (fused), and 4 coccygeal (fused). It protects the spinal cord and provides structural support.`,
    followUps: {},
    funFact: `💡 You are about 1cm taller in the morning because your intervertebral discs decompress overnight!`,
  },
  ribcage: {
    whatIsThis: `This is the <strong>Rib Cage (Cavea thoracis)</strong> — 12 pairs of ribs forming a protective cage. Ribs 1-7 are "true ribs" (directly attach to sternum), 8-10 are "false ribs" (attach via costal cartilage), and 11-12 are "floating ribs."`,
    followUps: {},
    funFact: `💡 Ribs can flex and absorb impact — they protect your heart and lungs during trauma!`,
  },
  skull: {
    whatIsThis: `This is the <strong>Skull (Cranium)</strong> — composed of 22 bones: 8 cranial bones (frontal, parietal×2, temporal×2, occipital, sphenoid, ethmoid) and 14 facial bones. It encases and protects the brain.`,
    followUps: {},
    funFact: `💡 At birth, the skull has soft spots (fontanelles) that allow brain growth!`,
  },
  pelvis: {
    whatIsThis: `This is the <strong>Pelvis</strong> — a basin-shaped structure formed by 2 hip bones (os coxae), the sacrum, and coccyx. Each hip bone is fused from 3 bones: ilium, ischium, and pubis. It supports the weight of the upper body.`,
    followUps: {},
    funFact: `💡 The female pelvis is wider and shallower than the male pelvis to accommodate childbirth!`,
  },
  spinalCord: {
    whatIsThis: `This is the <strong>Spinal Cord (Medulla spinalis)</strong> — about 45cm long, extending from the brainstem to L1-L2 vertebral level. It transmits sensory and motor signals between the brain and body via 31 pairs of spinal nerves.`,
    followUps: {},
    funFact: `💡 Nerve signals travel at up to 120 m/s (268 mph) along the spinal cord!`,
  },
  torsoSkin: {
    whatIsThis: `This is the <strong>Torso (Truncus)</strong> — the central body region containing the thoracic and abdominal cavities. The skin overlying the torso protects internal organs and is the site of surgical incisions for many procedures.`,
    followUps: {},
    funFact: `💡 Your skin is the largest organ, covering ~1.7m² and weighing about 3.6 kg!`,
  },
  headSkin: {
    whatIsThis: `This is the <strong>Head (Caput)</strong> — contains the brain, sensory organs (eyes, ears, nose, tongue), and the openings of the digestive and respiratory systems. The scalp has 5 layers (mnemonic: SCALP).`,
    followUps: {},
    funFact: `💡 The 5 layers of the scalp: Skin, Connective tissue, Aponeurosis, Loose connective tissue, Periosteum!`,
  },
};

import { callAI, hasAPIKey } from './ai-client.js';

const WELCOME_MSG = `Welcome to the <strong>AI Tutor</strong>! 👋 I'm here to help you understand every structure you encounter. Click on any organ in the 3D model, use the quick buttons below, or type any question you have — I'm connected to a real AI, so ask me anything about anatomy.`;

const NO_KEY_MSG = `I can answer instant questions about structures you click on for free. For open-ended questions, you'll need to add an API key first — click <strong>⚙️ Settings</strong> at the top of the page and paste in a Claude or ChatGPT API key.`;

const STEP_MESSAGES = {
  observe: `🔍 Take a moment to observe the body from different angles. Use your mouse to <strong>rotate, zoom, and pan</strong> the model. This builds spatial awareness — a critical skill for anatomy.`,
  incise: `🔪 Now we'll make an incision. In real dissection, the scalpel is held like a <strong>dinner knife</strong> for long cuts. Always cut away from yourself and use controlled, shallow strokes.`,
  retract_skin: `📌 Retract the skin layer to expose underlying structures. In practice, retractors hold tissue open while you work deeper — freeing both hands for the procedure.`,
  expose_ribs: `🦴 Observe the rib cage protecting the thoracic organs. Count the ribs — there should be <strong>12 pairs</strong>. The intercostal spaces between them contain muscles, nerves, and vessels.`,
  open_cavity: `🪚 Access the thoracic cavity by cutting through bone. In real surgery, a sternal saw is used along the midline. This exposes the heart and lungs in situ.`,
  examine: `🔧 Examine this structure carefully. Click on it for detailed information. Note its <strong>size, position, color, and relationships</strong> to surrounding structures.`,
  craniotomy: `🧠 Performing a craniotomy — removing part of the skull to access the brain. This requires extreme precision to avoid damaging the underlying dura mater.`,
  complete: `🎉 <strong>Excellent work!</strong> You've completed this lesson. Review your findings, then proceed to the quiz to test your knowledge.`,
  retract: `📌 Retract the tissue layers to expose the deeper structures. Good surgical access requires adequate retraction.`,
};

export class AITutor {
  constructor(messagesContainer) {
    this.container = messagesContainer;
    this.currentOrgan = null;
    this.useSpeech = false;
    this.speaking = false;
    this.chatHistory = []; // [{role, content}] sent to the real AI for context
    this.busy = false;
  }

  init() {
    this.addMessage('ai', WELCOME_MSG);
  }

  /** Set the current organ context */
  setOrgan(organName) {
    this.currentOrgan = organName;
  }

  /** "What is this?" for current organ */
  askWhatIsThis() {
    if (!this.currentOrgan) {
      this.addMessage('ai', `Click on any organ or structure in the 3D model first, then I can tell you about it! 👆`);
      return;
    }

    const knowledge = ORGAN_KNOWLEDGE[this.currentOrgan];
    if (!knowledge) {
      this.addMessage('ai', `I don't have detailed information about this structure yet. This will be available in the full version.`);
      return;
    }

    this.addMessage('user', `What is this?`);
    this.showTyping();

    setTimeout(() => {
      this.hideTyping();
      this.addMessage('ai', knowledge.whatIsThis);

      // Show fun fact after a short delay
      if (knowledge.funFact) {
        setTimeout(() => {
          this.addMessage('ai', knowledge.funFact);
        }, 800);
      }

      // Show follow-up options
      this._showFollowUps(knowledge.followUps);
    }, 600);
  }

  /** Custom question to backend */
  async askQuestion(question) {
    if (!question.trim()) return;

    this.addMessage('user', question);
    this.showTyping();

    // Prepare context
    const context = {
      structure: this.currentOrgan || 'None selected',
      mode: 'Simulation Lab'
    };

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: question }],
          context: context
        })
      });
      
      const data = await response.json();
      
      this.hideTyping();
      if (response.ok) {
        this.addMessage('ai', data.message.replace(/\n/g, '<br>'));
      } else {
        // Fallback or show error
        console.warn('Backend AI failed, falling back to mock.', data);
        this._fallbackResponse(question);
      }
    } catch (error) {
      console.error('AI Request Error:', error);
      this.hideTyping();
      this._fallbackResponse(question);
    }
  }

  _fallbackResponse(question) {
    if (this.currentOrgan && ORGAN_KNOWLEDGE[this.currentOrgan]) {
      const k = ORGAN_KNOWLEDGE[this.currentOrgan];
      // Try to find a matching follow up
      let found = false;
      for (const [q, a] of Object.entries(k.followUps)) {
        if (q.toLowerCase().includes(question.toLowerCase()) || question.toLowerCase().includes(q.toLowerCase().slice(0, 10))) {
          this.addMessage('ai', a);
          found = true;
          break;
        }
      }
      if (!found) {
        this.addMessage('ai', `(Mock Mode) That's a great question about the ${this.currentOrgan}. Please check your API key configuration in the backend <code>.env</code> file.`);
      }
    } else {
      this.addMessage('ai', `(Mock Mode) Please select an anatomical structure first, or configure your Gemini API key in the backend <code>.env</code> file for general medical questions.`);
    }
  }

  /** Follow-up question */
  askFollowUp(question) {
    this.askQuestion(question);
  }

  /** Free-form question, answered by a real AI (Claude/ChatGPT). */
  async askFreeform(question) {
    if (!question || !question.trim() || this.busy) return;
    question = question.trim();

    this.addMessage('user', this._escape(question));

    if (!hasAPIKey()) {
      this.addMessage('ai', NO_KEY_MSG);
      return;
    }

    this.chatHistory.push({ role: 'user', content: question });
    this.busy = true;
    this.showTyping();

    try {
      const organContext = this.currentOrgan
        ? `The student currently has "${this.currentOrgan}" selected in the 3D model.`
        : null;

      const reply = await callAI(this.chatHistory, organContext);
      this.hideTyping();
      this.addMessage('ai', this._toHTML(reply));
      this.chatHistory.push({ role: 'assistant', content: reply });

      if (this.chatHistory.length > 20) {
        this.chatHistory = this.chatHistory.slice(-20);
      }
    } catch (err) {
      this.hideTyping();
      if (err.message === 'NO_API_KEY') {
        this.addMessage('ai', NO_KEY_MSG);
      } else {
        this.addMessage('ai', `⚠️ I couldn't reach the AI provider: ${this._escape(err.message)}. Double-check your API key and provider in Settings.`);
      }
    } finally {
      this.busy = false;
    }
  }

  /** Very small markdown-ish → HTML for AI replies (bold + line breaks only). */
  _toHTML(text) {
    const escaped = this._escape(text);
    return escaped
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  _escape(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /** Lesson step message */
  onLessonStep(action) {
    const msg = STEP_MESSAGES[action];
    if (msg) {
      this.addMessage('ai', msg);
    }
  }

  /** Add a message to the chat */
  addMessage(sender, html) {
    if (!this.container) return;

    const msg = document.createElement('div');
    msg.className = `tutor-msg ${sender}`;
    msg.innerHTML = `
      <span class="msg-sender">${sender === 'ai' ? '🤖 AI Tutor' : '👤 You'}</span>
      <div class="msg-text">${html}</div>
    `;
    this.container.appendChild(msg);
    this.container.scrollTop = this.container.scrollHeight;

    // Speech
    if (this.useSpeech && sender === 'ai') {
      this._speak(msg.querySelector('.msg-text').textContent);
    }
  }

  showTyping() {
    if (!this.container) return;
    const typing = document.createElement('div');
    typing.className = 'tutor-typing';
    typing.id = 'tutorTyping';
    typing.innerHTML = '<span></span><span></span><span></span>';
    this.container.appendChild(typing);
    this.container.scrollTop = this.container.scrollHeight;
  }

  hideTyping() {
    const el = document.getElementById('tutorTyping');
    if (el) el.remove();
  }

  toggleSpeech() {
    this.useSpeech = !this.useSpeech;
    if (!this.useSpeech) {
      window.speechSynthesis?.cancel();
    }
    return this.useSpeech;
  }

  _showFollowUps(followUps) {
    if (!followUps || Object.keys(followUps).length === 0) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'tutor-followups';
    wrapper.style.cssText = 'display:flex;flex-direction:column;gap:4px;margin-top:8px;';

    for (const q of Object.keys(followUps)) {
      const btn = document.createElement('button');
      btn.className = 'tutor-action-btn';
      btn.innerHTML = `<span class="ta-icon">❓</span> ${q}`;
      btn.addEventListener('click', () => {
        this.askFollowUp(q);
        wrapper.remove();
      });
      wrapper.appendChild(btn);
    }
    this.container.appendChild(wrapper);
    this.container.scrollTop = this.container.scrollHeight;
  }

  _speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  clearMessages() {
    if (this.container) this.container.innerHTML = '';
  }
}
