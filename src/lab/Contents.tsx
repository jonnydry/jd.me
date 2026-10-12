import { useId } from 'react'
import type { LinkItem } from '../config/links'
import Avatar from './Avatar'
import LabLink from './LabLink'
import LabSwitcher from './LabSwitcher'
import { identity, projects, social, support, work } from './data'

interface Part {
  numeral?: string
  label: string
  items: LinkItem[]
}

function TocPart({ part, start }: { part: Part; start: number }) {
  const labelId = useId()

  return (
    <section className="toc-part" aria-labelledby={labelId}>
      <h3 id={labelId} className="toc-part-label">
        {part.numeral && <span className="toc-numeral">{part.numeral}.</span>}
        {part.label}
      </h3>
      <ol className="toc-entries">
        {part.items.map((link, i) => (
          <li key={link.url}>
            <LabLink link={link} className="toc-entry">
              <span className="toc-line">
                <span className="toc-title">{link.title}</span>
                <span className="toc-leader" aria-hidden="true" />
                <span className="toc-page" aria-hidden="true">{start + i}</span>
              </span>
              {link.desc && <span className="toc-desc">{link.desc}</span>}
            </LabLink>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default function Contents() {
  const parts: Part[] = [
    { numeral: 'I', label: projects.label, items: projects.items },
    { numeral: 'II', label: 'Work', items: work },
    { numeral: 'III', label: social.label, items: social.items },
    { label: 'Acknowledgments', items: support.items },
  ].filter((part) => part.items.length > 0)

  let page = 1

  return (
    <main className="lab-page contents">
      <LabSwitcher current="contents" />
      <article className="toc">
        <header className="toc-title-page">
          <Avatar className="toc-avatar" size={56} />
          <h1 className="toc-name">{identity.name}</h1>
          {identity.tagline && <p className="toc-subtitle">{identity.tagline}</p>}
        </header>

        <h2 className="toc-heading">Contents</h2>
        {parts.map((part) => {
          const start = page
          page += part.items.length
          return <TocPart key={part.label} part={part} start={start} />
        })}
      </article>
    </main>
  )
}
