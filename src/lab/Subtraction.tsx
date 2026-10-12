import { useId } from 'react'
import Header from '../components/Header'
import ThemeToggle from '../components/ThemeToggle'
import { links, isGroup, type LinkItem } from '../config/links'
import LabLink from './LabLink'
import LabSwitcher from './LabSwitcher'
import { identity } from './data'

type Block = { label?: string; items: LinkItem[] }

/** Homepage order; consecutive ungrouped rows share one unlabeled block. */
const blocks = links.reduce<Block[]>((acc, entry) => {
  if (isGroup(entry)) {
    acc.push({ label: entry.label, items: entry.children })
  } else if (acc.length > 0 && !acc[acc.length - 1].label) {
    acc[acc.length - 1].items.push(entry)
  } else {
    acc.push({ items: [entry] })
  }
  return acc
}, [])

function Rows({ items }: { items: LinkItem[] }) {
  return (
    <ul className="sub-list">
      {items.map((link) => (
        <li key={link.url}>
          <LabLink link={link} className="sub-row">
            <span className="sub-title">{link.title}</span>
            {link.desc && <span className="sub-desc"> — {link.desc}</span>}
          </LabLink>
        </li>
      ))}
    </ul>
  )
}

function LabeledBlock({ label, items }: { label: string; items: LinkItem[] }) {
  const labelId = useId()

  return (
    <section className="sub-block" aria-labelledby={labelId}>
      <h2 id={labelId} className="sub-label">{label}</h2>
      <Rows items={items} />
    </section>
  )
}

export default function Subtraction() {
  return (
    <main className="lab-page sub">
      <LabSwitcher current="subtraction" />
      <div className="terminal sub-terminal">
        <Header name={identity.name} tagline={identity.tagline} avatar={identity.avatar} />
        {blocks.map((block, i) =>
          block.label ? (
            <LabeledBlock key={block.label} label={block.label} items={block.items} />
          ) : (
            <div key={`block-${i}`} className="sub-block">
              <Rows items={block.items} />
            </div>
          )
        )}
        <footer className="links-footer sub-footer">
          <ThemeToggle placement="up" />
        </footer>
      </div>
    </main>
  )
}
