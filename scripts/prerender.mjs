import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const distDir = path.resolve('dist')
const templatePath = path.join(distDir, 'index.html')
const defaultDescription = 'Personal links, live projects, writing samples, and resume from Jonny D.'
const defaultImage = 'https://jdry.me/avatar.jpg'

const routes = [
  {
    route: '/resume',
    title: 'Jonny D | Resume',
    description: 'Resume, experience, skills, and background for Jonny D.',
    type: 'website',
  },
  {
    route: '/writing',
    title: 'Jonny D | Writing',
    description: 'Essays, criticism, fiction, and other writing by Jonny D.',
    type: 'website',
  },
  {
    route: '/writing/lyrical-conceptions-of-self-and-nation',
    title: 'Lyrical Conceptions of Self and Nation | Jonny D',
    description: 'An essay on Whitman, Hughes, democracy, and the American lyric tradition.',
    type: 'article',
  },
  {
    route: '/writing/diving-into-the-void',
    title: 'Diving into the Void | Jonny D',
    description: 'A reading of Clarice Lispector, existentialism, and the unstable search for selfhood.',
    type: 'article',
  },
]

function replaceTag(html, pattern, replacement) {
  return html.replace(pattern, replacement)
}

function buildHtml(template, { route, title, description, type }) {
  const canonicalUrl = `https://jdry.me${route}`

  let html = template
  html = replaceTag(html, /<title>.*?<\/title>/, `<title>${title}</title>`)
  html = replaceTag(
    html,
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${canonicalUrl}" />`
  )
  html = replaceTag(
    html,
    /<meta name="description" content="[^"]*"\s*\/>/,
    `<meta name="description" content="${description}" />`
  )
  html = replaceTag(
    html,
    /<meta property="og:type" content="[^"]*"\s*\/>/,
    `<meta property="og:type" content="${type}" />`
  )
  html = replaceTag(
    html,
    /<meta property="og:title" content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${title}" />`
  )
  html = replaceTag(
    html,
    /<meta property="og:description" content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${description}" />`
  )
  html = replaceTag(
    html,
    /<meta property="og:url" content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${canonicalUrl}" />`
  )
  html = replaceTag(
    html,
    /<meta property="og:image" content="[^"]*"\s*\/>/,
    `<meta property="og:image" content="${defaultImage}" />`
  )
  html = replaceTag(
    html,
    /<meta name="twitter:title" content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${title}" />`
  )
  html = replaceTag(
    html,
    /<meta name="twitter:description" content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${description}" />`
  )
  html = replaceTag(
    html,
    /<meta name="twitter:image" content="[^"]*"\s*\/>/,
    `<meta name="twitter:image" content="${defaultImage}" />`
  )

  if (type === 'article') {
    const articleTags = [
      `<meta property="article:author" content="Jonny D" />`,
      `<meta name="twitter:label1" content="Author" />`,
      `<meta name="twitter:data1" content="Jonny D" />`,
    ].join('\n    ')

    if (!html.includes('article:author')) {
      html = html.replace(
        `<meta name="twitter:image" content="${defaultImage}" />`,
        `<meta name="twitter:image" content="${defaultImage}" />\n    ${articleTags}`
      )
    }
  }

  return html
}

async function main() {
  const template = await readFile(templatePath, 'utf8')

  if (!template.includes(defaultDescription)) {
    throw new Error('Unexpected dist/index.html template; prerender tags not found')
  }

  await Promise.all(
    routes.map(async (entry) => {
      const outputDir = path.join(distDir, entry.route.slice(1))
      const outputFile = path.join(outputDir, 'index.html')
      await mkdir(outputDir, { recursive: true })
      await writeFile(outputFile, buildHtml(template, entry))
    })
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
