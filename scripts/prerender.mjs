import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { links, isGroup } from '../src/config/links.ts'
import { profile } from '../src/config/profile.ts'
import { resume } from '../src/config/resume.ts'
import { SHORTCUT_KEYS } from '../src/utils/shortcut.ts'
import {
  AVATAR_ALT,
  DEFAULT_OG_IMAGE,
  HOME_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  getRouteMetadata,
} from '../src/config/seo.ts'
import { writingSamples } from '../src/config/writing.ts'

const distDir = path.resolve('dist')
const templatePath = path.join(distDir, 'index.html')

const routes = ['/', '/resume', '/writing', ...writingSamples.map((sample) => `/writing/${sample.slug}`)]

const AVATAR_AVIF_SRC_SET = '/avatar-360.avif 360w, /avatar-720.avif 720w'
const AVATAR_FALLBACK_SRC_SET = '/avatar-360.jpg 360w, /avatar.jpg 720w'
const AVATAR_SIZES = '(max-width: 640px) 80px, 88px'

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatInline(text) {
  return escapeHtml(text).replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

function absoluteUrl(url) {
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/')) return `${SITE_URL}${url}`
  return `${SITE_URL}/${url}`
}

function getHomeDescription() {
  for (const entry of links) {
    if (isGroup(entry) && entry.label === 'Live Projects') {
      const titles = entry.children.map((child) => child.title)
      const featured =
        titles.length <= 1
          ? titles[0] ?? ''
          : titles.length === 2
            ? `${titles[0]} and ${titles[1]}`
            : `${titles.slice(0, -1).join(', ')}, and ${titles[titles.length - 1]}`
      return `Personal links, live projects, writing samples, and resume from ${SITE_NAME}. Featuring ${featured}.`
    }
  }
  return HOME_DESCRIPTION
}

function replaceAttr(html, pattern, replacement) {
  if (!pattern.test(html)) {
    throw new Error(`Prerender template missing expected tag: ${pattern}`)
  }
  return html.replace(pattern, replacement)
}

function upsertJsonLd(html, data) {
  const tag = `    <script type="application/ld+json">${JSON.stringify(data)}</script>`
  if (html.includes('application/ld+json')) {
    return html.replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      tag.trim()
    )
  }
  return html.replace('</head>', `${tag}\n  </head>`)
}

function injectRootContent(html, content) {
  return replaceAttr(
    html,
    /<div id="root"><\/div>/,
    `<div id="root">${content}</div>`
  )
}

function collectExternalProfileUrls() {
  const urls = []
  for (const entry of links) {
    if (isGroup(entry)) {
      if (entry.label === 'Social') {
        for (const child of entry.children) urls.push(child.url)
      }
      continue
    }
    if (entry.icon === 'github') urls.push(entry.url)
  }
  return [...new Set(urls)]
}

function collectOwnedProjects() {
  for (const entry of links) {
    if (isGroup(entry) && entry.label === 'Live Projects') {
      return entry.children.map((child) => ({
        '@type': 'WebSite',
        name: child.title,
        url: child.url,
        description: child.desc,
      }))
    }
  }
  return []
}

function buildLinkListItems() {
  const items = []
  let position = 1
  for (const entry of links) {
    if (isGroup(entry)) {
      for (const child of entry.children) {
        items.push({
          '@type': 'ListItem',
          position,
          name: child.title,
          url: absoluteUrl(child.url),
          description: child.desc,
        })
        position += 1
      }
      continue
    }

    items.push({
      '@type': 'ListItem',
      position,
      name: entry.title,
      url: absoluteUrl(entry.url),
      description: entry.desc,
    })
    position += 1
  }
  return items
}

// The markup below mirrors the client components' classes so the page doesn't move when
// createRoot replaces it; JS-only controls are rendered invisibly to reserve their space.
function renderThemeTogglePlaceholder(placement) {
  return `<div class="theme-toggle theme-toggle--${placement}" style="visibility: hidden"><button type="button" class="theme-trigger"><span class="theme-prompt">theme</span></button><button type="button" class="crt-toggle">CRT</button></div>`
}

