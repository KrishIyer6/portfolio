import { lazy, Suspense, useMemo, useRef, useState } from 'react'
import { copy } from '../data/content'
import { hasWebGL, isLowPower } from '../lib/env'
import { useInView } from '../lib/hooks'
import { FIRE_PRESETS, MAX_FLOORS, planRoute, type RoofKind } from '../three/building'
import { Minus, Plus } from './Icons'
import { StaticBuilding } from './Schematics'

const ArchViewer = lazy(() => import('../three/ArchViewer'))
const ROOF_KINDS: RoofKind[] = ['flat', 'gable', 'hip']

export function ViewerPanel() {
  const host = useRef<HTMLDivElement>(null)
  const near = useInView(host, '300px', true)
  const active = useInView(host, '0px')
  const webgl = useMemo(hasWebGL, [])
  const low = useMemo(isLowPower, [])
  const [roof, setRoof] = useState<RoofKind>('gable')
  const [floors, setFloors] = useState(3)
  const [cut, setCut] = useState(false)
  const [route, setRoute] = useState<number | null>(null)

  const status = useMemo(() => {
    if (route === null) return copy.viewerIdle
    const r = planRoute(route)
    const steps = r.points.length - 1
    return `${FIRE_PRESETS[route].label}. Dijkstra finds ${steps} steps to ${r.exit === 'door' ? 'the front door' : 'the nearest window, because the door is cut off'}.`
  }, [route])

  return (
    <div>
      <div ref={host} className="sheet relative aspect-[4/3] overflow-hidden bg-panel md:aspect-[16/10]" data-cursor={webgl ? 'Drag' : undefined}>
        {!webgl && (
          <div className="gridpaper absolute inset-0 grid place-items-center">
            <StaticBuilding floors={floors} roof={roof} className="h-4/5 text-draw" />
          </div>
        )}
        {webgl && near && (
          <Suspense fallback={<p className="note absolute inset-0 grid place-items-center">Loading model</p>}>
            <ArchViewer roof={roof} floors={floors} cut={cut} route={route} active={active} low={low} />
          </Suspense>
        )}
        <p className="note pointer-events-none absolute top-3 left-4">{copy.viewerNote}</p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-4">
        <fieldset className="flex items-center gap-3">
          <legend className="note float-left mr-3">Roof</legend>
          <div className="flex">
            {ROOF_KINDS.map((k) => (
              <button key={k} type="button" className="btn -ml-px !min-h-10 capitalize first:ml-0" aria-pressed={roof === k} onClick={() => setRoof(k)}>
                {k}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="flex items-center gap-3">
          <span className="note" id="floors-label">
            Floors
          </span>
          <div className="flex items-center" role="group" aria-labelledby="floors-label">
            <button type="button" className="btn !min-h-10 !px-3" aria-label="Remove a floor" disabled={floors <= 1} onClick={() => setFloors((f) => Math.max(1, f - 1))}>
              <Minus />
            </button>
            <output className="tabular grid h-10 w-10 place-items-center border-y border-line-strong font-mono text-sm" aria-live="polite">
              {floors}
            </output>
            <button type="button" className="btn !min-h-10 !px-3" aria-label="Add a floor" disabled={floors >= MAX_FLOORS} onClick={() => setFloors((f) => Math.min(MAX_FLOORS, f + 1))}>
              <Plus />
            </button>
          </div>
        </div>
        <button type="button" className="btn !min-h-10" aria-pressed={cut} onClick={() => setCut((v) => !v)}>
          Section cut
        </button>
        <div className="flex">
          <button type="button" className="btn !min-h-10" aria-pressed={route !== null} onClick={() => setRoute((r) => (r === null ? 0 : null))}>
            Fire route
          </button>
          {route !== null && (
            <button type="button" className="btn -ml-px !min-h-10" onClick={() => setRoute((r) => ((r ?? 0) + 1) % FIRE_PRESETS.length)}>
              Move the fire
            </button>
          )}
        </div>
      </div>
      <p className="mt-4 min-h-[3em] max-w-[60ch] text-[length:var(--text-small)] text-dim" aria-live="polite">
        {status}
      </p>
    </div>
  )
}
