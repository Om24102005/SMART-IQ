import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const footerLinks = {
  Product: [
    { label: 'How it works',    href: '#hologram-overlay' },
    { label: 'Pricing',         href: '#pricing' },
    { label: 'Calculator',      href: '#configurator-overlay' },
    { label: 'Coverage map',    href: '#india-map-overlay' },
  ],
  Support: [
    { label: 'Installation guide', href: '#' },
    { label: 'Contact us',         href: 'mailto:hello@sparshiq.com' },
    { label: 'Warranty terms',     href: '#' },
    { label: 'Spare parts',        href: '#' },
  ],
  Legal: [
    { label: 'Privacy policy',  href: '#' },
    { label: 'Terms of service',href: '#' },
    { label: 'Refund policy',   href: '#' },
  ],
}

const wordmark = 'SparshIQ'.split('')

function SocialIcon({ children, label, href }) {
  return (
    <motion.a
      href={href}
      aria-label={label}
      whileHover={{ scale: 1.15, y: -3 }}
      whileTap={{ scale: 0.95 }}
      style={{
        width: 40, height: 40,
        borderRadius: '50%',
        border: '1px solid rgba(240,236,228,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(240,236,228,0.45)',
        transition: 'color 0.25s, border-color 0.25s, background 0.25s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.color = 'var(--amber)'
        e.currentTarget.style.borderColor = 'rgba(232,146,52,0.4)'
        e.currentTarget.style.background = 'rgba(232,146,52,0.08)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = 'rgba(240,236,228,0.45)'
        e.currentTarget.style.borderColor = 'rgba(240,236,228,0.1)'
        e.currentTarget.style.background = 'transparent'
      }}
    >
      {children}
    </motion.a>
  )
}

export default function Footer() {
  const ref    = useRef()
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const charVariants = {
    hidden: { opacity: 0, y: '100%', clipPath: 'inset(0 0 100% 0)' },
    show: (i) => ({
      opacity: 1, y: '0%', clipPath: 'inset(0 0 0% 0)',
      transition: { duration: 0.65, delay: i * 0.065, ease: [0.16,1,0.3,1] },
    }),
  }

  return (
    <footer style={{
      background: 'var(--footer-bg)',
      color: '#F0ECE4',
      padding: '6rem 1.5rem 2.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '60%', height: '40%',
        background: 'radial-gradient(ellipse at top, rgba(232,146,52,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>

        {/* Giant wordmark */}
        <div ref={ref} style={{ textAlign: 'center', marginBottom: '1.5rem', overflow: 'hidden' }}>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(4rem, 12vw, 9rem)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            display: 'flex',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {wordmark.map((char, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={charVariants}
                initial="hidden"
                animate={inView ? 'show' : 'hidden'}
                style={{
                  display: 'inline-block',
                  color: (char === 'I' || char === 'Q')
                    ? 'var(--amber)'
                    : '#F0ECE4',
                  textShadow: (char === 'I' || char === 'Q')
                    ? '0 0 40px var(--amber-glow)'
                    : 'none',
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.7 }}
          style={{
            textAlign: 'center',
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '1.1rem',
            color: 'rgba(240,236,228,0.4)',
            marginBottom: '5rem',
            fontWeight: 300,
          }}
        >
          Made for rooftops that should be earning more.
        </motion.p>

        {/* Links grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2.5rem',
          marginBottom: '4rem',
          paddingTop: '2.5rem',
          borderTop: '1px solid rgba(240,236,228,0.07)',
        }}>
          {Object.entries(footerLinks).map(([section, links], si) => (
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 + si * 0.08, duration: 0.6 }}
            >
              <h4 style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(240,236,228,0.35)',
                marginBottom: '1.25rem',
              }}>
                {section}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {links.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.9375rem',
                        color: 'rgba(240,236,228,0.58)',
                        transition: 'color 0.22s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--amber)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,236,228,0.58)'}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          paddingTop: '1.75rem',
          borderTop: '1px solid rgba(240,236,228,0.07)',
        }}>
          <a
            href="mailto:hello@sparshiq.com"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem',
              color: 'rgba(240,236,228,0.4)',
              transition: 'color 0.22s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--amber)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,236,228,0.4)'}
          >
            hello@sparshiq.com
          </a>

          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.8125rem',
            color: 'rgba(240,236,228,0.25)',
          }}>
            © 2025 SparshIQ · Built in India 🇮🇳
          </span>

          {/* Social icons */}
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <SocialIcon label="Instagram" href="#">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </SocialIcon>
            <SocialIcon label="X / Twitter" href="#">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </SocialIcon>
            <SocialIcon label="YouTube" href="#">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </SocialIcon>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          footer > div > div:nth-child(4) {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}
