import { useLocation, useNavigate } from 'react-router-dom'
import { writingSamples } from '../config/writing'
import type { ContentBlock, WritingSample } from '../config/writing'
import ThemeToggle from './ThemeToggle'

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function buildToc(sample: WritingSample) {
  const entries: { id: string; label: string }[] = [
    { id: 'introduction', label: 'Introduction' },
  ]
  for (const block of sample.body) {
    if (block.type === 'heading') {
      entries.push({ id: slugify(block.text), label: block.text })
    }
    if (block.type === 'citation') {
      entries.push({ id: 'works-cited', label: 'Works Cited' })
    }
  }
  return entries
}

function ContentRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'paragraph':
      return <p className="writing-body-p">{block.text}</p>
    case 'heading':
      return (
        <h2 id={slugify(block.text)} className="writing-body-heading">
          {block.text}
        </h2>
      )
    case 'quote':
      return (
        <blockquote className="writing-blockquote">
          <p>{block.text}</p>
          {block.attribution && (
            <cite className="writing-blockquote-cite">{block.attribution}</cite>
          )}
        </blockquote>
      )
    case 'verse':
      return (
        <div className="writing-verse">
          {block.lines.map((line, i) => (
            <span key={i} className="writing-verse-line">
              {line || '\u00A0'}
            </span>
          ))}
          {block.attribution && (
            <cite className="writing-verse-cite">{block.attribution}</cite>
          )}
        </div>
      )
    case 'image':
      return (
        <figure className="writing-figure">
          <img
            className="writing-figure-img"
            src={block.src}
            alt={block.alt}
            loading="lazy"
          />
          {block.caption && (
            <figcaption className="writing-figure-caption">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )
    case 'citation':
      return (
        <section id="works-cited" className="writing-citations">
          <h2 className="writing-body-heading">Works Cited</h2>
          <ul className="writing-citations-list">
            {block.entries.map((entry, i) => (
              <li key={i}>{entry}</li>
            ))}
          </ul>
        </section>
      )
  }
}

export default function WritingPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const match = location.pathname.match(/^\/writing\/(.+)$/)
  const slug = match?.[1]
  const sample = slug ? writingSamples.find((s) => s.slug === slug) : null

  const handleTocClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Detail view
  if (sample) {
    const toc = buildToc(sample)

    return (
      <main className="app">
        <div className="writing">
          <button className="resume-back" onClick={() => navigate('/writing')}>
            <span className="resume-back-arrow">←</span> writing
          </button>
          <ThemeToggle />

          <article className="writing-detail" style={{ animationDelay: '80ms' }}>
            <header id="introduction" className="writing-detail-header">
              <h1 className="writing-detail-title">{sample.title}</h1>
              {sample.subtitle && (
                <p className="writing-detail-subtitle">{sample.subtitle}</p>
              )}
              <div className="writing-detail-meta">
                <time className="writing-detail-date">{sample.date}</time>
                <div className="writing-detail-tags">
                  {sample.tags.map((tag) => (
                    <span key={tag} className="writing-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </header>
            <nav className="writing-toc">
              <span className="writing-toc-label">Contents</span>
              <div className="writing-toc-items">
                {toc.map((entry) => (
                  <button
                    key={entry.id}
                    className="writing-toc-link"
                    onClick={() => handleTocClick(entry.id)}
                  >
                    {entry.label}
                  </button>
                ))}
              </div>
            </nav>
            <div className="writing-detail-body">
              {sample.body.map((block, i) => (
                <ContentRenderer key={i} block={block} />
              ))}
            </div>
          </article>
        </div>
      </main>
    )
  }

  // List view
  return (
    <main className="app">
      <div className="writing">
        <button className="resume-back" onClick={() => navigate('/')}>
          <span className="resume-back-arrow">←</span> links
        </button>
        <ThemeToggle />

        <header className="writing-header" style={{ animationDelay: '80ms' }}>
          <h1 className="writing-page-title">Writing</h1>
          <p className="writing-page-desc">Essays, fiction, and other things.</p>
        </header>

        <div className="writing-list">
          {writingSamples.map((s, i) => (
            <button
              key={s.slug}
              className="writing-list-item"
              style={{ animationDelay: `${(i + 2) * 80}ms` }}
              onClick={() => navigate(`/writing/${s.slug}`)}
            >
              <div className="writing-list-item-top">
                <h2 className="writing-list-item-title">{s.title}</h2>
                <time className="writing-list-item-date">{s.date}</time>
              </div>
              <p className="writing-list-item-excerpt">{s.excerpt}</p>
              <div className="writing-list-item-tags">
                {s.tags.map((tag) => (
                  <span key={tag} className="writing-tag">{tag}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
