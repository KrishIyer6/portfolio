// Pure geometry data for the procedural building. No three.js import, so the SVG fallback can share it.

export const W = 6
export const D = 4
export const H = 1.1
export const MAX_FLOORS = 5
export const CELL = 0.5
export const COLS = W / CELL
export const ROWS = D / CELL

export type RoofKind = 'flat' | 'gable' | 'hip'
export const ROOFS: Record<RoofKind, { inset: number; height: number }> = {
  flat: { inset: D / 2 + 0.15, height: 0.14 },
  gable: { inset: 0, height: 1.3 },
  hip: { inset: D / 2 + 0.15, height: 1.2 },
}

export type Wall = { x1: number; z1: number; x2: number; z2: number }
export type Opening = { wall: 'front' | 'back' | 'left' | 'right'; c: number; w: number; y0: number; y1: number; door: boolean }

const BASE_WALLS: Wall[] = [
  { x1: -3, z1: -0.5, x2: -2.5, z2: -0.5 },
  { x1: -2, z1: -0.5, x2: 0, z2: -0.5 },
  { x1: 0.5, z1: -0.5, x2: 1, z2: -0.5 },
  { x1: -1, z1: -2, x2: -1, z2: -0.5 },
  { x1: 1, z1: -2, x2: 1, z2: -1.5 },
  { x1: 1, z1: -1, x2: 1, z2: 1.5 },
  { x1: 1, z1: 1, x2: 3, z2: 1 },
  { x1: -1.5, z1: 0.5, x2: -1.5, z2: 2 },
]

export function walls(floor: number): Wall[] {
  const m = floor % 2 === 0 ? 1 : -1
  return BASE_WALLS.map((p) => ({ x1: p.x1 * m, z1: p.z1, x2: p.x2 * m, z2: p.z2 }))
}

export function openings(floor: number): Opening[] {
  const o: Opening[] = []
  const y0 = H * 0.34
  const y1 = H * 0.8
  for (const c of [-2.25, -1.25, 1.25, 2.25]) {
    o.push({ wall: 'front', c, w: 0.5, y0, y1, door: false })
    o.push({ wall: 'back', c, w: 0.5, y0, y1, door: false })
  }
  o.push({ wall: 'back', c: 0, w: 0.5, y0, y1, door: false })
  if (floor === 0) o.push({ wall: 'front', c: -0.25, w: 0.5, y0: 0, y1: H * 0.8, door: true })
  else o.push({ wall: 'front', c: 0, w: 0.5, y0, y1, door: false })
  for (const c of [-1.25, 0, 1.25]) {
    o.push({ wall: 'left', c, w: 0.5, y0, y1, door: false })
    o.push({ wall: 'right', c, w: 0.5, y0, y1, door: false })
  }
  return o
}

export function openingCorners(o: Opening, out = 0): [number, number, number][] {
  const a = o.c - o.w / 2
  const b = o.c + o.w / 2
  const hw = W / 2 + out
  const hd = D / 2 + out
  switch (o.wall) {
    case 'front':
      return [[a, o.y0, hd], [b, o.y0, hd], [b, o.y1, hd], [a, o.y1, hd]]
    case 'back':
      return [[b, o.y0, -hd], [a, o.y0, -hd], [a, o.y1, -hd], [b, o.y1, -hd]]
    case 'left':
      return [[-hw, o.y0, a], [-hw, o.y0, b], [-hw, o.y1, b], [-hw, o.y1, a]]
    default:
      return [[hw, o.y0, b], [hw, o.y0, a], [hw, o.y1, a], [hw, o.y1, b]]
  }
}

export function floorSegments(floor: number): number[] {
  const s: number[] = []
  const hw = W / 2
  const hd = D / 2
  const m = floor % 2 === 0 ? 1 : -1
  const rect = (y: number) => {
    s.push(-hw, y, -hd, hw, y, -hd, hw, y, -hd, hw, y, hd, hw, y, hd, -hw, y, hd, -hw, y, hd, -hw, y, -hd)
  }
  rect(0)
  for (const p of walls(floor)) s.push(p.x1, 0.012, p.z1, p.x2, 0.012, p.z2)
  for (let t = 0; t <= 5; t++) {
    const x = (1.6 + t * 0.2) * m
    s.push(x, 0.012, -1.85, x, 0.012, -1.1)
  }
  s.push(1.6 * m, 0.012, -1.85, 2.6 * m, 0.012, -1.85, 1.6 * m, 0.012, -1.1, 2.6 * m, 0.012, -1.1)
  for (const [x, z] of [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]]) s.push(x, 0, z, x, H, z)
  for (const o of openings(floor)) {
    const c = openingCorners(o, 0.004)
    for (let i = 0; i < 4; i++) s.push(...c[i], ...c[(i + 1) % 4])
  }
  rect(H)
  return s
}

// Six roof vertices: four eaves corners then two ridge ends. Flat, gable and hip share this topology,
// so one roof morphs into another by tweening inset and height.
export function roofVertices(inset: number, height: number): number[] {
  const o = 0.16
  const hw = W / 2 + o
  const hd = D / 2 + o
  const rx = Math.max(hw - inset, 0.001)
  return [-hw, 0, hd, hw, 0, hd, hw, 0, -hd, -hw, 0, -hd, -rx, height, 0, rx, height, 0]
}
export const ROOF_TRIS = [0, 1, 5, 0, 5, 4, 2, 3, 4, 2, 4, 5, 3, 0, 4, 1, 2, 5, 0, 2, 1, 0, 3, 2]
export const ROOF_EDGES = [0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 0, 4, 3, 4, 1, 5, 2, 5]

