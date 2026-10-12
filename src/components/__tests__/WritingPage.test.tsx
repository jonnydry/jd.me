import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '../../ThemeContext'
import WritingPage from '../WritingPage'
import type { WritingSample } from '../../config/writing'

const { fixtureSamples } = vi.hoisted(() => {
  const words = (count: number) => Array.from({ length: count }, () => 'word').join(' ')
  const fixtureSamples: WritingSample[] = [
    {
      slug: 'sectioned',
      title: 'Sectioned Essay',
      date: '2016-05-18',
      tags: ['poetry'],
      excerpt: 'An essay with sections.',
      body: [
        { type: 'paragraph', text: words(460) },
        { type: 'heading', text: 'First Part' },
        { type: 'paragraph', text: words(230) },
        { type: 'heading', text: 'Second Part' },
        { type: 'citation', entries: ['Whitman, Walt. *Leaves of Grass*.'] },
      ],
    },
    {
      slug: 'unsectioned',
      title: 'Unsectioned Essay',
      date: '2024-11-15',
      tags: ['philosophy'],
      excerpt: 'An essay without sections.',
      body: [{ type: 'paragraph', text: words(100) }],
    },
  ]
  return { fixtureSamples }
})

vi.mock('../../config/writing', () => ({ writingSamples: fixtureSamples }))

const renderAt = (path: string) =>
  render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[path]}>
        <WritingPage />
      </MemoryRouter>
    </ThemeProvider>
  )

describe('WritingPage', () => {
  beforeEach(() => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  })

  it('lists essays with readable dates and reading time', async () => {
    renderAt('/writing')

    const date = await screen.findByText('May 18, 2016')
    expect(date.tagName).toBe('TIME')
    expect(date).toHaveAttribute('dateTime', '2016-05-18')
    expect(screen.getByText(/3 min read/)).toBeInTheDocument()
    expect(screen.getByText('Nov 15, 2024')).toBeInTheDocument()
    expect(screen.getByText(/1 min read/)).toBeInTheDocument()
  })

  it('shows the contents box when an essay has multiple sections', async () => {
    renderAt('/writing/sectioned')

    const toc = await screen.findByRole('navigation', { name: 'Table of contents' })
    expect(toc).toHaveTextContent('First Part')
    expect(toc).toHaveTextContent('Works Cited')
  })

  it('hides the contents box when an essay has no sections', async () => {
    renderAt('/writing/unsectioned')

    expect(await screen.findByRole('heading', { name: 'Unsectioned Essay' })).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Table of contents' })).not.toBeInTheDocument()
  })
})
