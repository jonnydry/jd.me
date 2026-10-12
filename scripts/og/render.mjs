// Renders public/og.png (1200x630) from template.html with a system Chromium.
// Usage: npm run og   (set CHROMIUM_PATH if chromium isn't on PATH)
import { execFileSync } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { links, isGroup } from '../../src/config/links.ts'
import { profile } from '../../src/config/profile.ts'
import { SITE_URL } from '../../src/config/seo.ts'

const root = path.resolve(import.meta.dirname, '../..')
const outputPath = path.join(root, 'public/og.png')
const candidates = [process.env.CHROMIUM_PATH, 'chromium', 'chromium-browser', 'google-chrome-stable', 'google-chrome'].filter(Boolean)

function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function findChromium() {
  for (const bin of candidates) {
    try {
      execFileSync(bin, ['--version'], { stdio: 'ignore' })
      return bin
    } catch {
      // Try the next candidate
    }
  }
  throw new Error(`No Chromium found (tried ${candidates.join(', ')}); set CHROMIUM_PATH`)
}

const projects = links.find((entry) => isGroup(entry) && entry.label === 'Live Projects')?.children ?? []

const replacements = {
  fontDir: pathToFileURL(path.join(root, 'node_modules/@fontsource/jetbrains-mono/files')).href,
  avatar: pathToFileURL(path.join(root, 'public/avatar.jpg')).href,
  host: escapeHtml(new URL(SITE_URL).host),
  name: escapeHtml(profile.name),
  tagline: escapeHtml(profile.tagline),
  epigraph: escapeHtml(profile.epigraph),
  projects: projects.map((project) => `<span>${escapeHtml(project.title)}</span>`).join('<i>/</i>'),
}

const template = await readFile(path.join(import.meta.dirname, 'template.html'), 'utf8')
const html = template.replace(/\{\{(\w+)\}\}/g, (_, key) => replacements[key] ?? '')

const workDir = await mkdtemp(path.join(tmpdir(), 'jdme-og-'))
const htmlPath = path.join(workDir, 'og.html')
await writeFile(htmlPath, html)

try {
  execFileSync(findChromium(), [
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    '--allow-file-access-from-files',
    '--force-device-scale-factor=1',
    '--window-size=1200,630',
    '--virtual-time-budget=3000',
    `--screenshot=${outputPath}`,
    pathToFileURL(htmlPath).href,
  ], { stdio: 'ignore' })
} finally {
  await rm(workDir, { recursive: true, force: true })
}

console.log(`Wrote ${path.relative(root, outputPath)}`)
