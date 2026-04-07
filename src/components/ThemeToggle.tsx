import { useRef } from 'react'
import { useTheme } from '../ThemeContext'

const THEMES = ['default', 'rose', 'paper', 'stone', 'ember', 'pine', 'harbor', 'dusk', 'phosphor'] as const

const THEME_LABELS: Record<'default' | 'rose' | 'paper' | 'stone' | 'ember' | 'pine' | 'harbor' | 'dusk' | 'phosphor', string> = {
  default: '--dark',
  rose: '--rose',
  paper: '--paper',
  stone: '--stone',
  ember: '--ember',
  pine: '--pine',
  harbor: '--harbor',
  dusk: '--dusk',
  phosphor: '--phos',
}

export default function ThemeToggle() {
  const { theme, setTheme, crtEnabled, setCrtEnabled } = useTheme()
  const groupRef = useRef<HTMLDivElement>(null)

  const currentThemeIndex = THEMES.indexOf(theme)

  const focusThemeAtIndex = (index: number) => {
    const nextTheme = THEMES[index]
    setTheme(nextTheme)

    requestAnimationFrame(() => {
      const button = groupRef.current?.querySelector<HTMLButtonElement>(
        `button[data-theme-option="${nextTheme}"]`
      )
      button?.focus()
    })
  }

  const handleThemeKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    let nextIndex: number | null = null

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (currentThemeIndex + 1) % THEMES.length
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (currentThemeIndex - 1 + THEMES.length) % THEMES.length
        break
      case 'Home':
        nextIndex = 0
        break
      case 'End':
        nextIndex = THEMES.length - 1
        break
      default:
        break
    }

    if (nextIndex === null) return

    event.preventDefault()
    focusThemeAtIndex(nextIndex)
  }

  return (
    <div ref={groupRef} className="theme-toggle" role="radiogroup" aria-label="Theme">
      <span className="theme-prompt" aria-hidden="true">
        theme
      </span>
      {THEMES.map((t) => (
        <button
          type="button"
          key={t}
          data-theme-option={t}
          className={`theme-btn theme-btn--${t}${theme === t ? ' theme-btn--active' : ''}`}
          onClick={() => setTheme(t)}
          onKeyDown={handleThemeKeyDown}
          aria-label={`${t} theme`}
          role="radio"
          aria-checked={theme === t}
          tabIndex={theme === t ? 0 : -1}
        >
          {THEME_LABELS[t]}
        </button>
      ))}
      <button
        type="button"
        className={`crt-toggle${crtEnabled ? ' crt-toggle--active' : ''}`}
        onClick={() => setCrtEnabled(!crtEnabled)}
        aria-label="Toggle CRT effect"
        aria-pressed={crtEnabled}
      >
        CRT
      </button>
    </div>
  )
}
