import { useCallback, useEffect, useRef } from 'react'
import { useTheme } from '../ThemeContext'

const GLOW_SIZE = 640
const GLOW_HALF = GLOW_SIZE / 2

export function useGlow<T extends HTMLElement>(ref: React.RefObject<T>) {
  const { theme } = useTheme()
  const accentColorRef = useRef('')
  const rectRef = useRef<DOMRect | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const style = getComputedStyle(document.documentElement)
    const hue = style.getPropertyValue('--accent-hue').trim()
    const sat = style.getPropertyValue('--accent-sat').trim()
    const lit = style.getPropertyValue('--accent-lit').trim()
    accentColorRef.current = `hsl(${hue} ${sat} ${lit} / 0.07)`
  }, [theme])

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handleMouseEnter = useCallback(() => {
    rectRef.current = ref.current?.getBoundingClientRect() ?? null
  }, [ref])

  const handleMouseLeave = useCallback(() => {
    rectRef.current = null
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<T>) => {
      const el = ref.current
      if (!el) return

      const clientX = e.clientX
      const clientY = e.clientY

      if (rafRef.current) cancelAnimationFrame(rafRef.current)

      rafRef.current = requestAnimationFrame(() => {
        const rect = rectRef.current ?? el.getBoundingClientRect()
        if (!rectRef.current) rectRef.current = rect

        const glowX = clientX - rect.left - GLOW_HALF
        const glowY = clientY - rect.top - GLOW_HALF

        el.style.setProperty('--glow-x', String(glowX))
        el.style.setProperty('--glow-y', String(glowY))
        el.style.setProperty('--glow-color', accentColorRef.current)
      })
    },
    [ref]
  )

  return {
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove,
  }
}
