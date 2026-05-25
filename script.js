/* ── TYPING ANIMATION ──────────────────── */
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
      deleting = false;
      pi = (pi + 1) % phrases.length;
    }
    setTimeout(type, deleting ? 45 : 85);
  }
  type();
}

/* ── SCROLL FADE-IN ────────────────────── */
const targets = document.querySelectorAll(
  '.skill-card, .project-card, .info-card, .contact-form-wrap, .fade-in'
);
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 90);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
targets.forEach(t => io.observe(t));

/* ── NAVBAR SCROLL ─────────────────────── */
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (nav) {
    nav.style.background = window.scrollY > 60
      ? 'rgba(15,17,23,0.99)'
      : 'rgba(15,17,23,0.92)';
  }
});

/* ── CONTACT FORM ──────────────────────── */
const sendBtn = document.getElementById('send-btn');
if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    const name    = document.getElementById('name')?.value;
    const email   = document.getElementById('email')?.value;
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