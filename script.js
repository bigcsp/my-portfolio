/* ── GALAXY PARTICLES ─────────────────────────── */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let W, H, mouse = { x: -999, y: -999 };

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);
window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

/* ── STARS ───────────────────────────────────── */
class Star {
  constructor() { this.init(); }
  init() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.z = Math.random() * W;
    this.r = Math.random() * 1.5 + 0.2;
    this.twinkle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 0.3 + 0.05;
  }
  update() {
    this.twinkle += 0.04;
    this.z -= this.speed;
    if (this.z <= 0) this.init();
  }
  draw() {
    const sx = (this.x - W / 2) * (W / this.z) + W / 2;
    const sy = (this.y - H / 2) * (W / this.z) + H / 2;
    const sr = this.r * (W / this.z);
    const opacity = (0.5 + 0.5 * Math.sin(this.twinkle)) * Math.min(1, sr);
    if (sx < 0 || sx > W || sy < 0 || sy > H) return;
    ctx.beginPath();
    ctx.arc(sx, sy, Math.max(0.1, sr), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${opacity})`;
    ctx.fill();
  }
}

/* ── NEBULA CLOUDS ───────────────────────────── */
class Nebula {
  constructor() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 200 + 100;
    this.hue = Math.random() > 0.5 ? '80,0,180' : '0,100,200';
    this.a = Math.random() * 0.04 + 0.01;
    this.vx = (Math.random() - 0.5) * 0.1;
    this.vy = (Math.random() - 0.5) * 0.1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < -this.r) this.x = W + this.r;
    if (this.x > W + this.r) this.x = -this.r;
    if (this.y < -this.r) this.y = H + this.r;
    if (this.y > H + this.r) this.y = -this.r;
  }
  draw() {
    const g = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.r
    );
    g.addColorStop(0, `rgba(${this.hue},${this.a})`);
    g.addColorStop(1, `rgba(${this.hue},0)`);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }
}

/* ── SHOOTING STARS ──────────────────────────── */
class ShootingStar {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H * 0.5;
    this.len = Math.random() * 120 + 60;
    this.speed = Math.random() * 8 + 4;
    this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
    this.life = 1;
    this.decay = Math.random() * 0.015 + 0.008;
    this.active = false;
    this.timer = Math.random() * 400;
  }
  update() {
    if (!this.active) {
      this.timer--;
      if (this.timer <= 0) this.active = true;
      return;
    }
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.life -= this.decay;
    if (this.life <= 0) this.reset();
  }
  draw() {
    if (!this.active) return;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(
      this.x - Math.cos(this.angle) * this.len,
      this.y - Math.sin(this.angle) * this.len
    );
    const g = ctx.createLinearGradient(
      this.x, this.y,
      this.x - Math.cos(this.angle) * this.len,
      this.y - Math.sin(this.angle) * this.len
    );
    g.addColorStop(0, `rgba(255,255,255,${this.life})`);
    g.addColorStop(1, `rgba(255,255,255,0)`);
    ctx.strokeStyle = g;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }
}

/* ── CURSOR TRAIL ────────────────────────────── */
class TrailDot {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.r = Math.random() * 3 + 1;
    this.life = 1;
    this.decay = Math.random() * 0.04 + 0.02;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.life -= this.decay;
    this.r *= 0.96;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(0, this.r), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(150,80,255,${this.life * 0.7})`;
    ctx.fill();
  }
}

const stars = Array.from({ length: 280 }, () => new Star());
const nebulas = Array.from({ length: 6 }, () => new Nebula());
const shooters = Array.from({ length: 5 }, () => new ShootingStar());
let trails = [];

window.addEventListener('mousemove', e => {
  for (let i = 0; i < 3; i++) trails.push(new TrailDot(e.clientX, e.clientY));
});

/* ── MAIN LOOP ───────────────────────────────── */
(function loop() {
  ctx.fillStyle = 'rgba(5,5,12,0.25)';
  ctx.fillRect(0, 0, W, H);
  nebulas.forEach(n => { n.update(); n.draw(); });
  stars.forEach(s => { s.update(); s.draw(); });
  shooters.forEach(s => { s.update(); s.draw(); });
  trails = trails.filter(t => t.life > 0);
  trails.forEach(t => { t.update(); t.draw(); });
  drawRobot(mouse.x, mouse.y);
  requestAnimationFrame(loop);
})();

