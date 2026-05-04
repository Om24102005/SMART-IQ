/**
 * Micro-interactions System
 * ─────────────────────────
 * Babel standalone compatible — no imports
 * Tiny, delightful interactions that make the UI feel alive.
 */

/* ─── Hover Glow Trail ─────────────────────────────────────────── */
function initHoverGlow() {
  const style = document.createElement('style');
  style.textContent = `
    .hover-glow {
      position: relative;
      overflow: hidden;
      isolation: isolate;
    }
    .hover-glow::before {
      content: '';
      position: absolute;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(232,146,52,0.08) 0%, transparent 70%);
      pointer-events: none;
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.5);
      transition: opacity 0.3s ease, transform 0.3s ease;
      z-index: -1;
    }
    .hover-glow:hover::before {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  `;
  document.head.appendChild(style);

  document.addEventListener('mousemove', (e) => {
    const els = document.querySelectorAll('.hover-glow:hover');
    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty('--glow-x', `${x}px`);
      el.style.setProperty('--glow-y', `${y}px`);
    });
  });
}

/* ─── Scroll Progress Badge ────────────────────────────────────── */
function createScrollProgressBadge() {
  const badge = document.createElement('div');
  badge.id = 'scroll-progress-badge';
  badge.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 2rem;
    z-index: 9999;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    color: rgba(232,146,52,0.3);
    letter-spacing: 0.1em;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.6s ease;
    mix-blend-mode: difference;
  `;
  document.body.appendChild(badge);

  setTimeout(() => { badge.style.opacity = '1'; }, 3000);

  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        badge.textContent = `${progress.toFixed(1)}%`;
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}

/* ─── Ambient Cursor Glow ──────────────────────────────────────── */
function initAmbientCursorGlow() {
  const glow = document.createElement('div');
  glow.id = 'ambient-cursor-glow';
  glow.style.cssText = `
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    transition: background 0.3s ease;
  `;
  document.body.appendChild(glow);

  let rafId = null;
  const onMove = (e) => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      glow.style.background = `
        radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px,
          rgba(232,146,52,0.03) 0%,
          transparent 70%)
      `;
    });
  };

  window.addEventListener('mousemove', onMove, { passive: true });
  return () => {
    window.removeEventListener('mousemove', onMove);
    glow.remove();
  };
}

/* ─── Card Tilt Effect ─────────────────────────────────────────── */
function initCardTilt() {
  document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('[data-tilt]');
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -8;
      const rotateY = (x - centerX) / centerX * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
    });
  });

  document.addEventListener('mouseleave', () => {
    const cards = document.querySelectorAll('[data-tilt]');
    cards.forEach((card) => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    });
  });
}

/* ─── Smooth Anchor Scroll ─────────────────────────────────────── */
function initSmoothAnchors() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;

    if (window.__lenis) {
      window.__lenis.scrollTo(target);
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

/* ─── Initialize all micro-interactions ────────────────────────── */
function initAllMicroInteractions() {
  initHoverGlow();
  initAmbientCursorGlow();
  initSmoothAnchors();
}

// Expose to window
window.SparshMicro = {
  initHoverGlow,
  createScrollProgressBadge,
  initAmbientCursorGlow,
  initCardTilt,
  initSmoothAnchors,
  initAllMicroInteractions,
};
