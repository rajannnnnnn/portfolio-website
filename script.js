document.getElementById('year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none)').matches;

/* ---------- Navbar background + active link on scroll ---------- */
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('main section[id], header#top');
const navAnchors = document.querySelectorAll('.nav-links a[data-section]');

function onScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 20);

  let current = '';
  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom >= 120) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.dataset.section === current);
  });

  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  const bar = document.getElementById('scrollProgress');
  if (bar) bar.style.width = progress + '%';
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Mobile nav toggle ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ---------- Scroll reveal ---------- */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

/* ---------- Count-up stats ---------- */
const statEls = document.querySelectorAll('.stat-num[data-count-to]');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.countTo);
    const suffix = el.dataset.suffix || '';
    if (prefersReducedMotion) {
      el.textContent = target + suffix;
    } else {
      const duration = 1200;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });
statEls.forEach(el => statObserver.observe(el));

/* ---------- Role cycle (typewriter) ---------- */
const roles = [
  'Applied AI Engineer',
  'GenAI Systems Engineer',
  'LLM Systems Owner',
  'ML / NLP Engineer',
  'AI Safety Researcher'
];
const roleEl = document.getElementById('roleCycle');

if (roleEl && !prefersReducedMotion) {
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let deleting = false;

  function typeTick() {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      if (charIndex > current.length) {
        charIndex = current.length;
        deleting = false;
        setTimeout(() => { deleting = true; typeTick(); }, 1800);
        return;
      }
    } else {
      charIndex--;
      if (charIndex < 0) {
        charIndex = 0;
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeTick, 300);
        return;
      }
    }
    roleEl.textContent = current.slice(0, charIndex);
    setTimeout(typeTick, deleting ? 35 : 60);
  }
  charIndex = 0;
  roleEl.textContent = '';
  setTimeout(typeTick, 500);
} else if (roleEl) {
  roleEl.textContent = roles[0];
}

/* ---------- Cursor glow ---------- */
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow && !isTouch && !prefersReducedMotion) {
  window.addEventListener('mousemove', (e) => {
    cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    cursorGlow.classList.add('active');
  });
  document.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
}

/* ---------- Magnetic buttons ---------- */
if (!isTouch && !prefersReducedMotion) {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

/* ---------- 3D tilt on cards ---------- */
if (!isTouch && !prefersReducedMotion) {
  document.querySelectorAll('.project-card, .more-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-py * 4}deg) rotateY(${px * 4}deg) translateY(-3px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ---------- Neural network hero canvas ---------- */
const canvas = document.getElementById('neuralCanvas');
if (canvas && !prefersReducedMotion) {
  const ctx = canvas.getContext('2d');
  let width, height, nodes;
  const NODE_COUNT_BASE = 60;
  let animId;
  let visible = true;

  function resize() {
    const hero = canvas.parentElement;
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
    const count = Math.min(NODE_COUNT_BASE, Math.floor((width * height) / 18000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    }));
  }

  let mouseX = -9999, mouseY = -9999;
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouseX = -9999; mouseY = -9999; });

  function step() {
    if (!visible) { animId = requestAnimationFrame(step); return; }
    ctx.clearRect(0, 0, width, height);

    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    });

    const maxDist = 130;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.strokeStyle = `rgba(37,99,235,${0.14 * (1 - dist / maxDist)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
      const dxm = nodes[i].x - mouseX;
      const dym = nodes[i].y - mouseY;
      const dm = Math.sqrt(dxm * dxm + dym * dym);
      if (dm < 160) {
        ctx.strokeStyle = `rgba(4,120,87,${0.3 * (1 - dm / 160)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
      }
    }

    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(20,23,31,0.45)';
      ctx.fill();
    });

    animId = requestAnimationFrame(step);
  }

  document.addEventListener('visibilitychange', () => {
    visible = !document.hidden;
  });

  resize();
  window.addEventListener('resize', resize);
  step();
}
