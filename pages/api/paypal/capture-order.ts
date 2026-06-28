/**
 * Captures a PayPal order after buyer approves.
 * Saves the membership record to Supabase automatically.
 */
import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

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
      'Authorization': `Basic ${Buffer.from(`${client}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  const data = await res.json()
  if (!data.access_token) throw new Error(data.error_description || 'PayPal auth failed')
  return data.access_token
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { orderID, plan, email } = req.body
  if (!orderID) return res.status(400).json({ error: 'orderID required' })

  try {
    const token = await getAccessToken()

    const capRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    const capture = await capRes.json()

    if (capture.status !== 'COMPLETED') {
      return res.status(400).json({ error: `Payment not completed. Status: ${capture.status}` })
    }

    const unit = capture.purchase_units?.[0]
    const payment = unit?.payments?.captures?.[0]
    const buyerEmail = capture.payer?.email_address || email || 'unknown'
    const amount = payment?.amount?.value || '0'
    const currency = payment?.amount?.currency_code || 'USD'
    const planKey = unit?.reference_id || plan || 'unknown'
    const captureId = payment?.id

    // Save membership to Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

      // Save payment record
      await supabase.from('payments').insert({
        paypal_order_id: orderID,
        paypal_capture_id: captureId,
        buyer_email: buyerEmail,
        amount: parseFloat(amount),
        currency,
        plan: planKey,
        status: 'completed',
        paid_at: new Date().toISOString(),
      }).catch(() => {})

      // Activate membership
      await supabase.from('memberships').upsert({
        email: buyerEmail,
        plan: planKey,
        status: 'active',
        started_at: new Date().toISOString(),
        paypal_order_id: orderID,
        amount: parseFloat(amount),
      }, { onConflict: 'email' }).catch(() => {})
    }

    return res.status(200).json({
      ok: true,
      status: 'COMPLETED',
      captureId,
      buyerEmail,
      amount,
      currency,
      plan: planKey,
    })
  } catch (e: any) {
    return res.status(500).json({ error: e.message })
  }
}
