import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { identity, nav } from '../data/content'
import { asset } from '../lib/env'
import { lockScroll } from '../lib/scroll'
import { useActiveSection } from '../lib/sections'
import { SheetIndex } from './Chrome'
import { Download } from './Icons'
import { Magnetic } from './Magnetic'

function useResumeAvailable(url: string) {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    fetch(url, { method: 'HEAD' })
      .then((r) => setOk(r.ok && (r.headers.get('content-type') ?? '').includes('pdf')))
      .catch(() => setOk(false))
  }, [url])
  return ok
}

export function Nav() {
  const active = useActiveSection()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const resumeUrl = asset(identity.resumeFile)
  const hasResume = useResumeAvailable(resumeUrl)
  const showResume = hasResume || import.meta.env.DEV

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    if (!open) return
    lockScroll(true)
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', key)
    return () => {
      lockScroll(false)
      window.removeEventListener('keydown', key)
    }
  }, [open])

  const resume = showResume && (
    <a className="btn !min-h-9 !px-3 !py-1.5" href={resumeUrl} download title={hasResume ? undefined : 'Add public/Krish_Iyer_Resume.pdf'}>
      <Download />
      Resume
    </a>
  )

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${scrolled || open ? 'border-b border-line bg-paper/80 backdrop-blur-md' : 'border-b border-transparent'}`}>
      <nav aria-label="Primary" className="wrap flex h-[var(--nav-h)] items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <a href="#top" className="font-display text-xl font-extrabold tracking-wide whitespace-nowrap uppercase" onClick={() => setOpen(false)}>
            Krish Iyer
          </a>
          <SheetIndex />
        </div>
        <ul className="hidden items-center gap-7 lg:flex">
          {nav.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} data-on={active === n.id} aria-current={active === n.id ? 'true' : undefined} className={`link font-mono text-xs tracking-wider uppercase transition-colors duration-200 ${active === n.id ? 'text-ink' : 'text-dim hover:text-ink'}`}>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          {resume && <Magnetic strength={0.2}>{resume}</Magnetic>}
          <button type="button" className="btn !min-h-9 !px-3 !py-1.5 lg:hidden" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((v) => !v)}>
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div id="mobile-menu" className="fixed inset-x-0 top-[var(--nav-h)] bottom-0 overflow-y-auto bg-paper lg:hidden" initial={{ clipPath: 'inset(0% 0% 100% 0%)' }} animate={{ clipPath: 'inset(0% 0% 0% 0%)' }} exit={{ clipPath: 'inset(0% 0% 100% 0%)' }} transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}>
            <ul className="wrap flex flex-col py-6">
              {nav.map((n, i) => (
                <motion.li key={n.id} className="border-b border-line" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.04, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}>
                  <a href={`#${n.id}`} className="display block py-4 text-5xl" onClick={() => setOpen(false)}>
                    {n.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