function renderBackLink(href, label) {
  return `<a class="resume-back" href="${href}"><span class="resume-back-arrow">←</span> ${label}</a>${renderThemeTogglePlaceholder('down')}`
}

function renderPageShell(content) {
  return `<div id="main-content" class="page-slider"><div class="page">${content}</div></div>`
}

function formatPosition(position) {
  return String(position).padStart(2, '0')
}

function renderLinkIcon(item) {
  if (item.iconSrc && item.iconMask) {
    return `<span class="link-icon link-icon--mask" style="--icon-mask: url('${escapeHtml(item.iconSrc)}')" aria-hidden="true"></span>`
  }
  if (item.iconSrc) {
    return `<img src="${escapeHtml(item.iconSrc)}" alt="" class="link-icon link-icon--img" width="24" height="24" />`
  }
  return '<svg class="link-icon" aria-hidden="true"></svg>'
}

function renderLinkItem(item, position, child = false) {
  const rel = item.internal ? '' : ' rel="noopener noreferrer"'
  const target = item.internal ? '' : ' target="_blank"'
  const style = !child && position ? ` style="animation-delay: ${(position - 1) * 60}ms"` : ''
  const desc = item.desc ? ` <span class="link-row-desc">${escapeHtml(item.desc)}</span>` : ''
  return `<a class="link-row${child ? ' link-row--child' : ''}" href="${escapeHtml(absoluteUrl(item.url))}"${target}${rel}${style}><span class="link-row-index">${position ? formatPosition(position) : ''}</span> <span class="link-row-icon">${renderLinkIcon(item)}</span> <span class="link-row-text"><span class="link-row-title">${escapeHtml(item.title)}</span>${desc}</span> <span class="link-row-arrow">${item.internal ? '→' : '↗'}</span></a>`
}

function renderLinkGroup(group, position) {
  const style = ` style="animation-delay: ${(position - 1) * 60}ms"`
  const icon = `<span class="link-row-icon">${renderLinkIcon(group)}</span>`

  if (group.collapsible === false) {
    const children = group.children.map((child, i) => renderLinkItem(child, position + i, true)).join('')
    return `<section class="link-group link-group--inline"${style}><div class="link-row link-row--label"><span class="link-row-index"></span>${icon}<h2 class="link-row-title">${escapeHtml(group.label)}</h2></div>${children}</section>`
  }

  const children = group.children.map((child) => renderLinkItem(child, undefined, true)).join('')
  return `<details class="link-group"${style}><summary class="link-row link-row--group"><span class="link-row-index">${formatPosition(position)}</span> ${icon} <span class="link-row-text"><span class="link-row-title">${escapeHtml(group.label)}</span> <span class="link-row-desc">${group.children.length} links</span></span> <span class="link-row-chevron">▾</span></summary><div class="link-group-children"><div class="link-group-children-inner">${children}</div></div></details>`
}

function renderHomeContent() {
  let position = 0
  const rows = links
    .map((entry) => {
      if (isGroup(entry)) {
        const start = position + 1
        position += entry.collapsible === false ? entry.children.length : 1
        return renderLinkGroup(entry, start)
      }
      position += 1
      return renderLinkItem(entry, position)
    })
    .join('')
  const shortcutCount = Math.min(position, SHORTCUT_KEYS.length)
  const shortcutRange =
    shortcutCount === SHORTCUT_KEYS.length ? '0-9' : shortcutCount === 1 ? '1' : `1-${shortcutCount}`

  return `
<main class="app">
  <div class="terminal">
    <header class="header">
      <span class="avatar-wrap"><picture><source srcset="${AVATAR_AVIF_SRC_SET}" sizes="${AVATAR_SIZES}" type="image/avif" /><img class="avatar" src="${escapeHtml(profile.avatar)}" srcset="${AVATAR_FALLBACK_SRC_SET}" sizes="${AVATAR_SIZES}" alt="${escapeHtml(AVATAR_ALT)}" width="720" height="720" fetchpriority="high" /></picture></span>
      <h1 class="name">${escapeHtml(profile.name)}</h1>
      <p class="tagline">${escapeHtml(profile.tagline)}</p>
    </header>
    <nav id="links-content" class="links-section" aria-label="Personal links">
      <div class="links-list">${rows}</div>
    </nav>
    <footer class="links-footer">${renderThemeTogglePlaceholder('up')}</footer>
    <p class="keyboard-hint" aria-hidden="true" style="visibility: hidden">press ${shortcutRange} to navigate · t for theme</p>
  </div>
</main>`.trim()
}

