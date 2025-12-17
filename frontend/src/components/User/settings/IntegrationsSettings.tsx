'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Plug, X} from 'lucide-react'

type Props = {
  onClose?: () => void
}

const available = [
  { id: 'google', name: 'Google Calendar' },
  { id: 'zoom', name: 'Zoom' },
]

export default function IntegrationsSettings({ onClose }: Props) {
  const [connected, setConnected] = useState<Record<string, boolean>>({
    google: true,
    zoom: false,
  })
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const toggle = async (id: string) => {
    setLoadingId(id)
    await new Promise(r => setTimeout(r, 700))
    setConnected(c => ({ ...c, [id]: !c[id] }))
    setLoadingId(null)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-gray-50 dark:bg-gray-900/30">
            <Zap size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Integrations</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Connect apps to extend functionality</p>
          </div>
        </div>

        <div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"><X size={16} /></button>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {available.map(it => (
          <div key={it.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-white dark:bg-gray-800">
                <Plug size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{it.name}</p>
                <p className="text-xs text-gray-400">Quick integration</p>
              </div>
            </div>

            <div>
              <button
                onClick={() => toggle(it.id)}
                disabled={loadingId === it.id}
                className={`px-3 py-1 rounded-md text-sm ${connected[it.id] ? 'bg-red-100 text-red-700' : 'bg-green-600 text-white'} hover:opacity-90`}
              >
                {loadingId === it.id ? 'Processing...' : connected[it.id] ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}