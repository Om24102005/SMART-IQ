/**
 * Theatre.js Scroll-Driven Orchestration
 * ────────────────────────────────────────
 * Provides scroll-driven animation control for R3F scenes.
 * Uses Theatre.js for declarative, timeline-based animation of
 * camera, lights, and scene elements tied to scroll progress.
 */
import { useEffect, useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { getProject, types } from '@theatre/core'
import studio from '@theatre/studio'

// Only enable studio in dev
if (import.meta.env.DEV) {
  studio.initialize()
}

// Create a project for scroll-driven animations
const project = getProject('SparshIQ Scroll', { state: 'auto' })

// Define a sheet for the scroll timeline
const sheet = project.sheet('Scroll Timeline')

// Define animation objects
const cameraAnim = sheet.object('Camera', {
  x: types.number(0, { range: [-5, 5] }),
  y: types.number(1.5, { range: [-2, 12] }),
  z: types.number(11, { range: [0.3, 15] }),
  lookX: types.number(0, { range: [-2, 2] }),
  lookY: types.number(0.3, { range: [-1, 2] }),
  lookZ: types.number(0, { range: [-2, 2] }),
})

const sceneAnim = sheet.object('Scene', {
  ambientIntensity: types.number(0.5, { range: [0, 2] }),
  fogDensity: types.number(0, { range: [0, 0.05] }),
  timeSpeed: types.number(1, { range: [0, 3] }),
})

/**
 * TheatreOrchestrator - drives camera and scene params from Theatre.js
 * sequences based on scroll progress.
 */
export default function TheatreOrchestrator({ scrollProgressRef }) {
  const { camera } = useThree()
  const scene = useMemo(() => new THREE.Scene(), [])
  const fogRef = useRef(null)

  // Set up Theatre.js sequence positions
  useEffect(() => {
    // Define sequence positions matching scroll progress waypoints
    const seq = sheet.sequence

    // Position 0: Hero start
    seq.position(0)
    cameraAnim.setValues({ x: 0, y: 1.5, z: 11, lookX: 0, lookY: 0.3, lookZ: 0 })
    sceneAnim.setValues({ ambientIntensity: 0.5, fogDensity: 0, timeSpeed: 1 })

    // Position 0.1: Hero settled
    seq.position(0.1)
    cameraAnim.setValues({ x: 0, y: 1.0, z: 8.5, lookX: 0, lookY: 0.2, lookZ: 0 })

    // Position 0.18: Macro dive
    seq.position(0.18)
    cameraAnim.setValues({ x: 0, y: 0.1, z: 1.0, lookX: 0, lookY: 0, lookZ: 0 })

    // Position 0.26: Macro extreme close
    seq.position(0.26)
    cameraAnim.setValues({ x: -0.5, y: 0.3, z: 0.3, lookX: 0, lookY: 0, lookZ: 0 })

    // Position 0.34: Hologram pull out
    seq.position(0.34)
    cameraAnim.setValues({ x: -2.5, y: 1.5, z: 6.0, lookX: 0, lookY: 0, lookZ: 0 })

    // Position 0.41: Hologram center
    seq.position(0.41)
    cameraAnim.setValues({ x: 0, y: 1.2, z: 5.5, lookX: 0, lookY: 0.5, lookZ: 0 })

    // Position 0.49: Blueprint top down
    seq.position(0.49)
    cameraAnim.setValues({ x: 0, y: 5.5, z: 7.0, lookX: 0, lookY: 0, lookZ: 0 })

    // Position 0.56: Blueprint detail
    seq.position(0.56)
    cameraAnim.setValues({ x: 1.5, y: 4.0, z: 6.5, lookX: 0, lookY: 0, lookZ: 0 })

    // Position 0.62: Configurator bird's eye
    seq.position(0.62)
    cameraAnim.setValues({ x: 0, y: 7.0, z: 3.0, lookX: 0, lookY: 0.5, lookZ: 0 })

    // Position 0.70: Dashboard phone view
    seq.position(0.70)
    cameraAnim.setValues({ x: 2.5, y: 2.5, z: 7.5, lookX: 0, lookY: 1.0, lookZ: 0 })

    // Position 0.78: Savings meter
    seq.position(0.78)
    cameraAnim.setValues({ x: -1.5, y: 1.2, z: 5.5, lookX: 0, lookY: 0.5, lookZ: 0 })

    // Position 0.87: India map wide
    seq.position(0.87)
    cameraAnim.setValues({ x: 0, y: 10.0, z: 8.0, lookX: 0, lookY: 0, lookZ: 0 })

    // Position 1.00: India map full
    seq.position(1.00)
    cameraAnim.setValues({ x: 0, y: 12.0, z: 10.0, lookX: 0, lookY: 0, lookZ: 0 })

    return () => {
      // Cleanup
    }
  }, [])

  // Drive Theatre.js sequence from scroll progress
  useFrame(() => {
    const progress = scrollProgressRef.current
    const seq = sheet.sequence

    // Map scroll progress to Theatre.js sequence position (0 to 1)
    seq.position(progress)

    // Get current values from Theatre.js
    const camState = cameraAnim.value
    const sceneState = sceneAnim.value

    // Apply camera position
    if (camState) {
      camera.position.set(camState.x, camState.y, camState.z)
      camera.lookAt(camState.lookX, camState.lookY, camState.lookZ)
    }

    // Apply scene params
    if (sceneState) {
      // Update fog
      if (sceneState.fogDensity > 0) {
        if (!fogRef.current) {
          fogRef.current = new THREE.FogExp2(0x06080f, sceneState.fogDensity)
          camera.fog = fogRef.current
        } else {
          fogRef.current.density = sceneState.fogDensity
        }
      } else if (fogRef.current) {
        camera.fog = null
        fogRef.current = null
      }
    }
  })

  return null
}
