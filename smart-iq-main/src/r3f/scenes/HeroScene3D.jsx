import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { dustVertex, dustFragment } from '../shaders/dust.glsl.js'
import { getSolarPanelTexture } from '../utils/textures.js'
import { useSceneVisibility } from '../hooks/useSceneVisibility.js'

/* ─────────────────────────────────────────────────────────────────
   PANEL GRID CONFIG
   3 columns × 2 rows, each panel 2.96 × 1.96
   cols at x = -3.1, 0, 3.1
   rows at y = -1.075, 1.075
   Horizontal sweep range: x from -4.8 → +4.8
   ───────────────────────────────────────────────────────────────── */
const PANEL_W   = 2.96
const PANEL_H   = 1.96
const COL_STEP  = 3.1
const ROW_STEP  = 1.075
const COLS      = [-COL_STEP, 0, COL_STEP]
const ROWS      = [-ROW_STEP, ROW_STEP]
const SWEEP_MIN = -4.8          // left edge
const SWEEP_MAX =  4.8          // right edge
const SWEEP_DUR = 6.5           // seconds for one pass

/* ─── Procedural solar panel texture ──────────────────────────── */
function PBRPanel({ position = [0, 0, 0], xRef }) {
  const cellTexture = useMemo(() => getSolarPanelTexture(), [])
  return (
    <group position={position}>
      {/* Aluminium frame */}
      <RoundedBox args={[PANEL_W, PANEL_H, 0.08]} radius={0.015} smoothness={4} receiveShadow castShadow>
        <meshPhysicalMaterial color="#1e2028" metalness={0.92} roughness={0.12} />
      </RoundedBox>
      {/* PV cell bed */}
      <mesh position={[0, 0, 0.035]}>
        <boxGeometry args={[PANEL_W - 0.11, PANEL_H - 0.11, 0.01]} />
        <meshPhysicalMaterial map={cellTexture} metalness={0.35} roughness={0.45} clearcoat={0.15} />
      </mesh>
      {/* Anti-reflective glass */}
      <mesh position={[0, 0, 0.046]}>
        <boxGeometry args={[PANEL_W - 0.11, PANEL_H - 0.11, 0.004]} />
        <meshPhysicalMaterial
          color="#001a33"
          transmission={0.96}
          thickness={0.4}
          roughness={0.0}
          ior={1.52}
          transparent
          envMapIntensity={2.5}
        />
      </mesh>
      <DustOverlay xRef={xRef} />
    </group>
  )
}

