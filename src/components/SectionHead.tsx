import { useRef, type ReactNode } from 'react'
import { gsap, MOTION_OK, SplitText, useGSAP } from '../lib/gsap'

export function SectionHead({ title, children, id }: { title: string; children?: ReactNode; id?: string }) {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const h = root.current!.querySelector('h2')!
        const trigger = { trigger: root.current, start: 'top 82%', once: true }
        SplitText.create(h, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) => gsap.from(self.lines, { yPercent: 108, duration: 1.1, stagger: 0.09, scrollTrigger: trigger }),
        })
        gsap.from('.sh-rule', { scaleX: 0, duration: 1.4, ease: 'power3.inOut', scrollTrigger: trigger })
        gsap.from('.sh-lead', { autoAlpha: 0, y: 16, duration: 0.9, delay: 0.25, scrollTrigger: trigger })
      })
    },
    { scope: root },
  )
  return (
    <div ref={root} className="mb-[clamp(2.5rem,6vw,5rem)]">
      <div className="grid items-end gap-x-10 gap-y-5 lg:grid-cols-12">
        <h2 id={id} className="display h2 lg:col-span-7">
          {title}
        </h2>
        {children && <div className="sh-lead lead prose-measure text-dim lg:col-span-5 lg:pb-3">{children}</div>}
      </div>
      <div className="sh-rule rule mt-6" />
    </div>
  )
}
