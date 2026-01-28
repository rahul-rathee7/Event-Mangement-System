'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useEventContext } from '@/context/EventContext'
import { useAuth } from '@/context/UserContext'
import { Edit3, Trash2, ExternalLink, Users, Download, Eye } from 'lucide-react'

type EventType = any
type UserType = any

export default function AdminEventPage() {
  const { id } = useParams()
  const router = useRouter()
  const { events, setEvents } = useEventContext()
  const { user } = useAuth()

  const [event, setEvent] = useState<EventType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [registrants, setRegistrants] = useState<string[]>([])
  const [processing, setProcessing] = useState(false)

  // find event in context first (fast), fall back to fetch
  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const fromCtx = Array.isArray(events) ? events.find(e => String(e._id) === String(id)) : null
        if (fromCtx) {
          if (!mounted) return
          setEvent(fromCtx)
          setRegistrants(Array.isArray(fromCtx.register_user_id) ? fromCtx.register_user_id.map(String) : [])
          setLoading(false)
          return
        }
        const res = await fetch(`/api/events/${id}`)
        if (!res.ok) throw new Error('Failed to load event')
        const json = await res.json()
        if (!mounted) return
        setEvent(json.Event || json.data || null)
        const ids = json.Event?.register_user_id || json.data?.register_user_id || []
        setRegistrants(Array.isArray(ids) ? ids.map((x: any) => String(x)) : [])
      } catch (err: any) {
        console.error(err)
        if (mounted) setError(err.message || 'Unable to load event')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [events, id])

  const isOrganizer = useMemo(() => {
    if (!user || !event) return false
    const uid = (user._id || user._id || user?._id)
    return String(uid) === String(event.organizerInfo)
  }, [user, event])

  // const handleEdit = useCallback(() => {
  //   router.push(`/admin/edit-event/${id}`)
  // }, [router, id])

  const handleViewPublic = useCallback(() => {
    router.push(`/events/${id}`)
  }, [router, id])

  // const handleDelete = useCallback(async () => {
  //   if (!confirm('Delete this event? This cannot be undone.')) return
  //   try {
  //     setProcessing(true)
  //     const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })
  //     if (!res.ok) throw new Error('Delete failed')
  //     setEvents?.((prev: EventType[]) => (prev || []).filter(e => String(e._id) !== String(id)))
  //     router.push('/admin/events')
  //   } catch (err) {
  //     alert('Failed to delete event')
  //     console.error(err)
  //   } finally {
  //     setProcessing(false)
  //   }
  // }, [id, router, setEvents])

  // const togglePublish = useCallback(async () => {
  //   if (!event) return
  //   try {
  //     setProcessing(true)
  //     const res = await fetch(`/api/events/${id}`, {
  //       method: 'PATCH',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ isPublic: !event.isPublic })
  //     })
  //     if (!res.ok) throw new Error('Update failed')
  //     const json = await res.json()
  //     setEvent(prev => ({ ...(prev || {}), isPublic: json.Event?.isPublic ?? !event.isPublic }))
  //     // update context if present
  //     setEvents?.((prev: EventType[]) => (prev || []).map(e => e._id === id ? { ...e, isPublic: json.Event?.isPublic ?? !event.isPublic } : e))
  //   } catch (err) {
  //     alert('Failed to update visibility')
  //     console.error(err)
  //   } finally {
  //     setProcessing(false)
  //   }
  // }, [event, id, setEvents])

  // const exportRegistrants = useCallback(() => {
  //   if (!registrants || registrants.length === 0) {
  //     alert('No registrants to export')
  //     return
  //   }
  //   const csv = ['userId'].concat(registrants).join('\n')
  //   const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  //   const url = URL.createObjectURL(blob)
  //   const a = document.createElement('a')
  //   a.href = url
  //   a.download = `registrants-${id}.csv`
  //   document.body.appendChild(a)
  //   a.click()
  //   a.remove()
  //   URL.revokeObjectURL(url)
  // }, [registrants, id])

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-28 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-28 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-28 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => router.back()}>Go back</button>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <p className="text-gray-700 dark:text-gray-300">Event not found</p>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => router.push('/admin/events')}>Back to events</button>
      </div>
    )
  }

  if (!isOrganizer) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <p className="text-gray-700 dark:text-gray-300 mb-4">You are not authorized to manage this event.</p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => router.push('/admin/events')}>Back to my events</button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow">
        <div className="relative w-full h-72 md:h-96">
          {event.image ? (
            <Image src={event.image} alt={event.title || 'Event cover'} fill className="object-cover" sizes="100vw" />
          ) : (
            <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">No image</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-white">{event.title || event.name}</h1>
              <p className="text-sm text-white/90 mt-1 max-w-xl line-clamp-2">{event.shortDescription || event.description}</p>
            </div>

            <div className="flex items-center gap-2">
              {/* <button onClick={handleEdit} className="inline-flex items-center gap-2 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md">
                <Edit3 size={16} /> Edit
              </button> */}

              <button onClick={handleViewPublic} className="inline-flex items-center gap-2 px-3 py-2 bg-white/90 hover:bg-white text-gray-800 rounded-md">
                <Eye size={16} /> View public
              </button>

              {/* <button onClick={handleDelete} disabled={processing} className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md">
                <Trash2 size={16} /> Delete
              </button> */}
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
              <Users /> <span className="font-medium">{registrants.length}</span> registrants
              <span className="mx-2">•</span>
              <span>{event.capacity ? `${event.capacity} capacity` : 'Unlimited'}</span>
              <span className="mx-2">•</span>
              <span>{new Date(event.startDate || event.date || Date.now()).toLocaleString()}</span>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{event.description || 'No description'}</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Details & settings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-gray-500">Category</div>
                  <div className="font-medium">{event.category || '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Visibility</div>
                  <div className="font-medium">{event.isPublic ? 'Public' : 'Private'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Price</div>
                  <div className="font-medium">{event.ticketPrice === 0 ? 'Free' : `$${event.ticketPrice ?? '—'}`}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Capacity</div>
                  <div className="font-medium">{event.capacity ?? 'Unlimited'}</div>
                </div>
              </div>

              {/* <div className="mt-4 flex gap-2">
                <button onClick={togglePublish} disabled={processing} className="px-3 py-2 rounded-md bg-blue-600 text-white">
                  {event.isPublic ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={exportRegistrants} className="px-3 py-2 rounded-md border flex items-center gap-2">
                  <Download size={14} /> Export IDs
                </button>
              </div> */}
            </div>
          </div>

          {/* <aside className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500">Registrants</div>
                  <div className="text-lg font-semibold">{registrants.length}</div>
                </div>
                <div className="text-sm text-gray-500">{event.register_user_id ?? registrants.length}</div>
              </div>

              <div className="mt-3">
                {registrants.length === 0 ? (
                  <div className="text-sm text-gray-500">No one has registered yet.</div>
                ) : (
                  <ul className="max-h-56 overflow-auto divide-y divide-gray-100 dark:divide-gray-800">
                    {registrants.map((r, i) => (
                      <li key={r + i} className="py-2 flex items-center justify-between text-sm">
                        <div className="truncate text-gray-700 dark:text-gray-200">{r}</div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => navigator.clipboard.writeText(r)} title="Copy ID" className="text-gray-500 hover:text-gray-700">Copy</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-3 text-xs text-gray-400">Tip: click Export to download CSV of registrant IDs.</div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-100 dark:border-gray-700">
              <div className="text-xs text-gray-500">Quick links</div>
              <div className="mt-2 flex flex-col gap-2">
                <button onClick={() => router.push('/admin/events')} className="text-left text-sm text-blue-600 hover:underline flex items-center gap-2"><ExternalLink size={14} /> Back to events</button>
                <button onClick={() => router.push(`/admin/events/${id}/registrations`)} className="text-left text-sm text-blue-600 hover:underline flex items-center gap-2"><Users size={14} /> Manage registrations</button>
              </div>
            </div>
          </aside> */}
        </div>
      </div>
    </div>
  )
}