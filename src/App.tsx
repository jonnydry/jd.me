import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { profile } from './config/profile'
import { links, isGroup } from './config/links'
import { ThemeProvider } from './ThemeContext'
import { useTimeOfDay } from './hooks/useTimeOfDay'
import { ErrorBoundary } from './components/ErrorBoundary'
import Header from './components/Header'
import LinkCard from './components/LinkCard'
import LinkGroupComponent from './components/LinkGroup'
import ThemeToggle from './components/ThemeToggle'

const ResumePage = lazy(() => import('./components/ResumePage'))
const WritingPage = lazy(() => import('./components/WritingPage'))

const TAB_TITLES = ['Jonny D | Links', 'Jonny D | vibecoder', 'Jonny D | 🎸', 'Jonny D | writer']

function normalizePathname(pathname: string) {
  if (pathname === '/') return pathname
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <main className="app app--top">
      <div className="resume">
        <button className="resume-back" onClick={() => navigate('/')}>
          <span className="resume-back-arrow">←</span> links
        </button>
        <ThemeToggle />

        <header className="resume-header">
          <h1 className="resume-name">Page not found</h1>
          <p className="resume-contact">That route does not exist.</p>
        </header>
      </div>
    </main>
  )
}

function LinksPage() {
  let rowIndex = 0
  const shortcutCount = Math.min(links.length, 9)

  return (
    <main className="app">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
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
        <p className="keyboard-hint" aria-hidden="true">
          {shortcutCount === 1 ? 'press 1 to navigate' : `press 1-${shortcutCount} to navigate`}
        </p>
      </div>
    </main>
  )
}

function App() {
  useTimeOfDay()
  const location = useLocation()
  const normalizedPathname = normalizePathname(location.pathname)
  const isHomeRoute = normalizedPathname === '/'
  const isResumeRoute = normalizedPathname === '/resume'
  const isWritingRoute = /^\/writing(?:\/[^/]+)?$/.test(normalizedPathname)
  const pageIndex = isWritingRoute ? 2 : isResumeRoute ? 1 : isHomeRoute ? 0 : -1
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

  // Keyboard shortcuts: 1-N activate visible home-page rows
  useEffect(() => {
    if (pageIndex !== 0) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) return
      if (e.ctrlKey || e.metaKey || e.altKey) return

      const num = parseInt(e.key, 10)
      if (num >= 1 && num <= Math.min(links.length, 9)) {
        const shortcutTarget = document.querySelector<HTMLElement>(`[data-shortcut="${num}"]`)
        shortcutTarget?.click()
        shortcutTarget?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [pageIndex])

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
      document.documentElement.classList.toggle('page-hidden', document.hidden)
      if (document.hidden) {
        startCycling()
      } else {
        stopCycling()
      }
    }

    const handleFocus = () => stopCycling()
    const handleBlur = () => startCycling()

    document.documentElement.classList.toggle('page-hidden', document.hidden)
    if (document.hidden) startCycling()

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleFocus)

    return () => {
      document.documentElement.classList.remove('page-hidden')
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

    const connection = navigator as Navigator & {
      connection?: {
        saveData?: boolean
        effectiveType?: string
      }
    }

    if (
      connection.connection?.saveData ||
      connection.connection?.effectiveType === 'slow-2g' ||
      connection.connection?.effectiveType === '2g' ||
      window.matchMedia('(hover: none), (pointer: coarse), (max-width: 640px)').matches
    ) {
      return
    }

    if (typeof idleWindow.requestIdleCallback === 'function') {
      const idleId = idleWindow.requestIdleCallback(() => warmChunks())
      return () => idleWindow.cancelIdleCallback?.(idleId)
    }

    const timeoutId = window.setTimeout(warmChunks, 1500)
    return () => window.clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const nav = navigator as Navigator & {
      deviceMemory?: number
      connection?: {
        saveData?: boolean
        effectiveType?: string
        addEventListener?: (type: 'change', listener: () => void) => void
        removeEventListener?: (type: 'change', listener: () => void) => void
        addListener?: (listener: () => void) => void
        removeListener?: (listener: () => void) => void
      }
    }

    const applyPerformanceTier = () => {
      const lowPower =
        reducedMotion.matches ||
        Boolean(nav.connection?.saveData) ||
        nav.connection?.effectiveType === 'slow-2g' ||
        nav.connection?.effectiveType === '2g' ||
        (nav.hardwareConcurrency ?? 8) <= 4 ||
        (nav.deviceMemory ?? 8) <= 6

      root.setAttribute('data-performance', lowPower ? 'reduced' : 'default')
    }

    applyPerformanceTier()

    if (typeof reducedMotion.addEventListener === 'function') {
      reducedMotion.addEventListener('change', applyPerformanceTier)
    } else {
      reducedMotion.addListener(applyPerformanceTier)
    }

    if (nav.connection) {
      if (typeof nav.connection.addEventListener === 'function') {
        nav.connection.addEventListener('change', applyPerformanceTier)
      } else {
        nav.connection.addListener?.(applyPerformanceTier)
      }
    }

    return () => {
      root.removeAttribute('data-performance')

      if (typeof reducedMotion.removeEventListener === 'function') {
        reducedMotion.removeEventListener('change', applyPerformanceTier)
      } else {
        reducedMotion.removeListener(applyPerformanceTier)
      }

      if (nav.connection) {
        if (typeof nav.connection.removeEventListener === 'function') {
          nav.connection.removeEventListener('change', applyPerformanceTier)
        } else {
          nav.connection.removeListener?.(applyPerformanceTier)
        }
      }
    }
  }, [])

  if (pageIndex === -1) {
    return (
      <ThemeProvider>
        <NotFoundPage />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <div
          id="main-content"
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
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default App
