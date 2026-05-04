import { useState } from 'react'
import { motion } from 'framer-motion'

const INDIA_PATH = `
  M 120,20 L 145,12 L 175,15 L 200,18 L 220,30 L 235,50 L 248,72 L 258,95
  L 268,118 L 272,142 L 268,162 L 258,182 L 248,202 L 235,222 L 220,242
  L 205,265 L 192,288 L 178,312 L 165,338 L 155,360 L 148,378 L 143,390
  L 138,378 L 128,362 L 115,342 L 100,318 L 85,292 L 70,265 L 57,238
  L 46,210 L 38,180 L 34,152 L 35,125 L 40,100 L 50,78 L 62,58 L 78,40 L 98,28 Z
`

const cities = [
  {
    id: 'delhi',
    name: 'Delhi',
    x: 155,
    y: 95,
    color: '#E89234',
    loss: 28,
    dustLevel: 'Very High',
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    x: 128,
    y: 118,
    color: '#E89234',
    loss: 24,
    dustLevel: 'High',
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    x: 105,
    y: 162,
    color: '#E89234',
    loss: 22,
    dustLevel: 'High',
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    x: 105,
    y: 225,
    color: '#2D7A3F',
    loss: 14,
    dustLevel: 'Moderate',
  },
  {
    id: 'bangalore',
    name: 'Bangalore',
    x: 148,
    y: 300,
    color: '#2D7A3F',
    loss: 12,
    dustLevel: 'Moderate',
  },
  {
    id: 'chennai',
    name: 'Chennai',
    x: 178,
    y: 310,
    color: '#2D7A3F',
    loss: 15,
    dustLevel: 'Moderate',
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    x: 158,
    y: 258,
    color: '#E89234',
    loss: 19,
    dustLevel: 'High',
  },
  {
    id: 'lucknow',
    name: 'Lucknow',
    x: 178,
    y: 102,
    color: '#E89234',
    loss: 25,
    dustLevel: 'High',
  },
]

export default function IndiaMapSection() {
  const [tooltip, setTooltip] = useState(null)
  const [hovered, setHovered] = useState(null)

  return (
    <section style={{ background: 'var(--cream)', padding: '7rem 0', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <span className="eyebrow">Built for India</span>
          <h2 style={{ marginBottom: '0.875rem' }}>Where dust never stops</h2>
          <p style={{ maxWidth: '480px', margin: '0 auto' }}>
            Designed for the dustiest rooftops in the world.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'center',
          }}
        >
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            style={{ position: 'relative' }}
          >
            <svg
              viewBox="0 0 320 420"
              style={{ width: '100%', maxWidth: '380px', margin: '0 auto', display: 'block' }}
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* India outline */}
              <path
                d={INDIA_PATH}
                fill="rgba(27,79,114,0.08)"
                stroke="rgba(27,79,114,0.25)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />

              {/* Cities */}
              {cities.map((city) => (
                <g
                  key={city.id}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => {
                    setHovered(city.id)
                    setTooltip({
                      id: city.id,
                      name: city.name,
                      loss: city.loss,
                      dustLevel: city.dustLevel,
                      x: e.clientX,
                      y: e.clientY,
                    })
                  }}
                  onMouseLeave={() => {
                    setHovered(null)
                    setTooltip(null)
                  }}
                >
                  {/* Pulse rings */}
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r="14"
                    fill={city.color}
                    opacity="0.12"
                    style={{
                      animation: `pulse-ring ${1.5 + Math.random() * 0.5}s infinite`,
                      transformOrigin: `${city.x}px ${city.y}px`,
                    }}
                  />
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r="9"
                    fill={city.color}
                    opacity="0.2"
                    style={{
                      animation: `pulse-ring ${2 + Math.random() * 0.5}s infinite 0.4s`,
                      transformOrigin: `${city.x}px ${city.y}px`,
                    }}
                  />

                  {/* Main dot */}
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r={hovered === city.id ? 6 : 5}
                    fill={city.color}
                    style={{ transition: 'r 0.2s ease' }}
                  />
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r="2"
                    fill="#fff"
                    opacity="0.9"
                  />

                  {/* City name */}
                  <text
                    x={city.x + 9}
                    y={city.y + 4}
                    fontSize="8"
                    fill={city.color}
                    fontFamily="Inter, sans-serif"
                    fontWeight="500"
                  >
                    {city.name}
                  </text>
                </g>
              ))}

              {/* Sri Lanka outline (simple) */}
              <path
                d="M 200,335 Q 205,340 204,350 Q 200,358 196,350 Q 194,340 200,335 Z"
                fill="rgba(27,79,114,0.06)"
                stroke="rgba(27,79,114,0.15)"
                strokeWidth="1"
              />
            </svg>

            {/* Tooltip */}
            {tooltip && (
              <div
                style={{
                  position: 'fixed',
                  left: tooltip.x + 12,
                  top: tooltip.y - 60,
                  zIndex: 100,
                  background: '#fff',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  boxShadow: 'var(--shadow-lg)',
                  pointerEvents: 'none',
                  minWidth: '180px',
                  border: '1px solid rgba(44,44,42,0.08)',
                }}
              >
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.875rem', color: 'var(--charcoal)', marginBottom: '0.25rem' }}>
                  {tooltip.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#888', fontFamily: 'var(--font-sans)' }}>
                  {tooltip.dustLevel} dust
                </div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#c0392b', fontFamily: 'var(--font-sans)', marginTop: '0.25rem' }}>
                  {tooltip.loss}% panel efficiency loss
                </div>
              </div>
            )}
          </motion.div>

          {/* Stats column */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
          >
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>
              Dust is a bigger problem in India than anywhere else.
            </h3>
            <p style={{ marginBottom: '2rem', lineHeight: 1.7 }}>
              Indian rooftop panels lose 15–30% of output to dust in summer months. In cities like Delhi and Jaipur, it's worse. SparshIQ was built specifically for this environment.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: 'Average dust loss in North India', value: '26%', color: '#c0392b' },
                { label: 'Output recovered with SparshIQ', value: '+21%', color: 'var(--foliage)' },
                { label: 'Installations across India', value: '2,000+', color: 'var(--panel-blue)' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.25rem',
                    background: '#fff',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(44,44,42,0.08)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#666' }}>
                    {stat.label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.375rem',
                      fontWeight: 600,
                      color: stat.color,
                    }}
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#E89234' }} />
                <span style={{ fontSize: '0.8125rem', color: '#888', fontFamily: 'var(--font-sans)' }}>High dust zone</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2D7A3F' }} />
                <span style={{ fontSize: '0.8125rem', color: '#888', fontFamily: 'var(--font-sans)' }}>Moderate dust zone</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #india-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
