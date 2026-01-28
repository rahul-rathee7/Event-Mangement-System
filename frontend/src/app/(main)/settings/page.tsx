// ...existing code...
'use client'

import React, { useState, Suspense, lazy, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

const LoadingTiny = () => <div className="w-5 h-5 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />

const AccountSettings = lazy(() => import('@/components/User/settings/AccountSettings'))
const NotificationsSettings = lazy(() => import('@/components/User/settings/NotificationsSettings'))
const IntegrationsSettings = lazy(() => import('@/components/User/settings/IntegrationsSettings'))

import { User, Bell, Zap, Sun, Moon } from 'lucide-react'

const Shimmer = ({ className = '' }: { className?: string }) => (
  <div className={`shimmer h-full w-full ${className}`} />
)

// Reusable card for each settings section
const SectionCard = React.memo(({ title, icon, onOpen }: { title: string, icon: React.ReactNode, onOpen?: () => void }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 shadow-sm flex items-start gap-4 cursor-pointer"
    onClick={onOpen}
  >
    <div className="p-2 rounded-md bg-gray-50 dark:bg-gray-900/30">
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Click to expand and configure</p>
    </div>
  </motion.div>
))

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [prefetchDone, setPrefetchDone] = useState(false)

  // Memoized sections array to avoid re-renders
  const sections = useMemo(() => ([
    { key: 'account', title: 'Account', icon: <User size={18} /> },
    { key: 'notifications', title: 'Notifications', icon: <Bell size={18} /> },
    { key: 'integrations', title: 'Integrations', icon: <Zap size={18} /> },
  ]), [])

  // Lightweight prefetch for lazy components when user hovers (improves perceived speed)
  const prefetchSection = useCallback((key: string) => {
    if (prefetchDone) return
    if (key === 'account') import('@/components/User/settings/AccountSettings')
    if (key === 'notifications') import('@/components/User/settings/NotificationsSettings')
    if (key === 'integrations') import('@/components/User/settings/IntegrationsSettings')
    // mark as done to avoid repeated imports
    setPrefetchDone(true)
  }, [prefetchDone])

  const toggleTheme = useCallback(() => setTheme(theme === 'dark' ? 'light' : 'dark'), [theme, setTheme])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage your account, notifications and integrations</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="inline-flex items-center p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => window.location.reload()}
            className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: quick access cards */}
        <div className="lg:col-span-1 space-y-4">
          {sections.map(s => (
            <div
              key={s.key}
              onMouseEnter={() => prefetchSection(s.key)}
            >
              <SectionCard
                title={s.title}
                icon={s.icon}
                onOpen={() => setOpenSection(openSection === s.key ? null : s.key)}
              />
            </div>
          ))}

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Quick Tips</h4>
            <ul className="mt-3 text-xs text-gray-500 dark:text-gray-400 space-y-2">
              <li>• Use strong passwords and enable 2FA on your account.</li>
              <li>• Review notification preferences to avoid spam.</li>
              <li>• Connect integrations for streamlined workflows.</li>
            </ul>
          </div>
        </div>

        {/* Right column: dynamic content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Show a collapsed overview when no section open */}
          {!openSection && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Overview</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Configure core preferences and integrations. Click any card to expand that section.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Connected Apps</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white mt-2">3</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active Alerts</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white mt-2">2</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Security Score</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white mt-2">A</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Account Settings */}
          {openSection === 'account' && (
            <Suspense fallback={
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="h-24"><Shimmer /></div>
              </div>
            }>
              <AccountSettings onClose={() => setOpenSection(null)} />
            </Suspense>
          )}

          {/* Notifications */}
          {openSection === 'notifications' && (
            <Suspense fallback={<div className="bg-white dark:bg-gray-800 rounded-2xl p-6"><Shimmer /></div>}>
              <NotificationsSettings onClose={() => setOpenSection(null)} />
            </Suspense>
          )}

          {/* Integrations */}
          {openSection === 'integrations' && (
            <Suspense fallback={<div className="bg-white dark:bg-gray-800 rounded-2xl p-6"><Shimmer /></div>}>
              <IntegrationsSettings onClose={() => setOpenSection(null)} />
            </Suspense>
          )}
        </div>
      </div>

      {/* lightweight inline styles for shimmer (keeps bundle tiny) */}
      <style jsx>{`
        .shimmer {
          background: linear-gradient(90deg, rgba(230,230,230,1) 0%, rgba(245,245,245,1) 50%, rgba(230,230,230,1) 100%);
          background-size: 200% 100%;
          animation: shimmer 1.6s linear infinite;
          border-radius: 6px;
          height: 100%;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .shimmer { animation: none; }
        }
      `}</style>
    </div>
  )
}