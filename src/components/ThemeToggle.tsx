import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { THEMES, useTheme } from '../ThemeContext'
import type { Theme } from '../ThemeContext'

const THEME_LABELS: Record<Theme, string> = {
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

interface ThemeToggleProps {
  /** Which way the theme list opens from the trigger. */
  placement?: 'up' | 'down'
}

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  )
}

export default function ThemeToggle({ placement = 'down' }: ThemeToggleProps) {
  const { theme, setTheme, crtEnabled, setCrtEnabled } = useTheme()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const groupRef = useRef<HTMLDivElement>(null)
  const openRef = useRef(open)
  const themeRef = useRef(theme)
  const listId = useId()

  openRef.current = open
  themeRef.current = theme

  const currentThemeIndex = THEMES.indexOf(theme)

  const focusOption = useCallback((t: Theme) => {
    requestAnimationFrame(() => {
      if (!openRef.current) return
      groupRef.current?.querySelector<HTMLButtonElement>(`button[data-theme-option="${t}"]`)?.focus()
    })
  }, [])

  const openList = useCallback(() => {
    setOpen(true)
    focusOption(themeRef.current)
  }, [focusOption])

  const closeList = useCallback((restoreFocus: boolean) => {
    setOpen(false)
    if (restoreFocus) triggerRef.current?.focus()
  }, [])

  // `t` toggles the list from anywhere on the active page (inert pages and open modals are skipped)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 't' || e.ctrlKey || e.metaKey || e.altKey || isTypingTarget(e.target)) return
      if (!rootRef.current || rootRef.current.closest('[inert]')) return

      e.preventDefault()
      if (openRef.current) {
        closeList(true)
      } else {
        rootRef.current.scrollIntoView({ block: 'nearest' })
        openList()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeList, openList])

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) closeList(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open, closeList])

  const handleRootKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!open) return

    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      closeList(true)
    } else if (event.key === 'Tab' && groupRef.current?.contains(event.target as Node)) {
      // Defer so the browser moves focus before the focused radio is hidden
      window.setTimeout(() => closeList(false))
    }
  }

  // Close when keyboard focus leaves the control; null relatedTarget (e.g. Safari clicks) is left to pointerdown
  const handleRootBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget
    if (open && next instanceof Node && !rootRef.current?.contains(next)) closeList(false)
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
    setTheme(THEMES[nextIndex])
    focusOption(THEMES[nextIndex])
  }

  return (
    <div
      ref={rootRef}
      className={`theme-toggle theme-toggle--${placement}`}
      onKeyDown={handleRootKeyDown}
      onBlur={handleRootBlur}
    >
      <button
        ref={triggerRef}
        type="button"
        className="theme-trigger"
        aria-label={`Theme: ${theme}`}
        aria-expanded={open}
        aria-controls={listId}
        aria-keyshortcuts="t"
        onClick={() => (open ? closeList(false) : openList())}
      >
        <span className="theme-prompt" aria-hidden="true">theme</span>
        <span className="theme-trigger-value" aria-hidden="true">{THEME_LABELS[theme]}</span>
        <span className={`theme-trigger-caret${open ? ' theme-trigger-caret--open' : ''}`} aria-hidden="true">▾</span>
      </button>
      <button
        type="button"
        className={`crt-toggle${crtEnabled ? ' crt-toggle--active' : ''}`}
        onClick={() => setCrtEnabled(!crtEnabled)}
        aria-label="Toggle CRT effect"
        aria-pressed={crtEnabled}
      >
        CRT
      </button>
      <div ref={groupRef} id={listId} className="theme-menu" role="radiogroup" aria-label="Theme" hidden={!open}>
        {THEMES.map((t) => (
          <button
            type="button"
            key={t}
            data-theme-option={t}
            className={`theme-btn theme-btn--${t}${theme === t ? ' theme-btn--active' : ''}`}
            onClick={() => {
              setTheme(t)
              closeList(true)
            }}
            onKeyDown={handleThemeKeyDown}
            aria-label={`${t} theme`}
            role="radio"
            aria-checked={theme === t}
            tabIndex={theme === t ? 0 : -1}
          >
            <span className="theme-swatch" aria-hidden="true" />
            {THEME_LABELS[t]}
          </button>
        ))}
      </div>
    </div>
  )
}
