// pages/api/webhooks/paypal.ts — Edge runtime, Cloudflare Pages compatible
import { NextRequest, NextResponse } from 'next/server'

export const config = { runtime: 'edge' }

export default async function handler(req: NextRequest) {
  const body = await req.text()
  console.log('PayPal webhook received:', body.slice(0, 200))
  return NextResponse.json({ received: true })
}
