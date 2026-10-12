import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { shortcutKey } from '../utils/shortcut'
import type { LinkEntry } from '../config/links'

const { fixtureLinks } = vi.hoisted(() => {
  const link = (title: string) => ({ title, url: `https://example.com/${title.toLowerCase().replace(/\s+/g, '-')}` })
  const fixtureLinks: LinkEntry[] = [
    { label: 'Projects', collapsible: false, children: [link('Alpha'), link('Beta'), link('Gamma')] },
    link('Delta'),
    { label: 'More', children: [link('Hidden One'), link('Hidden Two')] },
    link('Epsilon'),
    link('Zeta'),
    link('Eta'),
    link('Theta'),
    { label: 'Support', children: [link('Coffee')] },
    link('Iota'),
  ]
  return { fixtureLinks }
})

vi.mock('../config/links', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../config/links')>()
  return { ...actual, links: fixtureLinks }
})

// A coarse pointer makes App skip idle route-chunk warming, which would otherwise import pages after teardown.
function stubMatchMedia() {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('pointer: coarse'),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

const renderHome = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  )

const rowFor = (name: string) => screen.getByText(name).closest('.link-row') as HTMLElement
const indexLabel = (row: HTMLElement) => row.querySelector('.link-row-index')?.textContent

describe('shortcutKey', () => {
  it('maps rows 1-9 to their digit, row 10 to 0, and later rows to nothing', () => {
    expect(shortcutKey(1)).toBe('1')
    expect(shortcutKey(9)).toBe('9')
    expect(shortcutKey(10)).toBe('0')
    expect(shortcutKey(11)).toBeUndefined()
  })
})

describe('homepage row numbering', () => {
  beforeEach(() => {
    stubMatchMedia()
  })

  it('numbers inline children and top-level rows in display order', () => {
    renderHome()

    const expected: [string, string, string | null][] = [
      ['Alpha', '01', '1'],
      ['Beta', '02', '2'],
      ['Gamma', '03', '3'],
      ['Delta', '04', '4'],
      ['More', '05', '5'],
      ['Epsilon', '06', '6'],
      ['Zeta', '07', '7'],
      ['Eta', '08', '8'],
      ['Theta', '09', '9'],
      ['Support', '10', '0'],
      ['Iota', '11', null],
    ]

    expected.forEach(([name, label, key]) => {
      const row = rowFor(name)
      expect(indexLabel(row), name).toBe(label)
      if (key === null) {
        expect(row, name).not.toHaveAttribute('data-shortcut')
        expect(row, name).not.toHaveAttribute('aria-keyshortcuts')
      } else {
        expect(row, name).toHaveAttribute('data-shortcut', key)
        expect(row, name).toHaveAttribute('aria-keyshortcuts', key)
      }
    })
  })

  it('leaves children of collapsible groups unnumbered', () => {
    renderHome()

    const hidden = rowFor('Hidden One')
    expect(indexLabel(hidden)).toBe('')
    expect(hidden).not.toHaveAttribute('data-shortcut')
    expect(document.querySelectorAll('[data-shortcut="0"]')).toHaveLength(1)
  })

  it('advertises the 0-9 range in the keyboard hint', () => {
    renderHome()

    expect(screen.getByText('press 0-9 to navigate · t for theme')).toBeInTheDocument()
  })

  it('activates the tenth row with the 0 key', () => {
    renderHome()

    const support = rowFor('Support')
    expect(support).toHaveAttribute('aria-expanded', 'false')

    fireEvent.keyDown(window, { key: '0' })

    expect(support).toHaveAttribute('aria-expanded', 'true')
    expect(support).toHaveFocus()
  })

  it('ignores digit keys pressed with a modifier', () => {
    renderHome()

    fireEvent.keyDown(window, { key: '0', ctrlKey: true })
    fireEvent.keyDown(window, { key: '5', metaKey: true })

    expect(rowFor('Support')).toHaveAttribute('aria-expanded', 'false')
    expect(rowFor('More')).toHaveAttribute('aria-expanded', 'false')
  })
})
