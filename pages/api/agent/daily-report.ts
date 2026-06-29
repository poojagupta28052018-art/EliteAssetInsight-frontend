/**
 * Daily email report to Mr. Hamdan — sent every morning at 07:00 UTC.
 * Uses Resend API (fetch-based, fully edge-compatible, free 3000/month).
 * Triggered by cron-job.org calling this endpoint with Authorization header.
 */
export const runtime = 'nodejs'

import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const OWNER_EMAIL = process.env.OWNER_EMAIL || 'mrhamduofficial@gmail.com'
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://eliteassetinsight.com'

function buildEmailHtml(data: {
  date: string
  listingsToday: number
  totalListings: number
  totalRevenue: number
  recentPayments: { plan: string; amount: number; paid_at: string }[]
  lastAgentRun: { listings_saved: number; ran_at: string } | null
}): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="background:#0d0d0d;font-family:Georgia,serif;color:#e8e3d9;margin:0;padding:0">
<div style="max-width:600px;margin:0 auto;padding:2rem">
  <div style="border-bottom:2px solid #c9a84c;padding-bottom:1.5rem;margin-bottom:2rem">
    <p style="color:#c9a84c;font-size:0.8rem;letter-spacing:.15em;text-transform:uppercase;margin:0 0 .5rem">Daily Intelligence Report</p>
    <h1 style="font-size:1.6rem;margin:0">Elite<span style="color:#c9a84c">Asset</span>Insight</h1>
    <p style="color:#888;font-size:.85rem;margin:.5rem 0 0">${data.date}</p>
  </div>
  <p style="color:#c9a84c;font-size:.78rem;letter-spacing:.1em;text-transform:uppercase;margin:0 0 .3rem">Dear Mr. Hamdan,</p>
  <p style="color:#888;font-size:.9rem;margin:0 0 2rem">Here is your automated daily platform report.</p>
  <table width="100%" cellpadding="0" cellspacing="12" style="margin-bottom:2rem">
    <tr>
      <td width="33%" style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:1.2rem;text-align:center">
        <div style="font-size:2rem;color:#c9a84c;margin-bottom:.3rem">${data.listingsToday}</div>
        <div style="color:#888;font-size:.75rem">New Listings Today</div>
      </td>
      <td width="33%" style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:1.2rem;text-align:center">
        <div style="font-size:2rem;color:#c9a84c;margin-bottom:.3rem">${data.totalListings}</div>
        <div style="color:#888;font-size:.75rem">Total Active</div>
      </td>
      <td width="33%" style="background:#1a1a1a;border:1px solid #c9a84c;border-radius:8px;padding:1.2rem;text-align:center">
        <div style="font-size:2rem;color:#c9a84c;margin-bottom:.3rem">$${data.totalRevenue.toFixed(0)}</div>
        <div style="color:#888;font-size:.75rem">Total Revenue</div>
      </td>
    </tr>
  </table>
  <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:1.5rem;margin-bottom:1.5rem">
    <p style="color:#c9a84c;font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;margin:0 0 .8rem">🤖 AI Agent Status</p>
    ${data.lastAgentRun
      ? `<p style="color:#e8e3d9;margin:0;font-size:.9rem">✅ Agent ran — <strong>${data.lastAgentRun.listings_saved} listings</strong> saved</p>`
      : `<p style="color:#e05c5c;margin:0;font-size:.9rem">⚠️ Agent has not run yet today. Check cron-job.org</p>`}
    <p style="color:#888;font-size:.8rem;margin:.5rem 0 0">Next automatic run: Tonight midnight UTC via cron-job.org</p>
  </div>
  ${data.recentPayments.length > 0 ? `
  <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:1.5rem;margin-bottom:1.5rem">
    <p style="color:#c9a84c;font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;margin:0 0 .8rem">💳 Recent Payments</p>
    ${data.recentPayments.slice(0, 5).map(p =>
      `<div style="display:flex;justify-content:space-between;border-bottom:1px solid #2a2a2a;padding:.6rem 0">
        <span style="color:#e8e3d9;font-size:.85rem">${p.plan.replace(/_/g, ' ').toUpperCase()}</span>
        <span style="color:#c9a84c;font-size:.85rem;font-weight:bold">$${p.amount}</span>
       </div>`
    ).join('')}
  </div>` : `
  <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:1.5rem;margin-bottom:1.5rem">
    <p style="color:#c9a84c;font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;margin:0 0 .5rem">💳 Revenue</p>
    <p style="color:#888;font-size:.85rem;margin:0">No payments yet — add PayPal keys to start earning.</p>
  </div>`}
  <div style="text-align:center;padding:1.5rem;background:rgba(201,168,76,.05);border:1px solid #2a2a2a;border-radius:8px">
    <a href="${BASE_URL}/dashboard" style="background:#c9a84c;color:#0d0d0d;padding:.7rem 2rem;border-radius:4px;text-decoration:none;font-size:.85rem;font-weight:bold">Open Dashboard →</a>
  </div>
  <p style="color:#444;font-size:.72rem;text-align:center;margin-top:2rem">
    EliteAssetInsight.com — Founded by Mr. Hamdan · Automated daily report
  </p>
</div>
</body></html>`
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isAuthorised =
    req.headers.authorization === `Bearer ${process.env.CRON_SECRET}` ||
    req.headers['x-agent-secret'] === process.env.AGENT_SECRET

  if (!isAuthorised) return res.status(401).json({ error: 'Unauthorised' })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseKey) return res.status(503).json({ error: 'Supabase not configured' })

  const supabase = createClient(supabaseUrl, supabaseKey)
  const today = new Date().toISOString().split('T')[0]

  const [
    { count: listingsToday },
    { count: totalListings },
    { data: paymentsData },
    { data: agentRuns },
  ] = await Promise.all([
    supabase.from('listings').select('*', { count: 'exact', head: true }).gte('created_at', today),
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('payments').select('plan,amount,paid_at').order('paid_at', { ascending: false }).limit(5),
    supabase.from('agent_runs').select('listings_saved,ran_at').order('ran_at', { ascending: false }).limit(1),
  ])

  const payments = paymentsData || []
  const totalRevenue = payments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0)

  const html = buildEmailHtml({
    date: new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    listingsToday: listingsToday || 0,
    totalListings: totalListings || 0,
    totalRevenue,
    recentPayments: payments,
    lastAgentRun: agentRuns?.[0] || null,
  })

  if (!RESEND_API_KEY) {
    return res.status(200).json({
      ok: true,
      emailSent: false,
      note: 'Add RESEND_API_KEY to send emails. Get free key at resend.com',
      stats: { listingsToday, totalListings, totalRevenue },
    })
  }

  try {
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'EliteAssetInsight <reports@eliteassetinsight.com>',
        to: [OWNER_EMAIL],
        subject: `📊 Daily Report — ${listingsToday} new listings · Revenue $${totalRevenue.toFixed(0)} · ${today}`,
        html,
      }),
    })
    const emailData = await emailRes.json()
    if (!emailRes.ok) throw new Error(emailData.message || 'Resend error')
    return res.status(200).json({ ok: true, emailSent: true, emailId: emailData.id, to: OWNER_EMAIL })
  } catch (e: any) {
    return res.status(500).json({ error: `Email failed: ${e.message}`, stats: { listingsToday, totalListings, totalRevenue } })
  }
}
