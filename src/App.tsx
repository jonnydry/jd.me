import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { profile } from './config/profile'
import { links, isGroup } from './config/links'
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT, SITE_NAME, SITE_URL, getRouteMetadata } from './config/seo'
import { ThemeProvider } from './ThemeContext'
import { useTimeOfDay } from './hooks/useTimeOfDay'
import { normalizePathname } from './utils/path'
import { ErrorBoundary } from './components/ErrorBoundary'
import Header from './components/Header'
import LinkCard from './components/LinkCard'
import LinkGroupComponent from './components/LinkGroup'
import ThemeToggle from './components/ThemeToggle'

const ResumePage = lazy(() => import('./components/ResumePage'))
const WritingPage = lazy(() => import('./components/WritingPage'))

const HOME_TAB_TITLES = ['Jonny D | Links, Writing, and Projects', 'Jonny D | vibecoder', 'Jonny D | writer', 'Jonny D | guitar player']

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <main className="app app--top">
      <div className="resume">
        <button type="button" className="resume-back" onClick={() => navigate('/')}>
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
      <a href="#links-content" className="skip-link">
        Skip to main content
      </a>
      <div className="terminal">
        <Header {...profile} />
        <ThemeToggle />
        <section id="links-content" className="links-section" tabIndex={-1}>
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
  const metadata = getRouteMetadata(normalizedPathname)
  const pageIndex = isWritingRoute ? 2 : isResumeRoute ? 1 : isHomeRoute ? 0 : -1
  const [animated, setAnimated] = useState(false)
  const linksPageRef = useRef<HTMLDivElement>(null)
  const resumePageRef = useRef<HTMLDivElement>(null)
  const writingPageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const upsertMeta = (selector: string, attributes: Record<string, string>) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector)

      if (!element) {
        element = document.createElement('meta')
        document.head.appendChild(element)
      }

      Object.entries(attributes).forEach(([key, value]) => {
        element?.setAttribute(key, value)
      })
    }

    const upsertLink = (selector: string, attributes: Record<string, string>) => {
      let element = document.head.querySelector<HTMLLinkElement>(selector)

      if (!element) {
        element = document.createElement('link')
        document.head.appendChild(element)
      }

      Object.entries(attributes).forEach(([key, value]) => {
        element?.setAttribute(key, value)
      })
    }

    const canonicalUrl = `${SITE_URL}${metadata.path}`

    document.title = metadata.title
    upsertMeta('meta[name="description"]', { name: 'description', content: metadata.description })
    upsertMeta('meta[name="robots"]', { name: 'robots', content: metadata.robots ?? 'index,follow' })
    upsertMeta('meta[name="author"]', { name: 'author', content: SITE_NAME })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: metadata.type ?? 'website' })
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: metadata.title })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: metadata.description })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: DEFAULT_OG_IMAGE })
    upsertMeta('meta[property="og:image:alt"]', {
      property: 'og:image:alt',
      content: DEFAULT_OG_IMAGE_ALT,
    })
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: metadata.title })
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: metadata.description,
    })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: DEFAULT_OG_IMAGE })
    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl })
  }, [metadata])

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

  useEffect(() => {
    const pages = [linksPageRef.current, resumePageRef.current, writingPageRef.current]

    pages.forEach((page, index) => {
      if (!page) return

      if (index === pageIndex) {
        page.removeAttribute('aria-hidden')
        page.removeAttribute('inert')
      } else {
        page.setAttribute('aria-hidden', 'true')
        page.setAttribute('inert', '')
      }
    })
  }, [pageIndex])

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
    if (!isHomeRoute) {
      document.title = metadata.title
      return
    }

    let index = 0
    let interval: ReturnType<typeof setInterval> | null = null

    const startCycling = () => {
      if (interval) return
      interval = setInterval(() => {
        index = (index + 1) % HOME_TAB_TITLES.length
        document.title = HOME_TAB_TITLES[index]
      }, 2000)
    }

    const stopCycling = () => {
      if (interval) {
        clearInterval(interval)
        interval = null
      }
      index = 0
      document.title = metadata.title
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
  }, [isHomeRoute, metadata.title])

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

  const pageSliderStyle = (pageIndex: number): React.CSSProperties => ({
    transform: `translateX(-${pageIndex * 100}vw)`,
  })

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
          style={pageSliderStyle(pageIndex)}
        >
          <div className="page" ref={linksPageRef}>
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
