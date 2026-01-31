import { NextResponse } from 'next/server';

export async function POST() {
  try {
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Reset password error:', err.errors || err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
