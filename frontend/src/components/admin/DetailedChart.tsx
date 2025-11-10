'use client'

import React, { useEffect, useState, useMemo, useCallback, useTransition } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Cpu, BarChart2, Star, Calendar } from 'lucide-react'

// heavy chart is dynamically imported to keep initial bundle small
const HeavyDeepChart = dynamic(() => import('@/components/admin/DeepDetailedChart'), {
  ssr: false,
  loading: () => (
    <div className="h-72 rounded-xl bg-white dark:bg-gray-800 animate-pulse" aria-hidden />
  )
})

// lightweight sparkline used everywhere (tiny, zero deps)
const Sparkline = ({ data = [], stroke = '#7C3AED' }: { data?: number[], stroke?: string }) => {
  const width = 300, height = 48
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

type Summary = {
  visitors: number[]
  total: number
  growth: number
  conversion: number
  avgSession: number
}

const KPI = React.memo(({ label, value, change, icon, spark }: any) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 shadow-sm">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300">
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{typeof value === 'number' ? value.toLocaleString() : value}</h3>
        </div>
      </div>
      <div className={`text-sm font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {change >= 0 ? `+${change}%` : `${change}%`}
      </div>
    </div>
    <div className="mt-3">
      <Sparkline data={spark} stroke="#7C3AED" />
    </div>
  </div>
))
KPI.displayName = 'KPI'

const DeepAnalyticsPage = () => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<Summary>({
    visitors: [20, 28, 35, 44, 40, 50, 60],
    total: 287,
    growth: 22,
    conversion: 7.4,
    avgSession: 58
  })

  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [showHeavy, setShowHeavy] = useState(false)

  useEffect(() => {
    let mounted = true
    // initial lightweight fetch / hydrate
    const load = async () => {
      try {
        // simulate a quick API fetch (replace with your API)
        await new Promise(res => setTimeout(res, 200))
        if (!mounted) return
        // jitter to feel live
        setSummary(prev => {
          const jitter = prev.visitors.map(v => Math.max(3, Math.round(v + (Math.random() * 8 - 4))))
          return {
            ...prev,
            visitors: jitter,
            total: jitter.reduce((a, b) => a + b, 0),
            growth: Math.round(Math.abs((Math.random() * 20) - 4)),
            conversion: +(5 + Math.random() * 4).toFixed(1),
            avgSession: Math.round(40 + Math.random() * 45)
          }
        })
      } finally {
        if (!mounted) return
        setLoading(false)
        // gently prefetch heavy chart during idle to optimize UX without blocking
        if ('requestIdleCallback' in window) {
          // @ts-ignore
          requestIdleCallback(() => {
            void HeavyDeepChart.prefetch?.() // attempt to prefetch if available
          })
        }
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  // change date range (useTransition for smoother UI updates when heavy chart mounts)
  const handleRange = useCallback((r: '7d' | '30d' | '90d') => {
    startTransition(() => {
      setDateRange(r)
      // simulate small refetch for the selected range
      setSummary(prev => {
        const multiplier = r === '7d' ? 1 : r === '30d' ? 4 : 12
        const base = prev.visitors.map(v => Math.max(3, Math.round(v * (multiplier / 4) + (Math.random() * 8 - 4))))
        return {
          ...prev,
          visitors: base,
          total: base.reduce((a, b) => a + b, 0)
        }
      })
    })
  }, [])

  const goBack = useCallback(() => router.back(), [router])

  const kpis = useMemo(() => ([
    { label: 'Visitors', value: summary.total, change: summary.growth, icon: <BarChart2 size={16} />, spark: summary.visitors },
    { label: 'Conversion', value: `${summary.conversion}%`, change: Math.round(summary.conversion - 5), icon: <Star size={16} />, spark: summary.visitors.map(v => Math.round(v * 0.08)) },
    { label: 'Avg. Session', value: `${summary.avgSession}m`, change: -2, icon: <Cpu size={16} />, spark: summary.visitors.map(v => Math.round(v * 0.6)) },
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Deep Analytics</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">In-depth charts and exportable insights — heavy visuals load only when you need them.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => handleRange('7d')}
              className={`px-3 py-1 rounded-md text-sm ${dateRange === '7d' ? 'bg-white dark:bg-gray-700 shadow' : 'text-gray-600 dark:text-gray-300'}`}
            >
              7d
            </button>
            <button
              onClick={() => handleRange('30d')}
              className={`px-3 py-1 rounded-md text-sm ${dateRange === '30d' ? 'bg-white dark:bg-gray-700 shadow' : 'text-gray-600 dark:text-gray-300'}`}
            >
              30d
            </button>
            <button
              onClick={() => handleRange('90d')}
              className={`px-3 py-1 rounded-md text-sm ${dateRange === '90d' ? 'bg-white dark:bg-gray-700 shadow' : 'text-gray-600 dark:text-gray-300'}`}
            >
              90d
            </button>
          </div>

          <motion.button
            onClick={() => startTransition(() => setShowHeavy(s => !s))}
            whileHover={{ scale: 1.03 }}
            className="text-sm px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            aria-pressed={showHeavy}
            aria-label="Toggle heavy chart"
            title="Toggle heavy chart"
          >
            {showHeavy ? 'Hide heavy chart' : 'Load heavy chart'}
          </motion.button>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loading ? Array(3).fill(0).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-white dark:bg-gray-800 animate-pulse border border-gray-100 dark:border-gray-700" />
        )) : kpis.map((k, i) => <KPI key={i} {...k} />)}
      </div>

      {/* Chart area */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36 }}
        className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Calendar className="text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Audience trend</h2>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">— {dateRange} overview</span>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            {isPending ? 'Updating…' : 'Live'}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="col-span-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">Summary</p>
            <div className="mt-2">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{summary.total}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Growth {summary.growth}% — Conversion {summary.conversion}%</div>
              <div className="mt-4 w-full">
                <Sparkline data={summary.visitors} stroke="#7C3AED" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 col-span-1">
            {/* show lightweight svg if heavy chart is hidden to keep interaction fast */}
            {!showHeavy ? (
              <div className="h-72 w-full rounded-xl border border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <div className="text-center">
                  <p className="font-medium text-gray-900 dark:text-white">Lightweight preview</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Click "Load heavy chart" for interactive, exportable visuals.</p>
                  <div className="mt-4 w-full">
                    <Sparkline data={summary.visitors} stroke="#7C3AED" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-72">
                {/* HeavyDeepChart is client-only and large — loaded lazily */}
                <HeavyDeepChart data={summary.visitors} range={dateRange} />
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="text-xs text-gray-400">Performance notes: heavy visuals are loaded on demand and prefetched during idle time. Replace simulated fetch with your real analytics endpoint for production.</div>
    </div>
  )
}

export default React.memo(DeepAnalyticsPage)