import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { LinkItem } from '../config/links'

interface LabLinkProps {
  link: LinkItem
  className?: string
  children: ReactNode
}

export default function LabLink({ link, className, children }: LabLinkProps) {
  if (link.internal) {
    return (
      <Link to={link.url} className={className}>
        {children}
      </Link>
    )
  }

  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  )
}
