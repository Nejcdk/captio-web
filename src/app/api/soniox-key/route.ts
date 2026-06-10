import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.SONIOX_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Demo not configured' }, { status: 503 });
  }
  return NextResponse.json({ apiKey });
}
