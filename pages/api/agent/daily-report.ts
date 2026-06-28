/**
 * Daily email report to owner (Mr. Hamdan).
 * Sends a summary of: listings added today, total active listings, revenue.
 * Triggered by Vercel Cron at 07:00 UTC daily.
 * Uses Gmail SMTP via nodemailer (needs GMAIL_APP_PASSWORD secret).
 */
import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

const OWNER_EMAIL = process.env.OWNER_EMAIL || 'mrhamduofficial@gmail.com'

function buildEmailHtml(data: {
  date: string
  listingsToday: number
  totalListings: number
  totalRevenue: number
  recentPayments: { plan: string; amount: number; paid_at: string }[]
  lastAgentRun: { listings_saved: number; ran_at: string } | null
}): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="background:#0d0d0d;font-family:Georgia,serif;color:#e8e3d9;margin:0;padding:0">
  <div style="max-width:600px;margin:0 auto;padding:2rem">
    <div style="border-bottom:2px solid #c9a84c;padding-bottom:1.5rem;margin-bottom:2rem">
      <p style="color:#c9a84c;font-size:0.8rem;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 0.5rem">Daily Intelligence Report</p>
      <h1 style="font-size:1.6rem;margin:0;color:#e8e3d9">Elite<span style="color:#c9a84c">Asset</span>Insight</h1>
      <p style="color:#888;font-size:0.85rem;margin:0.5rem 0 0">${data.date}</p>
    </div>

    <p style="color:#c9a84c;margin:0 0 0.3rem;font-size:0.78rem;letter-spacing:0.1em;text-transform:uppercase">Dear Mr. Hamdan,</p>
    <p style="color:#888;font-size:0.9rem;margin:0 0 2rem">Here is today's automated platform report.</p>

    <!-- Stats -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:2rem">
      <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:1.2rem;text-align:center">
        <div style="font-size:1.8rem;color:#c9a84c;margin-bottom:0.3rem">${data.listingsToday}</div>
        <div style="color:#888;font-size:0.75rem">New Today</div>
      </div>
      <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:1.2rem;text-align:center">
        <div style="font-size:1.8rem;color:#c9a84c;margin-bottom:0.3rem">${data.totalListings}</div>
        <div style="color:#888;font-size:0.75rem">Total Active</div>
      </div>
      <div style="background:#1a1a1a;border:1px solid #c9a84c;border-radius:8px;padding:1.2rem;text-align:center">
        <div style="font-size:1.8rem;color:#c9a84c;margin-bottom:0.3rem">$${data.totalRevenue.toFixed(0)}</div>
        <div style="color:#888;font-size:0.75rem">Total Revenue</div>
      </div>
    </div>

    <!-- Agent status -->
    <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:1.5rem;margin-bottom:1.5rem">
      <p style="color:#c9a84c;font-size:0.75rem;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 0.8rem">🤖 AI Agent Status</p>
      ${data.lastAgentRun
        ? `<p style="color:#e8e3d9;margin:0;font-size:0.9rem">✅ Agent ran successfully — <strong>${data.lastAgentRun.listings_saved} listings</strong> added</p>`
        : `<p style="color:#e05c5c;margin:0;font-size:0.9rem">⚠️ Agent has not run yet today</p>`
      }
      <p style="color:#888;font-size:0.8rem;margin:0.5rem 0 0">Next automatic run: Tonight at midnight (UTC)</p>
    </div>

    <!-- Recent payments -->
    ${data.recentPayments.length > 0 ? `
    <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:1.5rem;margin-bottom:1.5rem">
      <p style="color:#c9a84c;font-size:0.75rem;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 0.8rem">💳 Recent Membership Payments</p>
      ${data.recentPayments.slice(0, 5).map(p => `
        <div style="display:flex;justify-content:space-between;border-bottom:1px solid #2a2a2a;padding:0.6rem 0">
          <span style="color:#e8e3d9;font-size:0.85rem">${p.plan.replace('_', ' ').toUpperCase()}</span>
          <span style="color:#c9a84c;font-size:0.85rem;font-weight:bold">$${p.amount}</span>
        </div>
      `).join('')}
    </div>
    ` : `
    <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:1.5rem;margin-bottom:1.5rem">
      <p style="color:#c9a84c;font-size:0.75rem;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 0.5rem">💳 Membership Revenue</p>
      <p style="color:#888;font-size:0.85rem;margin:0">No payments yet — set up PayPal keys to start receiving payments.</p>
    </div>
    `}

    <!-- CTA -->
    <div style="text-align:center;padding:1.5rem;background:linear-gradient(135deg,rgba(201,168,76,0.08),transparent);border:1px solid #2a2a2a;border-radius:8px">
      <p style="margin:0 0 1rem;color:#888;font-size:0.85rem">Manage your platform</p>
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://eliteassetinsight.com'}/dashboard" style="background:#c9a84c;color:#0d0d0d;padding:0.7rem 2rem;border-radius:4px;text-decoration:none;font-size:0.85rem;font-weight:bold">Open Dashboard →</a>
    </div>

    <p style="color:#444;font-size:0.75rem;text-align:center;margin-top:2rem">
      Automated daily report from EliteAssetInsight.com — Founded by Mr. Hamdan<br>
      This email is sent automatically every morning at 7:00 AM UTC.
    </p>
  </div>
</body>
</html>`
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isVercelCron = req.headers.authorization === `Bearer ${process.env.CRON_SECRET}`
  const isAdminTrigger = process.env.AGENT_SECRET && req.headers['x-agent-secret'] === process.env.AGENT_SECRET

  if (!isVercelCron && !isAdminTrigger) {
    return res.status(401).json({ error: 'Unauthorised' })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return res.status(503).json({ error: 'Supabase not configured' })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  const today = new Date().toISOString().split('T')[0]

  // Fetch all stats
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
  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0)
  const lastAgentRun = agentRuns?.[0] || null

  const emailHtml = buildEmailHtml({
    date: new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    listingsToday: listingsToday || 0,
    totalListings: totalListings || 0,
    totalRevenue,
    recentPayments: payments,
    lastAgentRun,
  })

  // Send via Gmail SMTP
  const gmailPass = process.env.GMAIL_APP_PASSWORD
  if (!gmailPass) {
    return res.status(200).json({ ok: false, note: 'Email skipped — GMAIL_APP_PASSWORD not set. Report data:', listingsToday, totalListings, totalRevenue })
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user: OWNER_EMAIL, pass: gmailPass },
    })

    await transporter.sendMail({
      from: `"EliteAssetInsight" <${OWNER_EMAIL}>`,
      to: OWNER_EMAIL,
      subject: `📊 Daily Report — ${listingsToday} new listings | Revenue: $${totalRevenue.toFixed(0)} — ${today}`,
      html: emailHtml,
    })

    return res.status(200).json({ ok: true, emailSent: true, to: OWNER_EMAIL, listingsToday, totalListings, totalRevenue })
  } catch (e: any) {
    return res.status(500).json({ error: `Email failed: ${e.message}`, data: { listingsToday, totalListings, totalRevenue } })
  }
}
