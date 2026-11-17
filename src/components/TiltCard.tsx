import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from '../lib/gsap'
import { isFinePointer, prefersReducedMotion } from '../lib/env'

// 3D tilt toward the pointer plus a light that follows it.
export function TiltCard({ children, className = '', max = 5 }: { children: ReactNode; className?: string; max?: number }) {
  const outer = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const light = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const o = outer.current
    const el = inner.current
    const l = light.current
    if (!o || !el || !l || !isFinePointer() || prefersReducedMotion()) return
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3' })
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3' })
    const move = (e: PointerEvent) => {
      const r = o.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      rx((0.5 - py) * max * 2)
      ry((px - 0.5) * max * 2)
      l.style.background = `radial-gradient(420px circle at ${px * 100}% ${py * 100}%, rgb(36 71 249 / 0.1), transparent 60%)`
      l.style.opacity = '1'
    }
    const leave = () => {
      rx(0)
      ry(0)
      l.style.opacity = '0'
    }
    o.addEventListener('pointermove', move)
    o.addEventListener('pointerleave', leave)
    return () => {
      o.removeEventListener('pointermove', move)
      o.removeEventListener('pointerleave', leave)
      gsap.killTweensOf(el)
    }
  }, [max])

  return (
    <div ref={outer} className={className} style={{ perspective: '1100px' }}>
      <div ref={inner} className="relative h-full will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
        {children}
        <div ref={light} aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300" />
      </div>
    </div>
  )
}
