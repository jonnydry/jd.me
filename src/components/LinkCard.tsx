import { useCallback, useEffect, useRef, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import type { LinkItem } from '../config/links'
import { ArrowRight, IconMap } from './Icons'
import { useGlow } from '../hooks/useGlow'
import { shortcutKey } from '../utils/shortcut'

interface LinkCardProps {
  link: LinkItem
  /** 1-based homepage row position; drives the index label and digit shortcut. */
  position?: number
  child?: boolean
}

export default function LinkCard({ link, position, child = false }: LinkCardProps) {
  const IconComponent = link.icon ? IconMap[link.icon] : ArrowRight
  const iconSrc = link.iconSrc
  const iconMask = Boolean(link.iconMask && iconSrc)
  const shortcut = position ? shortcutKey(position) : undefined
  const rowRef = useRef<HTMLAnchorElement>(null)
  const navigate = useNavigate()

  const glowHandlers = useGlow(rowRef)

  const rippleRef = useRef<HTMLSpanElement | null>(null)

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
      data-shortcut={shortcut}
      aria-keyshortcuts={shortcut}
      href={link.url}
      target={link.internal ? undefined : '_blank'}
      rel={link.internal ? undefined : 'noopener noreferrer'}
      className={`link-row${child ? ' link-row--child' : ''}`}
      style={!child && position ? { animationDelay: `${(position - 1) * 60}ms` } : undefined}
      onMouseEnter={glowHandlers.handleMouseEnter}
      onMouseLeave={glowHandlers.handleMouseLeave}
      onMouseMove={glowHandlers.handleMouseMove}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <span className="link-row-index">{position ? String(position).padStart(2, '0') : null}</span>
      <span className="link-row-icon">
        {iconMask ? (
          <span
            className="link-icon link-icon--mask"
            style={{ '--icon-mask': `url('${iconSrc}')` } as CSSProperties}
            aria-hidden="true"
          />
        ) : iconSrc ? (
          <img src={iconSrc} alt="" className="link-icon link-icon--img" width={24} height={24} />
        ) : (
          <IconComponent className="link-icon" />
        )}
      </span>
      <span className="link-row-text">
        <span className="link-row-title">{link.title}</span>
        {link.desc && <span className="link-row-desc">{link.desc}</span>}
      </span>
      <span className="link-row-arrow">{link.internal ? '→' : '↗'}</span>
    </a>
  )
}
