// Custom magnetic cursor with particle trail
// Babel standalone compatible — no imports
const { useState: cUseState, useEffect: cUseEffect, useRef: cUseRef, useMemo: cUseMemo } = React;

function MagneticCursor() {
  const dotRef   = cUseRef(null);
  const ringRef  = cUseRef(null);
  const canvasRef = cUseRef(null);

  const pos     = cUseRef({ x: -200, y: -200 });
  const ringPos = cUseRef({ x: -200, y: -200 });
  const hover   = cUseRef(false);
  const drag    = cUseRef(false);
  const raf     = cUseRef(null);

  // Particle trail system
  const particles = cUseMemo(() => {
    const MAX = 30;
    const arr = [];
    for (let i = 0; i < MAX; i++) {
      arr.push({
        x: -200, y: -200,
        size: Math.random() * 3 + 1,
        alpha: 0,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5 - 0.3,
        life: 0,
        maxLife: 20 + Math.random() * 20,
      });
    }
    return arr;
  }, []);

  const particleIndex = cUseRef(0);
  const prevPos = cUseRef({ x: -200, y: -200 });

  cUseEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    const canvas = canvasRef.current;
    if (!dot || !ring || !canvas) return;

    // Add cursor-active class to body
    document.body.classList.add('cursor-active');

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Track mouse
    const onMove = (e) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;

      // Emit particle on movement
      const dx = pos.current.x - prevPos.current.x;
      const dy = pos.current.y - prevPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 3) {
        const p = particles[particleIndex.current % particles.length];
        p.x = pos.current.x;
        p.y = pos.current.y;
        p.alpha = 0.6;
        p.life = 0;
        p.vx = (Math.random() - 0.5) * 0.8;
        p.vy = (Math.random() - 0.5) * 0.8 - 0.4;
        particleIndex.current++;
      }
      prevPos.current.x = pos.current.x;
      prevPos.current.y = pos.current.y;

      // Check interactive elements
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const isHover = !!el?.closest('a, button, [data-cursor="hover"], input, select, textarea, label');
      const isDrag  = !!el?.closest('[data-cursor="drag"]');

      if (isHover !== hover.current || isDrag !== drag.current) {
        hover.current = isHover;
        drag.current  = isDrag;

        if (isHover) {
          dot.style.transform  = 'translate(-50%, -50%) scale(2.2)';
          dot.style.opacity    = '0.35';
          dot.style.mixBlendMode = 'normal';
          ring.style.transform = 'translate(-50%, -50%) scale(2.2)';
          ring.style.borderColor = 'rgba(232,146,52,0.9)';
          ring.style.boxShadow   = '0 0 20px rgba(232,146,52,0.5), inset 0 0 20px rgba(232,146,52,0.1)';
        } else {
          dot.style.transform  = 'translate(-50%, -50%) scale(1)';
          dot.style.opacity    = '1';
          dot.style.mixBlendMode = 'difference';
          ring.style.transform = 'translate(-50%, -50%) scale(1)';
          ring.style.borderColor = 'rgba(232,146,52,0.45)';
          ring.style.boxShadow   = 'none';
        }
      }
    };

    // RAF loop — ring follows with lerp, particles animate
    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      // Dot snaps instantly
      dot.style.left = pos.current.x + 'px';
      dot.style.top  = pos.current.y + 'px';

      // Ring follows with smooth lerp (lag)
      ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.12);
      ring.style.left = ringPos.current.x + 'px';
      ring.style.top  = ringPos.current.y + 'px';

      // Draw particle trail
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.alpha <= 0) continue;

        p.life++;
        p.alpha *= 0.96;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02; // gravity

        if (p.alpha > 0.01) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (p.alpha / 0.6), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(232, 146, 52, ${p.alpha * 0.5})`;
          ctx.fill();

          // Glow
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2 * (p.alpha / 0.6), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(232, 146, 52, ${p.alpha * 0.15})`;
          ctx.fill();
        }
      }

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);

    const onLeave  = () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
      canvas.style.opacity = '0';
    };
    const onEnter  = () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
      canvas.style.opacity = '1';
    };

    window.addEventListener('mousemove',  onMove,  { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      window.removeEventListener('resize', handleResize);
    };
  }, [particles]);

  const base = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 999999,
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    willChange: 'transform, left, top',
    top: '-200px',
    left: '-200px',
  };

  return React.createElement(React.Fragment, null,
    React.createElement('canvas', {
      ref: canvasRef,
      style: {
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 999998,
        transition: 'opacity 0.3s ease',
      }
    }),
    React.createElement('div', {
      ref: dotRef,
      style: Object.assign({}, base, {
        width: 10,
        height: 10,
        background: 'radial-gradient(circle at 35% 35%, #F5A94A, #C97820)',
        boxShadow: '0 0 12px rgba(232,146,52,0.8), 0 0 24px rgba(232,146,52,0.3)',
        transition: 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1), opacity 0.18s ease',
        mixBlendMode: 'difference',
      })
    }),
    React.createElement('div', {
      ref: ringRef,
      style: Object.assign({}, base, {
        width: 44,
        height: 44,
        border: '1.5px solid rgba(232,146,52,0.45)',
        background: 'rgba(232,146,52,0.03)',
        backdropFilter: 'blur(2px)',
        transition: 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1), border-color 0.25s ease, box-shadow 0.25s ease, opacity 0.2s ease',
      })
    })
  );
}

window.MagneticCursor = MagneticCursor;
