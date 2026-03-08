import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'

interface HeaderProps {
  name: string
  tagline: string
  avatar: string
}

function useAvatarTilt<T extends HTMLElement>(ref: React.RefObject<T>, scale: number, disabled: boolean) {
  const rectRef = useRef<DOMRect | null>(null)
  const pointerRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (disabled) return
    const el = ref.current
    if (!el) return
    rectRef.current = el.getBoundingClientRect()
    el.style.transition = 'box-shadow 0.25s ease'
  }, [disabled, ref])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (disabled) return
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
    if (disabled) return
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

  // Close modal on Escape
  useEffect(() => {
    if (!modalOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [modalOpen])

  const closeModal = useCallback(() => setModalOpen(false), [])

  const avatarWrapRef = useRef<HTMLDivElement>(null)
  const avatarModalWrapRef = useRef<HTMLDivElement>(null)
  const avatarTilt = useAvatarTilt(avatarWrapRef, 1.08, reducedMotion.current)
  const modalAvatarTilt = useAvatarTilt(avatarModalWrapRef, 1.02, reducedMotion.current)

  return (
    <header className="header">
      <div
        ref={avatarWrapRef}
        className="avatar-wrap"
        onClick={() => setModalOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setModalOpen(true) } }}
        onMouseEnter={avatarTilt.handleMouseEnter}
        onMouseMove={avatarTilt.handleMouseMove}
        onMouseLeave={avatarTilt.handleMouseLeave}
      >
        <img
          src={avatar}
          alt=""
          className="avatar"
          width={720}
          height={720}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </div>
      <h1 className="name">{name}</h1>
      <p className="tagline">
        {typed}
        <span className={`cursor${doneTyping ? ' cursor--blink' : ''}`} aria-hidden="true">|</span>
      </p>

      {modalOpen && createPortal(
        <div className="avatar-modal" onClick={closeModal}>
          <div className="avatar-modal-inner" onClick={(e) => e.stopPropagation()}>
            <div
              ref={avatarModalWrapRef}
              className="avatar-modal-wrap"
              onMouseEnter={modalAvatarTilt.handleMouseEnter}
              onMouseMove={modalAvatarTilt.handleMouseMove}
              onMouseLeave={modalAvatarTilt.handleMouseLeave}
            >
              <img
                src={avatar}
                alt={name}
                className="avatar-modal-img"
                width={720}
                height={720}
                loading="lazy"
                decoding="async"
              />
            </div>
            <button className="avatar-modal-close" onClick={closeModal} aria-label="Close">x</button>
          </div>
        </div>,
        document.body
      )}
    </header>
  )
}
