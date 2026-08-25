import { getSubject } from './portal.js';

export class PracticalSkills {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  init() {
    if (!this.container) return;
    this.render();
  }

  render() {
    const subject = getSubject('clinical_skills');
    if (!subject) return;

    let html = '<div class="cases-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(250px, 1fr)); gap:20px;">';
    
    subject.topics.forEach(t => {
      html += `
        <div class="dash-card topic-card" onclick="window.launchLab('clinical_skills', '${t.id}')">
          <div class="topic-icon" style="font-size:2rem; margin-bottom:10px;">${t.icon}</div>
          <h3 style="margin-bottom:5px;">${t.name}</h3>
          <p style="font-size:0.85rem; color:var(--text-secondary);">${t.desc}</p>
          <div style="margin-top:15px; display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-secondary);">
            <span>⏱️ ${t.duration}</span>
            <span class="difficulty ${t.difficulty}">${t.difficulty}</span>
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    this.container.innerHTML = html;
  }
}
