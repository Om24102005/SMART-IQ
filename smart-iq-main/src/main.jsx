import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './index.css'
import App from './App.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import { initGSAPDefaults } from './gsap-fx.jsx'
import { initAllMicroInteractions } from './utils/micro-interactions.js'

gsap.registerPlugin(ScrollTrigger)

// Init GSAP with premium defaults
initGSAPDefaults()

// Init Lenis smooth scroll and wire to GSAP ScrollTrigger
const lenis = new Lenis({
  duration: 1.25,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothTouch: false,
  touchMultiplier: 2,
})

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)

// Expose lenis globally for components that need it
window.__lenis = lenis

// Init micro-interactions after DOM is ready
setTimeout(() => {
  initAllMicroInteractions()
}, 100)

function Root() {
  const [loadingComplete, setLoadingComplete] = useState(false)

  return (
    <StrictMode>
      {!loadingComplete && (
        <LoadingScreen onComplete={() => setLoadingComplete(true)} />
      )}
      <div style={{ opacity: loadingComplete ? 1 : 0, transition: 'opacity 0.6s ease' }}>
        <App />
      </div>
    </StrictMode>
  )
}

createRoot(document.getElementById('root')).render(<Root />)
