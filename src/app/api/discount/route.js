import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.json();
    // Minimal server-side handler: log submission and return success.
    // Integrate with CRM/email service here.
    console.log('[/src/app/api/discount] submission:', data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[/src/app/api/discount] error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
