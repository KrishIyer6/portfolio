import { useRef } from 'react'
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap'
import type { Metric } from '../data/content'

const format = (m: Metric, v: number) => `${m.prefix ?? ''}${v.toFixed(m.decimals ?? 0)}${m.suffix ?? ''}`

export function CountUp({ metric, className = '' }: { metric: Metric; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useGSAP(() => {
    const el = ref.current
    if (!el) return
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      const state = { v: 0 }
      gsap.to(state, {
        v: metric.value,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        onStart: () => (el.textContent = format(metric, 0)),
        onUpdate: () => (el.textContent = format(metric, state.v)),
      })
    })
  })
  return (
    <span ref={ref} className={`tabular ${className}`}>
      {format(metric, metric.value)}
    </span>
  )
}
