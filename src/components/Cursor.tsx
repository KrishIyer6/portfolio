import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { isFinePointer, prefersReducedMotion } from '../lib/env'

const INTERACTIVE = 'a, button, [role="button"], summary, label, input, [data-cursor]'

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const d = dot.current
    const r = ring.current
    const l = label.current
    if (!d || !r || !l || !isFinePointer() || prefersReducedMotion()) return
    document.documentElement.classList.add('has-cursor')
    gsap.set([d, r], { xPercent: -50, yPercent: -50, autoAlpha: 0 })
    const dx = gsap.quickTo(d, 'x', { duration: 0.08, ease: 'power3' })
    const dy = gsap.quickTo(d, 'y', { duration: 0.08, ease: 'power3' })
    const rx = gsap.quickTo(r, 'x', { duration: 0.42, ease: 'power3' })
    const ry = gsap.quickTo(r, 'y', { duration: 0.42, ease: 'power3' })
    let shown = false
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      if (!shown) {
        shown = true
        gsap.set([d, r], { x: e.clientX, y: e.clientY })
        gsap.to([d, r], { autoAlpha: 1, duration: 0.3 })
      }
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
      const hit = (e.target as Element | null)?.closest?.(INTERACTIVE) as HTMLElement | null
      const text = hit?.closest<HTMLElement>('[data-cursor]')?.dataset.cursor ?? ''
      r.dataset.state = text ? 'label' : hit ? 'link' : 'idle'
      d.dataset.state = hit ? 'hidden' : 'idle'
      if (l.textContent !== text) l.textContent = text
    }
    const leave = () => {
      shown = false
      gsap.to([d, r], { autoAlpha: 0, duration: 0.2 })
    }
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  return (
    <div aria-hidden="true">
      <div
        ref={ring}
        data-state="idle"
        className="group pointer-events-none invisible fixed top-0 left-0 z-[90] grid size-9 place-items-center rounded-full border border-ink/70 transition-[width,height,background-color,border-color] duration-300 ease-[var(--ease-out)] data-[state=label]:size-20 data-[state=label]:border-accent data-[state=label]:bg-accent data-[state=link]:size-14 data-[state=link]:border-accent data-[state=link]:bg-accent/15"
      >
        <span ref={label} className="font-mono text-[0.6875rem] font-medium tracking-wider text-paper uppercase opacity-0 transition-opacity duration-200 group-data-[state=label]:opacity-100" />
      </div>
      <div ref={dot} data-state="idle" className="pointer-events-none invisible fixed top-0 left-0 z-[91] size-1.5 rounded-full bg-accent transition-transform duration-200 data-[state=hidden]:scale-0" />
    </div>
  )
}
