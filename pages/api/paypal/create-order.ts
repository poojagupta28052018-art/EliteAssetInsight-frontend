/**
 * Creates a PayPal order for membership plans.
 * Edge runtime — Cloudflare Pages compatible.
 */
import { NextRequest, NextResponse } from 'next/server'

export const config = { runtime: 'edge' }

const PAYPAL_BASE = process.env.PAYPAL_ENV === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

export const PLANS: Record<string, { name: string; amount: string; currency: string }> = {
  insider_monthly: { name: 'Insider Membership — Monthly',  amount: '97.00',   currency: 'USD' },
  elite_monthly:   { name: 'Elite Membership — Monthly',    amount: '297.00',  currency: 'USD' },
  ultra_monthly:   { name: 'Ultra Membership — Monthly',    amount: '997.00',  currency: 'USD' },
  insider_annual:  { name: 'Insider Membership — Annual',   amount: '970.00',  currency: 'USD' },
  elite_annual:    { name: 'Elite Membership — Annual',     amount: '2970.00', currency: 'USD' },
  ultra_annual:    { name: 'Ultra Membership — Annual',     amount: '9970.00', currency: 'USD' },
}

async function getAccessToken(): Promise<string> {
  const client = process.env.PAYPAL_CLIENT_ID
  const secret = process.env.PAYPAL_SECRET
  if (!client || !secret) throw new Error('PAYPAL_CLIENT_ID and PAYPAL_SECRET are required')
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

  const { plan } = await req.json()
  const planDetails = PLANS[plan as string]
  if (!planDetails) return NextResponse.json({ error: `Unknown plan "${plan}". Valid: ${Object.keys(PLANS).join(', ')}` }, { status: 400 })

  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_SECRET) {
    return NextResponse.json({ error: 'PayPal not configured. Add PAYPAL_CLIENT_ID and PAYPAL_SECRET.' }, { status: 503 })
  }

  try {
    const token = await getAccessToken()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://eliteassetinsight.com'

    const orderRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `EAI-${plan}-${Date.now()}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{ reference_id: plan, description: planDetails.name, amount: { currency_code: planDetails.currency, value: planDetails.amount }, custom_id: `membership:${plan}` }],
        application_context: {
          brand_name: 'EliteAssetInsight', landing_page: 'BILLING', shipping_preference: 'NO_SHIPPING', user_action: 'PAY_NOW',
          return_url: `${baseUrl}/membership?success=true&plan=${plan}`,
          cancel_url: `${baseUrl}/membership?cancelled=true`,
        },
      }),
    })

    const order = await orderRes.json()
    if (!order.id) return NextResponse.json({ error: order.message || 'Failed to create PayPal order' }, { status: 500 })
    const approvalUrl = order.links?.find((l: any) => l.rel === 'approve')?.href
    return NextResponse.json({ orderId: order.id, approvalUrl, plan, amount: planDetails.amount, name: planDetails.name })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
