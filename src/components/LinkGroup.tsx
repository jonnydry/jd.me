import { useState, useCallback, useRef } from 'react'
import type { LinkGroup as LinkGroupType, LinkItem } from '../config/links'
import { GitHub, Twitter, LinkedIn, Globe, Quill, Mail, ArrowRight } from './Icons'

const IconMap = {
  github: GitHub,
  twitter: Twitter,
  linkedin: LinkedIn,
  globe: Globe,
  quill: Quill,
  mail: Mail,
}

interface LinkGroupProps {
  group: LinkGroupType
  index: number
}

function ChildRow({ link }: { link: LinkItem }) {
  const rowRef = useRef<HTMLAnchorElement>(null)
  const IconComponent = link.icon ? IconMap[link.icon] : ArrowRight

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = rowRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mouse-x', `${(e.clientX - rect.left)}px`)
    el.style.setProperty('--mouse-y', `${(e.clientY - rect.top)}px`)
  }, [])

  return (
    <a
      ref={rowRef}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="link-row link-row--child"
      onMouseMove={handleMouseMove}
    >
      <span className="link-row-glow" />
      <span className="link-row-index" />
      <span className="link-row-icon">
        <IconComponent className="link-icon" />
      </span>
      <span className="link-row-title">{link.title}</span>
      {link.desc && <span className="link-row-desc">{link.desc}</span>}
      <span className="link-row-arrow">↗</span>
    </a>
  )
}

export default function LinkGroup({ group, index }: LinkGroupProps) {
  const [open, setOpen] = useState(false)
  const rowRef = useRef<HTMLDivElement>(null)
  const IconComponent = group.icon ? IconMap[group.icon] : ArrowRight

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = rowRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mouse-x', `${(e.clientX - rect.left)}px`)
    el.style.setProperty('--mouse-y', `${(e.clientY - rect.top)}px`)
  }, [])

  return (
    <div className="link-group" style={{ animationDelay: `${index * 60}ms` }}>
      <div
        ref={rowRef}
        className={`link-row link-row--group ${open ? 'link-row--open' : ''}`}
        role="button"
        tabIndex={0}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(!open) } }}
        onMouseMove={handleMouseMove}
      >
        <span className="link-row-glow" />
        <span className="link-row-index">{String(index + 1).padStart(2, '0')}</span>
        <span className="link-row-icon">
          <IconComponent className="link-icon" />
        </span>
        <span className="link-row-title">{group.label}</span>
        <span className="link-row-desc">{group.children.length} projects</span>
        <span className={`link-row-chevron ${open ? 'link-row-chevron--open' : ''}`}>▾</span>
      </div>
      <div className={`link-group-children ${open ? 'link-group-children--open' : ''}`}>
        <div className="link-group-children-inner">
          {group.children.map((child) => (
            <ChildRow key={child.url} link={child} />
          ))}
        </div>
      </div>
    </div>
  )
}
