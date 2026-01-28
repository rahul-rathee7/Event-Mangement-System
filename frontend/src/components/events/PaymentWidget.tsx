'use client'

import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Loader2, CreditCard, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

type Props = {
  eventId: string
  amount: number
  currency?: string
  onSuccess?: (receipt?: any) => void
  onError?: (err: any) => void
}

export default function PaymentWidget({ eventId, amount, currency = 'USD', onSuccess, onError }: Props) {
  const [processing, setProcessing] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const simulatePayment = async () => {
    setProcessing(true)
    setError(null)
    try {
      await new Promise((r) => setTimeout(r, 1200))
      if (Math.random() < 0.06) throw new Error('Payment processor error')
      const receipt = {
        id: `rcpt_${Date.now()}`,
        eventId,
        amount,
        currency,
        date: new Date().toISOString()
      }
      setDone(true)
      onSuccess?.(receipt)
    } catch (err: any) {
      setError(err?.message ?? 'Payment failed')
      onError?.(err)
    } finally {
      setProcessing(false)
    }
  } 
  
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-6 bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
          <CreditCard size={20} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Secure Payment</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">Pay for tickets securely. No payment details are stored on this demo.</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-300">Amount</div>
          <div className="text-lg font-semibold">${(amount || 0).toFixed(2)} <span className="text-xs text-gray-400">/{currency}</span></div>
        </div>
      </div>

      <div className="mt-4">
        {!done ? (
          <>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">Select a payment method and confirm.</div>

            <div className="rounded-lg border border-gray-100 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-900/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image src={'/assets/visa-icon.svg'} alt="Visa" width={36} height={24} className="object-contain" />
                  <div className="text-sm font-medium">Card (Demo)</div>
                </div>
                <div className="text-sm text-gray-500">•••• •••• •••• 4242</div>
              </div>
            </div>

            {error && <div className="mt-3 text-xs text-red-600">{error}</div>}

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={simulatePayment}
                disabled={processing}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60"
              >
                {processing ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                {processing ? 'Processing...' : `Pay $${(amount || 0).toFixed(2)}`}
              </button>

              <button
                onClick={() => window.alert('Open real payment options or gateways here')}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm"
              >
                Other options
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle2 className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">Payment completed</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Receipt sent to your email (demo)</div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}