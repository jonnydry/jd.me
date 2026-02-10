import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import type { LinkItem } from '../config/links'
import { GitHub, Twitter, LinkedIn, Globe, Quill, Mail, FileText, Monitor, ArrowRight } from './Icons'

interface LinkCardProps {
  link: LinkItem
  index: number
}

const IconMap = {
  github: GitHub,
  twitter: Twitter,
  linkedin: LinkedIn,
  globe: Globe,
  quill: Quill,
  mail: Mail,
  file: FileText,
  monitor: Monitor,
}

export default function LinkCard({ link, index }: LinkCardProps) {
  const IconComponent = link.icon ? IconMap[link.icon] : ArrowRight
  const rowRef = useRef<HTMLAnchorElement>(null)
  const navigate = useNavigate()

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = rowRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    el.style.setProperty('--mouse-x', `${x}px`)
    el.style.setProperty('--mouse-y', `${y}px`)
  }, [])

  const handleClick = (e: React.MouseEvent) => {
    if (link.internal) {
      e.preventDefault()
      navigate(link.url)
    }
  }

  return (
    <a
      ref={rowRef}
      href={link.url}
      target={link.internal ? undefined : '_blank'}
      rel={link.internal ? undefined : 'noopener noreferrer'}
      className="link-row"
      style={{ animationDelay: `${index * 60}ms` }}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <span className="link-row-glow" />
      <span className="link-row-index">{String(index + 1).padStart(2, '0')}</span>
      <span className="link-row-icon">
        <IconComponent className="link-icon" />
      </span>
      <span className="link-row-title">{link.title}</span>
      {link.desc && <span className="link-row-desc">{link.desc}</span>}
      <span className="link-row-arrow">{link.internal ? '→' : '↗'}</span>
    </a>
  )
}
