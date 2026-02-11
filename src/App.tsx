import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { profile } from './config/profile'
import { links, isGroup } from './config/links'
import type { LinkItem } from './config/links'
import { ThemeProvider } from './ThemeContext'
import Header from './components/Header'
import LinkCard from './components/LinkCard'
import LinkGroupComponent from './components/LinkGroup'
import ThemeToggle from './components/ThemeToggle'

const ResumePage = lazy(() => import('./components/ResumePage'))
const WritingPage = lazy(() => import('./components/WritingPage'))

const TAB_TITLES = ['Jonny D | Links', 'Jonny D | vibecoder', 'Jonny D | 🎸', 'Jonny D | writer']

// Flatten links for keyboard shortcuts (groups expand to children)
const flatLinks: LinkItem[] = links.flatMap((entry) =>
  isGroup(entry) ? entry.children : [entry]
)

function LinksPage() {
  let rowIndex = 0

  return (
    <main className="app">
      <div className="terminal">
        <Header {...profile} />
        <ThemeToggle />
        <section className="links-section">
          <div className="links-list">
            {links.map((entry, i) => {
              if (isGroup(entry)) {
                const idx = rowIndex
                rowIndex++
                return <LinkGroupComponent key={`group-${i}`} group={entry} index={idx} />
              } else {
                const idx = rowIndex
                rowIndex++
                return <LinkCard key={entry.url + i} link={entry} index={idx} />
              }
            })}
          </div>
        </section>
        <p className="keyboard-hint" aria-hidden="true">press 1–9 to navigate</p>
      </div>
    </main>
  )
}

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const pageIndex = location.pathname.startsWith('/writing') ? 2 : location.pathname === '/resume' ? 1 : 0
  const [animated, setAnimated] = useState(false)
  const resumePageRef = useRef<HTMLDivElement>(null)
  const writingPageRef = useRef<HTMLDivElement>(null)

  // Enable CSS transitions after initial render (prevents animation on direct load)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimated(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  // Scroll sub-pages to top when navigating to them
  useEffect(() => {
    if (pageIndex === 1 && resumePageRef.current) {
      resumePageRef.current.scrollTop = 0
    }
    if (pageIndex === 2 && writingPageRef.current) {
      writingPageRef.current.scrollTop = 0
    }
  }, [pageIndex, location.pathname])

  // Keyboard shortcuts: 1-N open flat links
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) return
      if (e.ctrlKey || e.metaKey || e.altKey) return

      const num = parseInt(e.key, 10)
      if (num >= 1 && num <= flatLinks.length) {
        const link = flatLinks[num - 1]
        if (link && link.internal) {
          navigate(link.url)
        } else if (link && link.url !== '#') {
          window.open(link.url, '_blank', 'noopener,noreferrer')
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  // Custom tab title when tab is not focused
  useEffect(() => {
    let index = 0
    let interval: ReturnType<typeof setInterval> | null = null

    const startCycling = () => {
      if (interval) return
      interval = setInterval(() => {
        index = (index + 1) % TAB_TITLES.length
        document.title = TAB_TITLES[index]
      }, 2000)
    }

    const stopCycling = () => {
      if (interval) {
        clearInterval(interval)
        interval = null
      }
      index = 0
      document.title = 'Jonny D | Links'
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        startCycling()
      } else {
        stopCycling()
      }
    }

    const handleFocus = () => stopCycling()
    const handleBlur = () => startCycling()

    if (document.hidden) startCycling()

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleFocus)

    return () => {
      stopCycling()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  // Warm route chunks after first paint so navigation feels instant.
  useEffect(() => {
    const warmChunks = () => {
      void import('./components/ResumePage')
      void import('./components/WritingPage')
    }

    if (typeof window === 'undefined') return

    const idleWindow = window as Window & {
      requestIdleCallback?: (cb: IdleRequestCallback) => number
      cancelIdleCallback?: (id: number) => void
    }

    if (typeof idleWindow.requestIdleCallback === 'function') {
      const idleId = idleWindow.requestIdleCallback(() => warmChunks())
      return () => idleWindow.cancelIdleCallback?.(idleId)
    }

    const timeoutId = window.setTimeout(warmChunks, 1500)
    return () => window.clearTimeout(timeoutId)
  }, [])

  return (
    <ThemeProvider>
      <div
        className={`page-slider${animated ? ' page-slider--animated' : ''}`}
        style={{ transform: `translateX(-${pageIndex * 100}vw)` }}
      >
        <div className="page">
          <LinksPage />
        </div>
        <div className="page" ref={resumePageRef}>
          {pageIndex === 1 ? (
            <Suspense fallback={null}>
              <ResumePage />
            </Suspense>
          ) : null}
        </div>
        <div className="page" ref={writingPageRef}>
          {pageIndex === 2 ? (
            <Suspense fallback={null}>
              <WritingPage />
            </Suspense>
          ) : null}
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
