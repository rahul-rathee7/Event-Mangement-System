'use client'

import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Ticket, Calendar, MapPin, CheckCircle2, Loader2 } from 'lucide-react'
import axios from 'axios'

const PaymentWidget = lazy(() => import('@/components/events/PaymentWidget'))

const Shimmer = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 ${className}`} />
)

const regSchema = z.object({
  tickets: z.number().int().min(1, 'Select at least 1 ticket'),
  ticketType: z.string().min(1, 'Choose ticket type'),
  agree: z.boolean().refine(v => v === true, 'You must agree to the terms'),
})

type RegData = z.infer<typeof regSchema>

export default function Page() {
  const params = useParams()
  const router = useRouter()
  const rawId = params?.id
  const eventId = Array.isArray(rawId) ? (rawId[0] ?? 'unknown') : (rawId ?? 'unknown')

  const [submitting, setSubmitting] = useState(false)
  const [showPaymentWidget, setShowPaymentWidget] = useState(false)
  const [eventData, setEventData] = useState<any | null>(null)
  const [loadingEvent, setLoadingEvent] = useState(false)

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors }
  } = useForm<RegData>({
    resolver: zodResolver(regSchema),
    mode: 'onChange',
    defaultValues: {
      tickets: 1,
      ticketType: '',
      agree: false
    }
  })
  const tickets = watch('tickets')
  const ticketType = watch('ticketType')
  useEffect(() => {
    let mounted = true
    setLoadingEvent(true);
    (async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/event/${eventId}`, {withCredentials: true})
        if (res.status !== 200) throw new Error('No server data')
          console.log(res.data.Event);
        const json = res.data.Event
        if (!mounted) return
        setEventData(json)
      } catch(err) {
        console.log(err);
        if (!mounted) return
        setEventData({
          id: eventId,
          title: 'Sample Event — Modern Web Summit',
          date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
          location: 'Grand Hall, Downtown',
          cover: '',
          ticketPrice: 25.0,
          ticketOptions: [{ name: 'general', label: 'General', price: 25 }, { name: 'vip', label: 'VIP', price: 75 }],
          description: 'An immersive event about modern web technologies — workshops, talks, and networking.'
        })
      } finally {
        setLoadingEvent(false)
      }
    })()

    return () => { mounted = false }
  }, [eventId])

  useEffect(() => {
    if (eventData?.ticketOptions?.length) {
      setValue('ticketType', eventData?.ticketOptions[0]._id)
    }
  }, [eventData, setValue])

  const summary = useMemo(() => {
    if (!eventData) return null
    const price = eventData?.ticketPrice ?? 0
    const selected = eventData?.ticketOptions?.find((t: any) => t._id === ticketType) ?? { price }
    return {
      title: eventData?.title,
      date: new Date(eventData?.date).toLocaleString(),
      location: eventData?.location,
      cover: eventData?.cover,
      unitPrice: selected.price ?? price,
      total: ((selected.price ?? price) * (tickets || 1))
    }
  }, [eventData, tickets, ticketType])

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      if (Number(summary?.total ?? 0) > 0) {
        setShowPaymentWidget(true)
      } else {
        await new Promise(r => setTimeout(r, 800))
        toast.success('Registration successful ✅')
        router.replace(`/events/${eventId}/register/success`)
      }
    } catch (err) {
      console.error(err)
      toast.error('Registration failed — try again')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
            {loadingEvent ? (
              <div className="p-6">
                <div className="flex gap-4">
                  <Shimmer className="h-40 w-56 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <Shimmer className="h-6 w-3/4 rounded" />
                    <Shimmer className="h-4 w-1/2 rounded" />
                    <Shimmer className="h-3 w-full rounded" />
                    <Shimmer className="h-3 w-full rounded" />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="relative w-full h-64 sm:h-72 lg:h-96">
                  {eventData?.image ? (
                    <Image src={eventData?.image} alt={eventData?.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-400 to-indigo-600" />
                  )}
                </div>

                <div className="p-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{eventData?.title}</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-3">
                    <Calendar size={14} /> {new Date(eventData?.date).toLocaleString()} • <MapPin size={14} /> {eventData?.location}
                  </p>

                  <div className="mt-4 text-gray-700 dark:text-gray-300 prose max-w-none">
                    <p>{eventData?.description}</p>
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(eventData?.ticketOptions ?? []).map((t: any) => (
                      <div key={t._id} className="p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{t.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Per ticket</div>
                          </div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">${t.price.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">What to expect</h3>
            <ul className="mt-3 text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <li>• In-person workshops and networking.</li>
              <li>• Bring a printed or mobile ticket.</li>
              <li>• Refund policy: up to 7 days before the event.</li>
            </ul>
          </motion.div>
        </div>

        <aside className="lg:col-span-1 space-y-4">
          <div className="sticky top-6 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Ticket /> Register
            </h3>

            <form onSubmit={onSubmit} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Ticket type</label>
                <div className="mt-1">
                  <Controller
                    control={control}
                    name="ticketType"
                    render={({ field }) => (
                      <select {...field} className="block w-full rounded-md border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm">
                        <option value="">Select ticket</option>
                        {(eventData?.ticketOptions ?? []).map((t: any) => <option key={t._id} value={t._id}>{t.name} — ${t.price.toFixed(2)}</option>)}
                      </select>
                    )}
                  />
                </div>
                {errors.ticketType && <p className="text-xs text-red-600 mt-1">{errors.ticketType.message}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Quantity</label>
                <Controller
                  control={control}
                  name="tickets"
                  render={({ field }) => (
                    <div className="flex items-center gap-3 mt-1">
                      <button
                        type="button"
                        className="px-3 py-1 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => field.onChange(Math.max(1, (field.value || 1) - 1))}
                      >
                        -
                      </button>
                      <input
                        {...field}
                        type="number"
                        min={1}
                        className="w-16 text-center rounded-md border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          field.onChange(isNaN(val) ? 1 : Math.max(1, val));
                        }}
                      />
                      <button
                        type="button"
                        className="px-3 py-1 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => field.onChange((field.value || 0) + 1)}
                      >
                        +
                      </button>
                    </div>
                  )}
                />
                {errors.tickets && <p className="text-xs text-red-600 mt-1">{errors.tickets.message}</p>}
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" {...register('agree')} id="agree" className="h-4 w-4 text-blue-600" />
                <label htmlFor="agree" className="text-xs text-gray-600 dark:text-gray-300">I agree to the terms and privacy policy</label>
              </div>
              {errors.agree && <p className="text-xs text-red-600 mt-1">{errors.agree.message}</p>}

              <div className="mt-2">
                <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-200">
                  <div>
                    <div className="text-xs text-gray-500">Unit</div>
                    <div className="font-semibold">${summary?.unitPrice ?? '—'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Total</div>
                    <div className="font-semibold">${(summary?.total ?? 0).toFixed(2)}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <button type="submit" onClick={onSubmit} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  {submitting ? <><Loader2 className="animate-spin" /> Processing...</> : (Number(summary?.total ?? 0) > 0) ? 'Proceed to Payment' : 'Register'}
                </button>
              </div>
            </form>
            <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="text-green-500" />
                Secure checkout & encrypted payment
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Summary</h4>
            <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <div><span className="font-medium">Event:</span> {eventData?.title ?? <span className="text-gray-400">Loading…</span>}</div>
              <div><span className="font-medium">When:</span> {eventData ? new Date(eventData?.date).toLocaleString() : <span className="text-gray-400">—</span>}</div>
              <div><span className="font-medium">Where:</span> {eventData?.location ?? <span className="text-gray-400">—</span>}</div>
              <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="font-medium">${(summary?.total ?? 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </motion.div>
      {showPaymentWidget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Complete Payment</h3>
              <button onClick={() => setShowPaymentWidget(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <Suspense fallback={<div className="mt-6"><Shimmer className="h-24 rounded-lg" /></div>}>
              <PaymentWidget
                eventId={eventId}
                amount={Number(summary?.total ?? 0)}
                onSuccess={() => {
                  setShowPaymentWidget(false)
                  toast.success('Registration successful ✅')
                  router.replace(`/events/${eventId}/register/success`)
                }}
              />
            </Suspense>
          </div>
        </div>
      )}

      <style jsx>{`
        /* small optimizations for smoother feel */
        input:focus, select:focus, textarea:focus {
          outline: none;
          box-shadow: 0 0 0 4px rgba(59,130,246,0.08);
        }
      `}</style>
    </div>
  )
}