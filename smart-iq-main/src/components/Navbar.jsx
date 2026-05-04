import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const navLinks = [
  { label: 'How it works', href: '#hologram-overlay' },
  { label: 'Technology',   href: '#blueprint-overlay' },
  { label: 'Calculator',   href: '#configurator-overlay' },
  { label: 'Coverage',     href: '#india-map-overlay' },
]

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [activeLink, setActiveLink] = useState(null)
  const underlineRef = useRef(null)
  const linkRefs     = useRef([])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLinkHover = (i) => {
    setActiveLink(i)
    const el = linkRefs.current[i]
    if (el && underlineRef.current) {
      const rect = el.getBoundingClientRect()
      const parentRect = el.closest('nav').getBoundingClientRect()
      underlineRef.current.style.width  = rect.width + 'px'
      underlineRef.current.style.left   = (rect.left - parentRect.left) + 'px'
      underlineRef.current.style.opacity = '1'
    }
  }
  const handleNavLeave = () => {
    setActiveLink(null)
    if (underlineRef.current) underlineRef.current.style.opacity = '0'
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      onMouseLeave={handleNavLeave}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        padding: '0 2.5rem',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'background 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease',
        background: scrolled
          ? 'rgba(6,8,15,0.88)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(24px) saturate(1.8)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(1.8)' : 'none',
        boxShadow: scrolled
          ? '0 1px 0 rgba(232,146,52,0.12), 0 8px 40px rgba(0,0,0,0.4)'
          : 'none',
      }}
    >
      {/* Logo */}
      <motion.a
        href="#"
        data-cursor="hover"
        whileHover={{ scale: 1.04 }}
        style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 700,
          fontSize: '1.45rem',
          letterSpacing: '-0.03em',
          color: '#FAF7F2',
          textShadow: '0 0 30px rgba(232,146,52,0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          flexShrink: 0,
        }}
      >
        Sparsh
        <span style={{
          color: 'var(--amber)',
          textShadow: '0 0 20px var(--amber-glow)',
          display: 'inline-block',
        }}>
          IQ
        </span>
        {/* Live dot */}
        <span style={{
          width: 6, height: 6,
          borderRadius: '50%',
          background: 'var(--amber)',
          boxShadow: '0 0 8px var(--amber-glow)',
          display: 'inline-block',
          marginLeft: 4,
          animation: 'dot-pulse 2.5s ease-in-out infinite',
          marginBottom: 8,
        }} />
      </motion.a>

      {/* Desktop nav links */}
      <div
        className="desktop-nav"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          position: 'relative',
        }}
      >
        {/* Sliding underline indicator */}
        <span
          ref={underlineRef}
          style={{
            position: 'absolute',
            bottom: -4,
            height: 2,
            background: 'linear-gradient(90deg, var(--amber-light), var(--amber))',
            borderRadius: 99,
            pointerEvents: 'none',
            transition: 'left 0.28s var(--ease-smooth), width 0.28s var(--ease-smooth), opacity 0.2s',
            opacity: 0,
            boxShadow: '0 0 12px var(--amber-glow)',
          }}
        />
        {navLinks.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            ref={el => linkRefs.current[i] = el}
            data-cursor="hover"
            onMouseEnter={() => handleLinkHover(i)}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9rem',
              fontWeight: 450,
              color: activeLink === i ? '#FAF7F2' : 'rgba(250,247,242,0.6)',
              transition: 'color 0.22s ease',
              padding: '0.5rem 0.9rem',
              borderRadius: 8,
              letterSpacing: '0.01em',
            }}
          >
            {link.label}
          </a>
        ))}

        {/* CTA */}
        <motion.a
          href="#configurator-overlay"
          className="btn-amber"
          data-cursor="hover"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: '0.55rem 1.3rem',
            fontSize: '0.875rem',
            marginLeft: '0.75rem',
          }}
        >
          Get Quote ↗
        </motion.a>
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMenuOpen(p => !p)}
        aria-label="Toggle menu"
        data-cursor="hover"
        className="mobile-menu-btn"
        style={{
          display: 'none',
          flexDirection: 'column',
          gap: '5px',
          padding: '8px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 10,
          backdropFilter: 'blur(10px)',
        }}
      >
        {[0, 1, 2].map(i => (
          <span
            key={i}
            style={{
              display: 'block',
              width: '22px', height: '2px',
              background: menuOpen ? 'var(--amber)' : '#FAF7F2',
              borderRadius: '2px',
              transition: 'transform 0.28s ease, opacity 0.28s ease, background 0.28s ease',
              transform: menuOpen
                ? i === 0 ? 'translateY(7px) rotate(45deg)'
                : i === 2 ? 'translateY(-7px) rotate(-45deg)'
                : 'scaleX(0)'
                : 'none',
              opacity: menuOpen && i === 1 ? 0 : 1,
            }}
          />
        ))}
      </button>

      {/* Mobile drawer */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{    opacity: 0, y: -8,  scale: 0.97 }}
          transition={{ duration: 0.28, ease: [0.16,1,0.3,1] }}
          style={{
            position: 'absolute',
            top: '70px', left: 12, right: 12,
            background: 'rgba(6,8,15,0.96)',
            backdropFilter: 'blur(28px) saturate(1.6)',
            WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
            padding: '1.5rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            borderRadius: 20,
            border: '1px solid rgba(232,146,52,0.18)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(232,146,52,0.06)',
          }}
        >
          {navLinks.map((link, i) => (
            <motion.a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.0625rem',
                fontWeight: 500,
                color: 'rgba(250,247,242,0.85)',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--amber)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(250,247,242,0.85)'}
            >
              <span style={{ color: 'var(--amber)', opacity: 0.5, fontSize: '0.7rem' }}>→</span>
              {link.label}
            </motion.a>
          ))}
          <motion.a
            href="#configurator-overlay"
            className="btn-amber"
            onClick={() => setMenuOpen(false)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{ alignSelf: 'flex-start' }}
          >
            Get Quote ↗
          </motion.a>
        </motion.div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav       { display: none !important; }
          .mobile-menu-btn   { display: flex !important; }
        }
      `}</style>
    </motion.nav>
  )
}
