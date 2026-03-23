import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'

interface HeaderProps {
  name: string
  tagline: string
  avatar: string
}

const INTERACTIVE_HOVER_MEDIA_QUERY =
  '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
const AVATAR_AVIF_SRC_SET = '/avatar-360.avif 360w, /avatar-720.avif 720w'
const AVATAR_FALLBACK_SRC_SET = '/avatar-360.jpg 360w, /avatar.jpg 720w'
const AVATAR_SIZES = '(max-width: 640px) 80px, 88px'
const AVATAR_MODAL_SIZES = '(max-width: 640px) 70vw, 360px'

function useAvatarTilt<T extends HTMLElement>(ref: React.RefObject<T | null>, scale: number, disabled: boolean) {
  const rectRef = useRef<DOMRect | null>(null)
  const pointerRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)
  const interactiveRef = useRef(
    typeof window === 'undefined' ? true : window.matchMedia(INTERACTIVE_HOVER_MEDIA_QUERY).matches
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    const media = window.matchMedia(INTERACTIVE_HOVER_MEDIA_QUERY)
    const updateInteractive = () => {
      interactiveRef.current = media.matches

      if (!media.matches) {
        const el = ref.current
        if (el) {
          el.style.transition = ''
          el.style.transform = ''
        }
        rectRef.current = null
      }
    }

    updateInteractive()

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', updateInteractive)
    } else {
      media.addListener(updateInteractive)
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)

      if (typeof media.removeEventListener === 'function') {
        media.removeEventListener('change', updateInteractive)
      } else {
        media.removeListener(updateInteractive)
      }
    }
  }, [ref])

  const handleMouseEnter = useCallback(() => {
    if (disabled || !interactiveRef.current) return
    const el = ref.current
    if (!el) return
    rectRef.current = el.getBoundingClientRect()
    el.style.transition = 'box-shadow 0.25s ease'
  }, [disabled, ref])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (disabled || !interactiveRef.current) return
    const el = ref.current
    if (!el) return

    pointerRef.current.x = e.clientX
    pointerRef.current.y = e.clientY
    if (rafRef.current) return

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0
      const rect = rectRef.current ?? el.getBoundingClientRect()
      rectRef.current = rect
      const rx = ((pointerRef.current.y - rect.top - rect.height / 2) / (rect.height / 2)) * -10
      const ry = ((pointerRef.current.x - rect.left - rect.width / 2) / (rect.width / 2)) * 10
      el.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`
    })
  }, [disabled, ref, scale])

  const handleMouseLeave = useCallback(() => {
    if (disabled || !interactiveRef.current) return
    const el = ref.current
    if (!el) return
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }
    rectRef.current = null
    el.style.transition = ''
    el.style.transform = ''
  }, [disabled, ref])

  return { handleMouseEnter, handleMouseMove, handleMouseLeave }
}

export default function Header({ name, tagline, avatar }: HeaderProps) {
  const [typed, setTyped] = useState('')
  const [doneTyping, setDoneTyping] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    if (reducedMotion.current) {
      setTyped(tagline)
      setDoneTyping(true)
      return
    }

    let intervalId: ReturnType<typeof setInterval> | null = null
    let i = 0

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        i++
        if (i <= tagline.length) {
          setTyped(tagline.slice(0, i))
        } else {
          clearInterval(intervalId!)
          intervalId = null
          setDoneTyping(true)
        }
      }, 45)
    }, 500)

    return () => {
      clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
    }
  }, [tagline])

  const closeModal = useCallback(() => setModalOpen(false), [])

  const avatarWrapRef = useRef<HTMLDivElement>(null)
  const avatarModalWrapRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const lastFocusedRef = useRef<HTMLElement | null>(null)
  const avatarTilt = useAvatarTilt(avatarWrapRef, 1.08, reducedMotion.current)
  const modalAvatarTilt = useAvatarTilt(avatarModalWrapRef, 1.02, reducedMotion.current)

  useEffect(() => {
    if (!modalOpen) return

    lastFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    const appRoot = document.getElementById('root')
    document.body.style.overflow = 'hidden'
    appRoot?.setAttribute('aria-hidden', 'true')
    appRoot?.setAttribute('inert', '')

    const rafId = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus()
    })

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalOpen(false)
        return
      }

      if (e.key !== 'Tab') return

      const modal = modalRef.current
      if (!modal) return

      const focusable = Array.from(
        modal.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hasAttribute('disabled'))

      if (focusable.length === 0) {
        e.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.cancelAnimationFrame(rafId)
      document.body.style.overflow = previousOverflow
      appRoot?.removeAttribute('aria-hidden')
      appRoot?.removeAttribute('inert')
      window.removeEventListener('keydown', handleKeyDown)
      lastFocusedRef.current?.focus()
    }
  }, [modalOpen])

  return (
    <header className="header">
      <div
        ref={avatarWrapRef}
        className="avatar-wrap"
        aria-label={`Open photo of ${name}`}
        onClick={() => setModalOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setModalOpen(true) } }}
        onMouseEnter={avatarTilt.handleMouseEnter}
        onMouseMove={avatarTilt.handleMouseMove}
        onMouseLeave={avatarTilt.handleMouseLeave}
      >
        <picture>
          <source
            srcSet={AVATAR_AVIF_SRC_SET}
            sizes={AVATAR_SIZES}
            type="image/avif"
          />
          <img
            src={avatar}
            srcSet={AVATAR_FALLBACK_SRC_SET}
            sizes={AVATAR_SIZES}
            alt=""
            className="avatar"
            width={720}
            height={720}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </picture>
      </div>
      <h1 className="name">{name}</h1>
      <p className="tagline">
        {typed}
        <span className={`cursor${doneTyping ? ' cursor--blink' : ''}`} aria-hidden="true">|</span>
      </p>

      {modalOpen && createPortal(
        <div
          className="avatar-modal"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label={`${name} photo`}
        >
          <div ref={modalRef} className="avatar-modal-inner" onClick={(e) => e.stopPropagation()}>
            <div
              ref={avatarModalWrapRef}
              className="avatar-modal-wrap"
              onMouseEnter={modalAvatarTilt.handleMouseEnter}
              onMouseMove={modalAvatarTilt.handleMouseMove}
              onMouseLeave={modalAvatarTilt.handleMouseLeave}
            >
              <picture>
                <source
                  srcSet={AVATAR_AVIF_SRC_SET}
                  sizes={AVATAR_MODAL_SIZES}
                  type="image/avif"
                />
                <img
                  src={avatar}
                  srcSet={AVATAR_FALLBACK_SRC_SET}
                  sizes={AVATAR_MODAL_SIZES}
                  alt={name}
                  className="avatar-modal-img"
                  width={720}
                  height={720}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </div>
            <button
              type="button"
              ref={closeButtonRef}
              className="avatar-modal-close"
              onClick={closeModal}
              aria-label="Close"
            >
              x
            </button>
          </div>
        </div>,
        document.body
      )}
    </header>
  )
}
