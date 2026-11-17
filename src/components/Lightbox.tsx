import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { images } from '../data/images'
import { lockScroll } from '../lib/scroll'
import { Chevron, Close } from './Icons'
import { SmartImage } from './SmartImage'

type Props = { slots: string[]; index: number | null; onIndex: (i: number | null) => void }

export function Lightbox({ slots, index, onIndex }: Props) {
  const panel = useRef<HTMLDivElement>(null)
  const open = index !== null

  useEffect(() => {
    if (!open) return
    const prevFocus = document.activeElement as HTMLElement | null
    lockScroll(true)
    panel.current?.querySelector<HTMLElement>('[data-close]')?.focus()
    return () => {
      lockScroll(false)
      prevFocus?.focus()
    }
  }, [open])

  useEffect(() => {
    if (index === null) return
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onIndex(null)
      }
      if (e.key === 'ArrowRight') onIndex((index + 1) % slots.length)
      if (e.key === 'ArrowLeft') onIndex((index - 1 + slots.length) % slots.length)
      if (e.key === 'Tab') {
        const f = Array.from(panel.current?.querySelectorAll<HTMLElement>('button') ?? [])
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', key, true)
    return () => window.removeEventListener('keydown', key, true)
  }, [index, slots.length, onIndex])

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div ref={panel} role="dialog" aria-modal="true" aria-label="Image viewer" className="fixed inset-0 z-[95] flex flex-col bg-paper/95 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onClick={() => onIndex(null)}>
          <div className="wrap flex items-center justify-between py-4">
            <p className="note tabular">
              {String(index + 1).padStart(2, '0')} / {String(slots.length).padStart(2, '0')}
              {images[slots[index]]?.caption ? `  ${images[slots[index]].caption}` : ''}
            </p>
            <button type="button" data-close className="btn" onClick={() => onIndex(null)}>
              <Close /> Close
            </button>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center gap-4 px-4 pb-8" onClick={(e) => e.stopPropagation()}>
            {slots.length > 1 && (
              <button type="button" className="btn !px-3" aria-label="Previous image" onClick={() => onIndex((index - 1 + slots.length) % slots.length)}>
                <Chevron className="rotate-180" />
              </button>
            )}
            <motion.div key={slots[index]} className="max-h-full w-full max-w-6xl" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}>
              <SmartImage slot={slots[index]} sizes="100vw" eager className="sheet mx-auto max-h-[78svh]" imgClassName="!object-contain" />
            </motion.div>
            {slots.length > 1 && (
              <button type="button" className="btn !px-3" aria-label="Next image" onClick={() => onIndex((index + 1) % slots.length)}>
                <Chevron />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
