/* ── Más Deli · Premium Scroll Effects ── */
(function () {
  'use strict';

  /* ── PROGRESS BAR ── */
  const bar = document.getElementById('scroll-progress');
  function updateProgress(scrollY) {
    if (!bar) return;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (scrollY / total) * 100 : 0) + '%';
  }

  /* ── NAVBAR ── */
  const navbar = document.getElementById('navbar');
  const isHeroNav = navbar && navbar.classList.contains('hero-nav');
  function updateNavbar(scrollY) {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', scrollY > 60);
    if (isHeroNav) navbar.classList.toggle('hero-nav', scrollY <= 60);
  }

  /* ── HERO PARALLAX ── */
  const heroBg = document.querySelector('.hero .hero-bg');
  const hero   = document.querySelector('.hero');
  function updateHeroParallax(scrollY) {
    if (!heroBg || !hero) return;
    if (scrollY > hero.offsetHeight) return;
    if (window.innerWidth > 767) {
      heroBg.style.transform = `translateY(${scrollY * 0.4}px)`;
    }
    const content = hero.querySelector('.hero-content');
    if (content) {
      const p = scrollY / hero.offsetHeight;
      content.style.opacity = Math.max(0, 1 - p * 2);
      content.style.transform = `translateY(${scrollY * 0.15}px)`;
    }
  }

  /* ── SECTION PARALLAX BGS ── */
  const parallaxBgs = document.querySelectorAll('.parallax-bg');
  function updateParallaxBgs() {
    parallaxBgs.forEach(el => {
      const rect = (el.closest('.parallax-wrap') || el).getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translateY(${center * 0.28}px)`;
    });
  }

  /* ── SCROLL HANDLER (throttled rAF) ── */
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        updateProgress(y);
        updateNavbar(y);
        updateHeroParallax(y);
        updateParallaxBgs();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── REVEAL OBSERVER ── */
  const selectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger';
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll(selectors).forEach(el => observer.observe(el));

  const lineObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); lineObs.unobserve(e.target); }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.reveal-line').forEach(l => lineObs.observe(l));

  /* ── SMOOTH SCROLL (anclas internas) ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ── MENÚ HAMBURGUESA ── */
  window.toggleMenu = function () {
    document.getElementById('navMenu')?.classList.toggle('open');
  };
  document.querySelectorAll('.nav-menu a').forEach(a => {
    a.addEventListener('click', () => document.getElementById('navMenu')?.classList.remove('open'));
  });

  /* ── COUNTERS ── */
  function animateCounter(el) {
    const target = +el.dataset.target;
    const step = target / (1400 / 16);
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = Math.round(cur) + (el.dataset.suffix || '');
      if (cur >= target) clearInterval(t);
    }, 16);
  }
  const counters = document.querySelectorAll('[data-target]');
  if (counters.length) {
    const cObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); cObs.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(c => cObs.observe(c));
  }

  /* Inicial */
  const y0 = window.scrollY;
  updateProgress(y0);
  updateNavbar(y0);
  updateHeroParallax(y0);
})();
