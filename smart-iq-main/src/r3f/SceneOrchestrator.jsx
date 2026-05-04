import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Camera waypoints: [progress, position, lookAt]
const WAYPOINTS = [
  { p: 0.00, pos: [0, 1.5, 11.0], look: [0, 0.3, 0] },    // Hero - wide view of all panels
  { p: 0.10, pos: [0, 1.0,  8.5], look: [0, 0.2, 0] },    // Hero settled
  { p: 0.18, pos: [0, 0.1, 1.0], look: [0, 0, 0] },        // Macro - dive into panel
  { p: 0.26, pos: [-0.5, 0.3, 0.3], look: [0, 0, 0] },     // Macro extreme close
  { p: 0.34, pos: [-2.5, 1.5, 6.0], look: [0, 0, 0] },     // Hologram - pull out left
  { p: 0.41, pos: [0, 1.2, 5.5], look: [0, 0.5, 0] },      // Hologram center
  { p: 0.49, pos: [0, 5.5, 7.0], look: [0, 0, 0] },        // Blueprint - top down
  { p: 0.56, pos: [1.5, 4.0, 6.5], look: [0, 0, 0] },      // Blueprint detail
  { p: 0.62, pos: [0, 7.0, 3.0], look: [0, 0.5, 0] },      // Configurator - bird's eye
  { p: 0.70, pos: [2.5, 2.5, 7.5], look: [0, 1.0, 0] },    // Dashboard - phone view
  { p: 0.78, pos: [-1.5, 1.2, 5.5], look: [0, 0.5, 0] },   // Savings meter
  { p: 0.87, pos: [0, 10.0, 8.0], look: [0, 0, 0] },       // India map - wide
  { p: 1.00, pos: [0, 12.0, 10.0], look: [0, 0, 0] },      // India map - full
]

function lerpWaypoints(progress) {
  let lo = WAYPOINTS[0], hi = WAYPOINTS[WAYPOINTS.length - 1]
  for (let i = 0; i < WAYPOINTS.length - 1; i++) {
    if (progress >= WAYPOINTS[i].p && progress <= WAYPOINTS[i + 1].p) {
      lo = WAYPOINTS[i]
      hi = WAYPOINTS[i + 1]
      break
    }
  }
  const range = hi.p - lo.p
  const t = range === 0 ? 0 : (progress - lo.p) / range
  const ease = t * t * (3 - 2 * t) // smoothstep

  return {
    pos: [
      lo.pos[0] + (hi.pos[0] - lo.pos[0]) * ease,
      lo.pos[1] + (hi.pos[1] - lo.pos[1]) * ease,
      lo.pos[2] + (hi.pos[2] - lo.pos[2]) * ease,
    ],
    look: [
      lo.look[0] + (hi.look[0] - lo.look[0]) * ease,
      lo.look[1] + (hi.look[1] - lo.look[1]) * ease,
      lo.look[2] + (hi.look[2] - lo.look[2]) * ease,
    ],
  }
}

export default function SceneOrchestrator({ scrollProgressRef }) {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(0, 2, 9))
  const targetLook = useRef(new THREE.Vector3(0, 0.5, 0))
  const currentPos = useRef(new THREE.Vector3(0, 2, 9))
  const currentLook = useRef(new THREE.Vector3(0, 0.5, 0))

  useFrame(() => {
    const p = scrollProgressRef.current
    const { pos, look } = lerpWaypoints(p)

    targetPos.current.set(pos[0], pos[1], pos[2])
    targetLook.current.set(look[0], look[1], look[2])

    // Smooth damping
    currentPos.current.lerp(targetPos.current, 0.06)
    currentLook.current.lerp(targetLook.current, 0.06)

    camera.position.copy(currentPos.current)
    camera.lookAt(currentLook.current)
  })

  return null
}
