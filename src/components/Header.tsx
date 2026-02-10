import { useState, useEffect, useRef, useCallback } from 'react'

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

  return (
    <header className="header">
      <div className="avatar-wrap" onClick={() => setModalOpen(true)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setModalOpen(true) } }}>
        <img src={avatar} alt="" className="avatar" />
      </div>
      <h1 className="name">{name}</h1>
      <p className="tagline">
        {typed}
        <span className={`cursor${doneTyping ? ' cursor--blink' : ''}`} aria-hidden="true">|</span>
      </p>

      {modalOpen && (
        <div className="avatar-modal" onClick={closeModal}>
          <div className="avatar-modal-inner" onClick={(e) => e.stopPropagation()}>
            <img src={avatar} alt={name} className="avatar-modal-img" />
            <button className="avatar-modal-close" onClick={closeModal} aria-label="Close">x</button>
          </div>
        </div>
      )}
    </header>
  )
}
