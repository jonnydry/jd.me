import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '../../ThemeContext'
import ThemeToggle from '../ThemeToggle'

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

const openList = () => {
  fireEvent.click(screen.getByRole('button', { name: /^Theme:/ }))
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('renders a compact trigger with the list collapsed', () => {
    renderWithProvider(<ThemeToggle />)

    const trigger = screen.getByRole('button', { name: 'Theme: default' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument()
    expect(screen.queryAllByRole('radio')).toHaveLength(0)
  })

  it('opens a labelled radiogroup with every theme and focuses the checked one', async () => {
    renderWithProvider(<ThemeToggle />)
    openList()

    expect(screen.getByRole('button', { name: 'Theme: default' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('radiogroup', { name: 'Theme' })).toBeInTheDocument()

    const themes = ['default', 'rose', 'paper', 'stone', 'ember', 'pine', 'harbor', 'dusk', 'phosphor']
    themes.forEach((theme) => {
      expect(screen.getByRole('radio', { name: `${theme} theme` })).toBeInTheDocument()
    })

    const defaultButton = screen.getByRole('radio', { name: 'default theme' })
    expect(defaultButton).toHaveAttribute('aria-checked', 'true')
    await vi.waitFor(() => {
      expect(defaultButton).toHaveFocus()
    })
  })

  it('applies a theme on click, then closes and returns focus to the trigger', async () => {
    renderWithProvider(<ThemeToggle />)
    openList()

    fireEvent.click(screen.getByRole('radio', { name: 'rose theme' }))

    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument()
    await vi.waitFor(() => {
      const trigger = screen.getByRole('button', { name: 'Theme: rose' })
      expect(trigger).toHaveFocus()
      expect(document.documentElement).toHaveAttribute('data-theme', 'rose')
    })
  })

  it('closes on Escape and restores focus to the trigger', () => {
    renderWithProvider(<ThemeToggle />)
    openList()

    fireEvent.keyDown(screen.getByRole('radio', { name: 'default theme' }), { key: 'Escape' })

    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Theme: default' })).toHaveFocus()
  })

  it('closes when tabbing out of the list', async () => {
    renderWithProvider(<ThemeToggle />)
    openList()

    fireEvent.keyDown(screen.getByRole('radio', { name: 'default theme' }), { key: 'Tab' })

    await vi.waitFor(() => {
      expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument()
    })
  })

  it('closes when clicking outside', () => {
    renderWithProvider(<ThemeToggle />)
    openList()

    fireEvent.pointerDown(document.body)

    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument()
  })

  it('toggles the list with the t key', () => {
    renderWithProvider(<ThemeToggle />)

    fireEvent.keyDown(window, { key: 't' })
    expect(screen.getByRole('radiogroup', { name: 'Theme' })).toBeInTheDocument()

    fireEvent.keyDown(window, { key: 't' })
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument()
  })

  it('ignores the t key inside an inert page', () => {
    render(
      <ThemeProvider>
        <div inert>
          <ThemeToggle />
        </div>
      </ThemeProvider>
    )

    fireEvent.keyDown(window, { key: 't' })
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument()
  })

  it('supports arrow-key navigation between theme radios', async () => {
    renderWithProvider(<ThemeToggle />)
    openList()

    const defaultButton = screen.getByRole('radio', { name: 'default theme' })
    defaultButton.focus()
    fireEvent.keyDown(defaultButton, { key: 'ArrowDown' })

    const roseButton = screen.getByRole('radio', { name: 'rose theme' })

    await vi.waitFor(() => {
      expect(roseButton).toHaveAttribute('aria-checked', 'true')
      expect(roseButton).toHaveFocus()
    })
    expect(screen.getByRole('radiogroup', { name: 'Theme' })).toBeInTheDocument()
  })

  it('toggles CRT effect', async () => {
    renderWithProvider(<ThemeToggle />)

    const crtButton = screen.getByRole('button', { name: 'Toggle CRT effect' })
    expect(crtButton).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(crtButton)

    await vi.waitFor(() => {
      expect(crtButton).toHaveAttribute('aria-pressed', 'true')
    })
  })
})
