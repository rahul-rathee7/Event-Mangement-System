'use client'

import React, { useEffect, useState, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, BarChart2, Zap, Clock } from 'lucide-react'

const HeavyChart = dynamic(() => import('@/components/admin/DetailedChart'), {
  ssr: false,
  loading: () => (
    <div className="h-40 rounded-xl bg-white dark:bg-gray-800 animate-pulse" aria-hidden />
  )
})

const Sparkline = ({ data = [], stroke = '#7C3AED' }: { data?: number[], stroke?: string }) => {
  const width = 240, height = 48
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

const Stat = React.memo(({ title, value, delta, icon, spark }: any) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex items-center justify-between shadow-sm">
    <div>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300">
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{typeof value === 'number' ? value.toLocaleString() : value}</h3>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <span className={`text-sm font-medium ${delta >= 0 ? 'text-green-500' : 'text-red-500'}`}>{delta >= 0 ? `+${delta}%` : `${delta}%`}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">vs last week</span>
      </div>
    </div>
    <div className="w-36">
      <Sparkline data={spark} stroke="#7C3AED" />
    </div>
  </div>
))
Stat.displayName = 'Stat'

const AnalyticsPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState({
    attendees: [12, 18, 24, 30, 28, 34, 40],
    total: 186,
    growth: 14,
    conversion: 6.2,
    avgDuration: 52
  })

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        await new Promise(res => setTimeout(res, 220))
        if (!mounted) return
        setSummary(prev => ({
          ...prev,
          attendees: prev.attendees.map(v => Math.max(5, Math.round(v + (Math.random() * 6 - 3)))),
          total: prev.attendees.reduce((a, b) => a + b, 0),
          growth: Math.round(8 + Math.random() * 8),
          conversion: +(5 + Math.random() * 3).toFixed(1),
          avgDuration: Math.round(45 + Math.random() * 20)
        }))
      } finally {
        if (!mounted) return
        setLoading(false)
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
          })
        }
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const goBack = useCallback(() => router.back(), [router])
  const openDeepChart = useCallback(() => {
    router.push('/admin/analytics/deep')
  }, [router])

  const stats = useMemo(() => ([
    { title: 'Attendees (week)', value: summary.total, delta: summary.growth, icon: <BarChart2 size={18} />, spark: summary.attendees },
    { title: 'Conversion Rate', value: `${summary.conversion}%`, delta: Math.round(summary.conversion - 5), icon: <Zap size={18} />, spark: summary.attendees.map(x => Math.round(x * 0.1)) },
    { title: 'Avg. Session', value: `${summary.avgDuration}m`, delta: -2, icon: <Clock size={18} />, spark: summary.attendees.map(x => Math.round(x * 0.6)) },
  ]), [summary])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button
            onClick={goBack}
            whileHover={{ scale: 1.03 }}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            aria-label="Go back"
            title="Back"
          >
            <ArrowLeft size={16} />
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Overview — lightweight, fast and focused insights.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            onClick={openDeepChart}
            whileHover={{ scale: 1.03 }}
            className="text-sm px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            aria-label="Open detailed analytics"
          >
            View deep insights
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-white dark:bg-gray-800 animate-pulse border border-gray-100 dark:border-gray-700" />
          ))
        ) : (
          stats.map((s, i) => <Stat key={i} {...s} />)
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly visitors</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Lightweight sparkline + lazy heavy chart</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="col-span-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total this week</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{summary.total}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Growth {summary.growth}% vs last week</div>
            <div className="mt-3 w-full md:w-48">
              <Sparkline data={summary.attendees} stroke="#7C3AED" />
            </div>
          </div>

          <div className="md:col-span-2">
            <HeavyChart data={summary.attendees} height={160} />
          </div>
        </div>
      </motion.div>

      <div className="text-xs text-gray-400">Notes: charts are lazy-loaded; this page intentionally avoids heavy libraries on first paint to keep load times minimal. Replace the simulated fetch with your API endpoint for real data.</div>
    </div>
  )
}

export default React.memo(AnalyticsPage)