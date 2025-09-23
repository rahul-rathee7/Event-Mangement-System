import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const { code, password } = await req.json();

  try {
    const result = await clerkClient.passwords.resetPasswordAttempt({
      code,
      password,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    console.error('Reset password attempt error:', err.errors || err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
