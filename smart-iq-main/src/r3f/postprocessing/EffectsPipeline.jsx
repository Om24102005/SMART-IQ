import { useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette, DepthOfField } from '@react-three/postprocessing'
import { BlendFunction, KernelSize, Resolution } from 'postprocessing'
import * as THREE from 'three'

/**
 * Enhanced post-processing pipeline
 * ─────────────────────────────────
 * - Bloom with multi-layer intensity (amber glow)
 * - Chromatic aberration (subtle, scroll-driven)
 * - Vignette for cinematic framing
 * - Adaptive quality: disable expensive effects on low tier
 */
export default function EffectsPipeline({ quality = 'high' }) {
  const { size } = useThree()

  const isLow = quality === 'low'
  const isMedium = quality === 'medium'

  // Bloom settings — amber-tinted glow
  const bloomProps = useMemo(() => ({
    luminanceThreshold: 0.15,
    luminanceSmoothing: 0.08,
    intensity: isLow ? 0.3 : 0.85,
    kernelSize: isLow ? KernelSize.SMALL : KernelSize.LARGE,
    resolution: isLow ? Resolution.QUARTER : Resolution.HALF,
    mipmapBlur: true,
    blendFunction: BlendFunction.ADD,
  }), [isLow])

  // Chromatic aberration — subtle, driven by scroll
  const chromaRef = useMemo(() => ({ current: null }), [])

  // Vignette
  const vignetteProps = useMemo(() => ({
    offset: 0.3,
    darkness: 0.65,
    blendFunction: BlendFunction.NORMAL,
  }), [])

  // Noise (film grain) — very subtle
  const noiseProps = useMemo(() => ({
    premultiply: true,
    blendFunction: BlendFunction.OVERLAY,
    opacity: isLow ? 0.01 : 0.025,
  }), [isLow])

  // Depth of field — only on high
  const dofProps = useMemo(() => ({
    focusDistance: 0.02,
    focalLength: 0.08,
    bokehScale: 2,
    height: 480,
  }), [])

  return (
    <EffectComposer multisampling={isLow ? 0 : 4} autoClear={false}>
      {/* Bloom — the signature amber glow */}
      <Bloom {...bloomProps} />

      {/* Chromatic aberration — subtle RGB split */}
      {!isLow && (
        <ChromaticAberration
          ref={chromaRef}
          offset={new THREE.Vector2(0.002, 0.001)}
          radialModulation={false}
          modulationOffset={0}
          blendFunction={BlendFunction.NORMAL}
        />
      )}

      {/* Vignette — cinematic framing */}
      <Vignette {...vignetteProps} />

      {/* Film grain — subtle texture */}
      {!isLow && <Noise {...noiseProps} />}

      {/* Depth of field — only on high-end */}
      {quality === 'high' && <DepthOfField {...dofProps} />}
    </EffectComposer>
  )
}
