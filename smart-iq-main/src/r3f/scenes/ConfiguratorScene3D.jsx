import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneVisibility } from '../hooks/useSceneVisibility.js'

export const configuratorState = { panelCount: 6, roofType: 'flat', city: 'Mumbai' }

const CITY_LIGHT = {
  Mumbai: { sky: '#1a2535', sun: '#ffd580', intensity: 2.2 },
  Delhi: { sky: '#2a2015', sun: '#ffb040', intensity: 1.6 },
  Bangalore: { sky: '#0d1f35', sun: '#ffe8a0', intensity: 2.8 },
  Chennai: { sky: '#1a1a2a', sun: '#ffcc60', intensity: 2.4 },
  Hyderabad: { sky: '#1e1510', sun: '#ffc080', intensity: 2.0 },
}

/* ── Detailed Building Diorama ────────────────────────────────── */
function Building({ roofType }) {
  // Generate windows positions
  const windows = useMemo(() => {
    const arr = []
    // Front and back
    for (let face of [1.51, -1.51]) {
      for (let x of [-1.2, 0, 1.2]) {
        for (let y of [0.8, -0.4]) {
          arr.push({ x, y, z: face, w: 0.5, h: 0.8, rotY: face < 0 ? Math.PI : 0 })
        }
      }
    }
    // Sides
    for (let face of [2.01, -2.01]) {
      for (let z of [-0.6, 0.6]) {
        for (let y of [0.8, -0.4]) {
          arr.push({ x: face, y, z, w: 0.5, h: 0.8, rotY: Math.PI / 2 })
        }
      }
    }
    return arr
  }, [])

  return (
    <group position={[0, -1, 0]}>
      {/* Main Concrete Body */}
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[4, 3, 3]} />
        <meshStandardMaterial color="#d4d0c8" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Roof Parapet / Terracotta */}
      {roofType === 'flat' ? (
        <group position={[0, 2.05, 0]}>
          {/* Parapet walls */}
          <mesh receiveShadow castShadow>
            <boxGeometry args={[4.2, 0.3, 3.2]} />
            <meshStandardMaterial color="#c4c0b8" roughness={0.9} />
          </mesh>
          {/* Inner roof surface */}
          <mesh receiveShadow position={[0, 0.16, 0]}>
            <boxGeometry args={[3.8, 0.02, 2.8]} />
            <meshStandardMaterial color="#888" roughness={1} />
          </mesh>
          {/* AC Units */}
          <mesh position={[-1.2, 0.3, -0.8]} castShadow>
            <boxGeometry args={[0.4, 0.5, 0.6]} />
            <meshStandardMaterial color="#a0a0a0" roughness={0.6} metalness={0.4} />
          </mesh>
          <mesh position={[1.4, 0.25, 0.5]} castShadow>
            <boxGeometry args={[0.5, 0.4, 0.5]} />
            <meshStandardMaterial color="#a0a0a0" roughness={0.6} metalness={0.4} />
          </mesh>
        </group>
      ) : (
        /* Detailed Terracotta Roof */
        <group position={[0, 2.0, 0]}>
          {/* Eaves */}
          <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
            <boxGeometry args={[4.4, 0.1, 3.4]} />
            <meshStandardMaterial color="#4a3a30" roughness={0.8} />
          </mesh>
          {/* Pitched Roof */}
          <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
            <coneGeometry args={[3.2, 1.6, 4]} />
            <meshStandardMaterial color="#c4523a" roughness={0.85} />
          </mesh>
        </group>
      )}

      {/* Glass Windows */}
      {windows.map((w, i) => (
        <mesh key={i} position={[w.x, w.y, w.z]} rotation={[0, w.rotY, 0]}>
          <boxGeometry args={[w.w, w.h, 0.04]} />
          <meshPhysicalMaterial 
            color="#0a1a2a" 
            transmission={0.4} 
            roughness={0.1} 
            metalness={0.6} 
            envMapIntensity={2.0} 
          />
        </mesh>
      ))}
    </group>
  )
}

function RoofPanels({ panelCount, roofType }) {
  const instancedRef = useRef()
  const maxPanels = 20
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Adjust panel position based on roof type
  const baseHeight = roofType === 'flat' ? 2.25 : 2.6
  const tilt = roofType === 'flat' ? -0.2 : -0.5

  const positions = useMemo(() => {
    const cols = 5, rows = 4
    return Array.from({ length: cols * rows }, (_, i) => ({
      x: (i % cols - 2) * 0.7,
      z: (Math.floor(i / cols) - 1.5) * 0.5,
    }))
  }, [])

  useFrame(() => {
    if (!instancedRef.current) return
    const count = Math.min(panelCount, positions.length)
    for (let i = 0; i < maxPanels; i++) {
      if (i < count) {
        const { x, z } = positions[i]
        // If pitched, adjust height based on Z position to follow the slope
        const heightAdj = roofType === 'flat' ? 0 : Math.abs(z) * 0.4
        dummy.position.set(x, baseHeight - heightAdj, z)
        // Pitch the panels appropriately
        dummy.rotation.set(z < 0 ? tilt : -tilt, 0, 0)
        dummy.scale.setScalar(1)
      } else {
        dummy.scale.setScalar(0)
      }
      dummy.updateMatrix()
      instancedRef.current.setMatrixAt(i, dummy.matrix)
    }
    instancedRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={instancedRef} args={[null, null, maxPanels]} castShadow>
      <boxGeometry args={[0.65, 0.02, 0.45]} />
      <meshPhysicalMaterial color="#0d2840" metalness={0.6} roughness={0.3} />
    </instancedMesh>
  )
}

export default function ConfiguratorScene3D({ scrollProgressRef, configState }) {
  const visible = useSceneVisibility(scrollProgressRef, 0.48, 0.78)
  
  const state = configState || configuratorState
  const roofType = state.roofType || 'flat'
  const panelCount = state.panelCount || 6
  const city = state.city || 'Mumbai'
  const cityLight = CITY_LIGHT[city] || CITY_LIGHT.Mumbai
  const sunRef = useRef()
  const ambRef = useRef()

  useFrame(() => {
    if (sunRef.current) {
      // Smooth color transition for city swap
      sunRef.current.color.lerp(new THREE.Color(cityLight.sun), 0.05)
      sunRef.current.intensity += (cityLight.intensity - sunRef.current.intensity) * 0.05
    }
  })

  return (
    <group visible={visible}>
      {visible && (
        <>
          <ambientLight ref={ambRef} intensity={0.4} />
          <directionalLight
            ref={sunRef}
            position={[6, 12, 5]}
            intensity={cityLight.intensity}
            color={cityLight.sun}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.001}
          />
          <Building roofType={roofType} />
          <RoofPanels panelCount={panelCount} roofType={roofType} />
          {/* Ground plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.55, 0]} receiveShadow>
            <planeGeometry args={[40, 40]} />
            <meshStandardMaterial color="#2a3028" roughness={1} />
          </mesh>
        </>
      )}
    </group>
  )
}
