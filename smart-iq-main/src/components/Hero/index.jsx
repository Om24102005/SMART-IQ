import { Suspense, useState, useEffect } from 'react'
import HeroScene from './HeroScene.jsx'
import HeroContent from './HeroContent.jsx'

function SceneSkeleton() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to bottom, #0A1628 0%, #1B3050 60%, #F4A460 100%)',
      }}
      className="skeleton"
    />
  )
}

export default function Hero() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler, { passive: true })
    return () => window.removeEventListener('resize', handler)
  }, [])

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '600px',
        overflow: 'hidden',
        background: '#0A1628',
      }}
    >
      {/* 3D canvas layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {isMobile ? (
          /* Static SVG fallback for mobile */
          <svg
            viewBox="0 0 400 300"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0A1628" />
                <stop offset="60%" stopColor="#1B3050" />
                <stop offset="100%" stopColor="#F4A460" />
              </linearGradient>
              <linearGradient id="panelGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1B4F72" />
                <stop offset="100%" stopColor="#0d3350" />
              </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#skyGrad)" />
            {/* Rooftop */}
            <rect x="40" y="180" width="320" height="120" rx="4" fill="#1a1a18" />
            {/* Solar panels grid */}
            {[0, 1, 2].map((col) =>
              [0, 1].map((row) => (
                <rect
                  key={`${col}-${row}`}
                  x={60 + col * 100}
                  y={190 + row * 40}
                  width={85}
                  height={32}
                  rx="3"
                  fill="url(#panelGrad)"
                  stroke="#2a6fa8"
                  strokeWidth="0.5"
                />
              ))
            )}
            {/* Sun glow */}
            <circle cx="200" cy="260" r="40" fill="#F4A460" opacity="0.3" />
            <circle cx="200" cy="260" r="20" fill="#E89234" opacity="0.5" />
          </svg>
        ) : (
          <Suspense fallback={<SceneSkeleton />}>
            <HeroScene />
          </Suspense>
        )}
      </div>

      {/* Content overlay */}
      <HeroContent />
    </section>
  )
}
