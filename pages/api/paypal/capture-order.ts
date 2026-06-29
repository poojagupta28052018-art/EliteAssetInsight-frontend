/**
 * Captures a PayPal order after buyer approves.
 * Edge runtime — Cloudflare Pages compatible.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const config = { runtime: 'edge' }

const PAYPAL_BASE = process.env.PAYPAL_ENV === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

async function getAccessToken(): Promise<string> {
  const client = process.env.PAYPAL_CLIENT_ID
  const secret = process.env.PAYPAL_SECRET
  if (!client || !secret) throw new Error('PayPal credentials not configured')
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${client}:${secret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  const data = await res.json()
  if (!data.access_token) throw new Error(data.error_description || 'PayPal auth failed')
  return data.access_token
}

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') return new NextResponse(null, { status: 405 })

  const { orderID, plan, email } = await req.json()
  if (!orderID) return NextResponse.json({ error: 'orderID required' }, { status: 400 })

  try {
    const token = await getAccessToken()
    const capRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    })
    const capture = await capRes.json()

    if (capture.status !== 'COMPLETED') {
      return NextResponse.json({ error: `Payment not completed. Status: ${capture.status}` }, { status: 400 })
    }

    const unit = capture.purchase_units?.[0]
    const payment = unit?.payments?.captures?.[0]
    const buyerEmail = capture.payer?.email_address || email || 'unknown'
    const amount = payment?.amount?.value || '0'
    const currency = payment?.amount?.currency_code || 'USD'
    const planKey = unit?.reference_id || plan || 'unknown'
    const captureId = payment?.id

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
      await supabase.from('payments').insert({ paypal_order_id: orderID, paypal_capture_id: captureId, buyer_email: buyerEmail, amount: parseFloat(amount), currency, plan: planKey, status: 'completed', paid_at: new Date().toISOString() }).catch(() => {})
      await supabase.from('memberships').upsert({ email: buyerEmail, plan: planKey, status: 'active', started_at: new Date().toISOString(), paypal_order_id: orderID, amount: parseFloat(amount) }, { onConflict: 'email' }).catch(() => {})
    }

    return NextResponse.json({ ok: true, status: 'COMPLETED', captureId, buyerEmail, amount, currency, plan: planKey })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
