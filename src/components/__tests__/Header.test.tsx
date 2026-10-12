import { render, screen } from '@testing-library/react'
import { profile } from '../../config/profile'
import Header from '../Header'

describe('Header', () => {
  beforeEach(() => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders the full tagline and epigraph on first render', () => {
    render(<Header {...profile} />)

    const tagline = screen.getByText(profile.tagline)
    expect(tagline).toHaveClass('tagline')
    expect(tagline.querySelector('.cursor')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText(profile.epigraph)).toHaveClass('epigraph')
  })
})
