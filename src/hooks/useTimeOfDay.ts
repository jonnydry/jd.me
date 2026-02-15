import { useEffect } from 'react'

type TimePeriod = 'morning' | 'afternoon' | 'dusk' | 'night'

function getTimePeriod(hour: number): TimePeriod {
  if (hour >= 6 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 21) return 'dusk'
  return 'night'
}

function msUntilNextBoundary(): number {
  const now = new Date()
  const hour = now.getHours()
  let nextHour: number

  if (hour < 6) nextHour = 6
  else if (hour < 12) nextHour = 12
  else if (hour < 17) nextHour = 17
  else if (hour < 21) nextHour = 21
  else nextHour = 30 // 6am next day (24 + 6)

  const next = new Date(now)
  next.setHours(nextHour >= 24 ? nextHour - 24 : nextHour, 0, 0, 0)
  if (nextHour >= 24) next.setDate(next.getDate() + 1)

  return next.getTime() - now.getTime()
}

export function useTimeOfDay() {
  useEffect(() => {
    const apply = () => {
      const period = getTimePeriod(new Date().getHours())
      document.documentElement.setAttribute('data-time', period)
    }

    apply()

    let timeout: ReturnType<typeof setTimeout>
    const schedule = () => {
      timeout = setTimeout(() => {
        apply()
        schedule()
      }, msUntilNextBoundary())
    }
    schedule()

    return () => clearTimeout(timeout)
  }, [])
}
