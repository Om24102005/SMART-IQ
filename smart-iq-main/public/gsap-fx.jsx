/**
 * GSAP Supercharged Animations
 * ─────────────────────────────
 * Babel standalone compatible — no imports
 * Character splits, smoother scrubs, parallax, and micro-interactions.
 */
const { useEffect: gUseEffect, useRef: gUseRef, useCallback: gUseCallback } = React;
const { gsap, ScrollTrigger } = window;

if (gsap && ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── Split Text Character Animation ──────────────────────────── */
function useSplitTextReveal(ref, options = {}) {
  gUseEffect(() => {
    const el = ref.current;
    if (!el || !gsap) return;

    // Simple character split without SplitText dependency
    const text = el.textContent;
    const chars = text.split('').map((ch, i) => {
      const span = document.createElement('span');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(40px) rotateX(-60deg)';
      span.style.transition = `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${i * 0.025}s, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${i * 0.025}s`;
      return span;
    });
    el.textContent = '';
    chars.forEach(s => el.appendChild(s));

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        chars.forEach(s => {
          s.style.opacity = '1';
          s.style.transform = 'translateY(0) rotateX(0deg)';
        });
        observer.unobserve(el);
      }
    }, { threshold: 0.15 });
    observer.observe(el);

    return () => {
      observer.disconnect();
      el.textContent = text;
    };
  }, [ref, options.start]);
}

/* ─── Parallax Scroll Effect ──────────────────────────────────── */
function useParallax(ref, { speed = 0.3, direction = 'y' } = {}) {
  gUseEffect(() => {
    const el = ref.current;
    if (!el || !gsap) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });
    tl.to(el, { [direction]: speed * 100, ease: 'none' });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [ref, speed, direction]);
}

/* ─── Smooth Number Counter ───────────────────────────────────── */
function useAnimatedNumber(ref, { value, trigger, duration = 2 } = {}) {
  gUseEffect(() => {
    if (!trigger || !ref.current || !gsap) return;
    const el = ref.current;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: value,
      duration,
      ease: 'power3.out',
      onUpdate: () => {
        el.textContent = Math.round(obj.val).toLocaleString();
      },
    });
  }, [ref, value, trigger, duration]);
}

/* ─── Magnetic Hover Effect ───────────────────────────────────── */
function useMagneticHover(ref, { strength = 0.3 } = {}) {
  gUseEffect(() => {
    const el = ref.current;
    if (!el || !gsap) return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const onLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [ref, strength]);
}

/* ─── Stagger Children Animation ───────────────────────────────── */
function useStaggerReveal(containerRef, { stagger = 0.06, y = 30, start = 'top 85%' } = {}) {
  gUseEffect(() => {
    const container = containerRef.current;
    if (!container || !gsap) return;

    const children = Array.from(container.children);
    if (!children.length) return;

    gsap.fromTo(
      children,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start,
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, [containerRef, stagger, y, start]);
}

/* ─── Smooth Scroll Scrub ─────────────────────────────────────── */
function useScrollScrub(ref, { props, start = 'top top', end = 'bottom top' } = {}) {
  gUseEffect(() => {
    const el = ref.current;
    if (!el || !props || !gsap) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start,
        end,
        scrub: 1.5,
        invalidateOnRefresh: true,
      },
    });
    tl.to(el, { ...props, ease: 'none' });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [ref, props, start, end]);
}

/* ─── Micro-interaction: Button press ripple ──────────────────── */
function useRippleEffect(ref) {
  gUseEffect(() => {
    const el = ref.current;
    if (!el || !gsap) return;

    const onClick = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(232,146,52,0.3);
        transform: translate(-50%, -50%);
        pointer-events: none;
      `;
      el.appendChild(ripple);

      gsap.to(ripple, {
        width: 300,
        height: 300,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => ripple.remove(),
      });
    };

    el.addEventListener('click', onClick);
    return () => el.removeEventListener('click', onClick);
  }, [ref]);
}

/* ─── Global GSAP config ──────────────────────────────────────── */
function initGSAPDefaults() {
  if (!gsap) return;
  gsap.defaults({
    ease: 'power3.out',
    overwrite: 'auto',
  });
  if (ScrollTrigger) {
    ScrollTrigger.defaults({
      toggleActions: 'play none none reverse',
      scroller: window.__lenis || window,
    });
  }
}

// Expose to window for use in app.jsx
window.SparshGSAP = {
  useSplitTextReveal,
  useParallax,
  useAnimatedNumber,
  useMagneticHover,
  useStaggerReveal,
  useScrollScrub,
  useRippleEffect,
  initGSAPDefaults,
};
