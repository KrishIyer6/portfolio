import { useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { gsap, useGSAP } from '../lib/gsap'
import { useActiveSection } from '../lib/sections'
import { sheets } from '../data/content'

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    gsap.to(bar.current, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } })
  })
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-0.5">
      <div ref={bar} className="h-full origin-left scale-x-0 bg-accent" />
    </div>
  )
}

// The drawing's title block: which sheet of the set you are looking at.
export function SheetIndex() {
  const active = useActiveSection()
  const index = Math.max(0, sheets.findIndex((s) => s.id === active))
  const no = String(index + 1).padStart(2, '0')
  return (
        <div aria-hidden="true" className="hidden items-stretch border border-line font-mono text-[0.6875rem] tracking-wider text-dim uppercase xl:flex">
      <div className="border-r border-line px-2.5 py-1.5 text-faint">Sheet</div>
      <div className="tabular flex w-[4.5rem] gap-1 overflow-hidden px-2.5 py-1.5">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={no} className="inline-block text-ink" initial={{ y: '110%' }} animate={{ y: '0%' }} exit={{ y: '-110%' }} transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}>
            {no}
          </motion.span>
        </AnimatePresence>
        <span className="text-faint">/ {String(sheets.length).padStart(2, '0')}</span>
      </div>
    </div>
  )
}
