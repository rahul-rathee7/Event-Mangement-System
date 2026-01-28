import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email } = await req.json();

  try {
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Reset password error:', err.errors || err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
