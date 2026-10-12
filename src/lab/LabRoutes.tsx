import { useEffect, useRef } from 'react'
import { Navigate } from 'react-router-dom'
import Contents from './Contents'
import LabIndex from './LabIndex'
import LinerNotes from './LinerNotes'
import ManPage from './ManPage'
import './lab.css'

const PAGES = new Map([
  ['', LabIndex],
  ['manpage', ManPage],
  ['liner-notes', LinerNotes],
  ['contents', Contents],
])

export default function LabRoutes({ pathname }: { pathname: string }) {
  const slug = pathname.replace(/^\/lab\/?/, '')
  const Page = PAGES.get(slug)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0)
  }, [slug])

  if (!Page) return <Navigate to="/lab" replace />

  return (
    <div id="main-content" className="lab" ref={scrollRef}>
      <Page />
    </div>
  )
}
