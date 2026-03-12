import { useEffect } from 'react'

export function useScrollProgress(ref: React.RefObject<HTMLDivElement>, key?: string) {
  useEffect(() => {
    const attach = (): (() => void) | null => {
      const bar = ref.current
      if (!bar) return null

      const page = bar.closest('.page') as HTMLElement | null
      if (!page) return null

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
    }

    let cleanup = attach()
    if (!cleanup) {
      const rafId = window.requestAnimationFrame(() => {
        cleanup = attach()
      })
      return () => {
        window.cancelAnimationFrame(rafId)
        cleanup?.()
      }
    }

    return () => cleanup()
  }, [ref, key])
}