function renderResumeContent() {
  const education = resume.education
    .map(
      (entry) =>
        `<li><strong>${escapeHtml(entry.school)}</strong>${entry.location ? ` — ${escapeHtml(entry.location)}` : ''}: ${escapeHtml(entry.degree)}${entry.year ? ` (${escapeHtml(entry.year)})` : ''}</li>`
    )
    .join('')

  const experience = resume.experience
    .map((entry) => {
      const roles = entry.roles
        .map((role) => {
          const bullets = role.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')
          return `<div><h3>${escapeHtml(role.title)}</h3><p>${escapeHtml(role.period)}</p><ul>${bullets}</ul></div>`
        })
        .join('')
      return `<section><h2>${escapeHtml(entry.company)}</h2><p>${escapeHtml(entry.location)}</p>${roles}</section>`
    })
    .join('')

  const additional = resume.additionalExperience
    .map(
      (entry) =>
        `<li><strong>${escapeHtml(entry.title)}</strong> (${escapeHtml(entry.period)}) — ${escapeHtml(entry.description)}</li>`
    )
    .join('')

  return `
<main class="app app--top">
  <article class="resume">
    ${renderBackLink(`${SITE_URL}/`, 'links')}
    <header class="resume-header">
      <h1 class="resume-name">${escapeHtml(resume.name)}</h1>
      <p class="resume-contact">${escapeHtml(resume.location)} · <a href="mailto:${escapeHtml(resume.email)}">${escapeHtml(resume.email)}</a></p>
    </header>
    <section><h2>Education</h2><ul>${education}</ul></section>
    <section><h2>Professional Experience</h2>${experience}</section>
    <section><h2>Additional Experience</h2><ul>${additional}</ul></section>
    <section><h2>Skills</h2><ul>${resume.skills.map((skill) => `<li>${escapeHtml(skill)}</li>`).join('')}</ul></section>
    <section><h2>Awards &amp; Honors</h2><ul>${resume.awards.map((award) => `<li>${escapeHtml(award)}</li>`).join('')}</ul></section>
    <section><h2>Interests</h2><ul>${resume.interests.map((interest) => `<li>${escapeHtml(interest)}</li>`).join('')}</ul></section>
  </article>
</main>`.trim()
}

function renderWritingBlock(block) {
  switch (block.type) {
    case 'paragraph':
      return `<p>${formatInline(block.text)}</p>`
    case 'quote':
      return `<blockquote><p>${formatInline(block.text)}</p>${block.attribution ? `<cite>${escapeHtml(block.attribution)}</cite>` : ''}</blockquote>`
    case 'verse':
      return `<pre>${block.lines.map((line) => escapeHtml(line)).join('\n')}</pre>${block.attribution ? `<p><cite>${escapeHtml(block.attribution)}</cite></p>` : ''}`
    case 'image':
      return `<figure><img src="${escapeHtml(absoluteUrl(block.src))}" alt="${escapeHtml(block.alt)}" />${block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : ''}</figure>`
    case 'heading':
      return `<h2>${escapeHtml(block.text)}</h2>`
    case 'citation':
      return `<ul>${block.entries.map((entry) => `<li>${escapeHtml(entry)}</li>`).join('')}</ul>`
    default: {
      const _exhaustive = block
      throw new Error(`Unhandled writing block: ${JSON.stringify(_exhaustive)}`)
    }
  }
}

