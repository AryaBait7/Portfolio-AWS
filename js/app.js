// ============================================================
// Footer year
// ============================================================
document.getElementById('year').textContent = new Date().getFullYear();

// ============================================================
// Active nav link on scroll
// ============================================================
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => navObserver.observe(sec));

// ============================================================
// Scroll reveal (delays are handled per-grid in CSS via nth-child)
// ============================================================
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// ============================================================
// Skill bar fill animation
// ============================================================
const bars = document.querySelectorAll('.bar-fill');
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      bar.style.width = bar.dataset.fill + '%';
      barObserver.unobserve(bar);
    }
  });
}, { threshold: 0.4 });
bars.forEach(bar => barObserver.observe(bar));

// ============================================================
// Terminal typing animation (hero signature element)
// ============================================================
const terminalLines = [
  { type: 'cmd', text: 'aws partnercentral list-opportunities --status active' },
  { type: 'out', text: '24 open opportunities synced from Salesforce' },
  { type: 'cmd', text: 'python analyze_pipeline.py --quarter Q2' },
  { type: 'out', text: '✔ pipeline health report generated → insights ready' },
  { type: 'cmd', text: 'echo "translating ops data into decisions..."' },
];

const terminalBody = document.getElementById('terminalBody');

function typeLine(lineObj, container, done) {
  const lineEl = document.createElement('div');
  lineEl.className = 'line';
  container.appendChild(lineEl);

  const prefix = lineObj.type === 'cmd' ? '$ ' : '';
  if (lineObj.type === 'cmd') {
    const promptSpan = document.createElement('span');
    promptSpan.className = 'prompt';
    promptSpan.textContent = prefix;
    lineEl.appendChild(promptSpan);
  }

  const textSpan = document.createElement('span');
  if (lineObj.type === 'out') textSpan.className = 'out';
  lineEl.appendChild(textSpan);

  let i = 0;
  const speed = lineObj.type === 'cmd' ? 26 : 4;

  function step() {
    if (i <= lineObj.text.length) {
      textSpan.textContent = lineObj.text.slice(0, i);
      i++;
      setTimeout(step, speed);
    } else {
      done();
    }
  }
  step();
}

function runTerminal(lines, container) {
  container.innerHTML = '';
  const cursor = document.createElement('span');
  cursor.className = 'terminal-cursor';

  let idx = 0;
  function next() {
    if (idx < lines.length) {
      typeLine(lines[idx], container, () => {
        idx++;
        setTimeout(next, 350);
      });
    } else {
      container.appendChild(cursor);
    }
  }
  next();
}

if (terminalBody) {
  const terminalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runTerminal(terminalLines, terminalBody);
        terminalObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  terminalObserver.observe(document.querySelector('.terminal'));
}

// ============================================================
// Theme toggle (dark default <-> light)
// ============================================================
const themeToggle = document.getElementById('themeToggle');
const lightVars = {
  '--bg': '#F5F7FB', '--surface': '#FFFFFF', '--surface-2': '#EDF1F8',
  '--border': '#DCE3EF', '--text': '#131C2E', '--text-dim': '#5B6779'
};
const darkVars = {
  '--bg': '#0B1120', '--surface': '#131C2E', '--surface-2': '#1B2740',
  '--border': '#24304A', '--text': '#E7ECF5', '--text-dim': '#8996AD'
};
let isLight = false;
themeToggle.addEventListener('click', () => {
  isLight = !isLight;
  const vars = isLight ? lightVars : darkVars;
  Object.entries(vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
});

// ============================================================
// Contact form (front-end only — wire to your own backend/API)
// ============================================================
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const original = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-check"></i> Message sent';
  e.target.reset();
  setTimeout(() => { btn.innerHTML = original; }, 2500);
});

// ============================================================
// Cursor glow + dot (skip entirely on touch devices)
// ============================================================
const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (supportsHover && !prefersReducedMotion) {
  const glow = document.getElementById('cursorGlow');
  const dot = document.getElementById('cursorDot');
  let gx = 0, gy = 0, dx = 0, dy = 0;

  window.addEventListener('mousemove', (e) => {
    dx = e.clientX; dy = e.clientY;
  });

  function raf() {
    gx += (dx - gx) * 0.12;
    gy += (dy - gy) * 0.12;
    glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
    dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
    requestAnimationFrame(raf);
  }
  raf();

  document.querySelectorAll('a, button, .tilt').forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('hovered'));
    el.addEventListener('mouseleave', () => dot.classList.remove('hovered'));
  });
}

// ============================================================
// Magnetic buttons
// ============================================================
if (supportsHover && !prefersReducedMotion) {
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${relX * 0.25}px, ${relY * 0.35}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
}

// ============================================================
// Tilt on cards
// ============================================================
if (supportsHover && !prefersReducedMotion) {
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${py * -6}deg) rotateY(${px * 8}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(700px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

// ============================================================
// Background dot-grid canvas (hero only, subtle parallax on scroll)
// ============================================================
const canvas = document.getElementById('bgGrid');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let w, h, dpr;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    w = canvas.parentElement.offsetWidth;
    h = canvas.parentElement.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const spacing = 34;
  let scrollOffset = 0;
  window.addEventListener('scroll', () => { scrollOffset = window.scrollY * 0.15; });

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(137, 150, 173, 0.35)';
    const offsetY = scrollOffset % spacing;
    for (let y = -spacing + offsetY; y < h + spacing; y += spacing) {
      for (let x = 0; x < w + spacing; x += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1.1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    requestAnimationFrame(draw);
  }
  if (!prefersReducedMotion) draw();
  else {
    // static grid for reduced motion
    ctx.fillStyle = 'rgba(137, 150, 173, 0.3)';
    for (let y = 0; y < h + spacing; y += spacing) {
      for (let x = 0; x < w + spacing; x += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1.1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}