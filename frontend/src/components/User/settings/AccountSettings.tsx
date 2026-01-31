'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, ShieldCheck, X } from 'lucide-react'
import { useAuth } from '@/context/UserContext'
import { useRouter } from 'next/navigation'

type Props = {
  onClose?: () => void
}

export default function AccountSettings({ onClose }: Props) {
  const router = useRouter();
  const { user, enableTwoFA } = useAuth()
  const [saving, setSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true)
    router.push('userAuth/forget-password')
    setSaving(false)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative p-2 rounded-md bg-gray-50 dark:bg-gray-900/30">
            <User size={20} />
            {user?.twoFA ? <ShieldCheck size={12} className="absolute bottom-0 right-0 text-green-500 bg-white rounded-full" /> : null}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage profile and security settings</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onClose} aria-label="Close" className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Profile</p>
          <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{user?.email}</p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Two-Factor Authentication</p>
            <p className="text-xs text-gray-400 mt-1">Extra security for your account</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.twoFA ? 'Enabled' : 'Disabled'}</div>
            <button
              onClick={() => enableTwoFA()}
              className={`h-6 w-12 rounded-full p-0.5 transition-colors ${user?.twoFA ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}
              aria-pressed={user?.twoFA}
            >
              <div className={`h-5 w-5 rounded-full bg-white transform transition-transform ${user?.twoFA ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Password</p>
            <p className="text-xs text-gray-400 mt-1">Last changed 90 days ago</p>
          </div>
          <button onClick={handleSave} disabled={saving} className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-sm hover:bg-gray-200">
            {saving ? 'Saving...' : 'Change'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}