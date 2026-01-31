'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, X } from 'lucide-react'

type Props = {
  onClose?: () => void
}

export default function NotificationsSettings({ onClose }: Props) {
  const [prefs, setPrefs] = useState({
    email: true,
    push: true,
    reminders: true,
    marketing: false
  })
  const [saving, setSaving] = useState(false)

  const toggle = (key: keyof typeof prefs) => setPrefs(p => ({ ...p, [key]: !p[key] }))

  const save = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    setSaving(false)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-gray-50 dark:bg-gray-900/30">
            <Bell size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Control what notifications you receive</p>
          </div>
        </div>

        <div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"><X size={16} /></button>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {([
          { key: 'email', label: 'Email Notifications' },
          { key: 'push', label: 'Push Notifications' },
          { key: 'reminders', label: 'Event Reminders' },
          { key: 'marketing', label: 'Marketing Communications' },
        ] as const).map(item => (
          <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-200">{item.label}</p>
              <p className="text-xs text-gray-400">Manage delivery preferences</p>
            </div>

            <div className="flex items-center gap-3">
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={prefs[item.key]} onChange={() => toggle(item.key)} className="sr-only" />
                <div className={`h-6 w-12 rounded-full p-0.5 ${prefs[item.key] ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}>
                  <div className={`h-5 w-5 rounded-full bg-white transform transition-transform ${prefs[item.key] ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </label>
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button onClick={save} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            {saving ? 'Saving...' : 'Save preferences'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}