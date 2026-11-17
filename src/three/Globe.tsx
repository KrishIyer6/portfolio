import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { feature } from 'topojson-client'
import type { Topology } from 'topojson-specification'
import type { FeatureCollection, MultiPolygon, Polygon } from 'geojson'
import landTopo from 'world-atlas/land-110m.json'
import { gsap } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/env'
import type { Place } from '../data/content'

const RAD = Math.PI / 180
const toXYZ = (lat: number, lon: number, r = 1): [number, number, number] => [
  r * Math.cos(lat * RAD) * Math.sin(lon * RAD),
  r * Math.sin(lat * RAD),
  r * Math.cos(lat * RAD) * Math.cos(lon * RAD),
]

function useGlobeLines() {
  return useMemo(() => {
    const topo = landTopo as unknown as Topology
    const land = feature(topo, topo.objects.land) as unknown as FeatureCollection<Polygon | MultiPolygon>
    const coast: number[] = []
    const ring = (pts: number[][]) => {
      for (let i = 1; i < pts.length; i++) coast.push(...toXYZ(pts[i - 1][1], pts[i - 1][0], 1.002), ...toXYZ(pts[i][1], pts[i][0], 1.002))
    }
    for (const f of land.features) {
      const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates
      for (const poly of polys) for (const r of poly) ring(r)
    }
    const grat: number[] = []
    for (let lon = -180; lon < 180; lon += 30) for (let lat = -84; lat < 84; lat += 6) grat.push(...toXYZ(lat, lon), ...toXYZ(lat + 6, lon))
    for (let lat = -60; lat <= 60; lat += 30) for (let lon = -180; lon < 180; lon += 6) grat.push(...toXYZ(lat, lon), ...toXYZ(lat, lon + 6))
    const mk = (arr: number[]) => {
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3))
      return g
    }
    return { coast: mk(coast), grat: mk(grat) }
  }, [])
}

type SceneProps = { places: Place[]; selected: number | null; onSelect: (i: number | null) => void }

function GlobeScene({ places, selected, onSelect }: SceneProps) {
  const { coast, grat } = useGlobeLines()
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null)
  const invalidate = useThree((s) => s.invalidate)
  const reduced = prefersReducedMotion()

  useEffect(() => () => {
    coast.dispose()
    grat.dispose()
  }, [coast, grat])

  useEffect(() => {
    const c = controls.current
    if (selected === null || !c) return
    const p = places[selected]
    const from = { az: c.getAzimuthalAngle(), pol: c.getPolarAngle() }
    let az = p.lon * RAD
    while (az - from.az > Math.PI) az -= Math.PI * 2
    while (az - from.az < -Math.PI) az += Math.PI * 2
    const tween = gsap.to(from, {
      az,
      pol: Math.PI / 2 - p.lat * RAD * 0.8,
      duration: reduced ? 0 : 1.1,
      ease: 'power3.inOut',
      onUpdate: () => {
        c.setAzimuthalAngle(from.az)
        c.setPolarAngle(from.pol)
        c.update()
        invalidate()
      },
    })
    return () => {
      tween.kill()
    }
  }, [selected, places, reduced, invalidate])

  return (
    <>
      <mesh>
        <sphereGeometry args={[0.993, 48, 32]} />
        <meshBasicMaterial color="#f1f3ec" />
      </mesh>
      <lineSegments geometry={grat}>
        <lineBasicMaterial color="#586579" transparent opacity={0.28} />
      </lineSegments>
      <lineSegments geometry={coast}>
        <lineBasicMaterial color="#0f172a" transparent opacity={0.85} />
      </lineSegments>
      {places.map((p, i) => {
        const on = selected === i
        return (
          <group key={p.name} position={toXYZ(p.lat, p.lon, 1.012)}>
            <mesh scale={on ? 1.7 : 1}>
              <sphereGeometry args={[0.022, 12, 12]} />
              <meshBasicMaterial color={on ? '#0f172a' : '#2447f9'} />
            </mesh>
            <mesh scale={on ? 1.5 : 1}>
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshBasicMaterial color="#2447f9" transparent opacity={on ? 0.4 : 0.2} depthWrite={false} />
            </mesh>
            <mesh onPointerOver={() => onSelect(i)} onClick={() => onSelect(i)}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
          </group>
        )
      })}
      <OrbitControls
        ref={controls}
        enablePan={false}
        enableZoom={false}
        autoRotate={!reduced && selected === null}
        autoRotateSpeed={0.55}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
      />
    </>
  )
}

export default function Globe(props: SceneProps & { active: boolean }) {
  return (
    <Canvas
      flat
      frameloop={!props.active ? 'never' : prefersReducedMotion() ? 'demand' : 'always'}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: 30, position: [1.1, 1.2, 4.3] }}
      role="img"
      aria-label="Globe with pins for places visited. Drag to rotate, or use the list of places."
      onCreated={({ gl }) => {
        gl.domElement.style.touchAction = 'pan-y'
      }}
    >
      <GlobeScene {...props} />
    </Canvas>
  )
}
