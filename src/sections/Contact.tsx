import { lazy, Suspense, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowOut, Check, Copy } from '../components/Icons'
import { Magnetic } from '../components/Magnetic'
import { contact, footer, identity } from '../data/content'
import { hasWebGL } from '../lib/env'
import { gsap, MOTION_OK, SplitText, useGSAP } from '../lib/gsap'
import { useInView } from '../lib/hooks'

const ContourField = lazy(() => import('../three/ContourField'))

export function Contact() {
  const root = useRef<HTMLElement>(null)
  const near = useInView(root, '400px', true)
  const active = useInView(root, '0px')
  const webgl = useMemo(hasWebGL, [])
  const [copied, setCopied] = useState(false)
  const timer = useRef<number>(0)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(identity.email)
    } catch {
      const input = document.createElement('input')
      input.value = identity.email
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      input.remove()
    }
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 2400)
  }

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const st = { trigger: '.cta', start: 'top 80%', once: true }
        SplitText.create('.cta', {
          type: 'words,chars',
          mask: 'chars',
          autoSplit: true,
          onSplit: (self) => gsap.from(self.chars, { yPercent: 110, duration: 1.1, stagger: 0.028, scrollTrigger: st }),
        })
        gsap.from('.cta-fade', { autoAlpha: 0, y: 20, duration: 0.9, stagger: 0.1, delay: 0.4, scrollTrigger: st })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="contact" aria-labelledby="contact-h" className="relative flex min-h-svh flex-col justify-end overflow-hidden border-t border-line pt-[var(--section-y)]">
      {webgl && near && (
        <Suspense fallback={null}>
          <ContourField active={active} />
        </Suspense>
      )}
      <div className="wrap relative">
        <h2 id="contact-h" className="cta display text-[clamp(4rem,14.5vw,15rem)] leading-[0.82]">
          {contact.heading}
        </h2>
        <div className="mt-10 grid gap-x-12 gap-y-8 lg:grid-cols-12">
          <p className="cta-fade lead prose-measure text-dim lg:col-span-5">{contact.body}</p>
          <div className="cta-fade lg:col-span-6 lg:col-start-7">
            <a href={`mailto:${identity.email}`} className="link font-display text-[clamp(1.75rem,4.4vw,4rem)] leading-none font-extrabold break-all text-accent uppercase">
              {identity.email}
            </a>
            <div className="mt-7 flex flex-wrap gap-3">
              <Magnetic>
                <button type="button" className="btn btn-solid min-w-[15.5rem]" onClick={copyEmail}>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span key={copied ? 'done' : 'idle'} className="inline-flex items-center gap-2.5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}>
                      {copied ? <Check /> : <Copy />}
                      {copied ? contact.copiedLabel : contact.copyLabel}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </Magnetic>
              <Magnetic>
                <a className="btn" href={`mailto:${identity.email}`}>
                  {contact.mailLabel}
                </a>
              </Magnetic>
            </div>
            <span className="sr-only" aria-live="polite">
              {copied ? contact.copiedLabel : ''}
            </span>
          </div>
        </div>
      </div>

      <footer className="wrap relative mt-[clamp(4rem,10vw,8rem)] flex flex-wrap items-center justify-between gap-x-10 gap-y-4 border-t border-line py-6">
        <ul className="flex flex-wrap gap-x-8 gap-y-2">
          <li>
            <a className="link inline-flex items-center gap-2 text-[length:var(--text-small)]" href={identity.linkedin} target="_blank" rel="noreferrer">
              {identity.linkedinLabel} <ArrowOut />
            </a>
          </li>
          <li>
            <a className="link inline-flex items-center gap-2 text-[length:var(--text-small)]" href={identity.github} target="_blank" rel="noreferrer">
              {identity.githubLabel} <ArrowOut />
            </a>
          </li>
        </ul>
        <p className="note">
          © {new Date().getFullYear()} {identity.name}. {footer.line}
        </p>
        <a className="link note text-ink" href="#top">
          {footer.top}
        </a>
      </footer>
    </section>
  )
}
