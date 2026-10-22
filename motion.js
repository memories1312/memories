'use strict';
(() => {
  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const motionKey = 'green-campus-motion-paused';
  const animations = new Set();
  const confettiLayers = new Set();
  let paused = false;
  try { paused = localStorage.getItem(motionKey) === 'true'; } catch {}
  const enabled = () => !paused && !reducedMotion.matches;
  const select = (selector) => document.querySelector(selector);
  const selectAll = (selector) => Array.from(document.querySelectorAll(selector));
  const ease = 'cubic-bezier(.22, 1, .36, 1)';

  // Finite animations never leave content hidden after finishing or being cancelled.
  function animate(element, frames, options = {}) {
    if (!element || !enabled() || !element.animate) return;
    const animation = element.animate(frames, { duration: 650, easing: ease, ...options });
    animations.add(animation);
    animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
    return animation;
  }
  function enter(element, delay = 0, distance = 25) {
    animate(element, [{ opacity: 0, transform: `translateY(${distance}px)` }, { opacity: 1, transform: 'translateY(0)' }], { delay, fill: 'backwards', duration: 800 });
  }
  function pop(element) {
    animate(element, [{ transform: 'scale(.85)' }, { transform: 'scale(1.12)', offset: .55 }, { transform: 'scale(1)' }], { duration: 450 });
  }

  const control = document.createElement('button');
  control.type = 'button';
  control.className = 'motion-toggle';
  document.body.append(control);
  function applyPreference() {
    const active = enabled();
    root.classList.toggle('motion-enabled', active);
    root.classList.toggle('motion-paused', !active);
    control.setAttribute('aria-pressed', String(!active));
    document.dispatchEvent(new CustomEvent('green:motion-change', { detail: { active } }));
    control.disabled = reducedMotion.matches;
    const label = reducedMotion.matches ? 'Đã giảm chuyển động' : active ? 'Dừng hiệu ứng' : 'Bật hiệu ứng';
    control.innerHTML = `<svg viewBox="0 0 16 16" aria-hidden="true">${active ? '<path d="M4 3h3v10H4zm5 0h3v10H9z"/>' : '<path d="m5 3 8 5-8 5z"/>'}</svg><span>${label}</span>`;
    if (!active) {
      animations.forEach(animation => animation.cancel());
      confettiLayers.forEach(layer => layer.remove());
      confettiLayers.clear();
    }
  }
  control.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem(motionKey, String(paused)); } catch {}
    applyPreference();
  });
  reducedMotion.addEventListener('change', applyPreference);
  applyPreference();
  document.addEventListener('visibilitychange', () => {
    root.classList.toggle('page-inactive', document.hidden);
    animations.forEach(animation => document.hidden ? animation.pause() : animation.play());
  });
  window.addEventListener('beforeprint', () => animations.forEach(animation => animation.cancel()));

  // The original split hero is optional; the full-screen carousel has its own motion.
  const heroVisual = select('.hero-visual');
  if (heroVisual) {
    const orbit = document.createElement('div');
    orbit.className = 'hero-orbit';
    orbit.setAttribute('aria-hidden', 'true');
    heroVisual.prepend(orbit);
    selectAll('.hero-copy > *').forEach((element, index) => enter(element, index * 90, 22));
    enter(heroVisual, 180, 30);
  }

  const ribbon = select('.green-ribbon');
  const ribbonText = select('.ribbon-inner');
  const ribbonTrack = document.createElement('div');
  ribbonTrack.className = 'ribbon-track';
  const ribbonClone = ribbonText.cloneNode(true);
  ribbonClone.setAttribute('aria-hidden', 'true');
  ribbonTrack.append(ribbonText, ribbonClone);
  ribbon.append(ribbonTrack);
  ribbon.classList.add('has-marquee');

  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        const siblings = Array.from(element.parentElement.children);
        const stagger = element.matches('.category-card, .campus-story, .guide-item, .hub-item') ? siblings.indexOf(element) * 90 : 0;
        enter(element, stagger);
        reveal.unobserve(element);
      });
    }, { threshold: .08, rootMargin: '0px 0px -30px 0px' });
    selectAll('.intro-heading, .hub-item, .campus-filters, .section-heading, .category-card, .special-note, .lookup-copy, .lookup-box, .quiz-board, .campus-story, .campus-social, .guide-item, .action-panel, .faq-section > div, .footer-main').forEach(element => reveal.observe(element));
    const loops = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('motion-in-view', entry.isIntersecting));
    }, { rootMargin: '40px' });
    selectAll('.hero, .green-ribbon, .category-card, .quiz-board, .action-panel, .guide-item').forEach(element => loops.observe(element));
  } else {
    selectAll('.hero, .green-ribbon, .category-card, .quiz-board, .action-panel, .guide-item').forEach(element => element.classList.add('motion-in-view'));
  }

  const header = select('.site-header');
  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  header.append(progress);
  const nav = selectAll('#main-nav a').map(link => ({ link, section: select(link.getAttribute('href')) })).filter(item => item.section);
  let scrollPending = false;
  function reflectScroll() {
    scrollPending = false;
    const distance = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0})`;
    header.classList.toggle('is-scrolled', scrollY > 20);
    let active = null;
    nav.forEach(item => { if (item.section.getBoundingClientRect().top <= innerHeight * .4) active = item; });
    nav.forEach(item => {
      if (item === active) item.link.setAttribute('aria-current', 'location');
      else item.link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', () => {
    if (!scrollPending) { scrollPending = true; requestAnimationFrame(reflectScroll); }
  }, { passive: true });
  window.addEventListener('resize', reflectScroll);
  reflectScroll();

  function celebrate(container, count = 36) {
    if (!enabled() || !container || !Element.prototype.animate) return;
    confettiLayers.forEach(layer => layer.remove());
    confettiLayers.clear();
    const layer = document.createElement('div');
    layer.className = 'celebration';
    layer.setAttribute('aria-hidden', 'true');
    container.append(layer);
    confettiLayers.add(layer);
    const colors = ['#cde68f', '#749a47', '#2b7452', '#d6ac65', '#7ba6a2'];
    const width = container.clientWidth;
    const height = container.clientHeight;
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('i');
      piece.className = 'celebration-piece';
      piece.style.background = colors[i % colors.length];
      layer.append(piece);
      const x = (Math.random() - .5) * width * .95;
      const rise = 40 + Math.random() * height * .4;
      const spin = Math.random() * 450 - 225;
      animate(piece, [
        { opacity: 0, transform: 'translate(0,0) scale(.3) rotate(0)' },
        { opacity: 1, transform: `translate(${x * .7}px,${-rise}px) scale(1) rotate(${spin * .5}deg)`, offset: .38 },
        { opacity: 0, transform: `translate(${x}px,${height * .55}px) scale(.7) rotate(${spin}deg)` }
      ], { duration: 1300 + Math.random() * 550, delay: Math.random() * 120, easing: 'cubic-bezier(.2,.6,.5,1)', fill: 'both' });
    }
    setTimeout(() => { layer.remove(); confettiLayers.delete(layer); }, 2100);
  }

  document.addEventListener('green:quiz-change', () => {
    enter(select('#quiz-question'), 0, 12);
    selectAll('.quiz-option').forEach((element, index) => enter(element, index * 45, 10));
    animate(select('#quiz-emoji'), [{ opacity: 0, transform: 'translateY(20px) rotate(-24deg) scale(.65)' }, { opacity: 1, transform: 'translateY(0) rotate(-12deg) scale(1)' }], { duration: 600 });
  });
  document.addEventListener('green:answer', event => {
    enter(select('#quiz-feedback'), 0, 9);
    if (event.detail.correct) {
      pop(select('.quiz-option.correct'));
      pop(select('#quiz-score'));
      celebrate(select('.quiz-illustration'), 14);
    } else {
      animate(select('.quiz-option.wrong'), [{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }], { duration: 300, easing: 'ease-out' });
    }
  });
  document.addEventListener('green:quiz-complete', () => {
    enter(select('.quiz-content.result'), 0, 12);
    pop(select('.result-score'));
    celebrate(select('.quiz-board'), 48);
  });
  document.addEventListener('change', event => {
    if (!event.target.matches('#challenge-list input')) return;
    pop(event.target.nextElementSibling);
    if (event.target.checked && selectAll('#challenge-list input:checked').length === 7) celebrate(select('.action-panel'), 48);
  });
  const resultsObserver = new MutationObserver(() => {
    selectAll('.result-item').slice(0, 6).forEach((element, index) => enter(element, index * 35, 9));
  });
  resultsObserver.observe(select('#search-results'), { childList: true });
  selectAll('details').forEach(details => details.addEventListener('toggle', () => {
    if (details.open) enter(details.querySelector('div, p'), 0, 8);
  }));
  select('#share-campaign').addEventListener('click', () => {
    animate(select('#share-dialog'), [{ opacity: 0, transform: 'translateY(18px) scale(.96)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }], { duration: 350 });
  });
})();
