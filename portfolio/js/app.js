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
// Scroll reveal
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
  { type: 'cmd', text: 'aws s3 sync ./portfolio s3://your-bucket-name' },
  { type: 'out', text: 'upload: index.html to s3://your-bucket-name/index.html' },
  { type: 'out', text: 'upload: css/styles.css to s3://your-bucket-name/css/styles.css' },
  { type: 'cmd', text: 'aws cloudfront create-invalidation --distribution-id ABCD123 --paths "/*"' },
  { type: 'out', text: '✔ invalidation created — deployment live in ~60s' },
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
  const speed = lineObj.type === 'cmd' ? 28 : 4;

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

const terminalObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      runTerminal(terminalLines, terminalBody);
      terminalObserver.disconnect();
    }
  });
}, { threshold: 0.3 });
terminalObserver.observe(document.querySelector('.terminal'));

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
