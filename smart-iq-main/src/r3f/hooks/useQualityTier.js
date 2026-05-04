import { useMemo } from 'react'

/**
 * Returns 'high' | 'medium' | 'low' based on GPU capability.
 * Called once on mount.
 */
export function useQualityTier() {
  return useMemo(() => {
    // Check for low-end mobile
    if (/Android|iPhone|iPad/i.test(navigator.userAgent)) return 'low'
    
    // Try to get GPU info
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
      if (!gl) return 'low'
      const ext = gl.getExtension('WEBGL_debug_renderer_info')
      if (ext) {
        const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL).toLowerCase()
        // Known low-end patterns
        if (/intel hd|intel uhd|mesa|llvm|swiftshader|angle/i.test(renderer)) return 'medium'
        // Apple Silicon GPUs are high-end
        if (/apple m[1-9]|apple gpu/i.test(renderer)) return 'high'
      }
      // Default to high if we can't tell
      return 'high'
    } catch {
      return 'medium'
    }
  }, [])
}
