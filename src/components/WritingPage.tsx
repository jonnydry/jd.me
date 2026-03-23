import { Fragment, useRef, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { ContentBlock, WritingSample } from '../config/writing'
import { useScrollProgress } from '../hooks/useScrollProgress'
import ThemeToggle from './ThemeToggle'
import { useGlow } from '../hooks/useGlow'

function normalizePathname(pathname: string) {
  if (pathname === '/') return pathname
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

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

function getResponsiveImageSources(src: string) {
  if (!src.endsWith('.jpg')) {
    return {
      avifSrcSet: undefined,
      fallbackSrcSet: undefined,
    }
  }

  const base = src.slice(0, -4)

  return {
    avifSrcSet: `${base}-480.avif 480w, ${base}-800.avif 800w, ${base}-1200.avif 1200w`,
    fallbackSrcSet: `${base}-480.jpg 480w, ${base}-800.jpg 800w, ${src} 1200w`,
  }
}

function renderInlineText(text: string) {
  const parts = text.split(/(\*[^*]+\*)/g)

  if (parts.length === 1) return text

  return parts.map((part, index) => {
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={index}>{part.slice(1, -1)}</em>
    }

    return <Fragment key={index}>{part}</Fragment>
  })
}

function ContentRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'paragraph':
      return <p className="writing-body-p">{renderInlineText(block.text)}</p>
    case 'heading':
      return (
        <h2 id={slugify(block.text)} className="writing-body-heading">
          {block.text}
        </h2>
      )
    case 'quote':
      return (
        <blockquote className="writing-blockquote">
          <p>{renderInlineText(block.text)}</p>
          {block.attribution && (
            <cite className="writing-blockquote-cite">{renderInlineText(block.attribution)}</cite>
          )}
        </blockquote>
      )
    case 'verse':
      return (
        <div className="writing-verse">
          {block.lines.map((line, i) => (
            <span key={i} className="writing-verse-line">
              {line ? renderInlineText(line) : '\u00A0'}
            </span>
          ))}
          {block.attribution && (
            <cite className="writing-verse-cite">{renderInlineText(block.attribution)}</cite>
          )}
        </div>
      )
    case 'image': {
      const { avifSrcSet, fallbackSrcSet } = getResponsiveImageSources(block.src)
      return (
        <figure className="writing-figure">
          <picture>
            {avifSrcSet && (
              <source
                srcSet={avifSrcSet}
                sizes="(max-width: 640px) 92vw, 690px"
                type="image/avif"
              />
            )}
            <img
              className="writing-figure-img"
              src={block.src}
              srcSet={fallbackSrcSet}
              sizes="(max-width: 640px) 92vw, 690px"
              alt={block.alt}
              width={1200}
              height={1600}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
            />
          </picture>
          {block.caption && (
            <figcaption className="writing-figure-caption">
              {renderInlineText(block.caption)}
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
              <li key={i}>{renderInlineText(entry)}</li>
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
        type="button"
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
        <h3 className="writing-list-item-title">{sample.title}</h3>
        <time className="writing-list-item-date" dateTime={sample.date}>{sample.date}</time>
      </div>
      <p className="writing-list-item-excerpt">{renderInlineText(sample.excerpt)}</p>
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
  const [writingSamples, setWritingSamples] = useState<WritingSample[] | null>(null)

  useEffect(() => {
    import('../config/writing').then((m) => setWritingSamples(m.writingSamples))
  }, [])

  const normalizedPathname = normalizePathname(location.pathname)
  const match = normalizedPathname.match(/^\/writing\/(.+)$/)
  const slug = match?.[1]
  const isDetailRoute = Boolean(slug)
  const sample = slug && writingSamples ? writingSamples.find((s) => s.slug === slug) : null

  useScrollProgress(progressRef, slug ?? 'list')

  const handleTocClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const reducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
    }
  }

  if (!writingSamples) {
    return (
      <main className="app app--top">
        <div className="writing">
          <button type="button" className="resume-back" onClick={() => navigate('/')}>
            <span className="resume-back-arrow">←</span> links
          </button>
          <ThemeToggle />
          <p className="writing-page-desc" style={{ marginTop: '2rem', opacity: 0.7 }}>
            Loading…
          </p>
        </div>
      </main>
    )
  }

  if (sample) {
    const toc = buildToc(sample)

    return (
      <main className="app app--top">
        <div className="scroll-progress" ref={progressRef} />
        <div className="writing">
          <button type="button" className="resume-back" onClick={() => navigate('/writing')}>
            <span className="resume-back-arrow">←</span> writing
          </button>
          <ThemeToggle />

          <article className="writing-detail" style={{ animationDelay: '80ms' }}>
            <header id="introduction" className="writing-detail-header">
              <h1 className="writing-detail-title">{sample.title}</h1>
              {sample.subtitle && (
                <p className="writing-detail-subtitle">{renderInlineText(sample.subtitle)}</p>
              )}
              <div className="writing-detail-meta">
                <time className="writing-detail-date" dateTime={sample.date}>{sample.date}</time>
                <div className="writing-detail-tags">
                  {sample.tags.map((tag) => (
                    <span key={tag} className="writing-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </header>
            <nav className="writing-toc" aria-label="Table of contents">
              <span className="writing-toc-label">Contents</span>
              <div className="writing-toc-items">
                {toc.map((entry) => (
                  <button
                    type="button"
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

  if (isDetailRoute) {
    return (
      <main className="app app--top">
        <div className="scroll-progress" ref={progressRef} />
        <div className="writing">
          <button type="button" className="resume-back" onClick={() => navigate('/writing')}>
            <span className="resume-back-arrow">←</span> writing
          </button>
          <ThemeToggle />

          <header className="writing-header" style={{ animationDelay: '80ms' }}>
            <h1 className="writing-page-title">Sample not found</h1>
            <p className="writing-page-desc">That writing sample does not exist.</p>
          </header>
        </div>
      </main>
    )
  }

  return (
    <main className="app app--top">
      <div className="scroll-progress" ref={progressRef} />
      <div className="writing">
        <button type="button" className="resume-back" onClick={() => navigate('/')}>
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
