import { useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { writingSamples } from '../config/writing'
import type { ContentBlock, WritingSample } from '../config/writing'
import { useScrollProgress } from '../hooks/useScrollProgress'
import ThemeToggle from './ThemeToggle'
import { useGlow } from '../hooks/useGlow'

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

function getResponsiveImageSrcSet(src: string) {
  if (!src.endsWith('.jpg')) return undefined
  const base = src.slice(0, -4)
  return `${base}-800.jpg 800w, ${src} 1200w`
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
    case 'image': {
      const srcSet = getResponsiveImageSrcSet(block.src)
      return (
        <figure className="writing-figure">
          <img
            className="writing-figure-img"
            src={block.src}
            srcSet={srcSet}
            sizes="(max-width: 640px) 92vw, 690px"
            alt={block.alt}
            width={1200}
            height={1600}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
          />
          {block.caption && (
            <figcaption className="writing-figure-caption">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )
    }
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

function WritingListItem({ sample, index }: { sample: WritingSample; index: number }) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()
  const glowHandlers = useGlow(buttonRef)

  return (
    <button
      ref={buttonRef}
      className="writing-list-item"
      style={{ animationDelay: `${(index + 2) * 80}ms` }}
      onClick={() => navigate(`/writing/${sample.slug}`)}
      onMouseEnter={glowHandlers.handleMouseEnter}
      onMouseLeave={glowHandlers.handleMouseLeave}
      onMouseMove={glowHandlers.handleMouseMove}
    >
      <span className="writing-list-item-glow" />
      <div className="writing-list-item-top">
        <h2 className="writing-list-item-title">{sample.title}</h2>
        <time className="writing-list-item-date">{sample.date}</time>
      </div>
      <p className="writing-list-item-excerpt">{sample.excerpt}</p>
      <div className="writing-list-item-tags">
        {sample.tags.map((tag) => (
          <span key={tag} className="writing-tag">{tag}</span>
        ))}
      </div>
    </button>
  )
}

export default function WritingPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const progressRef = useRef<HTMLDivElement>(null)

  useScrollProgress(progressRef)

  const match = location.pathname.match(/^\/writing\/(.+)$/)
  const slug = match?.[1]
  const sample = slug ? writingSamples.find((s) => s.slug === slug) : null

  const handleTocClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const reducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
    }
  }

  if (sample) {
    const toc = buildToc(sample)

    return (
      <main className="app app--top">
        <div className="scroll-progress" ref={progressRef} />
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

  return (
    <main className="app app--top">
      <div className="scroll-progress" ref={progressRef} />
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
            <WritingListItem key={s.slug} sample={s} index={i} />
          ))}
        </div>
      </div>
    </main>
  )
}
