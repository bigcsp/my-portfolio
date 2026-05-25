/* ── PARTICLES ───────────────────────────────── */
const canvas = document.getElementById('particles-canvas');
const ctx    = canvas.getContext('2d');
let W, H;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const COLORS = ['192,132,252', '124,58,237', '34,211,238'];

class Dot {
  constructor() { this.init(); }
  init() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.r  = Math.random() * 1.8 + 0.4;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.c  = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.a  = Math.random() * 0.6 + 0.15;
  }
  step() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.init();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.c},${this.a})`;
    ctx.fill();
  }
}

const dots = Array.from({ length: 130 }, () => new Dot());

function drawLines() {
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const dx   = dots[i].x - dots[j].x;
      const dy   = dots[i].y - dots[j].y;
      const dist = Math.hypot(dx, dy);
      if (dist < 110) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(124,58,237,${0.18 * (1 - dist / 110)})`;
        ctx.lineWidth   = 0.6;
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(dots[j].x, dots[j].y);
        ctx.stroke();
      }
    }
  }
}

(function loop() {
  ctx.clearRect(0, 0, W, H);
  dots.forEach(d => { d.step(); d.draw(); });
  drawLines();
  requestAnimationFrame(loop);
})();

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
    el.textContent = deleting
      ? word.slice(0, ci--)
      : word.slice(0, ci++);

    if (!deleting && ci > word.length) {
      deleting = true;
      setTimeout(type, 2000);
      return;
    }
    if (deleting && ci < 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;
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
      ? 'rgba(7,7,15,0.97)'
      : 'rgba(7,7,15,0.8)';
  }
});

/* ── CONTACT FORM ────────────────────────────── */
const sendBtn = document.getElementById('send-btn');
if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    const name    = document.getElementById('name')?.value;
    const email   = document.getElementById('email')?.value;
    const message = document.getElementById('message')?.value;
    if (!name || !email || !message) {
      alert('Please fill in all fields!');
      return;
    }
    const msg = document.getElementById('success-msg');
    if (msg) msg.style.display = 'block';
    sendBtn.textContent = 'Message sent ✓';
    sendBtn.style.background = 'linear-gradient(135deg,#059669,#10b981)';
    sendBtn.disabled = true;
  });
}