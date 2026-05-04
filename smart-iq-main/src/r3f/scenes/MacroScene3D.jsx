import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { dustVertex, dustFragment } from '../shaders/dust.glsl.js'
import { getSolarPanelTexture } from '../utils/textures.js'
import { useSceneVisibility } from '../hooks/useSceneVisibility.js'

/* ── Detailed Macro Panel ─────────────────────────────────────── */
function MacroPanel({ scrollRef }) {
  const dustMatRef = useRef()
  const cellTexture = useMemo(() => getSolarPanelTexture(), [])

  const uniforms = useMemo(() => ({
    dustAmount: { value: 0 },
    time: { value: 0 },
  }), [])

  useFrame(({ clock }) => {
    const p = scrollRef.current
    // Macro zone dust accumulation logic
    const macroProgress = Math.max(0, Math.min(1, (p - 0.18) / 0.16))

    if (dustMatRef.current) {
      dustMatRef.current.uniforms.dustAmount.value = macroProgress * 0.95
      dustMatRef.current.uniforms.time.value = clock.getElapsedTime()
    }
  })

  return (
    <group>
      {/* Aluminum Frame - extreme macro scale */}
      <mesh castShadow receiveShadow position={[0, 0, -0.02]}>
        <boxGeometry args={[4.2, 2.8, 0.1]} />
        <meshPhysicalMaterial color="#8a9ba8" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Solar Cell Grid */}
      <mesh position={[0, 0, 0.035]}>
        <boxGeometry args={[4.0, 2.6, 0.01]} />
        <meshPhysicalMaterial
          map={cellTexture}
          metalness={0.4}
          roughness={0.5}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Dust accumulation layer (shader) */}
      <mesh position={[0, 0, 0.048]}>
        <planeGeometry args={[4.0, 2.6, 2, 2]} />
        <shaderMaterial
          ref={dustMatRef}
          vertexShader={dustVertex}
          fragmentShader={dustFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* Glass with clearcoat transmission */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[4.0, 2.6, 0.005]} />
        <meshPhysicalMaterial
          color="#aaccdd"
          transmission={0.95}
          thickness={0.3}
          roughness={0.02}
          transparent
          opacity={0.88}
        />
      </mesh>
    </group>
  )
}

/* ── Isolated Macro Scene ─────────────────────────────────────── */
export default function MacroScene3D({ scrollProgressRef }) {
  // Visibility isolation (0.15 to 0.38)
  const visible = useSceneVisibility(scrollProgressRef, 0.15, 0.38)

  return (
    <group visible={visible}>
      {visible && (
        <>
          <ambientLight intensity={0.3} />
          <spotLight position={[0, 2, 3]} angle={0.4} penumbra={0.7} intensity={4} color="#fff5e0" castShadow decay={2} />
          <spotLight position={[-2, 1, 2]} angle={0.5} penumbra={0.9} intensity={1.2} color="#4488aa" decay={2} />
          <MacroPanel scrollRef={scrollProgressRef} />
        </>
      )}
    </group>
  )
}
