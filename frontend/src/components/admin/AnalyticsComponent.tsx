'use client'

import React, { useEffect, useState } from 'react'

const Sparkline = ({ data = [], stroke = '#60A5FA' }: { data?: number[], stroke?: string }) => {
  const width = 300, height = 64
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const points = data.map((d, i) => {
    const x = (i / Math.max(1, data.length - 1)) * width
    const y = height - ((d - min) / (max - min || 1)) * height
    return `${x},${y}`
  }).join(' ')
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="rounded">
      <polyline fill="none" stroke={stroke} strokeWidth={2} points={points} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const AnalyticsComponent = () => {
  const [metrics, setMetrics] = useState({ attendees: [10, 20, 18, 25, 30, 40, 35], growth: 12 })

  useEffect(() => {
    // lightweight periodic update to make the component feel alive
    const id = setInterval(() => {
      setMetrics(prev => {
        const next = prev.attendees.slice(1).concat([Math.max(5, Math.min(50, prev.attendees[prev.attendees.length - 1] + (Math.random() * 8 - 4)))])
        return { ...prev, attendees: next }
      })
    }, 2000)

    return () => clearInterval(id)
  }, [])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">This week</h3>
          <div className="flex items-end gap-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.attendees.reduce((a,b) => a + Math.round(b), 0)}</h2>
            <span className="text-sm text-green-500 font-medium">+{metrics.growth}%</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Attendees this week</p>
        </div>
        <div className="w-48">
          <Sparkline data={metrics.attendees} stroke="#7C3AED" />
        </div>
      </div>
    </div>
  )
}

export default AnalyticsComponent