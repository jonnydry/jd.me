import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import { prototypes } from './prototypes'

const rows = [
  { to: '/', title: 'Current homepage', summary: 'Typed tagline over a numbered terminal list.' },
  ...prototypes.map((prototype) => ({ to: `/lab/${prototype.slug}`, title: prototype.title, summary: prototype.summary })),
]

export default function LabIndex() {
  return (
    <main className="lab-page lab-index">
      <header className="lab-index-head">
        <h1 className="lab-index-title">lab</h1>
        <p className="lab-index-note">
          Homepage prototypes: same links, different typesetting. Preview only, not linked from the site.
        </p>
      </header>
      <ol className="lab-index-list">
        {rows.map((row) => (
          <li key={row.to}>
            <Link to={row.to} className="lab-index-row">
              <span className="lab-index-name">{row.title}</span>
              <span className="lab-index-path">{row.to}</span>
              <span className="lab-index-summary">{row.summary}</span>
            </Link>
          </li>
        ))}
      </ol>
      <footer className="lab-index-foot">
        <ThemeToggle placement="up" />
      </footer>
    </main>
  )
}
