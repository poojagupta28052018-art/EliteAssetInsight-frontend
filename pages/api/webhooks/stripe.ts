// Stripe removed — PayPal only
import { NextRequest, NextResponse } from 'next/server'

export const config = { runtime: 'edge' }

export default function handler(_req: NextRequest) {
  return NextResponse.json({ error: 'Stripe removed. Use /api/paypal/ endpoints.' }, { status: 410 })
}
