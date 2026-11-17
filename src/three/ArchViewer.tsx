import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Line, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/env'
import { BuildingModel, type BuildState } from './BuildingModel'
import { CELL, ROOFS, planRoute, type RoofKind } from './building'

export type ViewerProps = { roof: RoofKind; floors: number; cut: boolean; route: number | null; active: boolean; low: boolean }

function RouteLayer({ preset }: { preset: number }) {
  const route = useMemo(() => planRoute(preset), [preset])
  const pts = useMemo(() => route.points.map(([x, z]) => new THREE.Vector3(x, 0.09, z)), [route])
  const total = useMemo(() => pts.slice(1).reduce((sum, p, i) => sum + p.distanceTo(pts[i]), 0), [pts])
  const line = useRef<{ material: { dashOffset: number } } | null>(null)
  const fire = useRef<THREE.Mesh>(null)
  const runner = useRef<THREE.Mesh>(null)
  const progress = useRef({ p: 0 })
  const invalidate = useThree((s) => s.invalidate)

  useEffect(() => {
    progress.current.p = 0
    const tween = gsap.to(progress.current, { p: 1, duration: prefersReducedMotion() ? 0 : 1.6, ease: 'power2.inOut', onUpdate: invalidate })
    return () => {
      tween.kill()
    }
  }, [route, invalidate])

  useFrame((state) => {
    const p = progress.current.p
    if (line.current) line.current.material.dashOffset = total * (1 - p)
    if (fire.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 6) * 0.12
      fire.current.scale.set(s, 1 + Math.sin(state.clock.elapsedTime * 9) * 0.2, s)
    }
    if (runner.current) {
      let remaining = total * p
      let pos = pts[0]
      for (let i = 1; i < pts.length; i++) {
        const seg = pts[i].distanceTo(pts[i - 1])
        if (remaining <= seg) {
          pos = pts[i - 1].clone().lerp(pts[i], seg === 0 ? 0 : remaining / seg)
          break
        }
        remaining -= seg
        pos = pts[i]
      }
      runner.current.position.copy(pos)
    }
  })

  return (
    <group>
      <Line ref={line as never} points={pts} color={route.exit === 'door' ? '#2447f9' : '#0f172a'} lineWidth={3.5} dashed dashSize={total} gapSize={total} />
      <mesh ref={runner} position={[route.start[0], 0.09, route.start[1]]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>
      <mesh ref={fire} position={[route.fire[0], 0.3, route.fire[1]]}>
        <coneGeometry args={[0.2, 0.6, 6]} />
        <meshBasicMaterial color="#d92d20" />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[route.fire[0], 0.07, route.fire[1]]}>
        <planeGeometry args={[CELL * 3, CELL * 3]} />
        <meshBasicMaterial color="#d92d20" transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

function Controller({ roof, floors, cut, route, sref }: ViewerProps & { sref: React.RefObject<BuildState> }) {
  const { invalidate, gl } = useThree()
  useEffect(() => {
    gl.domElement.style.touchAction = 'pan-y'
  }, [gl])
  useEffect(() => {
    const instant = prefersReducedMotion()
    const r = ROOFS[roof]
    const tween = gsap.to(sref.current, {
      floors,
      roofInset: r.inset,
      roofHeight: r.height,
      cut: cut ? 1 : 0,
      ghost: route !== null ? 1 : 0,
      lit: route !== null ? 0.1 : 1,
      duration: instant ? 0 : 0.9,
      ease: 'power3.inOut',
      overwrite: true,
      onUpdate: invalidate,
    })
    return () => {
      tween.kill()
    }
  }, [roof, floors, cut, route, sref, invalidate])
  return null
}

export default function ArchViewer(props: ViewerProps) {
  const sref = useRef<BuildState>({
    reveal: 1,
    floors: props.floors,
    roof: 1,
    roofInset: ROOFS[props.roof].inset,
    roofHeight: ROOFS[props.roof].height,
    solid: 1,
    lit: 1,
    cut: 0,
    ghost: 0,
  })
  const animating = props.route !== null && !prefersReducedMotion()
  return (
    <Canvas
      flat
      frameloop={!props.active ? 'never' : animating ? 'always' : 'demand'}
      dpr={[1, props.low ? 1.5 : 2]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 30, near: 0.1, far: 120, position: [9.5, 7.5, 12.5] }}
      role="img"
      aria-label="Interactive 3D model of a procedural building. Drag to orbit."
    >
      <color attach="background" args={['#f4f5ef']} />
      <hemisphereLight args={['#ffffff', '#b9c0cc', 2.4]} />
      <directionalLight position={[6, 10, 7]} intensity={1.6} color="#ffffff" />
      <gridHelper args={[26, 52, '#b4bcc9', '#dfe3da']} position-y={-0.01} />
      <BuildingModel sref={sref} />
      {props.route !== null && <RouteLayer preset={props.route} />}
      <Controller {...props} sref={sref} />
      <OrbitControls makeDefault target={[0, 2.1, 0]} enablePan={false} enableZoom={false} minPolarAngle={0.25} maxPolarAngle={1.5} enableDamping dampingFactor={0.08} />
    </Canvas>
  )
}
