import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { prototypes, type PrototypeSlug } from './prototypes'

export default function LabSwitcher({ current }: { current: PrototypeSlug }) {
  return (
    <nav className="lab-switcher" aria-label="Prototypes">
      <Link to="/lab">← lab</Link>
      <span className="lab-switcher-sep" aria-hidden="true">·</span>
      {prototypes.map((prototype, i) => (
        <Fragment key={prototype.slug}>
          {i > 0 && <span className="lab-switcher-sep" aria-hidden="true">|</span>}
          <Link to={`/lab/${prototype.slug}`} aria-current={prototype.slug === current ? 'page' : undefined}>
            {prototype.label}
          </Link>
        </Fragment>
      ))}
    </nav>
  )
}
