import { useState } from 'react'
import { useFrame } from '@react-three/fiber'

/**
 * Returns a boolean indicating if the current scroll progress is within the active range [start, end].
 * Includes a small buffer to prevent popping before the camera looks away.
 */
export function useSceneVisibility(scrollProgressRef, start, end, buffer = 0.05) {
  const [visible, setVisible] = useState(false)

  useFrame(() => {
    if (!scrollProgressRef.current) return
    const p = scrollProgressRef.current
    const isVisible = p >= (start - buffer) && p <= (end + buffer)
    if (visible !== isVisible) {
      setVisible(isVisible)
    }
  })

  return visible
}
