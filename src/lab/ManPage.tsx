import type { LinkItem } from '../config/links'
import ThemeToggle from '../components/ThemeToggle'
import LabLink from './LabLink'
import LabSwitcher from './LabSwitcher'
import { identity, projects, social, support, work } from './data'

function ManEntries({ items, term = (link) => link.title }: { items: LinkItem[]; term?: (link: LinkItem) => string }) {
  return (
    <ul className="man-entries">
      {items.map((link) => (
        <li key={link.url}>
          <LabLink link={link} className="man-entry">
            <span className="man-term">{term(link)}</span>
            {link.desc && <span className="man-desc">{link.desc}</span>}
          </LabLink>
        </li>
      ))}
    </ul>
  )
}

export default function ManPage() {
  const page = `${identity.name.split(' ')[0].toUpperCase()}(1)`
  const pages = work.filter((link) => link.internal)
  const seeAlso = [...work.filter((link) => !link.internal), ...social.items]

  return (
    <main className="lab-page man">
      <LabSwitcher current="manpage" />
      <article className="man-sheet">
        <header className="man-running" aria-hidden="true">
          <span>{page}</span>
          <span className="man-running-center">General Commands Manual</span>
          <span>{page}</span>
        </header>

        <section className="man-section">
          <h2 className="man-heading">NAME</h2>
          <h1 className="man-body man-name">
            <b>{identity.name}</b> — links, writing, and projects
          </h1>
        </section>

        {identity.tagline && (
          <section className="man-section">
            <h2 className="man-heading">SYNOPSIS</h2>
            <p className="man-body">{identity.tagline}</p>
          </section>
        )}

        <section className="man-section">
          <h2 className="man-heading">PROJECTS</h2>
          <div className="man-body">
            <ManEntries items={projects.items} />
          </div>
        </section>

        <section className="man-section">
          <h2 className="man-heading">FILES</h2>
          <div className="man-body">
            <ManEntries items={pages} term={(link) => link.url} />
          </div>
        </section>

        <section className="man-section">
          <h2 className="man-heading">SEE ALSO</h2>
          <div className="man-body">
            <ManEntries items={seeAlso} />
          </div>
        </section>

        <section className="man-section">
          <h2 className="man-heading">SUPPORT</h2>
          <div className="man-body">
            <ManEntries items={support.items} />
          </div>
        </section>

        <footer className="man-running man-foot">
          <span>jdry.me</span>
          <ThemeToggle placement="up" />
          <span>{page}</span>
        </footer>
      </article>
    </main>
  )
}
