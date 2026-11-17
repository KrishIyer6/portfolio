import { useEffect, useRef } from 'react'
import { select } from 'd3-selection'
import { scaleLinear } from 'd3-scale'
import { easeCubicOut } from 'd3-ease'
import 'd3-transition'
import { results } from '../data/content'
import { prefersReducedMotion } from '../lib/env'

const ROW = 76
const TOP = 8
const AXIS = 34

export function ResultsChart() {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = host.current
    if (!el) return
    let played = false
    let visible = false

    const draw = (animate: boolean) => {
      const width = el.clientWidth
      const height = TOP + results.rows.length * ROW + AXIS
      const x = scaleLinear().domain([0, 1]).range([0, width - 1])
      const svg = select(el).selectAll<SVGSVGElement, null>('svg').data([null]).join('svg').attr('width', width).attr('height', height).attr('aria-hidden', 'true')
      svg.selectAll('*').remove()

      const ticks = [0, 0.25, 0.5, 0.75, 1]
      const axis = svg.append('g').attr('transform', `translate(0.5 ${TOP})`)
      axis
        .selectAll('line')
        .data(ticks)
        .join('line')
        .attr('x1', (d) => x(d))
        .attr('x2', (d) => x(d))
        .attr('y1', 0)
        .attr('y2', results.rows.length * ROW + 6)
        .attr('stroke', 'var(--color-line)')
        .attr('stroke-dasharray', (d) => (d === 0 || d === 1 ? null : '2 4'))
      axis
        .selectAll('text')
        .data(ticks)
        .join('text')
        .attr('x', (d) => x(d))
        .attr('y', results.rows.length * ROW + 24)
        .attr('text-anchor', (d) => (d === 0 ? 'start' : d === 1 ? 'end' : 'middle'))
        .attr('fill', 'var(--color-faint)')
        .attr('font-family', 'var(--font-mono)')
        .attr('font-size', 12)
        .text((d) => d.toFixed(2))

      const rows = svg
        .append('g')
        .selectAll('g')
        .data(results.rows)
        .join('g')
        .attr('transform', (_, i) => `translate(0.5 ${TOP + i * ROW})`)
      rows.append('text').attr('y', 18).attr('fill', 'var(--color-ink)').attr('font-size', 15).text((d) => d.label)
      rows.append('text').attr('y', 18).attr('x', width - 1).attr('text-anchor', 'end').attr('fill', 'var(--color-faint)').attr('font-family', 'var(--font-mono)').attr('font-size', 12).text((d) => d.context).attr('display', width < 560 ? 'none' : null)
      rows.append('line').attr('x1', 0).attr('x2', width - 1).attr('y1', 38).attr('y2', 38).attr('stroke', 'var(--color-line-strong)')

      const bars = rows.append('rect').attr('y', 34).attr('height', 8).attr('fill', 'var(--color-accent)').attr('width', 0)
      const marks = rows.append('g').attr('transform', 'translate(0 0)')
      marks.append('line').attr('y1', 27).attr('y2', 49).attr('stroke', 'var(--color-ink)').attr('stroke-width', 1.5)
      const values = marks.append('text').attr('y', 62).attr('text-anchor', 'end').attr('x', -6).attr('fill', 'var(--color-accent)').attr('font-family', 'var(--font-mono)').attr('font-size', 13).text((d) => d.display)

      if (animate) {
        values.attr('opacity', 0)
        bars
          .transition()
          .delay((_, i) => i * 140)
          .duration(1300)
          .ease(easeCubicOut)
          .attr('width', (d) => x(d.value))
        marks
          .transition()
          .delay((_, i) => i * 140)
          .duration(1300)
          .ease(easeCubicOut)
          .attr('transform', (d) => `translate(${x(d.value)} 0)`)
        values
          .transition()
          .delay((_, i) => i * 140 + 700)
          .duration(500)
          .attr('opacity', 1)
      } else {
        bars.attr('width', (d) => x(d.value))
        marks.attr('transform', (d) => `translate(${x(d.value)} 0)`)
      }
    }

    draw(false)
    select(el).select('svg').style('opacity', prefersReducedMotion() ? 1 : 0)
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting
        if (visible && !played) {
          played = true
          draw(!prefersReducedMotion())
          select(el).select('svg').style('opacity', 1)
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    const ro = new ResizeObserver(() => played && draw(false))
    ro.observe(el)
    return () => {
      io.disconnect()
      ro.disconnect()
    }
  }, [])

  return (
    <figure className="sheet p-[clamp(1.25rem,3vw,2.5rem)]">
      <figcaption className="mb-6 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <h3 className="display text-3xl">{results.heading}</h3>
        <p className="note">{results.note}</p>
      </figcaption>
      <div ref={host} />
      <div className="sr-only">
      <table>
        <caption>{results.heading}</caption>
        <tbody>
          {results.rows.map((r) => (
            <tr key={r.label}>
              <th scope="row">
                {r.label}, {r.context}
              </th>
              <td>{r.display}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </figure>
  )
}
