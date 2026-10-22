'use strict';
(() => {
  const root = document.documentElement;
  const hero = document.querySelector('.campus-hero');
  if (!hero) return;
  const slides = Array.from(hero.querySelectorAll('.campus-slide'));
  const dots = Array.from(hero.querySelectorAll('.slide-dot'));
  const play = document.querySelector('#hero-play');
  const live = hero.querySelector('.hero-live');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const delay = 7500;
  let current = 0;
  let timer;
  let manualPause = false;
  let hovered = false;
  let inView = true;
  const motionAllowed = () => root.classList.contains('motion-enabled') && !reduced.matches;
  const canRun = () => motionAllowed() && !manualPause && !document.hidden && inView && !hovered;

  function updatePlay() {
    const stopped = manualPause || !motionAllowed();
    play.setAttribute('aria-pressed', String(stopped));
    play.setAttribute('aria-label', !motionAllowed() ? 'Tự chuyển banner đã tắt theo cài đặt hiệu ứng' : stopped ? 'Bật tự chuyển banner' : 'Dừng tự chuyển banner');
    play.disabled = !motionAllowed();
    play.firstElementChild.textContent = stopped ? '▶' : 'Ⅱ';
  }
  function schedule() {
    clearTimeout(timer);
    hero.classList.remove('hero-autoplay');
    updatePlay();
    if (!canRun()) return;
    // Reset the visible progress bar to match this exact timer.
    void hero.offsetWidth;
    hero.classList.add('hero-autoplay');
    timer = setTimeout(() => showSlide(current + 1, false), delay);
  }
  function showSlide(index, userAction) {
    current = (index + slides.length) % slides.length;
    if (userAction) manualPause = true;
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle('is-active', active);
      slide.inert = !active;
      if (active) slide.removeAttribute('aria-hidden');
      else slide.setAttribute('aria-hidden', 'true');
      dots[i].classList.toggle('is-active', active);
      if (active) dots[i].setAttribute('aria-current', 'true');
      else dots[i].removeAttribute('aria-current');
    });
    document.querySelector('#slide-current').textContent = String(current + 1).padStart(2, '0');
    if (userAction) live.textContent = slides[current].getAttribute('aria-label');
    schedule();
  }
  dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i, true)));
  document.querySelector('#hero-prev').addEventListener('click', () => showSlide(current - 1, true));
  document.querySelector('#hero-next').addEventListener('click', () => showSlide(current + 1, true));
  play.addEventListener('click', () => { manualPause = !manualPause; schedule(); });
  hero.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    showSlide(current + (event.key === 'ArrowRight' ? 1 : -1), true);
  });
  hero.addEventListener('focusin', event => {
    // Keyboard users get a stable slide. The play button is the explicit resume control.
    if (event.target === play) return;
    manualPause = true;
    schedule();
  });
  hero.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse') return;
    hovered = true;
    schedule();
  });
  hero.addEventListener('pointerleave', event => {
    if (event.pointerType !== 'mouse') return;
    hovered = false;
    schedule();
  });
  let touchStart;
  hero.addEventListener('touchstart', event => {
    if (event.target.closest('a, button') || event.touches.length !== 1) { touchStart = null; return; }
    touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  hero.addEventListener('touchend', event => {
    if (!touchStart) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) showSlide(current + (dx < 0 ? 1 : -1), true);
    touchStart = null;
  }, { passive: true });
  document.addEventListener('green:motion-change', schedule);
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', schedule);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      hero.classList.toggle('hero-in-view', inView);
      schedule();
    }, { threshold: .1 });
    observer.observe(hero);
  } else hero.classList.add('hero-in-view');
  schedule();

  const back = document.querySelector('.back-to-top');
  let scrollFrame = false;
  function reflectScroll() {
    scrollFrame = false;
    back.hidden = scrollY < 600;
    const offset = motionAllowed() && finePointer.matches && inView ? Math.min(42, scrollY * .13) : 0;
    hero.style.setProperty('--hero-shift', `${offset}px`);
  }
  window.addEventListener('scroll', () => {
    if (!scrollFrame) { scrollFrame = true; requestAnimationFrame(reflectScroll); }
  }, { passive: true });
  document.addEventListener('green:motion-change', reflectScroll);
  reflectScroll();

  const counts = Array.from(document.querySelectorAll('[data-count]'));
  function animateCount(element) {
    if (!motionAllowed()) return;
    const target = Number(element.dataset.count);
    const start = performance.now();
    function step(now) {
      const amount = Math.min((now - start) / 1100, 1);
      if (!motionAllowed() || document.hidden) { element.textContent = target; return; }
      element.textContent = Math.round(target * (1 - Math.pow(1 - amount, 3)));
      if (amount < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    const counters = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        counters.unobserve(entry.target);
      });
    }, { threshold: .8 });
    counts.forEach(element => counters.observe(element));
  }

  const filters = Array.from(document.querySelectorAll('[data-story-filter]'));
  const stories = Array.from(document.querySelectorAll('[data-story]'));
  const storyAnimations = new Set();
  filters.forEach(button => button.addEventListener('click', () => {
    storyAnimations.forEach(animation => animation.cancel());
    storyAnimations.clear();
    filters.forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    let count = 0;
    stories.forEach(story => {
      const visible = button.dataset.storyFilter === 'all' || button.dataset.storyFilter === story.dataset.story;
      story.hidden = !visible;
      if (!visible) return;
      count++;
      if (motionAllowed() && story.animate) {
        const animation = story.animate([{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 450, easing: 'cubic-bezier(.22,1,.36,1)' });
        storyAnimations.add(animation);
        animation.finished.then(() => storyAnimations.delete(animation), () => storyAnimations.delete(animation));
      }
    });
    document.querySelector('#story-count').textContent = `${count} câu chuyện`;
  }));
  document.addEventListener('green:motion-change', () => {
    if (!motionAllowed()) storyAnimations.forEach(animation => animation.cancel());
  });
})();
