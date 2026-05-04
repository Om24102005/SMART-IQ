import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Returns a ref whose `.current` is the normalized scroll progress [0, 1]
 * across the entire scroll-body height. Updated every RAF via ScrollTrigger.
 */
export function useScrollProgress() {
  const progressRef = useRef(0)

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: '#scroll-body',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        progressRef.current = self.progress
      },
    })
    return () => st.kill()
  }, [])

  return progressRef
}