/* ── ROBOT ───────────────────────────────────── */
function drawRobot(mx, my) {
  const rx = 80, ry = H - 140;
  const angle = Math.atan2(my - ry, mx - rx);
  const eyeOffX = Math.cos(angle) * 8;
  const eyeOffY = Math.sin(angle) * 8;
  const armAngle = angle;

  ctx.save();
  ctx.translate(rx, ry);

  // Body glow
  const bodyGlow = ctx.createRadialGradient(0, 0, 10, 0, 0, 70);
  bodyGlow.addColorStop(0, 'rgba(120,40,220,0.15)');
  bodyGlow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.beginPath();
  ctx.arc(0, 0, 70, 0, Math.PI * 2);
  ctx.fillStyle = bodyGlow;
  ctx.fill();

  // Legs
  ctx.strokeStyle = '#1a1a2e';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-12, 28);
  ctx.lineTo(-14, 52);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(12, 28);
  ctx.lineTo(14, 52);
  ctx.stroke();

  // Feet
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.ellipse(-14, 54, 10, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(14, 54, 10, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body
  const bodyGrad = ctx.createLinearGradient(-20, -15, 20, 30);
  bodyGrad.addColorStop(0, '#1e1e3a');
  bodyGrad.addColorStop(1, '#0d0d1a');
  ctx.beginPath();
  ctx.roundRect(-22, -15, 44, 44, 8);
  ctx.fillStyle = bodyGrad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(120,40,220,0.6)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Chest light
  ctx.beginPath();
  ctx.arc(0, 8, 6, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(120,40,255,0.9)`;
  ctx.fill();
  ctx.shadowColor = '#7c3aed';
  ctx.shadowBlur = 12;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Chest lines
  ctx.strokeStyle = 'rgba(120,40,220,0.4)';
  ctx.lineWidth = 1;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.moveTo(-14, 20 + i * 5);
    ctx.lineTo(14, 20 + i * 5);
    ctx.stroke();
  }

  // Arm pointing at cursor
  ctx.save();
  ctx.rotate(armAngle);
  ctx.strokeStyle = '#1e1e3a';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(20, 5);
  ctx.lineTo(42, 5);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(120,40,220,0.5)';
  ctx.lineWidth = 1;
  ctx.stroke();
  // Hand
  ctx.beginPath();
  ctx.arc(44, 5, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#1e1e3a';
  ctx.fill();
  ctx.strokeStyle = 'rgba(120,40,220,0.6)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();

  // Neck
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.roundRect(-6, -22, 12, 10, 3);
  ctx.fill();

  // Head
  const headGrad = ctx.createLinearGradient(-18, -52, 18, -22);
  headGrad.addColorStop(0, '#1e1e3a');
  headGrad.addColorStop(1, '#0d0d1a');
  ctx.beginPath();
  ctx.roundRect(-18, -52, 36, 32, 8);
  ctx.fillStyle = headGrad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(120,40,220,0.6)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Antenna
  ctx.strokeStyle = 'rgba(120,40,220,0.8)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -52);
  ctx.lineTo(0, -64);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, -66, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#7c3aed';
  ctx.fill();
  ctx.shadowColor = '#7c3aed';
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Eyes — track cursor
  [-10, 10].forEach(ex => {
    // Eye white/bg
    ctx.beginPath();
    ctx.ellipse(ex, -36, 7, 7, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#0a0a18';
    ctx.fill();
    ctx.strokeStyle = 'rgba(120,40,220,0.7)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Pupil tracking cursor
    ctx.beginPath();
    ctx.arc(ex + eyeOffX * 0.5, -36 + eyeOffY * 0.5, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#a855f7';
    ctx.fill();
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
    // Eye shine
    ctx.beginPath();
    ctx.arc(ex + eyeOffX * 0.5 - 1, -36 + eyeOffY * 0.5 - 1, 1, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fill();
  });

  // Mouth
  ctx.beginPath();
  ctx.roundRect(-10, -24, 20, 5, 3);
  ctx.fillStyle = '#0a0a18';
  ctx.fill();
  ctx.strokeStyle = 'rgba(120,40,220,0.5)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Mouth LED dots
  [-6, 0, 6].forEach(mx2 => {
    ctx.beginPath();
    ctx.arc(mx2, -21.5, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(168,85,247,0.8)';
    ctx.fill();
  });

  ctx.restore();
}

/* ── TYPING ANIMATION ────────────────────────── */
const el = document.getElementById('typed-text');
if (el) {
  const phrases = [
    'Aspiring Web Developer',
    'Data Science Enthusiast',
    'Problem Solver',
    'Creative Coder',
    'Based in Lagos, Nigeria 🇳🇬'
  ];
  let pi = 0, ci = 0, deleting = false;
  function type() {
    const word = phrases[pi];
    el.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
    if (!deleting && ci > word.length) {
      deleting = true; setTimeout(type, 2000); return;
    }
    if (deleting && ci < 0) {
      deleting = false; pi = (pi + 1) % phrases.length;
    }
    setTimeout(type, deleting ? 45 : 85);
  }
  type();
}

/* ── SCROLL FADE-IN ──────────────────────────── */
const targets = document.querySelectorAll(
  '.skill-card, .project-card, .info-card, .contact-form-wrap'
);
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
targets.forEach(t => io.observe(t));

/* ── NAVBAR SCROLL ───────────────────────────── */
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (nav) {
    nav.style.background = window.scrollY > 60
      ? 'rgba(5,5,12,0.98)'
      : 'rgba(5,5,12,0.8)';
  }
});

/* ── CONTACT FORM ────────────────────────────── */
const sendBtn = document.getElementById('send-btn');
if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    const name = document.getElementById('name')?.value;
    const email = document.getElementById('email')?.value;
    const message = document.getElementById('message')?.value;
    if (!name || !email || !message) {
      alert('Please fill in all fields!'); return;
    }
    const msg = document.getElementById('success-msg');
    if (msg) msg.style.display = 'block';
    sendBtn.textContent = 'Message sent ✓';
    sendBtn.style.background = 'linear-gradient(135deg,#059669,#10b981)';
    sendBtn.disabled = true;
  });
}