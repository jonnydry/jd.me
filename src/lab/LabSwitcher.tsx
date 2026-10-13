import { Link } from 'react-router-dom'
import { prototypes, type PrototypeSlug } from './prototypes'

export default function LabSwitcher({ current }: { current: PrototypeSlug }) {
  return (
    <nav className="lab-switcher" aria-label="Prototypes">
      <Link to="/lab">← lab</Link>
      {prototypes.map((prototype) => (
        <Link
          key={prototype.slug}
          to={`/lab/${prototype.slug}`}
          aria-current={prototype.slug === current ? 'page' : undefined}
        >
          {prototype.label}
        </Link>
      ))}
    </nav>
  )
}
