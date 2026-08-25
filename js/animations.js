/* ========================================
   ImmersiMed — Scroll & UI Animations
   IntersectionObserver, counter, reveals
   ======================================== */

export function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Don't unobserve — allow re-animation on scroll back (optional)
          // observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.animate-in, .animate-in-left, .animate-in-right').forEach(el => {
    observer.observe(el);
  });
}

/**
 * Animate a number counting up from 0 to target
 * @param {HTMLElement} el - Element to animate (text content will be set)
 * @param {number} target - Target number
 * @param {string} suffix - Suffix to add (e.g. '+', '%', 'K')
 * @param {number} duration - Animation duration in ms
 */
export function animateCounter(el, target, suffix = '', duration = 2000) {
  let start = null;
  const initial = 0;

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    // Ease out cubic
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(initial + (target - initial) * ease);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/**
 * Initialize stat counter animations when they come into view
 */
export function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-count]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          animateCounter(el, target, suffix, 2200);
          observer.unobserve(el); // only animate once
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => observer.observe(c));
}

/**
 * Smooth scroll navigation
 */
export function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        return; // Ignore plain hash links (used by nav tabs)
      }
      
      e.preventDefault();
      try {
        const target = document.querySelector(href);
        if (target) {
          const offset = 80; // navbar height
          const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      } catch (err) {
        // Ignore invalid selectors
      }
    });
  });
}

/**
 * Navbar scroll effect
 */
export function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
        ticking = false;
      });
      ticking = true;
    }
  });
}
