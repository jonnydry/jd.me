import { useEffect } from 'react'

type TimePeriod = 'morning' | 'afternoon' | 'dusk' | 'night'

function getTimePeriod(hour: number): TimePeriod {
  if (hour >= 6 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 21) return 'dusk'
  return 'night'
}

function getDayProgress(now: Date): number {
  const minutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60
  return minutes / 1440
}

function msUntilNextHour(now: Date): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0, 0)
  const ms = next.getTime() - now.getTime()
  return ms > 0 ? ms : 36e5
}

function applyTimeFlowVariables(now: Date): void {
  const root = document.documentElement
  const dayProgress = getDayProgress(now)
  const phase = dayProgress * Math.PI * 2

  const hueFlow = Math.sin(phase - Math.PI / 3) * 6 + Math.sin(phase * 2) * 2.5
  const lineFlow = 1 + Math.sin(phase + Math.PI / 8) * 0.08
  const glowX = Math.sin(phase - Math.PI / 2)
  const glowY = Math.cos(phase * 0.75)

  root.style.setProperty('--time-progress', dayProgress.toFixed(6))
  root.style.setProperty('--time-hue-flow', hueFlow.toFixed(3))
  root.style.setProperty('--time-line-flow', lineFlow.toFixed(3))
  root.style.setProperty('--time-glow-x', glowX.toFixed(3))
  root.style.setProperty('--time-glow-y', glowY.toFixed(3))
}

export function useTimeOfDay() {
  useEffect(() => {
    const apply = () => {
      const now = new Date()
      const period = getTimePeriod(now.getHours())
      document.documentElement.setAttribute('data-time', period)
      applyTimeFlowVariables(now)
    }

    let timeout = 0

    const schedule = () => {
      const now = new Date()
      timeout = window.setTimeout(() => {
        apply()
        schedule()
      }, msUntilNextHour(now))
    }

    const handleVisibilityChange = () => {
      window.clearTimeout(timeout)

      if (!document.hidden) {
        apply()
        schedule()
      }
    }

    apply()

    if (!document.hidden) {
      schedule()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.clearTimeout(timeout)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])
}
