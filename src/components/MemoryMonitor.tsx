import { useEffect, useRef, useState } from 'react'

type MemoryInfo = {
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
}

function formatMb(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function getMemory(): MemoryInfo | null {
  const perf = performance as Performance & { memory?: MemoryInfo }
  return perf.memory ?? null
}

export default function MemoryMonitor() {
  const [enabled, setEnabled] = useState(false)
  const [memory, setMemory] = useState<MemoryInfo | null>(null)
  const [fps, setFps] = useState(0)
  const [domNodes, setDomNodes] = useState(0)
  const [growth, setGrowth] = useState(0)
  const baselineRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    if (params.get('debug') === 'memory') {
      setEnabled(true)
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'M' || e.key === 'm')) {
        e.preventDefault()
        setEnabled((v) => !v)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    if (!enabled) return

    let rafId = 0
    let frames = 0
    let lastFpsTime = performance.now()
    let lastSampleTime = performance.now()

    const tick = () => {
      const now = performance.now()
      frames += 1

      if (now - lastFpsTime >= 1000) {
        setFps(frames)
        frames = 0
        lastFpsTime = now
      }

      if (now - lastSampleTime >= 2000) {
        const mem = getMemory()
        if (mem) {
          setMemory(mem)
          if (baselineRef.current === null) {
            baselineRef.current = mem.usedJSHeapSize
          }
          setGrowth(mem.usedJSHeapSize - (baselineRef.current ?? mem.usedJSHeapSize))
        }
        if (typeof document !== 'undefined') {
          setDomNodes(document.getElementsByTagName('*').length)
        }
        lastSampleTime = now
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [enabled])

  if (!enabled) return null

  const memAvailable = memory !== null

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '0.75rem',
        right: '0.75rem',
        zIndex: 100000,
        pointerEvents: 'none',
        background: 'rgba(0, 0, 0, 0.82)',
        color: '#7ee787',
        font: '11px/1.45 ui-monospace, SFMono-Regular, Menlo, monospace',
        padding: '8px 10px',
        borderRadius: '4px',
        border: '1px solid rgba(126, 231, 135, 0.25)',
        minWidth: '180px',
        whiteSpace: 'pre',
      }}
    >
      <div style={{ color: '#58a6ff', marginBottom: '4px' }}>memory inspector</div>
      {memAvailable ? (
        <>
          <div>used   {formatMb(memory!.usedJSHeapSize)}</div>
          <div>total  {formatMb(memory!.totalJSHeapSize)}</div>
          <div>limit  {formatMb(memory!.jsHeapSizeLimit)}</div>
          <div style={{ color: growth > 0 ? '#ffa657' : '#7ee787' }}>
            Δ since open  {growth >= 0 ? '+' : ''}{formatMb(growth)}
          </div>
        </>
      ) : (
        <div style={{ color: '#ffa657' }}>performance.memory unavailable</div>
      )}
      <div style={{ borderTop: '1px solid rgba(126, 231, 135, 0.15)', marginTop: '4px', paddingTop: '4px' }}>
        fps     {fps}
        {'\n'}dom    {domNodes} nodes
      </div>
      <div style={{ color: '#6e7681', marginTop: '4px' }}>ctrl+shift+M to hide</div>
    </div>
  )
}
