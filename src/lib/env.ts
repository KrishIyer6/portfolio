export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const isFinePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches

let webgl: boolean | null = null
export function hasWebGL(): boolean {
  if (webgl !== null) return webgl
  try {
    const c = document.createElement('canvas')
    webgl = !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    webgl = false
  }
  return webgl
}

export function isLowPower(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number }
  const small = window.innerWidth < 820
  const weak = (nav.deviceMemory ?? 8) <= 4 || (nav.hardwareConcurrency ?? 8) <= 4
  return small || weak || !isFinePointer()
}

export const asset = (path: string) => import.meta.env.BASE_URL + path
