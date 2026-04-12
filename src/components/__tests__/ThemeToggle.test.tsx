import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '../../ThemeContext'
import ThemeToggle from '../ThemeToggle'

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('renders all theme buttons', () => {
    renderWithProvider(<ThemeToggle />)
    
    const themes = ['default', 'rose', 'paper', 'stone', 'ember', 'pine', 'harbor', 'dusk']
    themes.forEach((theme) => {
      expect(screen.getByRole('radio', { name: `${theme} theme` })).toBeInTheDocument()
    })
  })

  it('renders CRT toggle button', () => {
    renderWithProvider(<ThemeToggle />)
    expect(screen.getByRole('button', { name: 'Toggle CRT effect' })).toBeInTheDocument()
  })

  it('has default theme checked by default', () => {
    renderWithProvider(<ThemeToggle />)
    const defaultButton = screen.getByRole('radio', { name: 'default theme' })
    expect(defaultButton).toHaveAttribute('aria-checked', 'true')
  })

  it('changes theme when button is clicked', async () => {
    renderWithProvider(<ThemeToggle />)
    
    const roseButton = screen.getByRole('radio', { name: 'rose theme' })
    fireEvent.click(roseButton)
    
    await vi.waitFor(() => {
      expect(roseButton).toHaveAttribute('aria-checked', 'true')
    })
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

  it('has radiogroup with proper aria-label', () => {
    renderWithProvider(<ThemeToggle />)
    expect(screen.getByRole('radiogroup', { name: 'Theme' })).toBeInTheDocument()
  })

  it('supports arrow-key navigation between theme radios', async () => {
    renderWithProvider(<ThemeToggle />)

    const defaultButton = screen.getByRole('radio', { name: 'default theme' })
    defaultButton.focus()
    fireEvent.keyDown(defaultButton, { key: 'ArrowRight' })

    const roseButton = screen.getByRole('radio', { name: 'rose theme' })

    await vi.waitFor(() => {
      expect(roseButton).toHaveAttribute('aria-checked', 'true')
      expect(roseButton).toHaveFocus()
    })
  })
})
