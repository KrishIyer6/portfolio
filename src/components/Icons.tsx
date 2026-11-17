import type { SVGProps } from 'react'

const base = { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'square' as const, 'aria-hidden': true }

export const ArrowOut = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M4 12 12 4M5.5 4H12v6.5" />
  </svg>
)
export const ArrowDown = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M8 2.5v11M3.5 9 8 13.5 12.5 9" />
  </svg>
)
export const Download = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M8 2v8M4.5 6.5 8 10l3.5-3.5M2.5 13.5h11" />
  </svg>
)
export const Copy = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M5.5 5.5h8v8h-8zM2.5 10.5v-8h8" />
  </svg>
)
export const Check = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="m2.5 8.5 3.5 3.5 7.5-8" />
  </svg>
)
export const Close = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="m3 3 10 10M13 3 3 13" />
  </svg>
)
export const Play = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M4.5 2.5v11l9-5.5z" />
  </svg>
)
export const Plus = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M8 3v10M3 8h10" />
  </svg>
)
export const Minus = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M3 8h10" />
  </svg>
)
export const Chevron = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="m6 3 5 5-5 5" />
  </svg>
)
