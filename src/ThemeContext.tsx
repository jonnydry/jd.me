import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

export const THEMES = ['default', 'rose', 'paper'] as const
export type Theme = (typeof THEMES)[number]

type ThemeContextValue = {
  theme: Theme
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function applyTheme(t: Theme) {
  if (t === 'default') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', t)
  }
  localStorage.setItem('theme', t)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeRaw] = useState<Theme>(() => {
    return (typeof localStorage !== 'undefined'
      ? (localStorage.getItem('theme') as Theme)
      : null) || 'default'
  })
  const [wiping, setWiping] = useState(false)
  const pendingTheme = useRef<Theme | null>(null)

  // Apply theme on initial mount
  useEffect(() => { applyTheme(theme) }, [])

  const setTheme = useCallback((t: Theme) => {
    if (t === theme || wiping) return
    pendingTheme.current = t
    setWiping(true)

    // At midpoint (300ms), swap the theme under the wipe
    setTimeout(() => {
      applyTheme(t)
      setThemeRaw(t)
    }, 300)

    // After full animation (600ms), remove the wipe
    setTimeout(() => {
      setWiping(false)
      pendingTheme.current = null
    }, 600)
  }, [theme, wiping])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
      {wiping && <div className="theme-wipe" />}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