/* ─── Dust shader — receives real-time bar X position ─────────── */
function DustOverlay({ xRef }) {
  const matRef = useRef()
  const uniforms = useMemo(() => ({
    dustAmount:  { value: 0.7 },
    time:        { value: 0 },
    barWorldX:   { value: -10.0 },
  }), [])

  useFrame(({ clock }) => {
    if (!matRef.current) return
    matRef.current.uniforms.time.value      = clock.getElapsedTime()
    matRef.current.uniforms.barWorldX.value = xRef.current
    /* dustAmount cycles: start dusty, get cleaned, back to dusty */
    const cycle = (clock.getElapsedTime() % (6.5 * 2)) / (6.5 * 2)
    matRef.current.uniforms.dustAmount.value = 0.65 + Math.sin(cycle * Math.PI) * 0.15
  })

  return (
    <mesh position={[0, 0, 0.049]}>
      <planeGeometry args={[PANEL_W - 0.11, PANEL_H - 0.11, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={dustVertex}
        fragmentShader={dustFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

/* ─────────────────────────────────────────────────────────────────
   HORIZONTAL CLEANING BAR — spans the full height of both panel rows
   Moves left-to-right, then right-to-left (smooth sine easing)
   ───────────────────────────────────────────────────────────────── */
function CleaningBar({ xRef }) {
  const groupRef  = useRef()
  const brushRef  = useRef()
  const glowRef   = useRef()

  /* Brush texture — vertical ribbing for horizontal bar */
  const brushTex = useMemo(() => {
    const c   = document.createElement('canvas')
    c.width   = 64
    c.height  = 512
    const ctx = c.getContext('2d')
    ctx.fillStyle = '#111'
    ctx.fillRect(0, 0, 64, 512)
    ctx.strokeStyle = '#2a2a2a'
    ctx.lineWidth = 3
    for (let i = 0; i < 64; i += 8) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke()
    }
    const t = new THREE.CanvasTexture(c)
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(10, 1)
    return t
  }, [])

  /* Scan-line emissive pulse material */
  const scanMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#00f5ff'),
    emissive: new THREE.Color('#00f5ff'),
    emissiveIntensity: 4,
    transparent: true,
    opacity: 0.9,
  }), [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.position.x = xRef.current

    /* Glow pulse */
    const t = clock.getElapsedTime()
    scanMat.emissiveIntensity = 3.5 + Math.sin(t * 8) * 1.5
    scanMat.opacity = 0.85 + Math.sin(t * 12) * 0.1

    if (glowRef.current) {
      glowRef.current.intensity = 4 + Math.sin(t * 6) * 1.5
    }
    /* Brush spin */
    if (brushRef.current) {
      brushRef.current.rotation.y = t * 25
    }
  })

  /* Bar height covers both rows: from bottom of lower panel to top of upper */
  const barHeight = ROW_STEP * 2 + PANEL_H + 0.15    // ≈ 2.305

  return (
    <group ref={groupRef} position={[SWEEP_MIN, 0, 0.13]}>

      {/* ── Main chassis — thin in X, tall in Y ── */}
      <RoundedBox args={[0.14, barHeight, 0.09]} radius={0.015} smoothness={4} castShadow>
        <meshPhysicalMaterial
          color="#0d0f14"
          metalness={0.88}
          roughness={0.18}
          clearcoat={0.6}
          clearcoatRoughness={0.1}
        />
      </RoundedBox>

      {/* ── Chrome accent rails on front face ── */}
      {[-0.025, 0.025].map((dz, i) => (
        <mesh key={i} position={[0.04, 0, dz]}>
          <boxGeometry args={[0.005, barHeight - 0.04, 0.002]} />
          <meshPhysicalMaterial color="#ffffff" metalness={1} roughness={0.04} />
        </mesh>
      ))}

      {/* ── CYAN Optical Scan Line (horizontal, full height) ── */}
      <mesh position={[0.055, 0, 0.002]}>
        <boxGeometry args={[0.004, barHeight - 0.06, 0.001]} />
        <primitive object={scanMat} attach="material" />
      </mesh>

      {/* ── Second amber indicator LED ── */}
      <mesh position={[-0.055, 0, 0.002]}>
        <boxGeometry args={[0.004, barHeight - 0.06, 0.001]} />
        <meshStandardMaterial
          color="#E89234"
          emissive="#E89234"
          emissiveIntensity={3}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* ── Microfibre brush roller (vertical axis) ── */}
      <mesh ref={brushRef} position={[0, 0, -0.06]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, barHeight - 0.06, 24]} rotation={[0, 0, 0]} />
        <meshPhysicalMaterial map={brushTex} color="#2a2a2a" roughness={0.95} />
      </mesh>

      {/* ── Drive wheels (top & bottom) ── */}
      {ROWS.map((y, i) => (
        <group key={i} position={[0, y, -0.04]}>
          <RoundedBox args={[0.16, 0.1, 0.14]} radius={0.015} castShadow>
            <meshPhysicalMaterial color="#191b1f" metalness={0.7} roughness={0.35} />
          </RoundedBox>
        </group>
      ))}

      {/* ── Trailing water mist particle emitter ── */}
      <WaterMist barHeight={barHeight} />

      {/* ── Scan point light (attached to bar) ── */}
      <pointLight
        ref={glowRef}
        color="#00e8ff"
        intensity={5}
        distance={4}
        decay={2}
        position={[0.1, 0, 0.3]}
      />
      {/* ── Amber point light (warms cleaned panels behind) ── */}
      <pointLight
        color="#E89234"
        intensity={3}
        distance={3.5}
        decay={2}
        position={[-0.15, 0, 0.2]}
      />
    </group>
  )
}

