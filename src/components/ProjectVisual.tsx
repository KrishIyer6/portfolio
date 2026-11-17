import type { ReactNode } from 'react'
import type { Project } from '../data/content'
import { Schematic } from './Schematics'
import { isIllustration } from '../data/images'
import { SmartImage, slotAvailable } from './SmartImage'

export function BrowserFrame({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div className="border border-line-strong bg-panel">
      <div className="flex items-center gap-3 border-b border-line px-3 py-2">
        <span aria-hidden="true" className="flex gap-1.5">
          <i className="size-2 border border-line-strong" />
          <i className="size-2 border border-line-strong" />
          <i className="size-2 border border-line-strong" />
        </span>
        <span className="truncate border border-line px-2 py-0.5 font-mono text-[0.6875rem] text-faint">{url}</span>
      </div>
      {children}
    </div>
  )
}

// A project's cover: the first supplied screenshot, or its line drawing until one exists.
export function ProjectVisual({ project, ratio = '16 / 10', sizes }: { project: Project; ratio?: string; sizes?: string }) {
  const slot = project.images.find(slotAvailable)
  const body = slot ? (
    <SmartImage slot={slot} ratio={ratio} sizes={sizes} imgClassName="transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]" />
  ) : (
    <div className="gridpaper relative grid place-items-center bg-panel" style={{ aspectRatio: ratio }}>
      <Schematic id={project.id} />
    </div>
  )
  if (project.frame !== 'browser' || (slot && isIllustration(slot))) return body
  const url = project.liveUrl ? project.liveUrl.replace('https://', '') : project.title
  return <BrowserFrame url={url}>{body}</BrowserFrame>
}
