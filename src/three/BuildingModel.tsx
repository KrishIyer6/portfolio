import { useEffect, useMemo, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { D, H, MAX_FLOORS, ROOF_TRIS, W, floorSegments, openingCorners, openings, roofSegments, roofVertices, walls } from './building'

export type BuildState = {
  reveal: number
  floors: number
  roof: number
  roofInset: number
  roofHeight: number
  solid: number
  lit: number
  cut: number
  ghost: number
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const LINE = new THREE.Color(0.06, 0.09, 0.16)
const AMBER = new THREE.Color(0.14, 0.28, 0.98)
const WALL_T = 0.09

function box(w: number, h: number, d: number, x: number, y: number, z: number) {
  const g = new THREE.BoxGeometry(w, h, d)
  g.translate(x, y, z)
  return g
}

function buildFloor(i: number, plane: THREE.Plane) {
  const group = new THREE.Group()
  const segs = floorSegments(i)
  const lineGeo = new THREE.BufferGeometry()
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(segs, 3))
  const lineMat = new THREE.LineBasicMaterial({ color: LINE, transparent: true, clippingPlanes: [plane], toneMapped: false })
  const lines = new THREE.LineSegments(lineGeo, lineMat)
  lines.renderOrder = 3

  const shell = [
    box(W, H, WALL_T, 0, H / 2, D / 2 - WALL_T / 2),
    box(W, H, WALL_T, 0, H / 2, -D / 2 + WALL_T / 2),
    box(WALL_T, H, D, -W / 2 + WALL_T / 2, H / 2, 0),
    box(WALL_T, H, D, W / 2 - WALL_T / 2, H / 2, 0),
  ]
  const inner = walls(i).map((p) => {
    const len = Math.hypot(p.x2 - p.x1, p.z2 - p.z1)
    const horizontal = Math.abs(p.z1 - p.z2) < 0.01
    return box(horizontal ? len : 0.06, H * 0.9, horizontal ? 0.06 : len, (p.x1 + p.x2) / 2, H * 0.45, (p.z1 + p.z2) / 2)
  })
  const wallGeo = mergeGeometries([...shell, ...inner])
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xf6f7f2, roughness: 0.95, transparent: true, side: THREE.DoubleSide, clippingPlanes: [plane] })
  const wallMesh = new THREE.Mesh(wallGeo, wallMat)

  const slabGeo = box(W - 0.02, 0.05, D - 0.02, 0, 0.025, 0)
  const slabMat = new THREE.MeshStandardMaterial({ color: 0xe4e7dd, emissive: new THREE.Color(0.14, 0.28, 0.98), emissiveIntensity: 0, roughness: 0.9, transparent: true, clippingPlanes: [plane] })
  const slabMesh = new THREE.Mesh(slabGeo, slabMat)

  const quads: number[] = []
  for (const o of openings(i)) {
    const c = openingCorners(o, 0.012)
    quads.push(...c[0], ...c[1], ...c[2], ...c[0], ...c[2], ...c[3])
  }
  const winGeo = new THREE.BufferGeometry()
  winGeo.setAttribute('position', new THREE.Float32BufferAttribute(quads, 3))
  const winMat = new THREE.MeshBasicMaterial({ color: AMBER, transparent: true, opacity: 0, side: THREE.DoubleSide, clippingPlanes: [plane], toneMapped: false })
  const winMesh = new THREE.Mesh(winGeo, winMat)
  winMesh.renderOrder = 2

  group.add(wallMesh, slabMesh, winMesh, lines)
  return { group, lines, segCount: segs.length / 6, lineMat, wallMat, slabMat, winMat, wallMesh, slabMesh, winMesh }
}

