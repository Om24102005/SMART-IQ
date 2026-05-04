import { useRef, useState, useEffect, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'

/* ── Dust Shader Material ─────────────────────────────────── */
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform float dustAmount;
uniform float time;
varying vec2 vUv;

float noise(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float smoothNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = noise(i);
  float b = noise(i + vec2(1.0, 0.0));
  float c = noise(i + vec2(0.0, 1.0));
  float d = noise(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

void main() {
  float n = smoothNoise(vUv * 8.0 + time * 0.1);
  n += 0.5 * smoothNoise(vUv * 16.0 + time * 0.15);
  n /= 1.5;

  vec3 dustColor = vec3(0.76, 0.67, 0.52);
  float dustOpacity = dustAmount * n * 0.75;

  gl_FragColor = vec4(dustColor, dustOpacity);
}
`

/* ── Solar Panel ─────────────────────────────────────────── */
function SolarPanel({ position }) {
  return (
    <group position={position}>
      {/* Panel body */}
      <mesh>
        <boxGeometry args={[2.8, 1.8, 0.05]} />
        <meshStandardMaterial
          color="#1a4060"
          metalness={0.6}
          roughness={0.35}
        />
      </mesh>
      {/* Panel grid lines */}
      <mesh position={[0, 0, 0.028]}>
        <boxGeometry args={[2.75, 1.75, 0.001]} />
        <meshStandardMaterial
          color="#0d2840"
          metalness={0.8}
          roughness={0.2}
          wireframe={false}
          opacity={0.8}
          transparent
        />
      </mesh>
      {/* Panel frame */}
      <mesh>
        <boxGeometry args={[2.85, 1.85, 0.04]} />
        <meshStandardMaterial color="#888" metalness={0.9} roughness={0.2} wireframe />
      </mesh>
      {/* Dust overlay plane */}
      <DustOverlay />
    </group>
  )
}

/* ── Dust Overlay ────────────────────────────────────────── */
function DustOverlay() {
  const matRef = useRef()
  const { dustAmountRef } = useSceneContext()

  const uniforms = useMemo(() => ({
    dustAmount: { value: 0 },
    time: { value: 0 },
  }), [])

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.time.value = clock.getElapsedTime()
      matRef.current.uniforms.dustAmount.value = dustAmountRef.current
    }
  })

  return (
    <mesh position={[0, 0, 0.04]}>
      <planeGeometry args={[2.8, 1.8, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

/* ── Cleaning Bar ────────────────────────────────────────── */
function CleaningBar({ barYRef }) {
  const meshRef = useRef()

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.y = barYRef.current
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0.9, 0.06]}>
      <boxGeometry args={[8.7, 0.08, 0.02]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#a0d4ff"
        emissiveIntensity={0.4}
        metalness={0.5}
        roughness={0.3}
      />
    </mesh>
  )
}

/* ── Particle System ─────────────────────────────────────── */
function ParticleSystem({ barYRef }) {
  const pointsRef = useRef()
  const opacityRef = useRef(0)

  const particles = useMemo(() => {
    const count = 500
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8.5
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3.5
      positions[i * 3 + 2] = Math.random() * 0.3 + 0.05
    }
    return positions
  }, [])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const elapsed = clock.getElapsedTime()
    const geo = pointsRef.current.geometry
    const pos = geo.attributes.position.array

    const barY = barYRef.current
    // particles cluster near bar
    for (let i = 0; i < 500; i++) {
      const idx = i * 3
      const dist = pos[idx + 1] - barY
      if (Math.abs(dist) < 0.5) {
        pos[idx] += (Math.random() - 0.5) * 0.04
        pos[idx + 1] += (Math.random() - 0.5) * 0.02
      }
      // reset particles far from bar
      if (pos[idx + 1] < barY - 1.5) {
        pos[idx] = (Math.random() - 0.5) * 8.5
        pos[idx + 1] = barY + Math.random() * 0.3
        pos[idx + 2] = Math.random() * 0.3 + 0.05
      }
    }
    geo.attributes.position.needsUpdate = true

    // fade based on whether bar is active
    const isActive = barY > -1.8 && barY < 0.95
    opacityRef.current += (isActive ? 0.8 : 0) * 0.05 - opacityRef.current * 0.05
    if (pointsRef.current.material) {
      pointsRef.current.material.opacity = Math.max(0, opacityRef.current)
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={500}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#a8d4f0"
        size={0.04}
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/* ── Sky Background ──────────────────────────────────────── */
function SkyBackground({ phaseRef }) {
  const { scene } = useThree()
  const colorRef = useRef(new THREE.Color('#0A1628'))

  useFrame(() => {
    const phase = phaseRef.current
    let targetColor

    if (phase < 0.3) {
      // Night
      targetColor = new THREE.Color('#0A1628')
    } else if (phase < 0.5) {
      // Sunrise
      const t = (phase - 0.3) / 0.2
      targetColor = new THREE.Color('#0A1628').lerp(new THREE.Color('#F4A460'), t)
    } else if (phase < 0.7) {
      // Daytime
      const t = (phase - 0.5) / 0.2
      targetColor = new THREE.Color('#F4A460').lerp(new THREE.Color('#87CEEB'), t)
    } else {
      // Day
      targetColor = new THREE.Color('#87CEEB')
    }

    colorRef.current.lerp(targetColor, 0.02)
    scene.background = colorRef.current.clone()
  })

  return null
}

/* ── Data Card (HTML overlay) ────────────────────────────── */
function DataCard({ visibleRef }) {
  const [opacity, setOpacity] = useState(0)
  const [power, setPower] = useState(270)
  const rafRef = useRef()
  const targetPower = useRef(270)

  useEffect(() => {
    let val = 270
    const animate = () => {
      val += (targetPower.current - val) * 0.04
      setPower(Math.round(val))
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  useFrame(() => {
    const target = visibleRef.current ? 1 : 0
    setOpacity((prev) => {
      const next = prev + (target - prev) * 0.04
      return Math.abs(next - target) < 0.01 ? target : next
    })
    targetPower.current = visibleRef.current ? 340 : 270
  })

  return (
    <Html position={[2.5, 1.8, 0.5]} center>
      <div
        style={{
          opacity,
          transition: 'opacity 0.3s ease',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          borderRadius: '12px',
          padding: '10px 16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          minWidth: '140px',
          textAlign: 'center',
          pointerEvents: 'none',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1B4F72', lineHeight: 1 }}>
          {power}W
        </div>
        <div style={{ fontSize: '0.7rem', color: '#5a5a58', marginTop: '2px' }}>output</div>
        <div
          style={{
            marginTop: '6px',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#2D7A3F',
            background: 'rgba(45,122,63,0.1)',
            borderRadius: '100px',
            padding: '2px 8px',
          }}
        >
          +21% more power
        </div>
      </div>
    </Html>
  )
}

/* ── Scene Context (shared refs) ─────────────────────────── */
import { createContext, useContext } from 'react'
const SceneContext = createContext({ dustAmountRef: { current: 0 } })
function useSceneContext() { return useContext(SceneContext) }

/* ── Panel Grid ──────────────────────────────────────────── */
function PanelGrid() {
  const panels = []
  for (let col = 0; col < 3; col++) {
    for (let row = 0; row < 2; row++) {
      panels.push(
        <SolarPanel
          key={`${col}-${row}`}
          position={[(col - 1) * 3.1, (row - 0.5) * 2.1 - 0.3, 0]}
        />
      )
    }
  }
  return <group rotation={[-0.3, 0, 0]}>{panels}</group>
}

/* ── Main Scene Logic ────────────────────────────────────── */
function Scene() {
  const dustAmountRef = useRef(0)
  const barYRef = useRef(0.9)
  const phaseRef = useRef(0)
  const dataCardVisibleRef = useRef(false)
  const timeRef = useRef(0)

  // Sequence timing (seconds):
  // 0-4: sunrise (phase 0→1)
  // 4-5: dust accumulates (dustAmount 0→1)
  // 5-8: bar slides down (barY 0.9 → -0.9), dust clears
  // 8-9: data card fades in
  // 9-12: hold
  // 12-15: reset
  const CYCLE = 15

  useFrame((_, delta) => {
    timeRef.current += delta
    const t = timeRef.current % CYCLE
    const loopT = t / CYCLE

    // Sky phase (sunrise over first 4s)
    if (t < 4) {
      phaseRef.current = t / 4
    } else {
      phaseRef.current = 1
    }

    // Dust accumulation (4-5s)
    if (t >= 4 && t < 5) {
      dustAmountRef.current = (t - 4) / 1
    }

    // Cleaning bar slides (5-8s) and dust clears
    if (t >= 5 && t < 8) {
      const progress = (t - 5) / 3
      barYRef.current = 0.9 - progress * 1.8
      dustAmountRef.current = 1 - progress
    }

    // Bar done
    if (t >= 8) {
      barYRef.current = -0.9
      dustAmountRef.current = 0
    }

    // Data card visibility (8-12s)
    dataCardVisibleRef.current = t >= 8.5 && t < 12

    // Reset
    if (t >= 12) {
      barYRef.current = 0.9
    }
  })

  return (
    <SceneContext.Provider value={{ dustAmountRef }}>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-3, 2, -2]} intensity={0.3} color="#87CEEB" />

      {/* Sky */}
      <SkyBackground phaseRef={phaseRef} />

      {/* Rooftop platform */}
      <mesh position={[0, -1.6, -0.1]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[12, 6, 0.3]} />
        <meshStandardMaterial color="#1a1a18" roughness={0.9} />
      </mesh>

      {/* Panels */}
      <PanelGrid />

      {/* Cleaning bar */}
      <group rotation={[-0.3, 0, 0]}>
        <CleaningBar barYRef={barYRef} />
        <ParticleSystem barYRef={barYRef} />
      </group>

      {/* Data card */}
      <DataCard visibleRef={dataCardVisibleRef} />

      {/* Camera controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 6}
      />
    </SceneContext.Provider>
  )
}

/* ── Error Boundary ──────────────────────────────────────── */
import { Component } from 'react'
class ErrorBoundary extends Component {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ width: '100%', height: '100%', background: '#0A1628' }} />
      )
    }
    return this.props.children
  }
}

/* ── HeroScene Export ─────────────────────────────────────── */
export default function HeroScene() {
  return (
    <ErrorBoundary>
      <Canvas
        camera={{ position: [0, 4, 9], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        style={{ width: '100%', height: '100%' }}
        shadows
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </ErrorBoundary>
  )
}
