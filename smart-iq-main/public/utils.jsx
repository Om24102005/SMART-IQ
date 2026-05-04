// Shared utilities
const { useState, useEffect, useRef, useCallback, useMemo } = React;

// Lerp two numbers
const lerp = (a, b, t) => a + (b - a) * t;

// Smoothly animate a value with rAF
function useLerpedNumber(target, speed = 0.08) {
  const [value, setValue] = useState(target);
  const rafRef = useRef();
  const cur = useRef(target);
  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    const step = () => {
      cur.current = lerp(cur.current, target, speed);
      if (Math.abs(cur.current - target) < 0.01) {
        cur.current = target;
        setValue(target);
        return;
      }
      setValue(cur.current);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, speed]);
  return value;
}

// Format INR
const inr = (n) => {
  const v = Math.round(n);
  return "₹" + v.toLocaleString("en-IN");
};

// Reveal on scroll
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("show");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// Section scroll-progress (0..1) when target enters viewport
function useScrollProgress(ref) {
  const [p, setP] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const onScroll = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      // Progress: 0 when top of section hits bottom of viewport, 1 when bottom hits top.
      const total = r.height + vh * 0.6;
      const passed = vh - r.top;
      const np = Math.max(0, Math.min(1, passed / total));
      setP(np);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref]);
  return p;
}

// Easing
const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

window.SparshUtils = { lerp, useLerpedNumber, inr, useReveal, useScrollProgress, easeOutQuart, easeInOutCubic };
