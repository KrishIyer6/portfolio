import { useEffect, useSyncExternalStore } from 'react'
import { ScrollTrigger } from './gsap'
import { sheets } from '../data/content'

let active = 'top'
const subs = new Set<() => void>()

export function useSectionTracker() {
  useEffect(() => {
    const triggers = sheets
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el)
      .map((el) =>
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => {
            if (!self.isActive) return
            active = el.id
            subs.forEach((f) => f())
          },
        }),
      )
    return () => triggers.forEach((t) => t.kill())
  }, [])
}

export function useActiveSection(): string {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb)
      return () => subs.delete(cb)
    },
    () => active,
  )
}
