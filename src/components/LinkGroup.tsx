import { useState, useCallback, useEffect, useId, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import type { LinkGroup as LinkGroupType, LinkItem } from '../config/links'
import { ArrowRight, IconMap } from './Icons'
import { useGlow } from '../hooks/useGlow'

interface LinkGroupProps {
  group: LinkGroupType
  index: number
}

function ChildRow({ link }: { link: LinkItem }) {
  const rowRef = useRef<HTMLAnchorElement>(null)
  const navigate = useNavigate()
  const IconComponent = link.icon ? IconMap[link.icon] : ArrowRight
  const iconSrc = link.iconSrc
  const isSanchoIcon = iconSrc === '/sanchodarktransVector.svg'
  const rippleRef = useRef<HTMLSpanElement | null>(null)

  const glowHandlers = useGlow(rowRef)

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = rowRef.current
    if (!el) return
    if (rippleRef.current) rippleRef.current.remove()
    const rect = el.getBoundingClientRect()
    const ripple = document.createElement('span')
    ripple.className = 'link-ripple'
    ripple.style.left = `${e.clientX - rect.left - 3}px`
    ripple.style.top = `${e.clientY - rect.top - 3}px`
    el.appendChild(ripple)
    rippleRef.current = ripple
    ripple.addEventListener('animationend', () => {
      ripple.remove()
      if (rippleRef.current === ripple) rippleRef.current = null
    }, { once: true })
  }, [])

  useEffect(() => {
    return () => { rippleRef.current?.remove() }
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
      onMouseEnter={glowHandlers.handleMouseEnter}
      onMouseLeave={glowHandlers.handleMouseLeave}
      onMouseMove={glowHandlers.handleMouseMove}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <span className="link-row-glow" />
      <span className="link-row-index" />
      <span className="link-row-icon">
        {isSanchoIcon ? (
          <span className="link-icon link-icon--sancho-mask" aria-hidden="true" />
        ) : iconSrc ? (
          <img src={iconSrc} alt="" className="link-icon link-icon--img" width={24} height={24} />
        ) : (
          <IconComponent className="link-icon" />
        )}
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
  const childrenRef = useRef<HTMLDivElement>(null)
  const IconComponent = group.icon ? IconMap[group.icon] : ArrowRight
  const childrenId = useId()

  const glowHandlers = useGlow(rowRef)

  useEffect(() => {
    const children = childrenRef.current
    if (!children) return

    if (open) {
      children.removeAttribute('inert')
    } else {
      children.setAttribute('inert', '')
    }
  }, [open])

  return (
    <div className="link-group" style={{ animationDelay: `${index * 60}ms` }}>
      <div
        ref={rowRef}
        data-shortcut={index + 1}
        aria-keyshortcuts={String(index + 1)}
        aria-expanded={open}
        aria-controls={childrenId}
        className={`link-row link-row--group ${open ? 'link-row--open' : ''}`}
        role="button"
        tabIndex={0}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(!open) } }}
        onMouseEnter={glowHandlers.handleMouseEnter}
        onMouseLeave={glowHandlers.handleMouseLeave}
        onMouseMove={glowHandlers.handleMouseMove}
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
      <div
        ref={childrenRef}
        id={childrenId}
        className={`link-group-children ${open ? 'link-group-children--open' : ''}`}
        aria-hidden={!open}
      >
        <div className="link-group-children-inner">
          {group.children.map((child) => (
            <ChildRow key={child.url} link={child} />
          ))}
        </div>
      </div>
    </div>
  )
}
