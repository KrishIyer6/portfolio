import { useState, type ReactNode } from 'react'
import { generatedImages, images } from '../data/images'
import { asset, prefersReducedMotion } from '../lib/env'

export const slotAvailable = (slot: string) => slot in generatedImages
export const anyAvailable = (slots: string[]) => slots.some(slotAvailable)

const srcset = (slot: string, format: string) =>
  generatedImages[slot].widths.map((w) => `${asset(`images/${slot}-${w}.${format}`)} ${w}w`).join(', ')

export function SlotFallback({ slot, children }: { slot: string; children?: ReactNode }) {
  const meta = images[slot]
  return (
    <div className="hatch absolute inset-0 grid place-items-center bg-panel">
      {children ?? (
        <svg className="h-1/3 max-h-16 text-line-strong" viewBox="0 0 40 40" fill="none" stroke="currentColor" aria-hidden="true">
          <path d="M20 4v32M4 20h32" />
          <circle cx="20" cy="20" r="9" />
        </svg>
      )}
      {meta?.caption && <span className="note absolute bottom-2 left-3">{meta.caption}</span>}
      {import.meta.env.DEV && <span className="absolute top-2 left-3 font-mono text-[0.6875rem] text-accent">add image-source/{slot}.jpg</span>}
    </div>
  )
}

type Props = {
  slot: string
  sizes?: string
  className?: string
  imgClassName?: string
  eager?: boolean
  ratio?: string
  fallback?: ReactNode
}

export function SmartImage({ slot, sizes = '(min-width: 1024px) 50vw, 100vw', className = '', imgClassName = '', eager = false, ratio, fallback }: Props) {
  const meta = images[slot]
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const ok = slotAvailable(slot) && !failed
  const gen = generatedImages[slot]
  const largest = ok ? gen.widths[gen.widths.length - 1] : 0
  const video = meta?.video
  const showVideo = ok && video && !prefersReducedMotion()

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: ratio ?? `${meta.width} / ${meta.height}`, backgroundColor: ok ? meta.color : undefined }}>
      {!ok && <SlotFallback slot={slot}>{fallback}</SlotFallback>}
      {ok && showVideo && (
        <video className={`absolute inset-0 size-full object-cover ${imgClassName}`} autoPlay muted loop playsInline poster={asset(`images/${slot}-${largest}.jpg`)} aria-label={meta.alt}>
          {video.webm && <source src={asset(video.webm)} type="video/webm" />}
          {video.mp4 && <source src={asset(video.mp4)} type="video/mp4" />}
        </video>
      )}
      {ok && !showVideo && (
        <picture>
          {gen.formats.includes('avif') && <source type="image/avif" srcSet={srcset(slot, 'avif')} sizes={sizes} />}
          {gen.formats.includes('webp') && <source type="image/webp" srcSet={srcset(slot, 'webp')} sizes={sizes} />}
          <img
            src={asset(`images/${slot}-${largest}.jpg`)}
            srcSet={srcset(slot, 'jpg')}
            sizes={sizes}
            alt={meta.alt}
            width={meta.width}
            height={meta.height}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
          />
        </picture>
      )}
    </div>
  )
}
