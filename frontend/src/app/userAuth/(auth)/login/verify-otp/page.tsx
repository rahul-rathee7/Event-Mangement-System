'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/context/UserContext'

const OTP_LENGTH = 6
const RESEND_COOLDOWN_MS = 45_000

export default function Page() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const userEmail = user?.email ?? ''
  const twoFAEnabled = Boolean(user?.twoFA)

  const [digits, setDigits] = useState<string[]>(() => Array(OTP_LENGTH).fill(''))
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'info' | 'success' | 'error'; text: string } | null>(null)
  const [sentAt, setSentAt] = useState<number | null>(null)
  const [countdown, setCountdown] = useState<number>(0)

  const code = useMemo(() => digits.join(''), [digits])
  const canVerify = code.length === OTP_LENGTH && !digits.includes('')
  const resendAvailable = useMemo(() => (sentAt ? Date.now() - sentAt > RESEND_COOLDOWN_MS : true), [sentAt])

  // mask email for display
  const maskedEmail = useMemo(() => {
    if (!userEmail) return ''
    const [local, domain] = userEmail.split('@')
    const visible = Math.max(1, Math.min(3, Math.floor(local.length / 2)))
    return `${local.slice(0, visible)}${local.length > visible ? '…' : ''}@${domain}`
  }, [userEmail])

  // countdown for resend
  useEffect(() => {
    if (!sentAt) {
      setCountdown(0)
      return
    }
    const tick = () => {
      const diff = Math.max(0, RESEND_COOLDOWN_MS - (Date.now() - sentAt))
      setCountdown(Math.ceil(diff / 1000))
    }
    tick()
    const id = setInterval(tick, 250)
    return () => clearInterval(id)
  }, [sentAt])

  // prevent duplicate sends across remounts/tabs
  const sendingRef = useRef(false)

  // sendCode returns boolean success and guards with in-memory + sessionStorage flags
  const sendCode = useCallback(async (): Promise<boolean> => {
    if (!userEmail) return false

    const sentKey = `twofa_sent_${userEmail}`
    const sendingKey = `twofa_sending_${userEmail}`

    // guard: already sending in this tab or another tab
    if (sendingRef.current || sessionStorage.getItem(sendingKey)) {
      setMessage({ type: 'info', text: 'Verification code is being sent. Please wait.' })
      return false
    }

    // guard: recently sent -> restore state and skip
    const prev = Number(sessionStorage.getItem(sentKey) || '0')
    if (prev && Date.now() - prev < RESEND_COOLDOWN_MS) {
      setSentAt(prev)
      setMessage({ type: 'info', text: `OTP already sent to ${maskedEmail}` })
      return true
    }

    // mark sending
    sendingRef.current = true
    sessionStorage.setItem(sendingKey, '1')
    setMessage(null)
    setLoading(true)

    try {
      const res = await axios.post('http://localhost:5000/api/sendmail/forget-password', { email: userEmail, purpose: '2fa' })
      if (res.data?.success) {
        const now = Date.now()
        sessionStorage.setItem(sentKey, String(now))
        setSentAt(now)
        setDigits(Array(OTP_LENGTH).fill(''))
        setMessage({ type: 'success', text: `Verification code sent to ${maskedEmail}` })
        setTimeout(() => inputsRef.current[0]?.focus(), 80)
        return true
      } else {
        setMessage({ type: 'error', text: res.data?.message ?? 'Failed to send code' })
        return false
      }
    } catch (err) {
      console.error('send OTP error', err)
      setMessage({ type: 'error', text: 'Failed to send code. Try again or logout.' })
      return false
    } finally {
      sendingRef.current = false
      sessionStorage.removeItem(sendingKey)
      setLoading(false)
    }
  }, [userEmail, maskedEmail])

  // auto-send on mount (safe because sendCode is guarded)
  useEffect(() => {
    if (!user) {
      router.replace('/userAuth/login')
      return
    }
    if (!twoFAEnabled) {
      router.replace('/')
      return
    }
    if (!userEmail) return

    // call sendCode (it will skip if already sent/sending)
    sendCode()
  }, [user, userEmail, twoFAEnabled, router, sendCode])

  const handleChange = useCallback((index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    setDigits(prev => {
      const copy = prev.slice()
      copy[index] = value.slice(-1)
      return copy
    })
    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
      setDigits(prev => {
        const copy = prev.slice()
        copy[index - 1] = ''
        return copy
      })
    }
    if (e.key === 'ArrowLeft' && index > 0) inputsRef.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus()
  }, [digits])

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    const raw = e.clipboardData.getData('Text').trim()
    const digitsOnly = raw.replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (digitsOnly.length) {
      const arr = Array.from(digitsOnly).concat(Array(OTP_LENGTH).fill('')).slice(0, OTP_LENGTH)
      setDigits(arr)
      const nextIndex = digitsOnly.length >= OTP_LENGTH ? OTP_LENGTH - 1 : digitsOnly.length
      setTimeout(() => inputsRef.current[nextIndex]?.focus(), 50)
      e.preventDefault()
    }
  }, [])

  const verify = useCallback(async () => {
    if (!canVerify) {
      setMessage({ type: 'error', text: 'Please enter the complete code.' })
      return
    }
    setMessage(null)
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/api/sendmail/verify-otp', { email: userEmail, otp: code, purpose: '2fa' })
      if (res.data?.success) {
        setMessage({ type: 'success', text: 'Verified — signing you in.' })
        setTimeout(() => router.replace('/'), 700)
      } else {
        setMessage({ type: 'error', text: res.data?.message ?? 'Invalid code.' })
      }
    } catch (err) {
      console.error('verify OTP error', err)
      setMessage({ type: 'error', text: 'Verification failed. Try again.' })
    } finally {
      setLoading(false)
    }
  }, [canVerify, code, userEmail, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="hidden lg:flex flex-col justify-center gap-6 p-10 bg-gradient-to-b from-indigo-600 to-blue-600 text-white">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center">
                <Mail size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Two‑Factor Verification</h2>
                <p className="text-sm opacity-90">A one‑time code was sent to your email. Enter it below to continue.</p>
              </div>
            </div>

            <ul className="text-sm space-y-2 opacity-95">
              <li>• The code is valid for a short period.</li>
              <li>• You can paste the full code into the first box.</li>
              <li>• If you didn't receive it, try resend after cooldown.</li>
            </ul>
          </div>

          <div className="p-8">
            <button onClick={() => { logout?.(); router.replace('/userAuth/login') }} className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
              <ArrowLeft size={16} /> Logout
            </button>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Enter verification code</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">We sent a code to <span className="font-medium">{maskedEmail}</span></p>

            {message && (
              <div className={`mt-4 rounded-md px-4 py-2 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800 dark:bg-green-900/20' : message.type === 'error' ? 'bg-red-50 text-red-800 dark:bg-red-900/20' : 'bg-blue-50 text-blue-800 dark:bg-blue-900/20'}`}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={message.type === 'success' ? 'text-green-600' : 'text-gray-500'} />
                  <span>{message.text}</span>
                </div>
              </div>
            )}

            <div className="mt-6">
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Enter code</label>
              <div className="flex gap-2">
                {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                  <input
                    key={i}
                    ref={el => inputsRef.current[i] = el}
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={1}
                    value={digits[i]}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    onPaste={i === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 outline-none"
                    aria-label={`Digit ${i + 1}`}
                  />
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {resendAvailable ? (
                    <button
                      onClick={async () => {
                        await sendCode()
                      }}
                      disabled={loading}
                      className="text-indigo-600 hover:underline text-sm"
                    >
                      Resend code
                    </button>
                  ) : (
                    <span>Resend available in {countdown}s</span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <button onClick={() => { setDigits(Array(OTP_LENGTH).fill('')); inputsRef.current[0]?.focus() }} className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Clear</button>
                  <button onClick={() => { inputsRef.current[0]?.focus() }} className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Focus</button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={verify}
                disabled={!canVerify || loading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60"
              >
                Verify & Continue
              </button>

              <button
                onClick={() => { setDigits(Array(OTP_LENGTH).fill('')); setMessage(null); }}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
              >
                Cancel
              </button>
            </div>

            <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
              By verifying you agree to our <button className="underline">Terms</button> and <button className="underline">Privacy Policy</button>.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}