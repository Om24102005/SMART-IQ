import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { blueprintVertex, blueprintFragment } from '../shaders/blueprint.glsl.js'
import { useSceneVisibility } from '../hooks/useSceneVisibility.js'

function BlueprintGrid() {
  const matRef = useRef()
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    opacity: { value: 0 },
  }), [])

  useFrame(({ clock }) => {
    if (!matRef.current) return
    matRef.current.uniforms.time.value = clock.getElapsedTime()
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[40, 40, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={blueprintVertex}
        fragmentShader={blueprintFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function TechnicalModel() {
  const groupRef = useRef()
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.15
    }
  })

  const edgeMat = (
    <meshPhysicalMaterial
      color="#00ccff"
      emissive="#00aaff"
      emissiveIntensity={1.2}
      wireframe
      transparent
      opacity={0.7}
    />
  )

  return (
    <group ref={groupRef}>
      {/* Panel body wireframe */}
      <mesh castShadow>
        <boxGeometry args={[2.8, 1.8, 0.08]} />
        {edgeMat}
      </mesh>
      {/* Cleaning unit */}
      <mesh position={[0, 1.0, 0.08]}>
        <boxGeometry args={[2.82, 0.12, 0.08]} />
        <meshPhysicalMaterial color="#E89234" emissive="#E89234" emissiveIntensity={1.5} wireframe transparent opacity={0.9} />
      </mesh>
      {/* Motor cylinder */}
      <mesh position={[1.5, 1.0, 0.14]}>
        <cylinderGeometry args={[0.12, 0.12, 0.2, 16]} />
        <meshPhysicalMaterial color="#E89234" emissive="#E89234" emissiveIntensity={1.2} wireframe transparent opacity={0.8} />
      </mesh>
      {/* Left sensor */}
      <mesh position={[-1.5, 0.85, 0.12]}>
        <boxGeometry args={[0.18, 0.14, 0.08]} />
        <meshPhysicalMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={1.0} wireframe transparent opacity={0.8} />
      </mesh>
    </group>
  )
}

export default function BlueprintScene3D({ scrollProgressRef }) {
  const visible = useSceneVisibility(scrollProgressRef, 0.45, 0.62)

  return (
    <group visible={visible}>
      {visible && (
        <>
          <ambientLight intensity={0.04} color="#001133" />
          <pointLight position={[0, 4, 4]} intensity={1.5} color="#00aaff" decay={2} />
          <pointLight position={[-3, 2, 2]} intensity={0.8} color="#E89234" decay={2} />
          <BlueprintGrid />
          <TechnicalModel />
        </>
      )}
    </group>
  )
}
