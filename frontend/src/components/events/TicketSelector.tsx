'use client'

import React, { useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

type TicketType = {
  id: string
  label: string
  price: number
  available?: number
  description?: string
}

type Value = {
  ticketTypeId: string
  quantity: number
}

type Props = {
  ticketTypes: TicketType[]
  value?: Value
  onChange?: (v: Value) => void
  disabled?: boolean
}
export default function TicketSelector({ ticketTypes = [], value, onChange, disabled = false }: Props) {
  const selected = useMemo(() => {
    if (!value && ticketTypes.length) return { ticketTypeId: ticketTypes[0].id, quantity: 1 }
    return value ?? { ticketTypeId: ticketTypes[0]?.id ?? '', quantity: 1 }
  }, [value, ticketTypes])

  const changeType = useCallback((id: string) => {
    onChange?.({ ticketTypeId: id, quantity: 1 })
  }, [onChange])

  const setQuantity = useCallback((q: number) => {
    const max = ticketTypes.find(t => t.id === selected.ticketTypeId)?.available ?? Infinity
    const qty = Math.max(1, Math.min(Math.floor(q), Number.isFinite(max) ? max : q))
    onChange?.({ ticketTypeId: selected.ticketTypeId, quantity: qty })
  }, [onChange, selected.ticketTypeId, ticketTypes])

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {ticketTypes.map(t => {
          const active = t.id === selected.ticketTypeId
          return (
            <motion.button
              key={t.id}
              onClick={() => changeType(t.id)}
              whileHover={{ scale: 1.02 }}
              className={`flex flex-col items-start p-3 rounded-lg border transition-colors text-left ${active ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'}`}
              disabled={disabled}
            >
              <div className="w-full flex items-center justify-between">
                <div>
                  <div className={`text-sm font-medium ${active ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'}`}>{t.label}</div>
                  {t.description && <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.description}</div>}
                </div>
                <div className="text-sm font-semibold">${t.price.toFixed(2)}</div>
              </div>
              {typeof t.available === 'number' && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Available: {t.available}</div>
              )}
            </motion.button>
          )
        })}
      </div>

      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-600 dark:text-gray-300">Quantity</div>
        <div className="ml-auto inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-md px-2 py-1">
          <button
            onClick={() => setQuantity((selected.quantity || 1) - 1)}
            disabled={disabled || (selected.quantity || 1) <= 1}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Decrease"
          >
            <Minus size={14} />
          </button>
          <div className="px-3 text-sm font-medium">{selected.quantity || 1}</div>
          <button
            onClick={() => setQuantity((selected.quantity || 1) + 1)}
            disabled={disabled || (ticketTypes.find(t => t.id === selected.ticketTypeId)?.available ?? Infinity) <= (selected.quantity || 1)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Increase"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}