import { Fragment } from 'react'
import type { LinkItem } from '../config/links'
import Avatar from './Avatar'
import LabLink from './LabLink'
import LabSwitcher from './LabSwitcher'
import { identity, linkHost, projects, social, support, work } from './data'

const pages = work.filter((link) => link.internal)
const code = work.filter((link) => !link.internal)
/** Numbered in the order each link is mentioned in the bio. */
const notes = [...projects.items, ...code, ...social.items, ...pages, ...support.items]

function Ref({ link }: { link: LinkItem }) {
  const n = notes.indexOf(link) + 1

  return (
    <>
      {link.internal ? link.title.toLowerCase() : link.title}
      <sup className="fn-ref">
        <a href={`#note-${n}`} aria-label={`note ${n}`}>{n}</a>
      </sup>
    </>
  )
}

function list(items: LinkItem[], conjunction: 'and' | 'or') {
  return items.map((link, i) => (
    <Fragment key={link.url}>
      {i > 0 && (items.length > 2 ? ', ' : ' ')}
      {i > 0 && i === items.length - 1 && `${conjunction} `}
      <Ref link={link} />
    </Fragment>
  ))
}

export default function Footnotes() {
  return (
    <main className="lab-page fn">
      <LabSwitcher current="footnotes" />
      <article className="fn-sheet">
        <header className="fn-head">
          <Avatar className="fn-avatar" size={48} />
          <div>
            <h1 className="fn-name">{identity.name}</h1>
            {identity.tagline && <p className="fn-tagline">{identity.tagline}</p>}
          </div>
        </header>

        <p className="fn-bio">
          He makes {list(projects.items, 'and')}, with code and experiments on {list(code, 'and')}. He posts as{' '}
          {list(social.items, 'and')}, and his {list(pages, 'and')} live here. Support is welcome via{' '}
          {list(support.items, 'or')}.
        </p>

        <ol className="fn-notes" aria-label="Links">
          {notes.map((link, i) => (
            <li key={link.url} id={`note-${i + 1}`}>
              <LabLink link={link} className="fn-note">
                <span className="fn-no">{i + 1}</span>
                <span className="fn-text">
                  <span className="fn-title">{link.title}</span>, {linkHost(link)}
                  {link.desc && <> — {link.desc}</>}
                </span>
              </LabLink>
            </li>
          ))}
        </ol>
      </article>
    </main>
  )
}
