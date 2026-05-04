import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneVisibility } from '../hooks/useSceneVisibility.js'

// Simplified India outline as normalized (lat/lon → x/z) point cloud
const INDIA_OUTLINE = (() => {
  const pts = [
    [0.0,0.9],[0.05,0.82],[0.02,0.74],[0.08,0.65],[0.04,0.55],[0.0,0.45],[0.04,0.35],[0.0,0.22],[0.05,0.12],[0.12,0.0],
    [0.2,-0.08],[0.35,-0.1],[0.45,-0.05],
    [0.5,0.05],[0.55,0.15],[0.52,0.28],[0.58,0.38],[0.6,0.5],[0.55,0.62],[0.58,0.72],[0.62,0.82],
    [0.65,0.88],[0.7,0.94],[0.78,0.96],[0.85,0.9],[0.9,0.82],[0.95,0.75],[1.0,0.68],
    [0.95,0.92],[0.88,0.96],[0.8,1.0],[0.7,0.98],[0.6,0.96],[0.5,0.98],[0.4,0.96],[0.3,0.94],[0.2,0.9],[0.1,0.88],
  ]

  const result = []
  pts.forEach(([x, z]) => {
    result.push([x * 5 - 2.5, 0, z * 6 - 3])
  })
  for (let i = 0; i < 260; i++) {
    const x = Math.random() * 4.5 - 1.8
    const z = Math.random() * 5.5 - 2.8
    if (x > -0.5 && x < 4.5 && z > -2.5 && z < 2.8) {
      result.push([x, 0, z])
    }
  }
  return result
})()

const CITIES = [
  { name: 'Mumbai', pos: [0.1, 0, 0.45] },
  { name: 'Delhi', pos: [1.2, 0, 1.8] },
  { name: 'Bangalore', pos: [0.8, 0, -0.5] },
  { name: 'Chennai', pos: [1.5, 0, -0.4] },
  { name: 'Hyderabad', pos: [1.2, 0, 0.4] },
  { name: 'Kolkata', pos: [2.8, 0, 1.2] },
  { name: 'Pune', pos: [0.5, 0, 0.3] },
  { name: 'Ahmedabad', pos: [0.3, 0, 1.4] },
]

function MapDots({ mouseRef }) {
  const instancedRef = useRef()
  const count = INDIA_OUTLINE.length
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const basePositions = useMemo(() => INDIA_OUTLINE.map(([x, y, z]) => new THREE.Vector3(x, y, z)), [])

  useFrame(({ clock }) => {
    if (!instancedRef.current) return
    const t = clock.getElapsedTime()
    const mx = mouseRef?.current?.x * 4 || 0
    const mz = mouseRef?.current?.y * 4 || 0

    basePositions.forEach((base, i) => {
      const wave = Math.sin(t * 0.8 + base.x * 1.2 + base.z * 0.8) * 0.08
      const dx = base.x - mx
      const dz = base.z - mz
      const dist = Math.sqrt(dx * dx + dz * dz)
      const repel = Math.max(0, 1.2 - dist) * 0.4

      dummy.position.set(
        base.x + (dx / (dist + 0.01)) * repel,
        base.y + wave,
        base.z + (dz / (dist + 0.01)) * repel
      )
      dummy.scale.setScalar(0.06)
      dummy.updateMatrix()
      instancedRef.current.setMatrixAt(i, dummy.matrix)
    })
    instancedRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={instancedRef} args={[null, null, count]} castShadow>
      <sphereGeometry args={[1, 6, 6]} />
      <meshPhysicalMaterial color="#4488aa" emissive="#2255aa" emissiveIntensity={0.3} roughness={0.6} />
    </instancedMesh>
  )
}

function CityOrbs() {
  const orbs = useRef([])
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    orbs.current.forEach((orb, i) => {
      if (orb) {
        orb.position.y = Math.sin(t * 1.2 + i) * 0.06
        orb.material.emissiveIntensity = 0.8 + Math.sin(t * 2 + i * 0.7) * 0.3
      }
    })
  })

  return (
    <>
      {CITIES.map((city, i) => (
        <mesh
          key={city.name}
          ref={el => orbs.current[i] = el}
          position={city.pos}
        >
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshPhysicalMaterial color="#E89234" emissive="#E89234" emissiveIntensity={1.0} roughness={0.2} />
        </mesh>
      ))}
    </>
  )
}

export default function IndiaMapScene3D({ scrollProgressRef }) {
  const visible = useSceneVisibility(scrollProgressRef, 0.82, 1.0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const groupRef = useRef()

  useFrame(({ mouse, clock }) => {
    if (!visible) return
    mouseRef.current.x = mouse.x
    mouseRef.current.y = mouse.y
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.05
    }
  })

  return (
    <group visible={visible} ref={groupRef} rotation={[0.3, 0, 0]}>
      {visible && (
        <>
          <ambientLight intensity={0.3} />
          <directionalLight position={[0, 10, 5]} intensity={1.5} color="#fff5e0" castShadow />
          <pointLight position={[0, 3, 2]} intensity={2} color="#E89234" decay={2} distance={10} />
          <MapDots mouseRef={mouseRef} />
          <CityOrbs />
        </>
      )}
    </group>
  )
}
