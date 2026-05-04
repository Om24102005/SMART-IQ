import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneVisibility } from '../hooks/useSceneVisibility.js'

function PhoneShell({ mouseRef }) {
  const groupRef = useRef()
  const screenRef = useRef()
  const timeRef = useRef(0)

  useFrame((state, delta) => {
    timeRef.current += delta
    if (!groupRef.current) return
    const mx = mouseRef?.current?.x || 0
    const my = mouseRef?.current?.y || 0
    groupRef.current.rotation.y = mx * 0.25 + Math.sin(timeRef.current * 0.4) * 0.04
    groupRef.current.rotation.x = -my * 0.15 + Math.sin(timeRef.current * 0.3) * 0.02
    groupRef.current.position.y = Math.sin(timeRef.current * 0.5) * 0.08
  })

  // Animate screen emissive to simulate app UI
  useFrame(({ clock }) => {
    if (screenRef.current) {
      const t = clock.getElapsedTime()
      const pulse = 0.4 + Math.sin(t * 1.2) * 0.15
      screenRef.current.material.emissiveIntensity = pulse
    }
  })

  return (
    <group ref={groupRef} position={[0.8, 0.5, 0]}>
      {/* Phone body */}
      <mesh castShadow>
        <boxGeometry args={[0.75, 1.55, 0.08]} />
        <meshPhysicalMaterial color="#1a1a1a" metalness={0.9} roughness={0.08} />
      </mesh>
      {/* Screen */}
      <mesh ref={screenRef} position={[0, 0, 0.042]}>
        <boxGeometry args={[0.65, 1.38, 0.005]} />
        <meshPhysicalMaterial
          color="#0a1a2a"
          emissive="#1a4a6a"
          emissiveIntensity={0.5}
          roughness={0.05}
          metalness={0}
        />
      </mesh>
      {/* App UI lines on screen */}
      {[0.5, 0.2, -0.1, -0.35].map((y, i) => (
        <mesh key={i} position={[0, y, 0.046]}>
          <boxGeometry args={[i === 0 ? 0.45 : 0.35, 0.025, 0.001]} />
          <meshPhysicalMaterial
            color={i === 0 ? '#E89234' : '#4488aa'}
            emissive={i === 0 ? '#E89234' : '#4488aa'}
            emissiveIntensity={0.9}
          />
        </mesh>
      ))}
      {/* Live graph bar */}
      <AppGraphBars />
      {/* Camera notch */}
      <mesh position={[0, 0.71, 0.044]}>
        <cylinderGeometry args={[0.025, 0.025, 0.015, 12]} />
        <meshPhysicalMaterial color="#111" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

function AppGraphBars() {
  const barsRef = useRef([])
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    barsRef.current.forEach((bar, i) => {
      if (bar) {
        const h = 0.06 + Math.abs(Math.sin(t * 1.5 + i * 0.8)) * 0.14
        bar.scale.y = h / 0.08
        bar.material.emissiveIntensity = 0.5 + Math.abs(Math.sin(t * 2 + i)) * 0.5
      }
    })
  })

  return (
    <group position={[0, -0.1, 0.047]}>
      {[-0.2, -0.1, 0, 0.1, 0.2].map((x, i) => (
        <mesh
          key={i}
          ref={el => barsRef.current[i] = el}
          position={[x, -0.3, 0]}
        >
          <boxGeometry args={[0.06, 0.08, 0.001]} />
          <meshPhysicalMaterial
            color="#E89234"
            emissive="#E89234"
            emissiveIntensity={0.7}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function DashboardScene3D({ scrollProgressRef }) {
  const visible = useSceneVisibility(scrollProgressRef, 0.62, 0.82)
  const mouseRef = useRef({ x: 0, y: 0 })

  useFrame(({ mouse }) => {
    if (!visible) return
    mouseRef.current.x = mouse.x
    mouseRef.current.y = mouse.y
  })

  return (
    <group visible={visible}>
      {visible && (
        <>
          <ambientLight intensity={0.5} />
          <directionalLight position={[3, 5, 4]} intensity={2.0} color="#fff5e0" castShadow />
          <pointLight position={[-2, 0, 3]} intensity={1.5} color="#E89234" decay={2} />
          <pointLight position={[2, 2, 2]} intensity={0.8} color="#4488ff" decay={2} />
          <PhoneShell mouseRef={mouseRef} />
        </>
      )}
    </group>
  )
}
