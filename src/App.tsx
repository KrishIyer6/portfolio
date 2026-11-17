import { useEffect, useState } from 'react'
import { MotionConfig } from 'motion/react'
import { ScrollProgress } from './components/Chrome'
import { Cursor } from './components/Cursor'
import { Nav } from './components/Nav'
import { Preloader } from './components/Preloader'
import { ProjectDetail } from './components/ProjectDetail'
import { ScrollTrigger } from './lib/gsap'
import { startSmoothScroll } from './lib/scroll'
import { useSectionTracker } from './lib/sections'
import { About } from './sections/About'
import { Contact } from './sections/Contact'
import { Education } from './sections/Education'
import { Experience } from './sections/Experience'
import { Hero } from './sections/Hero'
import { OffTheClock } from './sections/OffTheClock'
import { Process } from './sections/Process'
import { Projects } from './sections/Projects'
import { Skills } from './sections/Skills'

export default function App() {
  const [ready, setReady] = useState(false)
  useSectionTracker()

  useEffect(() => {
    const stop = startSmoothScroll()
    const refresh = () => ScrollTrigger.refresh()
    document.fonts.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => {
      stop()
      window.removeEventListener('load', refresh)
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <a href="#about" className="sr-only-focusable btn btn-solid fixed top-3 left-3 z-[120]">
        Skip to content
      </a>
      <Preloader onDone={() => setReady(true)} />
      <Cursor />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero ready={ready} />
        <Process />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <OffTheClock />
        <Contact />
      </main>
      <ProjectDetail />
      <div className="grain" aria-hidden="true" />
    </MotionConfig>
  )
}
