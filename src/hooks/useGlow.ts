import { useCallback, useEffect, useId, useRef } from 'react'

const GLOW_MEDIA_QUERY = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

let glowEl: HTMLDivElement | null = null
let activeOwner: string | null = null
let scrollListenerBound = false

function ensureGlowElement(): HTMLDivElement {
  if (glowEl) return glowEl

  const el = document.createElement('div')
  el.className = 'shared-glow'
  el.setAttribute('aria-hidden', 'true')
  document.body.appendChild(el)
  glowEl = el
  return el
}

function hideGlow(owner: string) {
  if (activeOwner !== owner || !glowEl) return
  glowEl.classList.remove('shared-glow--active')
  glowEl.style.removeProperty('will-change')
  if (glowEl.parentElement !== document.body) {
    document.body.appendChild(glowEl)
  }
  activeOwner = null
}

function placeGlow(host: HTMLElement, clientX: number, clientY: number, rect: DOMRect) {
  const el = ensureGlowElement()

  if (el.parentElement !== host) {
    host.prepend(el)
  }

  el.style.setProperty('--glow-x', `${clientX - rect.left}px`)
  el.style.setProperty('--glow-y', `${clientY - rect.top}px`)
  el.classList.add('shared-glow--active')
  el.style.willChange = 'opacity'
}

function bindScrollHide() {
  if (scrollListenerBound) return
  scrollListenerBound = true

  const onScroll = () => {
    if (!activeOwner) return
    hideGlow(activeOwner)
  }

  window.addEventListener('scroll', onScroll, { passive: true, capture: true })
}

export function useGlow<T extends HTMLElement>(ref: React.RefObject<T | null>) {
  const ownerId = useId()
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
      if (!media.matches) hideGlow(ownerId)
    }

    updateEnabled()
    bindScrollHide()

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', updateEnabled)
    } else {
      media.addListener(updateEnabled)
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      hideGlow(ownerId)

      if (typeof media.removeEventListener === 'function') {
        media.removeEventListener('change', updateEnabled)
      } else {
        media.removeListener(updateEnabled)
      }
    }
  }, [ownerId])

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<T>) => {
      if (!enabledRef.current) return
      const host = ref.current
      if (!host) return

      activeOwner = ownerId
      const rect = host.getBoundingClientRect()
      rectRef.current = rect
      pointerRef.current.x = e.clientX
      pointerRef.current.y = e.clientY
      placeGlow(host, e.clientX, e.clientY, rect)
    },
    [ownerId, ref]
  )

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }
    rectRef.current = null
    hideGlow(ownerId)
  }, [ownerId])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<T>) => {
      if (!enabledRef.current) return
      const host = ref.current
      if (!host) return

      pointerRef.current.x = e.clientX
      pointerRef.current.y = e.clientY
      if (rafRef.current) return

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0
        if (activeOwner !== ownerId) return
        const rect = rectRef.current ?? host.getBoundingClientRect()
        if (!rectRef.current) rectRef.current = rect
        placeGlow(host, pointerRef.current.x, pointerRef.current.y, rect)
      })
    },
    [ownerId, ref]
  )

  return {
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove,
  }
}
