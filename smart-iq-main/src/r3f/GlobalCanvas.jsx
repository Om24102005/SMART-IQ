import { Suspense, createContext, useContext } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import SceneOrchestrator from './SceneOrchestrator'
import TheatreOrchestrator from './TheatreOrchestrator'
import EffectsPipeline from './postprocessing/EffectsPipeline'
import HeroScene3D from './scenes/HeroScene3D'
import MacroScene3D from './scenes/MacroScene3D'
import HologramScene3D from './scenes/HologramScene3D'
import BlueprintScene3D from './scenes/BlueprintScene3D'
import ConfiguratorScene3D from './scenes/ConfiguratorScene3D'
import DashboardScene3D from './scenes/DashboardScene3D'
import SaverScene3D from './scenes/SaverScene3D'
import IndiaMapScene3D from './scenes/IndiaMapScene3D'
import { useQualityTier } from './hooks/useQualityTier'

export const ScrollContext = createContext({ scrollProgressRef: { current: 0 } })
export const useScrollContext = () => useContext(ScrollContext)

function WorldContent({ scrollProgressRef, quality }) {
  return (
    <>
      {/* Theatre.js scroll-driven orchestration (replaces SceneOrchestrator) */}
      <TheatreOrchestrator scrollProgressRef={scrollProgressRef} />

      {/* Fallback SceneOrchestrator for camera waypoints */}
      <SceneOrchestrator scrollProgressRef={scrollProgressRef} />

      <HeroScene3D        scrollProgressRef={scrollProgressRef} />
      <MacroScene3D       scrollProgressRef={scrollProgressRef} />
      <HologramScene3D    scrollProgressRef={scrollProgressRef} />
      <BlueprintScene3D   scrollProgressRef={scrollProgressRef} />
      <ConfiguratorScene3D scrollProgressRef={scrollProgressRef} />
      <DashboardScene3D   scrollProgressRef={scrollProgressRef} />
      <SaverScene3D       scrollProgressRef={scrollProgressRef} />
      <IndiaMapScene3D    scrollProgressRef={scrollProgressRef} />

      <EffectsPipeline quality={quality} />
    </>
  )
}

export default function GlobalCanvas({ scrollProgressRef }) {
  const quality = useQualityTier()

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 1.5, 11], fov: 58, near: 0.01, far: 200 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          /* Premium tone mapping for realistic HDR look */
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        dpr={[1, 2]}
        shadows
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <WorldContent scrollProgressRef={scrollProgressRef} quality={quality} />
        </Suspense>
      </Canvas>
    </div>
  )
}