function renderWritingIndexContent() {
  const items = writingSamples
    .map(
      (sample) => `
      <li>
        <a href="${SITE_URL}/writing/${escapeHtml(sample.slug)}"><strong>${escapeHtml(sample.title)}</strong></a>
        ${sample.subtitle ? `<p>${escapeHtml(sample.subtitle)}</p>` : ''}
        <p>${formatInline(sample.excerpt)}</p>
      </li>`
    )
    .join('')

  return `
<main class="app app--top">
  <article class="writing">
    ${renderBackLink(`${SITE_URL}/`, 'links')}
    <header class="writing-header"><h1 class="writing-page-title">Writing</h1></header>
    <ul>${items}</ul>
  </article>
</main>`.trim()
}

function renderWritingSampleContent(sample) {
  const body = sample.body.map(renderWritingBlock).join('\n')
  return `
<main class="app app--top">
  <article class="writing">
    ${renderBackLink(`${SITE_URL}/writing`, 'writing')}
    <header>
      <h1>${escapeHtml(sample.title)}</h1>
      ${sample.subtitle ? `<p>${escapeHtml(sample.subtitle)}</p>` : ''}
      <p><time datetime="${escapeHtml(sample.date)}">${escapeHtml(sample.date)}</time> · ${sample.tags.map(escapeHtml).join(', ')}</p>
    </header>
    ${body}
  </article>
</main>`.trim()
}

function buildHomeJsonLd() {
  const metadata = getRouteMetadata('/')
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        description: metadata.description,
        publisher: { '@id': `${SITE_URL}/#person` },
      },
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: resume.name,
        alternateName: SITE_NAME,
        url: `${SITE_URL}/`,
        image: absoluteUrl(profile.avatar),
        description: profile.tagline,
        email: resume.email,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Boston',
          addressRegion: 'MA',
          addressCountry: 'US',
        },
        sameAs: collectExternalProfileUrls(),
        owns: collectOwnedProjects(),
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE_URL}/#links`,
        name: `${SITE_NAME} links`,
        itemListElement: buildLinkListItems(),
      },
    ],
  }
}

function buildResumeJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: `${SITE_URL}/resume`,
    name: `${SITE_NAME} | Resume`,
    description: getRouteMetadata('/resume').description,
    mainEntity: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: resume.name,
      alternateName: SITE_NAME,
      email: resume.email,
      url: `${SITE_URL}/`,
    },
  }
}

function buildWritingIndexJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    url: `${SITE_URL}/writing`,
    name: `${SITE_NAME} | Writing`,
    description: getRouteMetadata('/writing').description,
    hasPart: writingSamples.map((sample) => ({
      '@type': 'Article',
      headline: sample.title,
      url: `${SITE_URL}/writing/${sample.slug}`,
      datePublished: sample.date,
      description: sample.excerpt.replace(/\*/g, ''),
    })),
  }
}

function buildWritingArticleJsonLd(sample) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: sample.title,
    alternativeHeadline: sample.subtitle,
    datePublished: sample.date,
    description: getRouteMetadata(`/writing/${sample.slug}`).description,
    author: {
      '@type': 'Person',
      name: resume.name,
      alternateName: SITE_NAME,
      url: `${SITE_URL}/`,
    },
    mainEntityOfPage: `${SITE_URL}/writing/${sample.slug}`,
    keywords: sample.tags.join(', '),
  }
}

function contentForRoute(route) {
  if (route === '/') return renderHomeContent()
  if (route === '/resume') return renderResumeContent()
  if (route === '/writing') return renderWritingIndexContent()

  const match = route.match(/^\/writing\/(.+)$/)
  if (match) {
    const sample = writingSamples.find((entry) => entry.slug === match[1])
    if (!sample) throw new Error(`Missing writing sample for route ${route}`)
    return renderWritingSampleContent(sample)
  }

  throw new Error(`Unhandled prerender route: ${route}`)
}

function jsonLdForRoute(route) {
  if (route === '/') return buildHomeJsonLd()
  if (route === '/resume') return buildResumeJsonLd()
  if (route === '/writing') return buildWritingIndexJsonLd()

  const match = route.match(/^\/writing\/(.+)$/)
  if (match) {
    const sample = writingSamples.find((entry) => entry.slug === match[1])
    if (!sample) throw new Error(`Missing writing sample for route ${route}`)
    return buildWritingArticleJsonLd(sample)
  }

  throw new Error(`Unhandled JSON-LD route: ${route}`)
}

