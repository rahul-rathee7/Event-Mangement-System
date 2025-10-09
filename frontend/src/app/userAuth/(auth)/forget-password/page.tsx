'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/UserContext';

const Page = () => {
  const { isLoaded, useSignIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<'enterEmail' | 'enterCode'>('enterEmail');

  const handleSendCode = async () => {
    if (!isLoaded || !signIn) return;
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });
      setStep('enterCode');
    } catch (err: any) {
      console.error('Error sending reset code:', err);
    }
  };

  const handleReset = async () => {
    if (!isLoaded || !signIn) return;
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password: newPassword,
      });

      if (result.status === 'complete') {
        router.push('/');
      } else {
      }
    } catch (err: any) {
      console.error('Error resetting password:', err);
    }
  };

  return (
        <div className="flex items-center justify-center px-4 text-black w-full translate-y-1/2">
          <div className="sm:max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
            <h2 className="md:text-6xl text-5xl font-bold text-center mb-6">Forget Password</h2>
      {step === 'enterEmail' && (
        <div className="flex flex-col gap-4 md:w-5/7 m-auto">
          <input
            type="email"
            placeholder="Your email"
            value={email}
            className='border-2 border-black rounded-lg px-3 py-2 focus:outline-none'
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className='border-2 border-black rounded-lg px-3 py-2 focus:outline-none' onClick={handleSendCode}>Send Reset Code</button>
        </div>
      )}
      {step === 'enterCode' && (
        <div className='flex flex-col gap-4 w-5/7 m-auto'>
          <input
            type="text"
            placeholder="Reset code"
            value={code}
            className='border-2 border-black rounded-lg px-3 py-2 focus:outline-none'
            onChange={(e) => setCode(e.target.value)}
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            className='border-2 border-black rounded-lg px-3 py-2 focus:outline-none'
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button className="border-2 border-black rounded-lg px-3 py-2 focus:outline-none" onClick={handleReset}>Reset Password</button>
        </div>
      )}
      </div>
    </div>
  );
};

export default Page;