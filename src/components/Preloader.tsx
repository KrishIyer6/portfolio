import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/env'

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => v / 16)
const CELL = 10

// Ordered-dither dissolve: the ink sheet breaks into a 4x4 Bayer pattern from the top down.
function drawDither(canvas: HTMLCanvasElement, progress: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const cols = canvas.width
  const rows = canvas.height
  ctx.clearRect(0, 0, cols, rows)
  ctx.fillStyle = '#fbfcf8'
  for (let y = 0; y < rows; y++) {
    const bias = (y / rows) * 0.6
    for (let x = 0; x < cols; x++) {
      if (BAYER[(y % 4) * 4 + (x % 4)] * 0.4 + bias >= progress) ctx.fillRect(x, y, 1, 1)
    }
  }
}

export function Preloader({ onDone }: { onDone: () => void }) {
  const [gone, setGone] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const count = useRef<HTMLSpanElement>(null)
  const done = useRef(onDone)
  done.current = onDone

  useEffect(() => {
    const el = root.current
    const cv = canvas.current
    if (!el || !cv) return
    if (prefersReducedMotion()) {
      done.current()
      setGone(true)
      return
    }
    cv.width = Math.ceil(window.innerWidth / CELL)
    cv.height = Math.ceil(window.innerHeight / CELL)
    let exiting = false
    const exit = () => {
      if (exiting) return
      exiting = true
      intro.kill()
      done.current()
      const state = { p: 0 }
      drawDither(cv, 0)
      gsap.set(el, { backgroundColor: 'transparent' })
      gsap.set('.pre-content', { autoAlpha: 0 })
      gsap.to(state, { p: 1.02, duration: 0.7, ease: 'power2.inOut', onUpdate: () => drawDither(cv, state.p), onComplete: () => setGone(true) })
    }
    const num = { v: 0 }
    const intro = gsap.timeline()
    intro
      .fromTo('.pre-plan path', { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.9, stagger: 0.07, ease: 'power2.inOut' }, 0)
      .to(num, { v: 100, duration: 1, ease: 'power1.inOut', onUpdate: () => count.current && (count.current.textContent = String(Math.round(num.v)).padStart(3, '0')) }, 0)
    const fonts = Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))])
    Promise.all([fonts, intro.then()]).then(exit)
    const skip = () => exit()
    // If the tab is in the background the ticker stalls; never let the sheet cover the page for long.
    const failsafe = window.setTimeout(() => {
      done.current()
      setGone(true)
    }, 4000)
    window.addEventListener('keydown', skip)
    el.addEventListener('pointerdown', skip)
    return () => {
      window.removeEventListener('keydown', skip)
      el.removeEventListener('pointerdown', skip)
      window.clearTimeout(failsafe)
      intro.kill()
    }
  }, [])

  if (gone) return null
  return (
    <div ref={root} role="status" aria-label="Loading" className="fixed inset-0 z-[100] bg-paper">
      <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 size-full" style={{ imageRendering: 'pixelated' }} />
      <div className="pre-content absolute inset-0 grid place-items-center">
        <div className="flex flex-col items-center gap-5">
          <svg className="pre-plan w-28 text-draw" viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
            <path d="M60 6 112 26 60 46 8 26z" />
            <path d="M8 40 60 60 112 40" />
            <path d="M8 54 60 74 112 54" />
            <path d="M60 46v28" strokeDasharray="2 3" />
          </svg>
          <p className="note tabular">
            Stacking layers <span ref={count}>000</span>
          </p>
          <p className="note text-[0.6875rem] opacity-70">Press any key to skip</p>
        </div>
      </div>
    </div>
  )
}
