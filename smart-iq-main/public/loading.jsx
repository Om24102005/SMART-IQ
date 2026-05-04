// Animated loading screen with particle background
// Babel standalone compatible — no imports
const { useState: lUseState, useEffect: lUseEffect, useRef: lUseRef } = React;

const PARTICLE_COUNT = 80;

function generateParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    speed: Math.random() * 0.3 + 0.1,
    delay: Math.random() * 2,
    opacity: Math.random() * 0.5 + 0.2,
  }));
}

function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = lUseState(0);
  const [phase, setPhase] = lUseState('loading');
  const particles = lUseRef(generateParticles());
  const startTime = lUseRef(Date.now());
  const rafRef = lUseRef(null);

  lUseEffect(() => {
    const DURATION = 2200;
    const animate = () => {
      const elapsed = Date.now() - startTime.current;
      const p = Math.min(elapsed / DURATION, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(eased);

      if (p < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setPhase('complete');
        setTimeout(() => {
          setPhase('hidden');
          if (onComplete) onComplete();
        }, 600);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onComplete]);

  if (phase === 'hidden') return null;

  return React.createElement('div', {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 999999,
      background: '#06080f',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      opacity: phase === 'complete' ? 0 : 1,
      transition: 'opacity 0.6s ease',
    }
  },
    // Particle background SVG
    React.createElement('svg', {
      style: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }
    },
      React.createElement('defs', null,
        React.createElement('radialGradient', { id: 'loading-glow' },
          React.createElement('stop', { offset: '0%', stopColor: '#E89234', stopOpacity: '0.15' }),
          React.createElement('stop', { offset: '100%', stopColor: '#E89234', stopOpacity: '0' })
        )
      ),
      React.createElement('rect', { width: '100%', height: '100%', fill: 'url(#loading-glow)' }),
      particles.current.map((p) =>
        React.createElement('circle', {
          key: p.id,
          cx: p.x + '%',
          cy: p.y + '%',
          r: p.size,
          fill: '#E89234',
          style: {
            animation: `loadingParticle ${3 + p.speed * 2}s ${p.delay}s infinite ease-in-out`,
          }
        })
      )
    ),

    // Central content
    React.createElement('div', {
      style: {
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
      }
    },
      // Logo
      React.createElement('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          opacity: 1,
          transform: 'translateY(0)',
          transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)',
        }
      },
        React.createElement('div', {
          style: {
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#E89234',
            boxShadow: '0 0 20px #E89234, 0 0 40px rgba(232,146,52,0.3)',
          }
        }),
        React.createElement('span', {
          style: {
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            fontWeight: 700,
            color: '#FAF7F2',
            letterSpacing: '-0.03em',
          }
        }, 'SparshIQ')
      ),

      // Tagline
      React.createElement('p', {
        style: {
          color: 'rgba(250,247,242,0.4)',
          fontSize: '0.82rem',
          fontFamily: "'Inter', sans-serif",
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginTop: '-1rem',
        }
      }, 'Autonomous Solar Cleaning'),

      // Progress bar
      React.createElement('div', {
        style: {
          width: 'clamp(160px, 20vw, 280px)',
          height: 2,
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 2,
          overflow: 'hidden',
        }
      },
        React.createElement('div', {
          style: {
            height: '100%',
            width: `${progress * 100}%`,
            background: 'linear-gradient(90deg, #C97820, #F5A94A)',
            borderRadius: 2,
            boxShadow: '0 0 12px rgba(232,146,52,0.5)',
            transition: 'width 0.1s linear',
          }
        })
      ),

      // Percentage
      React.createElement('div', {
        style: {
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.75rem',
          color: 'rgba(250,247,242,0.3)',
          letterSpacing: '0.1em',
          marginTop: '-0.5rem',
        }
      }, `${Math.round(progress * 100)}%`)
    ),

    // Bottom status
    React.createElement('div', {
      style: {
        position: 'absolute',
        bottom: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
      }
    },
      React.createElement('div', {
        style: {
          display: 'flex',
          gap: '0.35rem',
          alignItems: 'center',
        }
      },
        [0, 1, 2].map((i) =>
          React.createElement('div', {
            key: i,
            style: {
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: '#E89234',
              animation: `loadingDot 1.2s ${i * 0.2}s infinite ease-in-out`,
            }
          })
        )
      ),
      React.createElement('span', {
        style: {
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.65rem',
          color: 'rgba(250,247,242,0.2)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }
      }, phase === 'complete' ? 'Ready' : 'Initializing')
    )
  );
}

window.LoadingScreen = LoadingScreen;
