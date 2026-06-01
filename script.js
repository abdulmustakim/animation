const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const preloader = $('#preloader');
const header = $('#header');
const menuBtn = $('#menuBtn');
const mainNav = $('#mainNav');
const cursorGlow = $('#cursorGlow');
const paletteBtn = $('#paletteBtn');
const projectSlider = $('#projectSlider');
const prevProject = $('#prevProject');
const nextProject = $('#nextProject');
const contactForm = $('#contactForm');
const formStatus = $('#formStatus');
const downloadBtn = $('#downloadBtn');
const typingCode = $('#typingCode');

window.addEventListener('load', () => {
  setTimeout(() => preloader.classList.add('hide'), 650);
});

$('#year').textContent = new Date().getFullYear();

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 35);
  setActiveNav();
});

menuBtn.addEventListener('click', () => {
  document.body.classList.toggle('menu-open');
});

$$('.main-nav a').forEach(link => {
  link.addEventListener('click', () => document.body.classList.remove('menu-open'));
});

function setActiveNav() {
  const sections = ['home', 'mission', 'projects', 'services', 'contact'];
  let activeId = 'home';
  for (const id of sections) {
    const section = document.getElementById(id);
    if (!section) continue;
    const rect = section.getBoundingClientRect();
    if (rect.top <= 160 && rect.bottom >= 160) activeId = id;
  }
  $$('.main-nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${activeId}`));
}
setActiveNav();

// Cursor glow
window.addEventListener('pointermove', event => {
  if (!cursorGlow) return;
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

// Reveal on scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

$$('.reveal').forEach(el => revealObserver.observe(el));

// Canvas particle background
const canvas = $('#spaceCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let width = 0;
let height = 0;
let mouse = { x: 0, y: 0 };

function resizeCanvas() {
  width = canvas.width = window.innerWidth * devicePixelRatio;
  height = canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  createParticles();
}

function createParticles() {
  const count = Math.min(135, Math.floor(window.innerWidth / 9));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: (Math.random() * 1.6 + 0.4) * devicePixelRatio,
    vx: (Math.random() - 0.5) * 0.22 * devicePixelRatio,
    vy: (Math.random() - 0.5) * 0.22 * devicePixelRatio,
    a: Math.random() * 0.75 + 0.18
  }));
}

function animateParticles() {
  ctx.clearRect(0, 0, width, height);
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(120, 245, 255, ${p.a})`;
    ctx.fill();
  }

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 120 * devicePixelRatio) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(85, 247, 255, ${0.08 * (1 - dist / (120 * devicePixelRatio))})`;
        ctx.lineWidth = 1 * devicePixelRatio;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
animateParticles();

window.addEventListener('pointermove', event => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

// 3D tilt cards
$$('.tilt-card').forEach(card => {
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = ((0.5 - y / rect.height)) * 10;
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});

// Neon palette changer
const palettes = [
  { primary: '#55f7ff', secondary: '#9d4dff', accent: '#ff4fd8' },
  { primary: '#7cff6b', secondary: '#2bd3ff', accent: '#ffe66d' },
  { primary: '#ff5f7e', secondary: '#ffc15e', accent: '#8e7dff' },
  { primary: '#8affff', secondary: '#00ff99', accent: '#3f7cff' }
];
let paletteIndex = 0;
paletteBtn.addEventListener('click', () => {
  paletteIndex = (paletteIndex + 1) % palettes.length;
  const palette = palettes[paletteIndex];
  Object.entries(palette).forEach(([key, value]) => document.documentElement.style.setProperty(`--${key}`, value));
});

// Project slider controls
let activeProject = 0;
const cards = $$('.project-card');
function updateProject(index) {
  activeProject = (index + cards.length) % cards.length;
  cards.forEach((card, i) => card.classList.toggle('active', i === activeProject));
  if (window.innerWidth <= 980) {
    cards[activeProject].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
}
prevProject.addEventListener('click', () => updateProject(activeProject - 1));
nextProject.addEventListener('click', () => updateProject(activeProject + 1));
cards.forEach((card, index) => card.addEventListener('click', () => updateProject(index)));
setInterval(() => updateProject(activeProject + 1), 5200);

// Typing workflow
const codeText = `const website = new CreativeProject({
  style: "dark cinematic neon",
  layout: "responsive + mobile first",
  features: [
    "3D hero section",
    "glassmorphism cards",
    "animated project showcase",
    "working contact form",
    "download action",
    "smooth scroll reveal"
  ],
  result: "premium launch-ready website"
});

website.design();
website.animate();
website.publish();`;

let typeIndex = 0;
function typeCode() {
  if (!typingCode) return;
  typingCode.textContent = codeText.slice(0, typeIndex);
  typeIndex++;
  if (typeIndex <= codeText.length) {
    setTimeout(typeCode, typeIndex < 40 ? 26 : 14);
  }
}

const typingObserver = new IntersectionObserver((entries) => {
  if (entries.some(entry => entry.isIntersecting)) {
    typeCode();
    typingObserver.disconnect();
  }
}, { threshold: 0.4 });
typingObserver.observe(typingCode);

// Working local contact form
contactForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(contactForm));
  const saved = JSON.parse(localStorage.getItem('creativeDXMessages') || '[]');
  saved.push({ ...data, date: new Date().toLocaleString() });
  localStorage.setItem('creativeDXMessages', JSON.stringify(saved));
  formStatus.textContent = 'Request saved successfully. You can connect this form with email/backend later.';
  contactForm.reset();
});

// Real download action
function downloadProjectPlan() {
  const content = `CREATIVE DIGITAL EXPERIENCE - PROJECT PLAN\n\nWebsite Style:\n- Dark cinematic design\n- Neon blue/purple/pink color palette\n- Glassmorphism cards\n- 3D animated hero section\n- Responsive mobile-first layout\n\nPages/Sections:\n1. Home hero\n2. Mission\n3. Project showcase\n4. Services\n5. Development flow\n6. Contact form\n\nRecommended Next Steps:\n1. Replace brand name with your own company/project name.\n2. Add your real text, images, social links, and WhatsApp number.\n3. Host on GitHub Pages, Netlify, or Vercel.\n`;
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'creative-digital-experience-project-plan.txt';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

downloadBtn.addEventListener('click', downloadProjectPlan);
