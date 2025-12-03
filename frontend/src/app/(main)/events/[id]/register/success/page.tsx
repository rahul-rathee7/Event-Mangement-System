'use client'

import React, { useMemo, useCallback, useState, useEffect } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { CheckCircle2, Share2, Download, Calendar, ExternalLink, Link as LinkIcon } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '@/context/UserContext'

export default function RegistrationSuccessPage() {
  const router = useRouter()
  const params = useParams()
  const search = useSearchParams()
  const { user } = useAuth();

  const demoFallback = {
    id: 'event',
    name: 'Demo Conference 2025',
    ticket: 'Demo General',
    order: 'DEMO-0001'
  }

  const eventId = params?.id ?? demoFallback.id
  const eventName = search?.get('eventName') ?? demoFallback.name
  const ticketType = search?.get('ticket') ?? demoFallback.ticket
  const orderId = search?.get('order') ?? demoFallback.order

  const [copied, setCopied] = useState(false)

  const ticketUrl = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    return `${origin}/events/${encodeURIComponent(eventId)}/ticket/${encodeURIComponent(orderId)}`
  }, [eventId, orderId])

  const qrUrl = useMemo(() => `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(ticketUrl)}`, [ticketUrl])

  const handlePrint = useCallback(() => {
  const win = window.open('', '_blank')

  if (!win) {
    console.error('Popup blocked')
    return
  }

  const html = `
    <html><head><title>Ticket - ${escapeHtml(eventName)}</title>
    <style>
      body{font-family:Inter,system-ui;padding:20px;background:#f7fafc;color:#0f172a}
      .card{max-width:720px;margin:0 auto;background:#fff;padding:20px;border-radius:12px;box-shadow:0 8px 24px rgba(2,6,23,0.06)}
      .meta{color:#475569}
    </style>
    </head><body>
    <div class="card">
      <h2>${escapeHtml(eventName)}</h2>
      <p class="meta">Ticket: ${escapeHtml(ticketType)} • Order: ${escapeHtml(orderId)}</p>
      <img src="${qrUrl}" width="160" height="160" />
      <p style="margin-top:12px">Present this ticket at entry</p>
    </div>
    </body></html>
  `

  win.document.write(html)
  win.document.close()

  win.onload = () => win.print()
}, [eventName, ticketType, orderId, qrUrl, ticketUrl])

  const openEvent = useCallback(() => router.push(`/events/${eventId}`), [router, eventId])

  useEffect(() => {
    async function sendRegistrationConfirmation() {
      try {
        const res = await axios.post('http://localhost:5000/api/events/registered-users', {userId:user._id, eventId}, {withCredentials: true})
        const res1 = await axios.post('http://localhost:5000/api/users/registered-events', {userId:user._id, eventId}, {withCredentials: true})
        if(res.status && res1.status) {
          console.log(res.data.message);
          console.log(res.data.message);
        }
        else{
          console.log(res.data.message);
        }
      } catch (error) {
        console.error('Error sending registration confirmation:', error)
      }
    }
    sendRegistrationConfirmation()
  }, [params])

  return (
    <main className="max-w-3xl mx-auto p-6">
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-green-50 dark:bg-green-900 flex items-center justify-center" aria-hidden>
            <CheckCircle2 size={36} className="text-green-600 dark:text-green-300" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold truncate text-gray-900 dark:text-white">{eventName}</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Registration complete — ticket ready.</p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-md bg-gray-50 dark:bg-gray-900/40 p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400">Ticket</div>
              <div className="mt-1 font-medium text-gray-900 dark:text-white">{ticketType}</div>
              <div className="text-xs text-gray-400 mt-2">Order #{orderId}</div>
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                <LinkIcon size={14} /> <span className="truncate">{ticketUrl}</span>
              </div>
            </div>
            <div className="rounded-md bg-gray-50 dark:bg-gray-900/40 p-3 flex items-center gap-3">
              <img src={qrUrl} alt="Ticket QR code" width="88" height="88" className="rounded bg-white" />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={handlePrint} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              <Download size={16} /> Download / Print
            </button>

            <button onClick={openEvent} className="inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 text-sm">
              View Event <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Quick actions</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <li>Keep this page bookmarked or download the ticket for offline use.</li>
            <li>Share the ticket link with guests or add it to your calendar.</li>
            <li>For demo builds this ticket is accessible at the URL above.</li>
          </ul>
        </div>
      </section>
    </main>
  )
}

/* helpers */
function escapeHtml(str: unknown) {
  return String(str ?? '').replace(/[&<>"']/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s as keyof any]))
}
function slugify(s: unknown) {
  return String(s ?? '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')
}