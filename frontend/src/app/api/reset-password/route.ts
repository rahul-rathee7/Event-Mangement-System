import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const { email } = await req.json();

  try {
    // Start password reset flow
    await clerkClient.passwords.resetPassword({
      identifier: email, // email or username
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Reset password error:', err.errors || err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