function buildModel() {
  const root = new THREE.Group()
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 100)
  const floors = Array.from({ length: MAX_FLOORS }, (_, i) => buildFloor(i, plane))
  floors.forEach((f) => root.add(f.group))

  const roof = new THREE.Group()
  const roofGeo = new THREE.BufferGeometry()
  roofGeo.setAttribute('position', new THREE.Float32BufferAttribute(roofVertices(0, 1), 3))
  roofGeo.setIndex(ROOF_TRIS)
  const roofMat = new THREE.MeshStandardMaterial({ color: 0xdfe3d8, roughness: 0.95, transparent: true, side: THREE.DoubleSide, clippingPlanes: [plane], flatShading: true })
  const roofMesh = new THREE.Mesh(roofGeo, roofMat)
  const roofLineGeo = new THREE.BufferGeometry()
  roofLineGeo.setAttribute('position', new THREE.Float32BufferAttribute(roofSegments(0, 1), 3))
  const roofLineMat = new THREE.LineBasicMaterial({ color: LINE, transparent: true, clippingPlanes: [plane], toneMapped: false })
  const roofLines = new THREE.LineSegments(roofLineGeo, roofLineMat)
  roofLines.renderOrder = 3
  roof.add(roofMesh, roofLines)
  root.add(roof)

  const cutGeo = new THREE.BufferGeometry()
  const hx = W / 2 + 0.5
  cutGeo.setAttribute('position', new THREE.Float32BufferAttribute([-hx, 0, 0, hx, 0, 0, hx, 1, 0, -hx, 1, 0], 3))
  const cutMat = new THREE.LineBasicMaterial({ color: new THREE.Color(0.14, 0.28, 0.98), transparent: true, toneMapped: false })
  const cutFrame = new THREE.LineLoop(cutGeo, cutMat)
  cutFrame.renderOrder = 4
  root.add(cutFrame)

  return { root, plane, floors, roof, roofGeo, roofMat, roofMesh, roofLineGeo, roofLineMat, roofLines, cutFrame, cutMat, last: { inset: -1, height: -1 } }
}

export function BuildingModel({ sref }: { sref: RefObject<BuildState> }) {
  const gl = useThree((s) => s.gl)
  const model = useMemo(buildModel, [])

  useEffect(() => {
    gl.localClippingEnabled = true
    return () => {
      model.root.traverse((o) => {
        const m = o as THREE.Mesh
        m.geometry?.dispose()
        const mat = m.material as THREE.Material | THREE.Material[] | undefined
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
        else mat?.dispose()
      })
    }
  }, [gl, model])

  useFrame(() => {
    const s = sref.current
    if (!s) return
    const nVis = Math.max(1, Math.ceil(s.floors - 0.001))
    const fade = 1 - s.ghost * 0.86
    let y = 0
    model.floors.forEach((f, i) => {
      const k = clamp01(s.floors - i)
      f.group.visible = k > 0.002
      f.group.position.y = y
      f.group.scale.y = Math.max(k, 0.002)
      y += k * H
      const r = clamp01(s.reveal * (nVis + 1) - i)
      f.lines.geometry.setDrawRange(0, Math.floor(f.segCount * r) * 2)
      f.lineMat.opacity = k * (1 - 0.25 * s.solid * fade)
      const o = s.solid * k * fade
      f.wallMesh.visible = f.slabMesh.visible = o > 0.01
      f.wallMat.opacity = o
      f.wallMat.depthWrite = o > 0.9
      f.slabMat.opacity = i === 0 ? s.solid * k : o
      const lit = clamp01(s.lit * 1.9 - i * 0.22) * k
      f.slabMat.emissiveIntensity = lit * 0.16
      f.winMesh.visible = lit > 0.01
      f.winMat.opacity = lit * (0.35 + 0.65 * fade)
    })

    if (model.last.inset !== s.roofInset || model.last.height !== s.roofHeight) {
      model.last.inset = s.roofInset
      model.last.height = s.roofHeight
      const pos = model.roofGeo.getAttribute('position') as THREE.BufferAttribute
      pos.set(roofVertices(s.roofInset, s.roofHeight))
      pos.needsUpdate = true
      model.roofGeo.computeVertexNormals()
      const lp = model.roofLineGeo.getAttribute('position') as THREE.BufferAttribute
      lp.set(roofSegments(s.roofInset, s.roofHeight))
      lp.needsUpdate = true
    }
    model.roof.visible = s.roof > 0.002
    model.roof.position.y = y
    model.roof.scale.y = Math.max(s.roof, 0.002)
    model.roofLines.geometry.setDrawRange(0, Math.floor(9 * clamp01(s.reveal * (nVis + 1) - nVis)) * 2)
    model.roofLineMat.opacity = 1 - 0.25 * s.solid * fade
    model.roofMesh.visible = s.solid * fade > 0.01
    model.roofMat.opacity = s.solid * fade
    model.roofMat.depthWrite = s.solid * fade > 0.9

    const cutZ = THREE.MathUtils.lerp(D / 2 + 0.6, 0.2, s.cut)
    model.plane.constant = s.cut > 0.001 ? cutZ : 100
    model.cutFrame.visible = s.cut > 0.01 && s.cut < 0.995
    model.cutFrame.position.z = cutZ
    model.cutFrame.scale.y = y + s.roofHeight * s.roof + 0.4
    model.cutMat.opacity = Math.sin(Math.PI * clamp01(s.cut)) * 0.9 + 0.1
  })

  return <primitive object={model.root} />
}
