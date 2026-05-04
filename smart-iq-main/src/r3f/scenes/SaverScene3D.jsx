import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { liquidVertex, liquidFragment } from '../shaders/liquid.glsl.js'
import { useSceneVisibility } from '../hooks/useSceneVisibility.js'

// Exposed for UI to write into
export const saverState = { fillLevel: 0 }

function GlassTube({ fillRef }) {
  const liquidMatRef = useRef()
  const uniforms = useMemo(() => ({
    fillLevel: { value: 0 },
    time: { value: 0 },
    liquidColor: { value: new THREE.Color('#E89234') },
  }), [])

  useFrame(({ clock }) => {
    if (!liquidMatRef.current) return
    liquidMatRef.current.uniforms.time.value = clock.getElapsedTime()
    liquidMatRef.current.uniforms.fillLevel.value += ((fillRef?.current || 0) - liquidMatRef.current.uniforms.fillLevel.value) * 0.04
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Glass tube exterior */}
      <mesh castShadow>
        <cylinderGeometry args={[0.35, 0.35, 3.0, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#aaccee"
          transmission={0.88}
          thickness={0.2}
          roughness={0.04}
          metalness={0}
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Bottom cap */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.04, 32]} />
        <meshPhysicalMaterial color="#8899aa" metalness={0.7} roughness={0.15} />
      </mesh>
      {/* Top cap */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.04, 32]} />
        <meshPhysicalMaterial color="#8899aa" metalness={0.7} roughness={0.15} />
      </mesh>
      {/* Liquid fill */}
      <mesh position={[0, -1.49, 0]}>
        <cylinderGeometry args={[0.33, 0.33, 2.96, 32, 8]} />
        <shaderMaterial
          ref={liquidMatRef}
          vertexShader={liquidVertex}
          fragmentShader={liquidFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.FrontSide}
        />
      </mesh>
      {/* Ambient glow ring */}
      <pointLight position={[0, -0.5, 0]} intensity={1.5} color="#E89234" decay={3} distance={2} />
    </group>
  )
}

export default function SaverScene3D({ scrollProgressRef, fillLevel }) {
  const visible = useSceneVisibility(scrollProgressRef, 0.75, 0.90)
  const fillRef = useRef(fillLevel || 0)

  useFrame(() => {
    if (!visible) return
    const p = scrollProgressRef.current
    // Saver zone: 0.78 → 0.87
    const saverProgress = Math.max(0, Math.min(1, (p - 0.78) / 0.09))
    fillRef.current = (fillLevel !== undefined ? fillLevel : saverProgress) * 0.95
  })

  return (
    <group visible={visible}>
      {visible && (
        <>
          <ambientLight intensity={0.15} />
          <directionalLight position={[2, 4, 3]} intensity={1.5} color="#fff0d0" castShadow />
          <pointLight position={[-2, 1, 2]} intensity={1.0} color="#E89234" decay={2} />
          <GlassTube fillRef={fillRef} />
          {/* Pedestal */}
          <mesh position={[0, -1.7, 0]} receiveShadow>
            <cylinderGeometry args={[0.5, 0.6, 0.15, 32]} />
            <meshPhysicalMaterial color="#1a1a18" metalness={0.8} roughness={0.2} />
          </mesh>
        </>
      )}
    </group>
  )
}
