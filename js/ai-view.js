import { AITutor } from './ai-tutor.js';

export class AIView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.tutor = null;
  }

  init() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div id="fullAiMessages" class="tutor-messages" style="flex:1; overflow-y:auto; padding-bottom:20px; border-bottom:1px solid var(--border-subtle); margin-bottom:15px;"></div>
      <div class="chat-input-area" style="display:flex; gap:10px;">
        <input type="text" id="aiFullInput" placeholder="Ask a medical question, request a clinical case, or generate MCQs..." style="flex:1; padding:12px; border-radius:8px; border:1px solid var(--border-subtle); background:rgba(255,255,255,0.05); color:white;">
        <button id="aiFullSendBtn" class="btn btn-primary">Send</button>
      </div>
      <div style="display:flex; gap:10px; margin-top:12px; flex-wrap:wrap;" id="aiQuickActionBtns">
        <button class="btn btn-secondary btn-sm" id="btnAiExplain">📖 Explain Procedure</button>
        <button class="btn btn-secondary btn-sm" id="btnAiHint">💡 Give Hint</button>
        <button class="btn btn-secondary btn-sm" id="btnAiViva">🎓 Viva Me</button>
        <button class="btn btn-secondary btn-sm" id="btnAiAsk">❓ Ask AI</button>
      </div>
    `;

    const msgContainer = document.getElementById('fullAiMessages');
    this.tutor = new AITutor(msgContainer);
    
    // Add initial greeting manually for full view
    this.tutor.addMessage('ai', 'Hello! I am your AI Medical Assistant. You can ask me anything about anatomy, physiology, procedures, or request practice questions. How can I help you today?');

    const input = document.getElementById('aiFullInput');
    const sendBtn = document.getElementById('aiFullSendBtn');

    const handleSend = () => {
      const q = input.value;
      if (q.trim()) {
        this.tutor.askQuestion(q);
        input.value = '';
      }
    };

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });

    document.getElementById('btnAiExplain')?.addEventListener('click', () => {
      this.tutor.askQuestion('Explain the 11-step Peripheral IV Cannulation procedure simply for medical students.');
    });

    document.getElementById('btnAiHint')?.addEventListener('click', () => {
      this.tutor.askQuestion('Give me a helpful clinical hint for selecting a vein and inserting the cannula.');
    });

    document.getElementById('btnAiViva')?.addEventListener('click', () => {
      this.tutor.askQuestion('Give me 3 high-yield MBBS Viva questions on IV Cannulation and venous anatomy.');
    });

    document.getElementById('btnAiAsk')?.addEventListener('click', () => {
      input.focus();
    });
  }
}
