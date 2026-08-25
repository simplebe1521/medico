/* ========================================
   ImmersiMed — Particle Background System
   Floating cells & molecular connections
   ======================================== */

export class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: -1000, y: -1000 };
    this.particleCount = 70;
    this.connectionDist = 140;
    this.running = true;
    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    window.addEventListener('resize', () => { this.resize(); this.createParticles(); });
    this.canvas.parentElement.addEventListener('mousemove', e => {
      const r = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - r.left;
      this.mouse.y = e.clientY - r.top;
    });
    this.canvas.parentElement.addEventListener('mouseleave', () => {
      this.mouse.x = -1000; this.mouse.y = -1000;
    });
    this.loop();
  }

  resize() {
    const parent = this.canvas.parentElement;
    this.w = parent.offsetWidth;
    this.h = parent.offsetHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.w * dpr;
    this.canvas.height = this.h * dpr;
    this.canvas.style.width = this.w + 'px';
    this.canvas.style.height = this.h + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  createParticles() {
    const colors = [
      { r: 0, g: 212, b: 255 },   // cyan
      { r: 124, g: 58, b: 237 },   // purple
      { r: 16, g: 185, b: 129 },   // green
      { r: 244, g: 63, b: 94 },    // rose
    ];
    this.particles = Array.from({ length: this.particleCount }, () => {
      const c = colors[Math.floor(Math.random() * colors.length)];
      return {
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.4 + 0.15,
        phase: Math.random() * Math.PI * 2,
        isCell: Math.random() > 0.75,
        color: c,
      };
    });
  }

  loop() {
    if (!this.running) return;
    this.draw();
    requestAnimationFrame(() => this.loop());
  }

  draw() {
    const { ctx, w, h, particles, connectionDist, mouse } = this;
    ctx.clearRect(0, 0, w, h);
    const t = performance.now() * 0.001;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // mouse repulsion
      const dmx = p.x - mouse.x, dmy = p.y - mouse.y;
      const dm = Math.sqrt(dmx * dmx + dmy * dmy);
      if (dm < 120) {
        const force = (120 - dm) / 120 * 0.3;
        p.vx += (dmx / dm) * force;
        p.vy += (dmy / dm) * force;
      }

      p.x += p.vx; p.y += p.vy;
      p.vx *= 0.995; p.vy *= 0.995;

      // wrap
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      const pulse = Math.sin(t * 1.8 + p.phase) * 0.35 + 0.65;
      const rad = p.r * pulse;
      const a = p.alpha * pulse;
      const { r: cr, g: cg, b: cb } = p.color;

      if (p.isCell) {
        // outer membrane
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${a * 0.15})`;
        ctx.fill();
        // inner
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${a * 0.6})`;
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${a})`;
        ctx.fill();
      }

      // connections
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < connectionDist) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0,212,255,${(1 - d / connectionDist) * 0.12})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  destroy() { this.running = false; }
}
