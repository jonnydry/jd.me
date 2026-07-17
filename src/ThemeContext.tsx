import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

export const THEMES = ['default', 'rose', 'paper', 'stone', 'ember', 'pine', 'harbor', 'dusk', 'phosphor'] as const
export type Theme = (typeof THEMES)[number]

type ThemeContextValue = {
  theme: Theme
  setTheme: (t: Theme) => void
  crtEnabled: boolean
  setCrtEnabled: (enabled: boolean) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function isTheme(value: string | null): value is Theme {
  return (THEMES as readonly string[]).includes(value ?? '')
}

function applyTheme(t: Theme) {
  if (t === 'default') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', t)
  }
  try {
    localStorage.setItem('theme', t)
  } catch {
    // Ignore storage failures (private mode / storage restrictions).
  }
}

function applyCrt(enabled: boolean) {
  if (enabled) {
    document.documentElement.setAttribute('data-crt', 'true')
  } else {
    document.documentElement.removeAttribute('data-crt')
  }
  try {
    localStorage.setItem('crt', enabled ? 'true' : 'false')
  } catch {
    // Ignore storage failures
  }
}

function getStoredTheme(): Theme {
  try {
    const raw = localStorage.getItem('theme')
    return isTheme(raw) ? raw : 'default'
  } catch {
    return 'default'
  }
}

function getStoredCrt(): boolean {
  try {
    const raw = localStorage.getItem('crt')
    if (raw === null) return false
    return raw === 'true'
  } catch {
    return false
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeRaw] = useState<Theme>(getStoredTheme)
  const [crtEnabled, setCrtRaw] = useState<boolean>(getStoredCrt)
  const [wiping, setWiping] = useState(false)
  const midpointTimeoutRef = useRef<number | null>(null)
  const wipeTimeoutRef = useRef<number | null>(null)
  const themeRef = useRef(theme)
  const wipingRef = useRef(wiping)

  themeRef.current = theme
  wipingRef.current = wiping

  useEffect(() => { applyTheme(theme) }, [theme])

  useEffect(() => { applyCrt(crtEnabled) }, [crtEnabled])

  const clearThemeTimers = useCallback(() => {
    if (midpointTimeoutRef.current !== null) {
      window.clearTimeout(midpointTimeoutRef.current)
      midpointTimeoutRef.current = null
    }
    if (wipeTimeoutRef.current !== null) {
      window.clearTimeout(wipeTimeoutRef.current)
      wipeTimeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => clearThemeTimers()
  }, [clearThemeTimers])

  const setTheme = useCallback((t: Theme) => {
    if (t === themeRef.current || wipingRef.current) return
    setWiping(true)

    clearThemeTimers()

    midpointTimeoutRef.current = window.setTimeout(() => {
      setThemeRaw(t)
    }, 300)

    wipeTimeoutRef.current = window.setTimeout(() => {
      setWiping(false)
      clearThemeTimers()
    }, 600)
  }, [clearThemeTimers])

  const setCrtEnabled = useCallback((enabled: boolean) => {
    setCrtRaw(enabled)
  }, [])

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    setTheme,
    crtEnabled,
    setCrtEnabled,
  }), [theme, setTheme, crtEnabled, setCrtEnabled])

  return (
    <ThemeContext.Provider value={value}>
      {children}
      <div className="bg-lines-far" aria-hidden="true" />
      <div className="bg-stars" aria-hidden="true" />
      {wiping && <div className="theme-wipe" />}
      {crtEnabled && <div className="crt" aria-hidden="true" />}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}