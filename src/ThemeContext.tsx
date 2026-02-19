import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

export const THEMES = ['default', 'rose', 'paper'] as const
export type Theme = (typeof THEMES)[number]

type ThemeContextValue = {
  theme: Theme
  setTheme: (t: Theme, event?: React.MouseEvent) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

type TransitionStyle = 'fade' | 'blur' | 'radial' | 'slide' | 'morph'
const VT_TRANSITIONS: TransitionStyle[] = ['fade', 'blur', 'radial', 'slide']
const ALL_TRANSITIONS: TransitionStyle[] = [...VT_TRANSITIONS, 'morph']

function pickTransition(): TransitionStyle {
  // If the browser supports View Transitions, pick from all styles.
  // Otherwise, only use 'morph' (CSS variable interpolation, no VT needed).
  const pool = document.startViewTransition ? ALL_TRANSITIONS : ['morph'] as TransitionStyle[]
  return pool[Math.floor(Math.random() * pool.length)]
}

function isTheme(value: string | null): value is Theme {
  return value === 'default' || value === 'rose' || value === 'paper'
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

function getStoredTheme(): Theme {
  try {
    const raw = localStorage.getItem('theme')
    return isTheme(raw) ? raw : 'default'
  } catch {
    return 'default'
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeRaw] = useState<Theme>(getStoredTheme)
  const [fallbackWiping, setFallbackWiping] = useState(false)
  const transitioningRef = useRef(false)
  const cleanupRef = useRef<number | null>(null)

  // Keep DOM/localStorage in sync with current theme.
  useEffect(() => { applyTheme(theme) }, [theme])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current !== null) window.clearTimeout(cleanupRef.current)
    }
  }, [])

  const setTheme = useCallback((t: Theme, event?: React.MouseEvent) => {
    if (t === theme || transitioningRef.current) return
    transitioningRef.current = true

    const style = pickTransition()

    // --- Morph: CSS variable interpolation, no overlay or VT needed ---
    if (style === 'morph') {
      const root = document.documentElement
      // Temporarily pause colorDrift animations so they don't fight the transition
      root.classList.add('theme-morphing')
      setThemeRaw(t)

      cleanupRef.current = window.setTimeout(() => {
        root.classList.remove('theme-morphing')
        transitioningRef.current = false
        cleanupRef.current = null
      }, 550)
      return
    }

    // --- View Transitions API path (fade, blur, radial, slide) ---
    if (!document.startViewTransition) {
      // Fallback: old-school overlay wipe for very old browsers
      setFallbackWiping(true)
      cleanupRef.current = window.setTimeout(() => {
        setThemeRaw(t)
      }, 300)
      window.setTimeout(() => {
        setFallbackWiping(false)
        transitioningRef.current = false
        cleanupRef.current = null
      }, 600)
      return
    }

    const root = document.documentElement

    // Set transition style for CSS to target
    root.setAttribute('data-transition', style)

    // For radial wipe, compute circle origin from click point
    if (style === 'radial' && event) {
      const x = event.clientX
      const y = event.clientY
      const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )
      root.style.setProperty('--wipe-x', `${x}px`)
      root.style.setProperty('--wipe-y', `${y}px`)
      root.style.setProperty('--wipe-radius', `${maxRadius}px`)
    }

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setThemeRaw(t)
      })
      applyTheme(t)
    })

    transition.finished
      .then(() => {
        root.removeAttribute('data-transition')
        root.style.removeProperty('--wipe-x')
        root.style.removeProperty('--wipe-y')
        root.style.removeProperty('--wipe-radius')
        transitioningRef.current = false
      })
      .catch(() => {
        root.removeAttribute('data-transition')
        transitioningRef.current = false
      })
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
      {fallbackWiping && <div className="theme-wipe-overlay" />}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
