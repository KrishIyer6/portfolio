import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'
import { prefersReducedMotion } from './env'

let lenis: Lenis | null = null
let locks = 0

export function startSmoothScroll(): () => void {
  if (prefersReducedMotion()) return () => {}
  lenis = new Lenis({ lerp: 0.115, anchors: true })
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -56 })
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

export function lockScroll(lock: boolean) {
  locks = Math.max(0, locks + (lock ? 1 : -1))
  if (locks > 0) {
    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
  } else {
    lenis?.start()
    document.documentElement.style.overflow = ''
  }
}