function buildHtml(template, route) {
  const metadata = getRouteMetadata(route)
  const canonicalUrl = `${SITE_URL}${metadata.path === '/' ? '/' : metadata.path}`
  const description = route === '/' ? getHomeDescription() : metadata.description

  let html = template
  html = replaceAttr(html, /<title>.*?<\/title>/, `<title>${escapeHtml(metadata.title)}</title>`)
  html = replaceAttr(
    html,
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${canonicalUrl}" />`
  )
  html = replaceAttr(
    html,
    /<meta name="description" content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapeHtml(description)}" />`
  )
  html = replaceAttr(
    html,
    /<meta name="robots" content="[^"]*"\s*\/>/,
    `<meta name="robots" content="${escapeHtml(metadata.robots ?? 'index,follow')}" />`
  )
  html = replaceAttr(
    html,
    /<meta property="og:type" content="[^"]*"\s*\/>/,
    `<meta property="og:type" content="${escapeHtml(metadata.type ?? 'website')}" />`
  )
  html = replaceAttr(
    html,
    /<meta property="og:title" content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${escapeHtml(metadata.title)}" />`
  )
  html = replaceAttr(
    html,
    /<meta property="og:description" content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${escapeHtml(description)}" />`
  )
  html = replaceAttr(
    html,
    /<meta property="og:url" content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${canonicalUrl}" />`
  )
  html = replaceAttr(
    html,
    /<meta property="og:image" content="[^"]*"\s*\/>/,
    `<meta property="og:image" content="${DEFAULT_OG_IMAGE}" />`
  )
  html = replaceAttr(
    html,
    /<meta name="twitter:title" content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${escapeHtml(metadata.title)}" />`
  )
  html = replaceAttr(
    html,
    /<meta name="twitter:description" content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`
  )
  html = replaceAttr(
    html,
    /<meta name="twitter:image" content="[^"]*"\s*\/>/,
    `<meta name="twitter:image" content="${DEFAULT_OG_IMAGE}" />`
  )

  if (metadata.type === 'article' && !html.includes('article:author')) {
    const articleTags = [
      `<meta property="article:author" content="${SITE_NAME}" />`,
      `<meta name="twitter:label1" content="Author" />`,
      `<meta name="twitter:data1" content="${SITE_NAME}" />`,
    ].join('\n    ')
    html = html.replace(
      `<meta name="twitter:image" content="${DEFAULT_OG_IMAGE}" />`,
      `<meta name="twitter:image" content="${DEFAULT_OG_IMAGE}" />\n    ${articleTags}`
    )
  }

  html = upsertJsonLd(html, jsonLdForRoute(route))
  html = injectRootContent(html, renderPageShell(contentForRoute(route)))
  return html
}

async function main() {
  const template = await readFile(templatePath, 'utf8')

  if (!template.includes('<div id="root"></div>')) {
    throw new Error('Unexpected dist/index.html template; #root shell not found')
  }

  const homeHtml = buildHtml(template, '/')
  await writeFile(path.join(distDir, 'index.html'), homeHtml)

  await Promise.all(
    routes
      .filter((route) => route !== '/')
      .map(async (route) => {
        const outputDir = path.join(distDir, route.slice(1))
        const outputFile = path.join(outputDir, 'index.html')
        await mkdir(outputDir, { recursive: true })
        await writeFile(outputFile, buildHtml(template, route))
      })
  )

  const requiredSnippets = ['sanchopoetry.com', 'mashnotes.me', 'harborpoetry.com', 'emuphoria.com', 'application/ld+json']
  for (const snippet of requiredSnippets) {
    if (!homeHtml.includes(snippet)) {
      throw new Error(`Prerendered homepage missing expected content: ${snippet}`)
    }
  }

  console.log(`Prerendered ${routes.length} routes with crawlable content`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
