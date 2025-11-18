'use client'

import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { User, Mail, Ticket, Calendar, MapPin, CheckCircle2, Loader2 } from 'lucide-react'
import axios from 'axios'

const PaymentWidget = lazy(() => import('@/components/events/PaymentWidget'))
const TicketSelector = lazy(() => import('@/components/events/TicketSelector'))

const Shimmer = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 ${className}`} />
)

const regSchema = z.object({
  name: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter a valid email'),
  tickets: z.number().int().min(1, 'Select at least 1 ticket'),
  ticketType: z.string().min(1, 'Choose ticket type'),
  phone: z.string().optional(),
  agree: z.boolean().refine(v => v === true, 'You must agree to the terms'),
})

type RegData = z.infer<typeof regSchema>

export default function Page() {
  const params = useParams()
  const router = useRouter()
  const rawId = params?.id
  const eventId = Array.isArray(rawId) ? (rawId[0] ?? 'unknown') : (rawId ?? 'unknown')

  const [loadingEvent, setLoadingEvent] = useState(true)
  const [eventData, setEventData] = useState<any | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [paymentRequired, setPaymentRequired] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<RegData>({
    resolver: zodResolver(regSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      tickets: 1,
      ticketType: '',
      phone: '',
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
        setPaymentRequired(Boolean(json?.ticketPrice && json?.ticketPrice > 0))
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
          ticketTypes: [{ id: 'general', label: 'General', price: 25 }, { id: 'vip', label: 'VIP', price: 75 }],
          description: 'An immersive event about modern web technologies — workshops, talks, and networking.'
        })
        setPaymentRequired(true)
      } finally {
        setLoadingEvent(false)
      }
    })()

    return () => { mounted = false }
  }, [eventId])

  useEffect(() => {
    if (eventData?.ticketTypes?.length) {
      setValue('ticketType', eventData?.ticketTypes[0].id)
    }
  }, [eventData, setValue])

  const onSubmit = useCallback(async (data: RegData) => {
    try {
      setSubmitting(true)
      if (paymentRequired) {
        toast('Redirecting to secure payment...', { icon: <Loader2 className="animate-spin" /> })
        await new Promise(r => setTimeout(r, 1200))
      }

      // simulate api registration
      await new Promise(r => setTimeout(r, 800))
      toast.success('Registration successful ✅')
      // optionally redirect to success page
      router.replace(`/events/${eventId}/register/success`)
    } catch (err) {
      console.error(err)
      toast.error('Registration failed — try again')
    } finally {
      setSubmitting(false)
    }
  }, [paymentRequired, router, eventId])

  // derived values memoized
  const summary = useMemo(() => {
    if (!eventData) return null
    const price = eventData?.ticketPrice ?? 0
    const selected = eventData?.ticketTypes?.find((t: any) => t.id === ticketType) ?? { price }
    return {
      title: eventData?.title,
      date: new Date(eventData?.date).toLocaleString(),
      location: eventData?.location,
      cover: eventData?.cover,
      unitPrice: selected.price ?? price,
      total: ((selected.price ?? price) * (tickets || 1)).toFixed(2)
    }
  }, [eventData, tickets, ticketType])

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
                    {(eventData?.ticketTypes ?? []).map((t: any) => (
                      <div key={t.id} className="p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{t.label}</div>
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

            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Full name</label>
                <div className="mt-1 relative">
                  <input {...register('name')} placeholder="Your name" className="block w-full py-2 pl-3 rounded-md border-gray-300 border-2 focus:border-blue-500 focus:border-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm" />
                  <div className="absolute right-3 top-3 text-gray-400"><User size={14} /></div>
                </div>
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Email</label>
                <div className="mt-1 relative">
                  <input {...register('email')} placeholder="you@example.com" className="block w-full py-2 pl-3 rounded-md border-gray-300 border-2 focus:border-blue-500 focus:border-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm" />
                  <div className="absolute right-3 top-3 text-gray-400"><Mail size={14} /></div>
                </div>
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Ticket type</label>
                <div className="mt-1">
                  <Controller
                    control={control}
                    name="ticketType"
                    render={({ field }) => (
                      <select {...field} className="block w-full rounded-md border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm">
                        <option value="">Select ticket</option>
                        {(eventData?.ticketTypes ?? []).map((t: any) => <option key={t.id} value={t.id}>{t.label} — ${t.price}</option>)}
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
                    <div className="font-semibold">${summary?.total ?? '—'}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <button type="submit" disabled={submitting || !isValid} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  {submitting ? <><Loader2 className="animate-spin" /> Processing...</> : `Pay & Register`}
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
                  <span className="font-medium">${summary?.total ?? '—'}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </motion.div>
      {paymentRequired && (
        <Suspense fallback={<div className="mt-6"><Shimmer className="h-24 rounded-lg" /></div>}>
          <PaymentWidget eventId={eventId} amount={Number(summary?.total ?? 0)} />
        </Suspense>
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