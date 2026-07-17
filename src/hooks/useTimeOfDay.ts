import { useLayoutEffect } from 'react'

type TimePeriod = 'morning' | 'afternoon' | 'dusk' | 'night'

type PeriodConfig = {
  hueShift: number
  lineDim: number
  /** Extra hue bias for the secondary ambient wash */
  secondaryHueBias: number
  primaryAlpha: number
  secondaryAlpha: number
}

const PERIOD: Record<TimePeriod, PeriodConfig> = {
  morning: {
    hueShift: 18,
    lineDim: 0.92,
    secondaryHueBias: -18,
    primaryAlpha: 0.05,
    secondaryAlpha: 0.022,
  },
  afternoon: {
    hueShift: 0,
    lineDim: 1,
    secondaryHueBias: 34,
    primaryAlpha: 0.038,
    secondaryAlpha: 0.022,
  },
  dusk: {
    hueShift: 28,
    lineDim: 0.78,
    secondaryHueBias: -22,
    primaryAlpha: 0.052,
    secondaryAlpha: 0.03,
  },
  night: {
    hueShift: -12,
    lineDim: 0.58,
    secondaryHueBias: 26,
    primaryAlpha: 0.034,
    secondaryAlpha: 0.02,
  },
}

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

/** Next boundary: 2-minute mark (slow intra-period crawl), or sooner on period change. */
function msUntilNextUpdate(now: Date): number {
  const minutes = now.getHours() * 60 + now.getMinutes()
  const seconds = now.getSeconds() + now.getMilliseconds() / 1000
  const nextTick = (Math.floor(minutes / 2) + 1) * 2
  let msToTick = (nextTick - minutes) * 60_000 - seconds * 1000
  if (msToTick <= 0) msToTick = 2 * 60_000

  // Period boundaries: 6, 12, 17, 21 (and next-day 6 as 30h)
  const periodEnds = [6, 12, 17, 21, 30]
  let msToPeriod = Number.POSITIVE_INFINITY
  for (const endHour of periodEnds) {
    const deltaMin = endHour * 60 - (minutes + seconds / 60)
    if (deltaMin > 0) {
      msToPeriod = deltaMin * 60_000
      break
    }
  }

  return Math.max(1000, Math.min(msToTick, msToPeriod))
}

function readNumber(cs: CSSStyleDeclaration, name: string, fallback: number): number {
  const value = parseFloat(cs.getPropertyValue(name))
  return Number.isFinite(value) ? value : fallback
}

function hsl(hue: number, sat: number, lit: number, alpha: number): string {
  const h = ((hue % 360) + 360) % 360
  return `hsl(${h.toFixed(2)} ${sat.toFixed(1)}% ${lit.toFixed(1)}% / ${Math.max(0, alpha).toFixed(4)})`
}

function applyAtmosphere(now: Date): void {
  const root = document.documentElement
  const period = getTimePeriod(now.getHours())
  const config = PERIOD[period]
  root.setAttribute('data-time', period)

  const cs = getComputedStyle(root)
  const hueA = readNumber(cs, '--line-hue-a', 212)
  const hueB = readNumber(cs, '--line-hue-b', 212)
  const hueC = readNumber(cs, '--line-hue-c', 212)
  const hueD = readNumber(cs, '--line-hue-d', 212)
  const accentHue = readNumber(cs, '--accent-hue', 212)
  const lineSat = readNumber(cs, '--line-sat', readNumber(cs, '--accent-sat', 100))
  const lineLit = readNumber(cs, '--line-lit', readNumber(cs, '--accent-lit', 67))
  const boost = readNumber(cs, '--theme-line-boost', 1)
  const isRose = root.getAttribute('data-theme') === 'rose'
  const roseBoost = isRose ? 1.45 : 1

  const dayProgress = getDayProgress(now)
  const phase = dayProgress * Math.PI * 2
  const hueFlow = Math.sin(phase - Math.PI / 3) * 6 + Math.sin(phase * 2) * 2.5
  const lineFlow = 1 + Math.sin(phase + Math.PI / 8) * 0.08
  const glowX = Math.sin(phase - Math.PI / 2)
  const glowY = Math.cos(phase * 0.75)

  const lineAlpha = (base: number) => base * config.lineDim * boost * lineFlow
  const lineHue = (base: number, flowScale = 1) =>
    base + config.hueShift + hueFlow * flowScale

  root.style.setProperty('--time-progress', dayProgress.toFixed(6))
  root.style.setProperty('--time-hue-flow', hueFlow.toFixed(3))
  root.style.setProperty('--time-line-flow', lineFlow.toFixed(3))
  root.style.setProperty('--time-glow-x', glowX.toFixed(3))
  root.style.setProperty('--time-glow-y', glowY.toFixed(3))

  // Precomputed laser strokes — avoids nested calc() in every gradient stop
  root.style.setProperty('--line-a', hsl(lineHue(hueA), lineSat, lineLit, lineAlpha(0.14)))
  root.style.setProperty('--line-a-soft', hsl(lineHue(hueA), lineSat, lineLit, lineAlpha(0.065)))
  root.style.setProperty('--line-b', hsl(lineHue(hueB), lineSat, lineLit, lineAlpha(0.1)))
  root.style.setProperty('--line-b-soft', hsl(lineHue(hueB), lineSat, lineLit, lineAlpha(0.055)))
  root.style.setProperty('--line-c', hsl(lineHue(hueC), lineSat, lineLit, lineAlpha(0.11)))
  root.style.setProperty('--line-d', hsl(lineHue(hueD), lineSat, lineLit, lineAlpha(0.08)))

  const primaryHue = accentHue + config.hueShift + hueFlow * 0.45
  const secondaryHue = accentHue + config.secondaryHueBias + hueFlow * 0.3
  const primaryAlpha =
    (config.primaryAlpha + dayProgress * 0.008) * roseBoost * (0.92 + lineFlow * 0.08)
  const secondaryAlpha = config.secondaryAlpha * roseBoost

  root.style.setProperty('--ambient-primary', hsl(primaryHue, 82, period === 'night' ? 42 : 58, primaryAlpha))
  root.style.setProperty(
    '--ambient-secondary',
    hsl(secondaryHue, period === 'dusk' ? 86 : 74, period === 'morning' ? 60 : 48, secondaryAlpha)
  )

  if (period === 'night') {
    root.style.setProperty('--star-1', hsl(accentHue + 12, 70, 78, 0.16))
    root.style.setProperty('--star-2', hsl(accentHue - 18, 68, 74, 0.12))
    root.style.setProperty('--star-3', hsl(accentHue + 24, 66, 76, 0.1))
  } else {
    root.style.setProperty('--star-1', 'transparent')
    root.style.setProperty('--star-2', 'transparent')
    root.style.setProperty('--star-3', 'transparent')
  }
}

export function useTimeOfDay() {
  useLayoutEffect(() => {
    const apply = () => applyAtmosphere(new Date())

    let timeout = 0

    const schedule = () => {
      const now = new Date()
      timeout = window.setTimeout(() => {
        apply()
        schedule()
      }, msUntilNextUpdate(now))
    }

    const handleVisibilityChange = () => {
      window.clearTimeout(timeout)

      if (!document.hidden) {
        apply()
        schedule()
      }
    }

    const themeObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'data-theme') {
          apply()
          break
        }
      }
    })

    apply()

    if (!document.hidden) {
      schedule()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => {
      window.clearTimeout(timeout)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      themeObserver.disconnect()
    }
  }, [])
}
