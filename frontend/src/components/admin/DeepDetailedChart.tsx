'use client'

import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react'

type Props = {
  data?: number[]
  range?: '7d' | '30d' | '90d'
  height?: number
  className?: string
}

const formatNumber = (v: number) => v.toLocaleString()

const useSize = (ref: React.RefObject<HTMLElement>) => {
  const [size, setSize] = useState({ width: 640, height: 300 })
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(entries => {
      for (const e of entries) {
        const cr = e.contentRect
        setSize(s => (s.width !== cr.width || s.height !== cr.height) ? { width: cr.width, height: cr.height } : s)
      }
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [ref])
  return size
}

const buildPath = (points: { x: number; y: number }[], smooth = true) => {
  if (!points.length) return { path: '', area: '' }
  if (!smooth || points.length < 3) {
    const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    const area = `${path} L ${points[points.length - 1].x} ${points[0].y} Z`
    return { path, area }
  }

  // simple Catmull-Rom to bezier
  const cps: string[] = []
  for (let i = 0; i < points.length; i++) {
    const p0 = points[i - 1] || points[i]
    const p1 = points[i]
    const p2 = points[i + 1] || points[i]
    const p3 = points[i + 2] || p2
    if (i === 0) cps.push(`M ${p1.x} ${p1.y}`)
    const x1 = p1.x + (p2.x - p0.x) / 6
    const y1 = p1.y + (p2.y - p0.y) / 6
    const x2 = p2.x - (p3.x - p1.x) / 6
    const y2 = p2.y - (p3.y - p1.y) / 6
    cps.push(`C ${x1} ${y1}, ${x2} ${y2}, ${p2.x} ${p2.y}`)
  }
  const path = cps.join(' ')
  const area = `${path} L ${points[points.length - 1].x} ${points[0].y} L ${points[0].x} ${points[0].y} Z`
  return { path, area }
}

export default function DeepDetailedChart({ data = [], range = '30d', height = 220, className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const size = useSize(containerRef)
  const [hover, setHover] = useState<{ x: number; y: number; index: number } | null>(null)
  const [smooth, setSmooth] = useState(true)
  const [showPoints, setShowPoints] = useState(true)
  const w = Math.max(240, size.width || 640)
  const h = height

  const padded = { left: 36, right: 12, top: 12, bottom: 28 }
  const innerW = Math.max(20, w - padded.left - padded.right)
  const innerH = Math.max(40, h - padded.top - padded.bottom)

  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)

  const points = useMemo(() => {
    if (!data || data.length === 0) return []
    return data.map((d, i) => {
      const x = padded.left + (i / Math.max(1, data.length - 1)) * innerW
      const y = padded.top + innerH - ((d - min) / (max - min || 1)) * innerH
      return { x, y, v: d, i }
    })
  }, [data, innerW, innerH, max, min, padded.left, padded.top])

  const { path, area } = useMemo(() => buildPath(points, smooth), [points, smooth])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    // find nearest index
    let nearest = 0
    let best = Infinity
    for (let i = 0; i < points.length; i++) {
      const dx = Math.abs(points[i].x - x)
      if (dx < best) {
        best = dx
        nearest = i
      }
    }
    if (points[nearest]) {
      setHover({ x: points[nearest].x, y: points[nearest].y, index: nearest })
    }
  }, [points])

  const handleLeave = useCallback(() => setHover(null), [])

  const exportSVG = useCallback(async () => {
    if (!svgRef.current) return
    const svg = svgRef.current
    const serializer = new XMLSerializer()
    const clone = svg.cloneNode(true) as SVGSVGElement
    // inline computed styles for reliable export
    const css = `
      .area { fill: rgba(124,58,237,0.08); }
      .line { stroke: #7C3AED; stroke-width: 2.5; fill: none; stroke-linecap: round; stroke-linejoin: round; }
      .grid { stroke: rgba(15,23,42,0.06); stroke-width: 1; }
      .axis-text { fill: rgba(74,85,104,0.85); font-size:11px; font-family: Inter, ui-sans-serif, system-ui; }
    `
    const style = document.createElement('style')
    style.textContent = css
    clone.insertBefore(style, clone.firstChild)
    const str = serializer.serializeToString(clone)
    const svgBlob = new Blob([str], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = clone.viewBox.baseVal.width || w
      canvas.height = clone.viewBox.baseVal.height || h
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      // white background for PNG
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg') || '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      canvas.toBlob(blob => {
        if (!blob) return
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `analytics-${range}-${Date.now()}.png`
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(a.href)
      }, 'image/png')
    }
    img.crossOrigin = 'anonymous'
    img.src = url
  }, [w, h, range])

  // lightweight grid lines (few ticks)
  const yTicks = useMemo(() => {
    const ticks = 4
    const arr: { y: number; val: number }[] = []
    for (let i = 0; i <= ticks; i++) {
      const t = i / ticks
      const val = Math.round(min + (1 - t) * (max - min))
      const y = padded.top + innerH * t
      arr.push({ y, val })
    }
    return arr
  }, [min, max, innerH, padded.top])

  return (
    <div ref={containerRef} className={`w-full ${className}`} style={{ minWidth: 240 }}>
      <div className="flex items-center justify-between mb-3 gap-2">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Audience</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">{formatNumber(data.reduce((a, b) => a + b, 0))} <span className="text-xs text-gray-400 ml-2">— {range}</span></div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSmooth(s => !s)}
            className={`px-2 py-1 text-sm rounded-md border ${smooth ? 'bg-white dark:bg-gray-700' : 'bg-transparent'}`}
            title="Toggle smoothing"
          >
            {smooth ? 'Smooth' : 'Sharp'}
          </button>
          <button
            onClick={() => setShowPoints(s => !s)}
            className={`px-2 py-1 text-sm rounded-md border ${showPoints ? 'bg-white dark:bg-gray-700' : 'bg-transparent'}`}
            title="Toggle points"
          >
            {showPoints ? 'Points' : 'No points'}
          </button>
          <button
            onClick={exportSVG}
            className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm"
            title="Export chart as PNG"
          >
            Export
          </button>
        </div>
      </div>

      <div
        role="img"
        aria-label="Audience trend chart"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleLeave}
        style={{ width: '100%', height: h }}
        className="rounded-xl bg-gradient-to-b from-white/60 to-transparent dark:from-gray-800/60 p-0"
      >
        <svg ref={svgRef} viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" className="block">
          <defs>
            <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
            </linearGradient>
            <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feBlend in="SourceGraphic" in2="blur" mode="normal" />
            </filter>
          </defs>

          {/* grid lines */}
          <g>
            {yTicks.map((t, idx) => (
              <line key={idx} className="grid" x1={padded.left} x2={w - padded.right} y1={t.y} y2={t.y} strokeDasharray="2 3" />
            ))}
          </g>

          {/* area */}
          <path className="area" d={area} fill="url(#g1)" opacity={0.95} />

          {/* line */}
          <path className="line" d={path} />

          {/* points */}
          {showPoints && points.map(p => (
            <circle key={p.i} cx={p.x} cy={p.y} r={3.2} fill="#7C3AED" stroke="#fff" strokeWidth={1.2} />
          ))}

          {/* axes labels */}
          <g>
            {yTicks.map((t, i) => (
              <text key={i} x={6} y={t.y + 4} className="axis-text">{formatNumber(t.val)}</text>
            ))}
            {/* simple x ticks: start and end and mid */}
            {points.length > 0 && (
              <>
                <text x={padded.left} y={h - 6} className="axis-text">Start</text>
                <text x={(padded.left + (w - padded.right)) / 2} y={h - 6} className="axis-text">Mid</text>
                <text x={w - padded.right} y={h - 6} textAnchor="end" className="axis-text">Now</text>
              </>
            )}
          </g>

          {/* hover indicator */}
          {hover && (
            <>
              <line x1={hover.x} x2={hover.x} y1={padded.top} y2={h - padded.bottom} stroke="rgba(124,58,237,0.15)" strokeWidth={1.5} />
              <circle cx={hover.x} cy={hover.y} r={5} fill="#fff" stroke="#7C3AED" strokeWidth={2} />
            </>
          )}
        </svg>

        {/* tooltip */}
        {hover && points[hover.index] && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(${Math.max(8, Math.min(w - 140, hover.x))}px, ${Math.max(8, hover.y - 48)}px)`,
              pointerEvents: 'none'
            }}
            className="z-50 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-md shadow px-3 py-2 text-xs"
          >
            <div className="text-xs text-gray-500 dark:text-gray-400">Point</div>
            <div className="font-medium text-gray-900 dark:text-white">{formatNumber(points[hover.index].v)}</div>
            <div className="text-xs text-gray-400">Index {points[hover.index].i + 1}</div>
          </div>
        )}
      </div>
    </div>
  )
}