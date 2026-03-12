import { useCallback, useEffect, useRef } from 'react'

const GLOW_SIZE = 640
const GLOW_HALF = GLOW_SIZE / 2
const GLOW_MEDIA_QUERY = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

export function useGlow<T extends HTMLElement>(ref: React.RefObject<T>) {
  const rectRef = useRef<DOMRect | null>(null)
  const rafRef = useRef<number>(0)
  const pointerRef = useRef({ x: 0, y: 0 })
  const enabledRef = useRef(
    typeof window === 'undefined' ? true : window.matchMedia(GLOW_MEDIA_QUERY).matches
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    const media = window.matchMedia(GLOW_MEDIA_QUERY)
    const updateEnabled = () => {
      enabledRef.current = media.matches
    }

    updateEnabled()

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', updateEnabled)
    } else {
      media.addListener(updateEnabled)
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)

      if (typeof media.removeEventListener === 'function') {
        media.removeEventListener('change', updateEnabled)
      } else {
        media.removeListener(updateEnabled)
      }
    }
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (!enabledRef.current) return
    rectRef.current = ref.current?.getBoundingClientRect() ?? null
  }, [ref])

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }
    rectRef.current = null
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<T>) => {
      if (!enabledRef.current) return
      const el = ref.current
      if (!el) return

      pointerRef.current.x = e.clientX
      pointerRef.current.y = e.clientY
      if (rafRef.current) return

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0
        const rect = rectRef.current ?? el.getBoundingClientRect()
        if (!rectRef.current) rectRef.current = rect

        const glowX = pointerRef.current.x - rect.left - GLOW_HALF
        const glowY = pointerRef.current.y - rect.top - GLOW_HALF

        el.style.setProperty('--glow-x', String(glowX))
        el.style.setProperty('--glow-y', String(glowY))
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