/* ─── Water / mist particles — trail left behind bar ──────────── */
function WaterMist({ barHeight }) {
  const ref    = useRef()
  const COUNT  = 2000
  const posArr = useMemo(() => {
    const a = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      a[i * 3]     = (Math.random() - 0.5) * 0.3
      a[i * 3 + 1] = (Math.random() - 0.5) * barHeight
      a[i * 3 + 2] = 0
    }
    return a
  }, [barHeight])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t   = clock.getElapsedTime()
    const pos = ref.current.geometry.attributes.position.array
    for (let i = 0; i < COUNT; i++) {
      const idx  = i * 3
      const age  = (t * 2.2 + i * 0.007) % 1.0
      /* Drift backwards (in -X, away from travel direction) */
      pos[idx]     = -0.05 - age * 0.45
      /* Swirl slightly */
      pos[idx + 1] = ((i % barHeight * 40) / 40 - barHeight / 2) +
                      Math.sin(t * 10 + i) * 0.04 * age
      pos[idx + 2] = -0.02 + Math.cos(t * 8 + i) * 0.05 * age
    }
    ref.current.geometry.attributes.position.needsUpdate = true

    /* Fade in/out */
    const opacity = 0.18 + Math.sin(t * 3) * 0.05
    ref.current.material.opacity = opacity
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={posArr}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#c8f0ff"
        size={0.012}
        transparent
        opacity={0.2}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

/* ─── Scan glow plane — wide translucent plane that highlights
       the region being cleaned (trails behind the bar) ─────────── */
function CleanGlowPlane({ xRef }) {
  const meshRef = useRef()
  const mat     = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#00e8ff'),
    emissive: new THREE.Color('#00e8ff'),
    emissiveIntensity: 0.4,
    transparent: true,
    opacity: 0.05,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  }), [])

  const panelH = ROW_STEP * 2 + PANEL_H + 0.2

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const x = xRef.current
    /* Trail glow follows about 1 unit behind the bar */
    meshRef.current.position.x = x - 1
    mat.opacity = 0.04 + Math.sin(clock.getElapsedTime() * 4) * 0.02
  })

  return (
    <mesh ref={meshRef} position={[SWEEP_MIN - 1, 0, 0.08]}>
      <planeGeometry args={[2, panelH]} />
      <primitive object={mat} attach="material" />
    </mesh>
  )
}

