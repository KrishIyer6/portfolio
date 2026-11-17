import { useSyncExternalStore } from 'react'

type Origin = { x: number; y: number; w: number; h: number } | null
type State = { id: string | null; origin: Origin }

let state: State = { id: null, origin: null }
const subs = new Set<() => void>()
const emit = () => subs.forEach((f) => f())

export function openProject(id: string, from?: Element | null) {
  const r = from?.getBoundingClientRect()
  state = { id, origin: r ? { x: r.left, y: r.top, w: r.width, h: r.height } : null }
  emit()
}
export function closeProject() {
  state = { ...state, id: null }
  emit()
}
export function useProjectState(): State {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb)
      return () => subs.delete(cb)
    },
    () => state,
  )
}
