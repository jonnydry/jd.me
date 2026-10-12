import { useState, useEffect, useId, useRef } from 'react'
import type { LinkGroup as LinkGroupType } from '../config/links'
import { ArrowRight, IconMap } from './Icons'
import LinkCard from './LinkCard'
import { useGlow } from '../hooks/useGlow'
import { shortcutKey } from '../utils/shortcut'

interface LinkGroupProps {
  group: LinkGroupType
  /** Row position of the group header, or of the first child when the group is inline. */
  position: number
}

function InlineLinkGroup({ group, position }: LinkGroupProps) {
  const IconComponent = group.icon ? IconMap[group.icon] : ArrowRight
  const labelId = useId()

  return (
    <section
      className="link-group link-group--inline"
      aria-labelledby={labelId}
      style={{ animationDelay: `${(position - 1) * 60}ms` }}
    >
      <div className="link-row link-row--label">
        <span className="link-row-index" />
        <span className="link-row-icon">
          <IconComponent className="link-icon" />
        </span>
        <h2 id={labelId} className="link-row-title">{group.label}</h2>
      </div>
      {group.children.map((child, i) => (
        <LinkCard key={child.url} link={child} position={position + i} child />
      ))}
    </section>
  )
}

function CollapsibleLinkGroup({ group, position }: LinkGroupProps) {
  const [open, setOpen] = useState(false)
  const rowRef = useRef<HTMLDivElement>(null)
  const childrenRef = useRef<HTMLDivElement>(null)
  const IconComponent = group.icon ? IconMap[group.icon] : ArrowRight
  const childrenId = useId()
  const shortcut = shortcutKey(position)

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
    <div className="link-group" style={{ animationDelay: `${(position - 1) * 60}ms` }}>
      <div
        ref={rowRef}
        data-shortcut={shortcut}
        aria-keyshortcuts={shortcut}
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
        <span className="link-row-index">{String(position).padStart(2, '0')}</span>
        <span className="link-row-icon">
          <IconComponent className="link-icon" />
        </span>
        <span className="link-row-text">
          <span className="link-row-title">{group.label}</span>
          <span className="link-row-desc">{group.children.length} links</span>
        </span>
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
            <LinkCard key={child.url} link={child} child />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function LinkGroup(props: LinkGroupProps) {
  return props.group.collapsible === false ? <InlineLinkGroup {...props} /> : <CollapsibleLinkGroup {...props} />
}
