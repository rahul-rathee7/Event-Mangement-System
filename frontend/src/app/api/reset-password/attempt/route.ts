import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { code, password } = await req.json();

  try {

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    console.error('Reset password attempt error:', err.errors || err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
