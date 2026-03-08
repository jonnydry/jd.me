import { useEffect } from 'react'

export function useScrollProgress(ref: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const bar = ref.current
    if (!bar) return

    const page = bar.closest('.page') as HTMLElement | null
    if (!page) return

    let rafId = 0

    const update = () => {
      rafId = 0
      const max = page.scrollHeight - page.clientHeight
      bar.style.transform = `scaleX(${max > 0 ? page.scrollTop / max : 0})`
    }

    const scheduleUpdate = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(update)
    }

    scheduleUpdate()
    page.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      page.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      if (rafId) window.cancelAnimationFrame(rafId)
    }
  }, [ref])
}
