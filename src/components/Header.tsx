import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'

interface HeaderProps {
  name: string
  tagline: string
  avatar: string
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

  // 3D tilt on avatar hover
  const avatarWrapRef = useRef<HTMLDivElement>(null)
  const tiltRafRef = useRef<number>(0)

  useEffect(() => {
    return () => { if (tiltRafRef.current) cancelAnimationFrame(tiltRafRef.current) }
  }, [])

  const handleAvatarMouseEnter = useCallback(() => {
    if (reducedMotion.current) return
    const el = avatarWrapRef.current
    if (!el) return
    // Disable transform transition during tracking so it follows the cursor instantly
    el.style.transition = 'box-shadow 0.25s ease'
  }, [])

  const handleAvatarMouseMove = useCallback((e: React.MouseEvent) => {
    if (reducedMotion.current) return
    const el = avatarWrapRef.current
    if (!el) return
    const clientX = e.clientX
    const clientY = e.clientY
    if (tiltRafRef.current) cancelAnimationFrame(tiltRafRef.current)
    tiltRafRef.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect()
      const rx = ((clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -10
      const ry = ((clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 10
      el.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.08)`
    })
  }, [])

  const handleAvatarMouseLeave = useCallback(() => {
    if (reducedMotion.current) return
    const el = avatarWrapRef.current
    if (!el) return
    // Restore CSS transition for smooth spring-back
    el.style.transition = ''
    el.style.transform = ''
  }, [])

  // Same tilt handlers for the expanded modal avatar
  const avatarModalWrapRef = useRef<HTMLDivElement>(null)
  const tiltModalRafRef = useRef<number>(0)

  useEffect(() => {
    return () => { if (tiltModalRafRef.current) cancelAnimationFrame(tiltModalRafRef.current) }
  }, [])

  const handleModalAvatarMouseEnter = useCallback(() => {
    if (reducedMotion.current) return
    const el = avatarModalWrapRef.current
    if (!el) return
    el.style.transition = 'box-shadow 0.25s ease'
  }, [])

  const handleModalAvatarMouseMove = useCallback((e: React.MouseEvent) => {
    if (reducedMotion.current) return
    const el = avatarModalWrapRef.current
    if (!el) return
    const clientX = e.clientX
    const clientY = e.clientY
    if (tiltModalRafRef.current) cancelAnimationFrame(tiltModalRafRef.current)
    tiltModalRafRef.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect()
      const rx = ((clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -10
      const ry = ((clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 10
      el.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`
    })
  }, [])

  const handleModalAvatarMouseLeave = useCallback(() => {
    if (reducedMotion.current) return
    const el = avatarModalWrapRef.current
    if (!el) return
    el.style.transition = ''
    el.style.transform = ''
  }, [])

  return (
    <header className="header">
      <div
        ref={avatarWrapRef}
        className="avatar-wrap"
        onClick={() => setModalOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setModalOpen(true) } }}
        onMouseEnter={handleAvatarMouseEnter}
        onMouseMove={handleAvatarMouseMove}
        onMouseLeave={handleAvatarMouseLeave}
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
              onMouseEnter={handleModalAvatarMouseEnter}
              onMouseMove={handleModalAvatarMouseMove}
              onMouseLeave={handleModalAvatarMouseLeave}
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
