// Renders public/<resume.pdf> by printing the built /resume page with a system Chromium.
// Usage: npm run resume:pdf   (set CHROMIUM_PATH if chromium isn't on PATH)
import { execFileSync, spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { build, preview } from 'vite'
import { resume } from '../../src/config/resume.ts'

const root = path.resolve(import.meta.dirname, '../..')
const outputPath = path.join(root, 'public', resume.pdf)
const port = 5198
const candidates = [process.env.CHROMIUM_PATH, 'chromium', 'chromium-browser', 'google-chrome-stable', 'google-chrome'].filter(Boolean)

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

// Minimal CDP client over --remote-debugging-pipe (fd 3 in, fd 4 out, NUL-delimited JSON)
function connect(browser) {
  const [, , , input, output] = browser.stdio
  const pending = new Map()
  const listeners = new Set()
  let nextId = 1
  let buffer = ''

  output.on('data', (chunk) => {
    buffer += chunk
    let end
    while ((end = buffer.indexOf('\0')) !== -1) {
      const message = JSON.parse(buffer.slice(0, end))
      buffer = buffer.slice(end + 1)
      const request = pending.get(message.id)
      if (request) {
        pending.delete(message.id)
        if (message.error) request.reject(new Error(`${request.method}: ${message.error.message}`))
        else request.resolve(message.result)
      } else {
        for (const listener of listeners) listener(message)
      }
    }
  })

  const send = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      const id = nextId++
      pending.set(id, { method, resolve, reject })
      input.write(`${JSON.stringify({ id, method, params, sessionId })}\0`)
    })

  const waitFor = (method, sessionId) =>
    new Promise((resolve) => {
      const listener = (message) => {
        if (message.method === method && message.sessionId === sessionId) {
          listeners.delete(listener)
          resolve(message.params)
        }
      }
      listeners.add(listener)
    })

  return { send, waitFor }
}

const workDir = await mkdtemp(path.join(tmpdir(), 'jdme-resume-pdf-'))
const outDir = path.join(workDir, 'dist')

await build({ root, logLevel: 'warn', build: { outDir, emptyOutDir: true } })
const server = await preview({ root, logLevel: 'warn', build: { outDir }, preview: { port, strictPort: true } })
const browser = spawn(
  findChromium(),
  ['--headless', '--disable-gpu', '--no-first-run', '--remote-debugging-pipe', `--user-data-dir=${path.join(workDir, 'profile')}`],
  { stdio: ['ignore', 'ignore', 'ignore', 'pipe', 'pipe'] }
)

try {
  const { send, waitFor } = connect(browser)
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true })

  await send('Page.enable', {}, sessionId)
  const loaded = waitFor('Page.loadEventFired', sessionId)
  await send('Page.navigate', { url: `http://localhost:${port}/resume` }, sessionId)
  await loaded

  await send(
    'Runtime.evaluate',
    {
      expression: `new Promise((resolve) => {
        const ready = () => document.querySelector('.resume-section') ? document.fonts.ready.then(resolve) : setTimeout(ready, 50)
        ready()
      }).then(() => { document.title = ${JSON.stringify(`${resume.name} – Resume`)} })`,
      awaitPromise: true,
    },
    sessionId
  )

  const { data } = await send(
    'Page.printToPDF',
    { preferCSSPageSize: true, displayHeaderFooter: false, generateTaggedPDF: true },
    sessionId
  )
  await writeFile(outputPath, Buffer.from(data, 'base64'))
} finally {
  const exited = once(browser, 'exit')
  browser.kill()
  await exited
  await server.close()
  await rm(workDir, { recursive: true, force: true })
}

console.log(`Wrote ${path.relative(root, outputPath)}`)
