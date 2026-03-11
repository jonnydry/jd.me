import { useTheme } from '../ThemeContext'

const THEME_LABELS: Record<'default' | 'rose' | 'paper' | 'stone' | 'ember' | 'pine' | 'harbor' | 'dusk', string> = {
  default: '--dark',
  rose: '--rose',
  paper: '--paper',
  stone: '--stone',
  ember: '--ember',
  pine: '--pine',
  harbor: '--harbor',
  dusk: '--dusk',
}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="theme-toggle" role="radiogroup" aria-label="Theme">
      <span className="theme-prompt" aria-hidden="true">
        theme
      </span>
      {(['default', 'rose', 'paper', 'stone', 'ember', 'pine', 'harbor', 'dusk'] as const).map((t) => (
        <button
          key={t}
          className={`theme-btn theme-btn--${t}${theme === t ? ' theme-btn--active' : ''}`}
          onClick={() => setTheme(t)}
          aria-label={`${t} theme`}
          role="radio"
          aria-checked={theme === t}
        >
          {THEME_LABELS[t]}
        </button>
      ))}
    </div>
  )
}