export function roofSegments(inset: number, height: number): number[] {
  const v = roofVertices(inset, height)
  const s: number[] = []
  for (const i of ROOF_EDGES) s.push(v[i * 3], v[i * 3 + 1], v[i * 3 + 2])
  return s
}

// ---- Fire escape routing on the ground floor grid (Dijkstra, uniform cost) ----

export type Cell = { cx: number; cz: number }
export type Route = { points: [number, number][]; exit: 'door' | 'window'; fire: [number, number]; start: [number, number] }

export const cellCenter = (c: Cell): [number, number] => [-W / 2 + CELL / 2 + c.cx * CELL, -D / 2 + CELL / 2 + c.cz * CELL]
const key = (c: Cell) => c.cz * COLS + c.cx

function blockedBetween(a: Cell, b: Cell, ws: Wall[]): boolean {
  const [ax, az] = cellCenter(a)
  const [bx, bz] = cellCenter(b)
  const mx = (ax + bx) / 2
  const mz = (az + bz) / 2
  const eps = 0.01
  for (const w of ws) {
    if (a.cz === b.cz && Math.abs(w.x1 - w.x2) < eps && Math.abs(w.x1 - mx) < eps) {
      if (mz > Math.min(w.z1, w.z2) && mz < Math.max(w.z1, w.z2)) return true
    }
    if (a.cx === b.cx && Math.abs(w.z1 - w.z2) < eps && Math.abs(w.z1 - mz) < eps) {
      if (mx > Math.min(w.x1, w.x2) && mx < Math.max(w.x1, w.x2)) return true
    }
  }
  return false
}

export const FIRE_PRESETS: { fire: Cell; label: string }[] = [
  { fire: { cx: 7, cz: 2 }, label: 'Fire in the back room' },
  { fire: { cx: 5, cz: 6 }, label: 'Fire at the front door' },
  { fire: { cx: 1, cz: 3 }, label: 'Fire outside the bedroom' },
]
const START: Cell = { cx: 1, cz: 1 }
const DOOR: Cell = { cx: 5, cz: 7 }
const WINDOWS: { cell: Cell; out: [number, number] }[] = [
  ...[1, 3, 8, 10].flatMap((cx) => [
    { cell: { cx, cz: 0 }, out: [0, -1] as [number, number] },
    { cell: { cx, cz: ROWS - 1 }, out: [0, 1] as [number, number] },
  ]),
  ...[1, 4, 6].flatMap((cz) => [
    { cell: { cx: 0, cz }, out: [-1, 0] as [number, number] },
    { cell: { cx: COLS - 1, cz }, out: [1, 0] as [number, number] },
  ]),
]

export function planRoute(preset: number): Route {
  const ws = walls(0)
  const fire = FIRE_PRESETS[preset % FIRE_PRESETS.length].fire
  const burning = new Set<number>()
  for (const [dx, dz] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const c = { cx: fire.cx + dx, cz: fire.cz + dz }
    if (c.cx >= 0 && c.cx < COLS && c.cz >= 0 && c.cz < ROWS && !blockedBetween(fire, c, ws)) burning.add(key(c))
  }
  const dist = new Map<number, number>([[key(START), 0]])
  const prev = new Map<number, Cell>()
  const queue: Cell[] = [START]
  const done = new Set<number>()
  while (queue.length) {
    queue.sort((a, b) => dist.get(key(a))! - dist.get(key(b))!)
    const cur = queue.shift()!
    if (done.has(key(cur))) continue
    done.add(key(cur))
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const n = { cx: cur.cx + dx, cz: cur.cz + dz }
      if (n.cx < 0 || n.cx >= COLS || n.cz < 0 || n.cz >= ROWS) continue
      if (burning.has(key(n)) || blockedBetween(cur, n, ws)) continue
      const nd = dist.get(key(cur))! + 1
      if (nd < (dist.get(key(n)) ?? Infinity)) {
        dist.set(key(n), nd)
        prev.set(key(n), cur)
        queue.push(n)
      }
    }
  }
  let goal: Cell = DOOR
  let out: [number, number] = [0, 1]
  let exit: Route['exit'] = 'door'
  if (!dist.has(key(DOOR))) {
    exit = 'window'
    const reachable = WINDOWS.filter((w) => dist.has(key(w.cell))).sort((a, b) => dist.get(key(a.cell))! - dist.get(key(b.cell))!)
    goal = reachable[0]?.cell ?? START
    out = reachable[0]?.out ?? [0, -1]
  }
  const cells: Cell[] = []
  let c: Cell | undefined = goal
  while (c) {
    cells.unshift(c)
    c = prev.get(key(c))
  }
  const points = cells.map(cellCenter)
  const last = points[points.length - 1]
  points.push([last[0] + out[0] * 0.7, last[1] + out[1] * 0.7])
  return { points, exit, fire: cellCenter(fire), start: cellCenter(START) }
}
