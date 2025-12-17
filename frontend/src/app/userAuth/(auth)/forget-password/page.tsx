'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/UserContext';
import axios from 'axios';
import { Mail, Key, ShieldCheck, Eye, EyeOff, CheckCircle2, ArrowLeft } from 'lucide-react';

const Page = () => {
  const { user } = useAuth();
  const router = useRouter();

  // form state
  const [email, setEmail] = useState(user?.email ?? '');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<'enterEmail' | 'enterCode' | 'verifyCode'>('enterEmail');

  // ui helpers
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'info' | 'success' | 'error'; text: string } | null>(null);
  const [sentAt, setSentAt] = useState<number | null>(null);

  // simple password strength indicator
  const passwordStrength = useMemo(() => {
    if (!newPassword) return { score: 0, label: 'Too short' };
    const len = newPassword.length;
    let score = 1;
    if (len > 7) score++;
    if (/[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;
    const label = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'][Math.min(score, 4)];
    return { score, label };
  }, [newPassword]);

  const handleSendCode = async () => {
    setMessage(null);
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/sendmail/forget-password', { email });
      if (res.data?.success) {
        setStep('enterCode');
        setSentAt(Date.now());
        setMessage({ type: 'success', text: 'Reset code sent to your email.' });
      } else {
        setMessage({ type: 'error', text: res.data?.message ?? 'Unable to send code.' });
      }
    } catch (err: any) {
      console.error('Error sending reset code:', err);
      setMessage({ type: 'error', text: 'Network error. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setMessage(null);
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/sendmail/verify-otp', { email, otp: code });
      if (res.data?.success) {
        setStep('verifyCode');
        setMessage({ type: 'success', text: 'Code verified. Set a new password.' });
        return true;
      } else {
        setMessage({ type: 'error', text: res.data?.message ?? 'Invalid code.' });
        return false;
      }
    } catch (err: any) {
      console.error('Error verifying reset code:', err);
      setMessage({ type: 'error', text: 'Verification failed. Try again.' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setMessage(null);
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/sendmail/reset-password', { email, password: newPassword });
      if (res.data?.success) {
        setMessage({ type: 'success', text: 'Password reset successful. Redirecting to login...' });
        setTimeout(() => router.push('/userAuth/login'), 1200);
      } else {
        setMessage({ type: 'error', text: res.data?.message ?? 'Reset failed.' });
      }
    } catch (err: any) {
      console.error('Error resetting password:', err);
      setMessage({ type: 'error', text: 'Network error. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  const resendAvailable = sentAt ? Date.now() - sentAt > 45_000 : true;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* left - branding / info */}
          <div className="hidden lg:flex flex-col items-start justify-center gap-6 p-10 bg-gradient-to-b from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center gap-3">
              <ShieldCheck size={28} />
              <h2 className="text-2xl font-semibold">Account Recovery</h2>
            </div>
            <p className="text-sm opacity-90">
              Securely reset your password in a few quick steps. We send a one-time code to your email to verify your identity.
            </p>
            <ul className="text-sm space-y-2 opacity-95">
              <li>• No payment or personal data is stored during reset.</li>
              <li>• Code expires in 10 minutes. Resend available shortly.</li>
              <li>• Use a strong unique password for best security.</li>
            </ul>
            <div className="mt-4 text-xs bg-white/10 px-3 py-2 rounded-md">Need help? contact support@example.com</div>
          </div>

          {/* right - form */}
          <div className="p-8">
            <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
              <ArrowLeft size={16} /> Back
            </button>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Forgot password?</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Enter your email and follow the steps to reset your password.</p>

            {/* progress */}
            <div className="flex items-center gap-3 mt-6">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${step === 'enterEmail' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>1</div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${step === 'enterCode' ? 'bg-blue-600 text-white' : step === 'verifyCode' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>2</div>
            </div>

            {/* message */}
            {message && (
              <div className={`mt-4 rounded-md px-4 py-2 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800 dark:bg-green-900/20' : message.type === 'error' ? 'bg-red-50 text-red-800 dark:bg-red-900/20' : 'bg-blue-50 text-blue-800 dark:bg-blue-900/20'}`}>
                <div className="flex items-center gap-2">
                  {message.type === 'success' ? <CheckCircle2 /> : <ShieldCheck />}
                  <span>{message.text}</span>
                </div>
              </div>
            )}

            {/* form content */}
            <div className="mt-6">
              {(step === 'enterEmail' || step === 'enterCode') && (
                <div className="space-y-4">
                  <label className="block text-sm text-gray-700 dark:text-gray-300">
                    Email
                    <div className="mt-2 relative">
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none"
                        aria-label="Email"
                      />
                      <div className="absolute right-3 top-3 text-gray-400"><Mail size={16} /></div>
                    </div>
                  </label>

                  {step === 'enterCode' && (
                    <label className="block text-sm text-gray-700 dark:text-gray-300">
                      Reset code
                      <div className="mt-2">
                        <input
                          type="text"
                          placeholder="Enter code"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none"
                          aria-label="Reset code"
                        />
                      </div>
                    </label>
                  )}

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => { if (step === 'enterEmail') handleSendCode(); else if (step === 'enterCode') verifyOtp(); }}
                      disabled={loading || !email}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-60"
                      aria-disabled={loading || !email}
                    >
                      {loading ? 'Please wait...' : (step === 'enterEmail' ? 'Send reset code' : 'Verify code')}
                    </button>

                    {step === 'enterCode' && (
                      <button
                        onClick={() => { if (resendAvailable) handleSendCode(); else setMessage({ type: 'info', text: 'Please wait a moment before resending.' }); }}
                        disabled={loading || !resendAvailable}
                        className="text-sm text-gray-600 dark:text-gray-300"
                      >
                        {resendAvailable ? 'Resend code' : 'Resend in a moment'}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {step === 'verifyCode' && (
                <div className="space-y-4">
                  <label className="block text-sm text-gray-700 dark:text-gray-300">
                    New password
                    <div className="mt-2 relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none"
                        aria-label="New password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(s => !s)}
                        className="absolute right-3 top-3 text-gray-400"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </label>

                  {/* strength meter */}
                  <div className="mt-1">
                    <div className="h-2 rounded bg-gray-100 dark:bg-gray-700 overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.score >= 4 ? 'bg-green-500' : passwordStrength.score >= 3 ? 'bg-yellow-400' : 'bg-red-400'} transition-all`}
                        style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                        aria-hidden
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{passwordStrength.label}</div>
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={handleReset}
                      disabled={loading || newPassword.length < 6}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-60"
                    >
                      {loading ? 'Resetting...' : 'Reset password'}
                    </button>

                    <button
                      onClick={() => { setStep('enterEmail'); setMessage(null); }}
                      className="text-sm text-gray-600 dark:text-gray-300"
                    >
                      Start over
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* footer */}
            <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
              <div>By resetting your password you agree to our <button className="underline">Terms</button> and <button className="underline">Privacy Policy</button>.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;