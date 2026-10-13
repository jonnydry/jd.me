import { Fragment, useId } from 'react'
import type { LinkItem } from '../config/links'
import Avatar from './Avatar'
import LabLink from './LabLink'
import LabSwitcher from './LabSwitcher'
import { identity, linkHost, projects, social, support, work } from './data'

function Side({ label, prefix, items }: { label: string; prefix: string; items: LinkItem[] }) {
  const labelId = useId()

  return (
    <section className="liner-side" aria-labelledby={labelId}>
      <h2 id={labelId} className="liner-label">{label}</h2>
      <ol className="liner-tracks">
        {items.map((link, i) => (
          <li key={link.url}>
            <LabLink link={link} className="liner-track">
              <span className="liner-no">{`${prefix}${i + 1}`}</span>
              <span className="liner-title">
                {link.title}
                {link.desc && <span className="liner-desc">{link.desc}</span>}
              </span>
              <span className="liner-meta">{linkHost(link)}</span>
            </LabLink>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Credit({ label, items }: { label: string; items: LinkItem[] }) {
  if (items.length === 0) return null

  return (
    <p className="liner-credit">
      <span className="liner-label">{label}</span>{' '}
      {items.map((link, i) => (
        <Fragment key={link.url}>
          {i > 0 && <span aria-hidden="true"> · </span>}
          <LabLink link={link}>{link.title}</LabLink>
        </Fragment>
      ))}
    </p>
  )
}

export default function LinerNotes() {
  return (
    <main className="lab-page liner">
      <LabSwitcher current="liner-notes" />
      <article className="liner-sleeve">
        <header className="liner-head">
          <Avatar className="liner-avatar" size={72} />
          <div>
            <h1 className="liner-name">{identity.name}</h1>
            {identity.tagline && <p className="liner-tagline">{identity.tagline}</p>}
          </div>
        </header>

        <Side label="Side A" prefix="A" items={projects.items} />
        <Side label="Side B" prefix="B" items={work} />

        <footer className="liner-credits">
          <Credit label={social.label} items={social.items} />
          <Credit label="Thanks" items={support.items} />
        </footer>
      </article>
    </main>
  )
}