/* ─── Ambient star-field / dust particles in background ─────────── */
function BackgroundParticles() {
  const ref    = useRef()
  const COUNT  = 500
  const posArr = useMemo(() => {
    const a = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      a[i * 3]     = (Math.random() - 0.5) * 20
      a[i * 3 + 1] = (Math.random() - 0.5) * 14
      a[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2
    }
    return a
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.getElapsedTime() * 0.01
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={posArr} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color="#3a6080"
        size={0.04}
        transparent
        opacity={0.5}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

/* ─── Lighting ─────────────────────────────────────────────────── */
function HeroLighting({ xRef }) {
  const spotRef  = useRef()
  const fillRef  = useRef()
  const scanRef  = useRef()
  const { scene } = useThree()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const x = xRef.current

    scene.background = new THREE.Color('#080c18')

    /* Main spot sweeps with bar */
    if (spotRef.current) {
      spotRef.current.position.x = x
      spotRef.current.target.position.x = x
      spotRef.current.target.updateMatrixWorld()
    }
    /* Scan light follows bar */
    if (scanRef.current) {
      scanRef.current.position.x = x + 0.1
      scanRef.current.intensity = 3.5 + Math.sin(t * 7) * 1
    }
    /* Ambient pulsing fill */
    if (fillRef.current) {
      fillRef.current.intensity = 2.2 + Math.sin(t * 0.5) * 0.4
    }
  })

  return (
    <>
      {/* Rich ambient — visible panels */}
      <ambientLight intensity={2.0} color="#b8ccee" />

      {/* Key warm light top-front */}
      <directionalLight
        color="#ffe8c0"
        position={[4, 9, 7]}
        intensity={3.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      {/* Cool blue back-rim */}
      <directionalLight position={[-6, 3, -5]} intensity={2.2} color="#3366dd" />

      {/* Warm fill from bottom */}
      <pointLight ref={fillRef} position={[0, -4, 4]} intensity={2.5} color="#E89234" distance={22} decay={2} />

      {/* Sweeping amber spot follows the robot */}
      <spotLight
        ref={spotRef}
        position={[0, 6, 8]}
        angle={0.35}
        penumbra={0.45}
        intensity={20}
        color="#FFB860"
        castShadow
        decay={2}
        distance={28}
      />

      {/* Cyan scan light — tracks bar position */}
      <pointLight
        ref={scanRef}
        color="#00e8ff"
        intensity={4}
        distance={5}
        decay={2}
        position={[0, 0, 2]}
      />
    </>
  )
}

/* ─── Main scene contents ──────────────────────────────────────── */
function HeroContents() {
  /* Shared X ref — updated by animation, read by bar + lights */
  const xRef = useRef(SWEEP_MIN)

  useFrame(({ clock }) => {
    const t  = clock.getElapsedTime()
    /* Full cycle = 2 × SWEEP_DUR (sweep there + sweep back)
       Use smooth sine to go SWEEP_MIN → SWEEP_MAX → SWEEP_MIN
       No instant jump. Ever.                                    */
    const cycle   = SWEEP_DUR * 2
    const tMod    = t % cycle
    const frac    = tMod / cycle                   // 0 → 1 per cycle
    /* cosine gives 0→1→0, shift to -1→1 then map */
    const cosVal  = Math.cos(frac * Math.PI * 2)   // 1 → -1 → 1
    const norm    = (1 - cosVal) / 2               // 0 → 1 → 0 smooth
    xRef.current  = SWEEP_MIN + (SWEEP_MAX - SWEEP_MIN) * norm
  })

  return (
    <>
      <HeroLighting xRef={xRef} />

      <group rotation={[-0.12, 0, 0]} position={[0, -0.2, 0]}>
        {/* 3×2 panel array — each gets the bar xRef for dust wipe */}
        {COLS.map(cx =>
          ROWS.map(cy => (
            <PBRPanel key={`${cx}-${cy}`} position={[cx, cy, 0]} xRef={xRef} />
          ))
        )}
        {/* Horizontal cleaning bar */}
        <CleaningBar xRef={xRef} />
        {/* Trail glow plane */}
        <CleanGlowPlane xRef={xRef} />
      </group>

      <BackgroundParticles />
    </>
  )
}

/* ─── Rooftop ground plane ─────────────────────────────────────── */
function Rooftop() {
  return (
    <group rotation={[-0.12, 0, 0]} position={[0, -2.3, 0]}>
      <mesh receiveShadow>
        <boxGeometry args={[18, 12, 0.35]} />
        <meshPhysicalMaterial
          color="#0a0b10"
          roughness={0.78}
          metalness={0.25}
        />
      </mesh>
      {/* Subtle grid lines on roof */}
      {[-6, -3, 0, 3, 6].map(x => (
        <mesh key={x} position={[x, 0, 0.18]}>
          <boxGeometry args={[0.015, 12, 0.001]} />
          <meshStandardMaterial color="#1a1c22" />
        </mesh>
      ))}
    </group>
  )
}

/* ─── Scene root ───────────────────────────────────────────────── */
export default function HeroScene3D({ scrollProgressRef }) {
  const visible = useSceneVisibility(scrollProgressRef, 0.0, 0.18)

  return (
    <group visible={visible}>
      {visible && (
        <>
          <Rooftop />
          <HeroContents />
        </>
      )}
    </group>
  )
}
