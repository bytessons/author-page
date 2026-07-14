document.getElementById('year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// ---------- Custom cursor ----------
if (!reduceMotion && hasFinePointer) {
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  (function animateRing() {
    rx += (mx - rx) * .1;
    ry += (my - ry) * .1;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll('a, button, .book-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '18px';
      cursor.style.height = '18px';
      ring.style.width = '50px';
      ring.style.height = '50px';
      ring.style.opacity = '1';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '10px';
      cursor.style.height = '10px';
      ring.style.width = '36px';
      ring.style.height = '36px';
      ring.style.opacity = '.5';
    });
  });
}

// ---------- Mobile nav toggle ----------
const navToggle = document.querySelector('.nav-toggle');
const navLinksList = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const isOpen = navLinksList.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinksList.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinksList.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---------- Active section + navbar scroll state ----------
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function setActive(id) {
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + id);
  });
}

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) setActive(e.target.id);
  });
}, { threshold: 0.3 });

sections.forEach(s => sectionObserver.observe(s));

const navbar = document.getElementById('navbar');
const progressBar = document.getElementById('progress-bar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  progressBar.style.width = pct + '%';
});

// ---------- Reveal on scroll ----------
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => revealObs.observe(el));

// ---------- Book card synopsis expand ----------
const bookCards = document.querySelectorAll('.book-card:not(.book-card-soon)');

function toggleCard(card) {
  const expanded = card.classList.toggle('is-expanded');
  card.setAttribute('aria-expanded', String(expanded));
}

bookCards.forEach(card => {
  const expandBtn = card.querySelector('.card-expand-btn');

  expandBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleCard(card);
  });

  card.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target === card) {
      e.preventDefault();
      toggleCard(card);
    }
    if (e.key === 'Escape') {
      card.classList.remove('is-expanded');
      card.setAttribute('aria-expanded', 'false');
    }
  });
});

if (location.hash) {
  const target = document.querySelector(location.hash);
  if (target) setTimeout(() => target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }), 100);
}
