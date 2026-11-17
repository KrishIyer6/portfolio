import { useEffect, useRef } from 'react'
import { forceLink, forceSimulation, forceX, forceY, type SimulationLinkDatum, type SimulationNodeDatum } from 'd3-force'
import { select } from 'd3-selection'
import { skillGroups } from '../data/content'
import { prefersReducedMotion } from '../lib/env'

type Node = SimulationNodeDatum & { id: string; lines: string[]; group: string; hub: boolean; w: number; h: number; ax: number; ay: number }
type Link = SimulationLinkDatum<Node>

const wrap = (label: string): string[] => {
  if (label.length <= 20) return [label]
  const words = label.split(' ')
  let best = 1
  let bestDiff = Infinity
  for (let i = 1; i < words.length; i++) {
    const diff = Math.abs(words.slice(0, i).join(' ').length - words.slice(i).join(' ').length)
    if (diff < bestDiff) {
      bestDiff = diff
      best = i
    }
  }
  return [words.slice(0, best).join(' '), words.slice(best).join(' ')]
}

// Labels are boxes, so circles would waste space. Push overlapping boxes apart on the axis of least overlap.
function boxCollide(nodes: Node[], pad = 6) {
  return () => {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i]
        const b = nodes[j]
        const dx = (b.x ?? 0) - (a.x ?? 0)
        const dy = (b.y ?? 0) - (a.y ?? 0)
        const ox = (a.w + b.w) / 2 + pad - Math.abs(dx)
        const oy = (a.h + b.h) / 2 + pad - Math.abs(dy)
        if (ox <= 0 || oy <= 0) continue
        const ka = a.hub ? 0 : b.hub ? 1 : 0.5
        const kb = b.hub ? 0 : a.hub ? 1 : 0.5
        if (ox < oy) {
          const s = (dx < 0 ? -1 : 1) * ox * 0.6
          a.x! -= s * ka
          b.x! += s * kb
        } else {
          const s = (dy < 0 ? -1 : 1) * oy * 0.6
          a.y! -= s * ka
          b.y! += s * kb
        }
      }
    }
  }
}

export type Focus = { kind: 'skill' | 'group'; id: string } | null

export function Constellation({ onFocus }: { onFocus: (f: Focus) => void }) {
  const host = useRef<HTMLDivElement>(null)
  const cb = useRef(onFocus)
  cb.current = onFocus

  useEffect(() => {
    const el = host.current
    if (!el) return
    let sim: ReturnType<typeof forceSimulation<Node>> | null = null
    let lastW = 0

    const build = () => {
      const width = el.clientWidth
      if (!width || Math.abs(width - lastW) < 24) return
      lastW = width
      sim?.stop()
      const wide = width >= 860
      const cols = wide ? 3 : width >= 520 ? 2 : 1
      const rows = Math.ceil(skillGroups.length / cols)
      const height = wide ? 640 : cols === 2 ? 1020 : 1260
      const nodes: Node[] = []
      const links: Link[] = []
      skillGroups.forEach((g, gi) => {
        const ax = ((gi % cols) + 0.5) * (width / cols)
        const ay = (Math.floor(gi / cols) + 0.5) * (height / rows)
        const hub: Node = { id: `hub:${g.id}`, lines: [g.label], group: g.id, hub: true, w: g.label.length * 9.4 + 30, h: 34, ax, ay, x: ax, y: ay, fx: ax, fy: ay }
        nodes.push(hub)
        g.items.forEach((item, i) => {
          const lines = wrap(item)
          const angle = (i / g.items.length) * Math.PI * 2
          const n: Node = {
            id: item,
            lines,
            group: g.id,
            hub: false,
            w: Math.max(...lines.map((l) => l.length)) * 7.25 + 24,
            h: lines.length * 16 + 8,
            ax,
            ay,
            x: ax + Math.cos(angle) * 120,
            y: ay + Math.sin(angle) * 90,
          }
          nodes.push(n)
          links.push({ source: hub, target: n })
        })
      })

      const svg = select(el).selectAll<SVGSVGElement, null>('svg').data([null]).join('svg').attr('width', width).attr('height', height).attr('viewBox', `0 0 ${width} ${height}`)
      svg.selectAll('*').remove()
      const link = svg.append('g').selectAll('line').data(links).join('line').attr('stroke', 'var(--color-line)').attr('class', 'cn-link')
      const node = svg
        .append('g')
        .selectAll<SVGGElement, Node>('g')
        .data(nodes)
        .join('g')
        .attr('class', (d) => `cn-node ${d.hub ? 'cn-hub' : ''}`)
        .attr('data-group', (d) => d.group)
      node
        .append('rect')
        .attr('x', (d) => -d.w / 2)
        .attr('y', (d) => -d.h / 2)
        .attr('width', (d) => d.w)
        .attr('height', (d) => d.h)
        .attr('fill', 'transparent')
      node
        .append('circle')
        .attr('cx', (d) => -d.w / 2 + 7)
        .attr('r', (d) => (d.hub ? 5.5 : 3.5))
        .attr('class', 'cn-dot')
      node.each(function (d) {
        const t = select(this)
          .append('text')
          .attr('x', -d.w / 2 + (d.hub ? 20 : 17))
          .attr('class', 'cn-label')
        d.lines.forEach((l, i) =>
          t
            .append('tspan')
            .attr('x', -d.w / 2 + (d.hub ? 20 : 17))
            .attr('y', (i - (d.lines.length - 1) / 2) * 16 + (d.hub ? 7 : 4))
            .text(l),
        )
      })

      const setFocus = (d: Node | null) => {
        svg.classed('cn-focus', !!d)
        node.classed('on', (n) => !!d && (d.hub ? n.group === d.group : n.id === d.id || (n.hub && n.group === d.group)))
        link.classed('on', (l) => !!d && (d.hub ? (l.source as Node).group === d.group : (l.target as Node).id === d.id))
        cb.current(d ? { kind: d.hub ? 'group' : 'skill', id: d.hub ? d.group : d.id } : null)
      }
      node.on('pointerenter', (_, d) => setFocus(d)).on('pointerleave', () => setFocus(null))

      const place = () => {
        for (const n of nodes) {
          n.x = Math.min(width - n.w / 2 - 2, Math.max(n.w / 2 + 2, n.x ?? 0))
          n.y = Math.min(height - n.h / 2 - 2, Math.max(n.h / 2 + 2, n.y ?? 0))
        }
        link
          .attr('x1', (l) => (l.source as Node).x! - (l.source as Node).w / 2 + 7)
          .attr('y1', (l) => (l.source as Node).y!)
          .attr('x2', (l) => (l.target as Node).x! - (l.target as Node).w / 2 + 7)
          .attr('y2', (l) => (l.target as Node).y!)
        node.attr('transform', (d) => `translate(${d.x} ${d.y})`)
      }

      sim = forceSimulation(nodes)
        .force('link', forceLink<Node, Link>(links).distance(wide ? 96 : 84).strength(0.25))
        .force('x', forceX<Node>((d) => d.ax).strength(0.05))
        .force('y', forceY<Node>((d) => d.ay).strength(0.09))
        .force('box', boxCollide(nodes))
        .alphaDecay(0.022)
        .on('tick', place)
      if (prefersReducedMotion()) {
        sim.stop()
        sim.tick(320)
        place()
      }
    }

    build()
    const ro = new ResizeObserver(build)
    ro.observe(el)
    return () => {
      ro.disconnect()
      sim?.stop()
    }
  }, [])

  return <div ref={host} role="img" aria-label="Constellation of skills grouped into six categories. The list view has the same content as text." className="constellation w-full" />
}
