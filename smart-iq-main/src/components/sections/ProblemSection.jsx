import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function PanelSVG({ dustOpacity }) {
  return (
    <svg viewBox="0 0 260 180" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: '280px' }}>
      <defs>
        <linearGradient id="panelBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1B4F72" />
          <stop offset="100%" stopColor="#0d3350" />
        </linearGradient>
        <linearGradient id="panelClean" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2a6fa8" />
          <stop offset="100%" stopColor="#1B4F72" />
        </linearGradient>
        <filter id="dustFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
      </defs>

      {/* 3x2 panel grid */}
      {[0,1,2].map(col =>
        [0,1].map(row => (
          <g key={`${col}-${row}`}>
            <rect
              x={10 + col * 82}
              y={10 + row * 82}
              width={74}
              height={72}
              rx="4"
              fill="url(#panelBlue)"
              stroke="#2a6fa8"
              strokeWidth="1"
            />
            {/* Cell lines horizontal */}
            {[1,2,3,4,5,6].map(n => (
              <line key={`h${n}`}
                x1={10 + col * 82 + 1}
                y1={10 + row * 82 + n * 10}
                x2={10 + col * 82 + 73}
                y2={10 + row * 82 + n * 10}
                stroke="#0d2840" strokeWidth="0.5" opacity="0.6"
              />
            ))}
            {/* Cell lines vertical */}
            {[1,2,3,4,5,6,7].map(n => (
              <line key={`v${n}`}
                x1={10 + col * 82 + n * 9}
                y1={10 + row * 82 + 1}
                x2={10 + col * 82 + n * 9}
                y2={10 + row * 82 + 71}
                stroke="#0d2840" strokeWidth="0.5" opacity="0.6"
              />
            ))}
          </g>
        ))
      )}

      {/* Dust overlay */}
      <rect
        x="10" y="10"
        width="240" height="155"
        rx="4"
        fill="rgba(180, 150, 100, 1)"
        opacity={dustOpacity}
        style={{ transition: 'none' }}
      />
      {/* Dust texture dots */}
      {dustOpacity > 0.1 && [
        [40,30],[90,55],[150,25],[200,70],[60,100],[130,110],[220,45],[80,140],[170,95],[240,130]
      ].map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r={3 + Math.sin(i) * 2} fill="rgba(160,130,80,0.6)" opacity={dustOpacity} />
      ))}
    </svg>
  )
}

function AnimatedCounter({ value, prefix = '' }) {
  const [display, setDisplay] = useState(0)
  const currentRef = useRef(0)
  const rafRef = useRef()

  useEffect(() => {
    const target = value
    const animate = () => {
      currentRef.current += (target - currentRef.current) * 0.06
      setDisplay(Math.round(currentRef.current))
      if (Math.abs(target - currentRef.current) > 0.5) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setDisplay(target)
      }
    }
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value])

  return (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}{display.toLocaleString('en-IN')}
    </span>
  )
}

export default function ProblemSection() {
  const sectionRef = useRef()
  const dustRef = useRef(0)
  const [dustOpacity, setDustOpacity] = useState(0)
  const [lossAmount, setLossAmount] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const prog = self.progress
          const dust = Math.min(1, prog * 2.5)
          const loss = Math.round(dust * 2847)
          setDustOpacity(dust * 0.72)
          setLossAmount(loss)
        },
      })
      return () => trigger.kill()
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="problem"
      ref={sectionRef}
      style={{
        background: 'var(--cream)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        className="section"
        style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '5rem 1.5rem',
        }}
      >
        {/* Section header */}
        <div style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
          <span className="eyebrow">The hidden problem</span>
          <h2 style={{ marginBottom: '0.75rem' }}>While you were away</h2>
          <p style={{ maxWidth: '480px', margin: '0 auto' }}>
            Your installer cleans twice a year. Dust accumulates daily.
          </p>
        </div>

        {/* Side-by-side panels */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2.5rem',
            alignItems: 'start',
          }}
        >
          {/* Dirty panel */}
          <div
            style={{
              background: '#fff',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              boxShadow: 'var(--shadow-md)',
              textAlign: 'center',
            }}
          >
            <div style={{ marginBottom: '0.75rem' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#c0392b',
                  background: 'rgba(192,57,43,0.1)',
                  padding: '3px 10px',
                  borderRadius: '100px',
                }}
              >
                Without SparshIQ
              </span>
            </div>
            <PanelSVG dustOpacity={dustOpacity} />
            <div style={{ marginTop: '1.25rem' }}>
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2rem',
                  fontWeight: 600,
                  color: '#c0392b',
                }}
              >
                <AnimatedCounter value={lossAmount} prefix="Rs " />
              </div>
              <div style={{ fontSize: '0.875rem', color: '#888', marginTop: '0.25rem' }}>
                lost this year from dust alone
              </div>
            </div>

            {/* Dust indicator bar */}
            <div style={{ marginTop: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#888', marginBottom: '0.375rem' }}>
                <span>Panel efficiency</span>
                <span style={{ color: '#c0392b', fontWeight: 500 }}>
                  {Math.round((1 - dustOpacity * 0.28) * 100)}%
                </span>
              </div>
              <div style={{ height: '6px', background: '#f0ece4', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${(1 - dustOpacity * 0.28) * 100}%`,
                    background: dustOpacity > 0.3 ? '#c0392b' : '#2D7A3F',
                    borderRadius: '3px',
                    transition: 'width 0.3s ease, background 0.3s ease',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Clean panel */}
          <div
            style={{
              background: '#fff',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              boxShadow: 'var(--shadow-md)',
              textAlign: 'center',
            }}
          >
            <div style={{ marginBottom: '0.75rem' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--foliage)',
                  background: 'rgba(45,122,63,0.1)',
                  padding: '3px 10px',
                  borderRadius: '100px',
                }}
              >
                With SparshIQ
              </span>
            </div>
            <PanelSVG dustOpacity={0} />
            <div style={{ marginTop: '1.25rem' }}>
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2rem',
                  fontWeight: 600,
                  color: 'var(--foliage)',
                }}
              >
                Rs 0
              </div>
              <div style={{ fontSize: '0.875rem', color: '#888', marginTop: '0.25rem' }}>
                lost — cleaned every morning
              </div>
            </div>

            {/* Efficiency bar */}
            <div style={{ marginTop: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#888', marginBottom: '0.375rem' }}>
                <span>Panel efficiency</span>
                <span style={{ color: 'var(--foliage)', fontWeight: 500 }}>100%</span>
              </div>
              <div style={{ height: '6px', background: '#f0ece4', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: '100%',
                    background: 'var(--foliage)',
                    borderRadius: '3px',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Caption */}
        <p
          style={{
            textAlign: 'center',
            marginTop: '2.5rem',
            fontSize: '0.9375rem',
            color: '#888',
            fontStyle: 'italic',
          }}
        >
          Scroll down to watch dust accumulate on the left panel.
        </p>
      </div>

      <style>{`
        @media (max-width: 640px) {
          #problem .section > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
