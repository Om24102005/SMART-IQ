import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { hologramVertex, hologramFragment } from '../shaders/hologram.glsl.js'
import { useSceneVisibility } from '../hooks/useSceneVisibility.js'

function HologramMaterial({ color = '#E89234' }) {
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    glowIntensity: { value: 1.0 },
    glowColor: { value: new THREE.Color(color) },
  }), [color])
  const matRef = useRef()
  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.time.value = clock.getElapsedTime()
  })
  return (
    <shaderMaterial
      ref={matRef}
      vertexShader={hologramVertex}
      fragmentShader={hologramFragment}
      uniforms={uniforms}
      transparent
      depthWrite={false}
      blending={THREE.AdditiveBlending}
      side={THREE.DoubleSide}
    />
  )
}

function DataLine({ start, end, color = '#E89234' }) {
  const ref = useRef()
  const points = useMemo(() => {
    const s = new THREE.Vector3(...start)
    const e = new THREE.Vector3(...end)
    const mid = s.clone().lerp(e, 0.5).add(new THREE.Vector3(0, 0.5, 0))
    return [s, mid, e]
  }, [start, end])

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points])
  const tubeGeo = useMemo(() => new THREE.TubeGeometry(curve, 20, 0.012, 6, false), [curve])

  useFrame(({ clock }) => {
    if (ref.current?.material) {
      ref.current.material.emissiveIntensity = 0.6 + Math.sin(clock.getElapsedTime() * 3) * 0.4
    }
  })

  return (
    <mesh ref={ref} geometry={tubeGeo}>
      <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={0.8} transparent opacity={0.7} />
    </mesh>
  )
}

function ExplodedUnit({ progress }) {
  const motorRef = useRef()
  const sensorLRef = useRef()
  const sensorRRef = useRef()
  const ctrlRef = useRef()
  const hubRef = useRef()

  useFrame(() => {
    const ease = progress.current * progress.current * (3 - 2 * progress.current)
    if (motorRef.current) motorRef.current.position.set(0, ease * 1.8, ease * 0.8)
    if (sensorLRef.current) sensorLRef.current.position.set(-ease * 2.2, ease * 0.3, 0)
    if (sensorRRef.current) sensorRRef.current.position.set(ease * 2.2, ease * 0.3, 0)
    if (ctrlRef.current) ctrlRef.current.position.set(0, -ease * 1.4, -ease * 0.6)
  })

  return (
    <group>
      {/* Hub */}
      <mesh ref={hubRef}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <HologramMaterial color="#E89234" />
      </mesh>
      {/* Motor */}
      <group ref={motorRef}>
        <mesh>
          <cylinderGeometry args={[0.25, 0.25, 0.6, 16]} />
          <HologramMaterial color="#E89234" />
        </mesh>
        <DataLine start={[0, 0, 0]} end={[0, -1.5, -0.8]} />
      </group>
      {/* Sensor L */}
      <group ref={sensorLRef}>
        <mesh>
          <boxGeometry args={[0.3, 0.2, 0.15]} />
          <HologramMaterial color="#88ddff" />
        </mesh>
        <DataLine start={[0, 0, 0]} end={[2, -0.2, 0]} color="#88ddff" />
      </group>
      {/* Sensor R */}
      <group ref={sensorRRef}>
        <mesh>
          <boxGeometry args={[0.3, 0.2, 0.15]} />
          <HologramMaterial color="#88ddff" />
        </mesh>
        <DataLine start={[0, 0, 0]} end={[-2, -0.2, 0]} color="#88ddff" />
      </group>
      {/* Controller */}
      <group ref={ctrlRef}>
        <mesh>
          <boxGeometry args={[0.6, 0.1, 0.4]} />
          <HologramMaterial color="#aaffaa" />
        </mesh>
        <DataLine start={[0, 0, 0]} end={[0, 1.2, 0.6]} color="#aaffaa" />
      </group>
    </group>
  )
}

export default function HologramScene3D({ scrollProgressRef }) {
  const visible = useSceneVisibility(scrollProgressRef, 0.25, 0.49)
  const progressRef = useRef(0)

  useFrame(() => {
    if (!visible) return
    const p = scrollProgressRef.current
    const target = Math.max(0, Math.min(1, (p - 0.34) / 0.12))
    progressRef.current += (target - progressRef.current) * 0.06
  })

  return (
    <group visible={visible}>
      {visible && (
        <>
          <ambientLight intensity={0.05} />
          <pointLight position={[0, 2, 3]} intensity={2} color="#E89234" decay={2} />
          <pointLight position={[0, -2, 2]} intensity={1} color="#4488ff" decay={2} />
          <ExplodedUnit progress={progressRef} />
        </>
      )}
    </group>
  )
}
