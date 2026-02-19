import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { LinkGroup as LinkGroupType, LinkItem } from '../config/links'
import { GitHub, Twitter, LinkedIn, Globe, Quill, Mail, FileText, Monitor, Heart, Wallet, Coffee, ArrowRight } from './Icons'

const IconMap = {
  github: GitHub,
  twitter: Twitter,
  linkedin: LinkedIn,
  globe: Globe,
  quill: Quill,
  mail: Mail,
  file: FileText,
  monitor: Monitor,
  heart: Heart,
  wallet: Wallet,
  coffee: Coffee,
}

interface LinkGroupProps {
  group: LinkGroupType
  index: number
}

function ChildRow({ link }: { link: LinkItem }) {
  const rowRef = useRef<HTMLAnchorElement>(null)
  const rectRef = useRef<DOMRect | null>(null)
  const rafRef = useRef<number>(0)
  const navigate = useNavigate()
  const IconComponent = link.icon ? IconMap[link.icon] : ArrowRight

  useEffect(() => {
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  const handleMouseEnter = useCallback(() => {
    rectRef.current = rowRef.current?.getBoundingClientRect() ?? null
  }, [])

  const handleMouseLeave = useCallback(() => {
    rectRef.current = null
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = rowRef.current
    if (!el) return
    const clientX = e.clientX
    const clientY = e.clientY
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const rect = rectRef.current ?? el.getBoundingClientRect()
      if (!rectRef.current) rectRef.current = rect
      el.style.setProperty('--mouse-x', `${clientX - rect.left}px`)
      el.style.setProperty('--mouse-y', `${clientY - rect.top}px`)
    })
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = rowRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const ripple = document.createElement('span')
    ripple.className = 'link-ripple'
    ripple.style.left = `${e.clientX - rect.left - 3}px`
    ripple.style.top = `${e.clientY - rect.top - 3}px`
    el.appendChild(ripple)
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true })
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
      className="link-row link-row--child"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <span className="link-row-glow" />
      <span className="link-row-index" />
      <span className="link-row-icon">
        <IconComponent className="link-icon" />
      </span>
      <span className="link-row-title">{link.title}</span>
      {link.desc && <span className="link-row-desc">{link.desc}</span>}
      <span className="link-row-arrow">{link.internal ? '→' : '↗'}</span>
    </a>
  )
}

export default function LinkGroup({ group, index }: LinkGroupProps) {
  const [open, setOpen] = useState(false)
  const rowRef = useRef<HTMLDivElement>(null)
  const rectRef = useRef<DOMRect | null>(null)
  const rafRef = useRef<number>(0)
  const IconComponent = group.icon ? IconMap[group.icon] : ArrowRight

  useEffect(() => {
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  const handleMouseEnter = useCallback(() => {
    rectRef.current = rowRef.current?.getBoundingClientRect() ?? null
  }, [])

  const handleMouseLeave = useCallback(() => {
    rectRef.current = null
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = rowRef.current
    if (!el) return
    const clientX = e.clientX
    const clientY = e.clientY
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const rect = rectRef.current ?? el.getBoundingClientRect()
      if (!rectRef.current) rectRef.current = rect
      el.style.setProperty('--mouse-x', `${clientX - rect.left}px`)
      el.style.setProperty('--mouse-y', `${clientY - rect.top}px`)
    })
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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <span className="link-row-glow" />
        <span className="link-row-index">{String(index + 1).padStart(2, '0')}</span>
        <span className="link-row-icon">
          <IconComponent className="link-icon" />
        </span>
        <span className="link-row-title">{group.label}</span>
        <span className="link-row-desc">{group.children.length} links</span>
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
