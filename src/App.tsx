import { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { profile } from './config/profile'
import { links, isGroup } from './config/links'
import type { LinkItem } from './config/links'
import Header from './components/Header'
import LinkCard from './components/LinkCard'
import LinkGroupComponent from './components/LinkGroup'
import ResumePage from './components/ResumePage'

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
      </div>
    </main>
  )
}

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const isResume = location.pathname === '/resume'
  const [animated, setAnimated] = useState(false)
  const resumePageRef = useRef<HTMLDivElement>(null)

  // Enable CSS transitions after initial render (prevents animation on direct load)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimated(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  // Scroll resume page to top when navigating to it
  useEffect(() => {
    if (isResume && resumePageRef.current) {
      resumePageRef.current.scrollTop = 0
    }
  }, [isResume])

  // Keyboard shortcuts: 1-N open flat links
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
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

  return (
    <div
      className={`page-slider${animated ? ' page-slider--animated' : ''}${isResume ? ' page-slider--resume' : ''}`}
    >
      <div className="page">
        <LinksPage />
      </div>
      <div className="page" ref={resumePageRef}>
        <ResumePage />
      </div>
    </div>
  )
}

export default App
