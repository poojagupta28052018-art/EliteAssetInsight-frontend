/**
 * Returns the last agent run status and listing counts.
 * Used by admin dashboard to show automated stats.
 */
import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  // Lightweight auth — admin key or public read
  const key = req.headers['x-agent-secret'] as string
  const isAdmin = key === process.env.AGENT_SECRET

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const [{ data: runs }, { count: totalListings }, { count: todayListings }, { data: revenue }] = await Promise.all([
      supabase.from('agent_runs').select('*').order('ran_at', { ascending: false }).limit(5),
      supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('listings').select('*', { count: 'exact', head: true })
        .gte('created_at', new Date().toISOString().split('T')[0]),
      isAdmin ? supabase.from('payments').select('amount,paid_at,plan,buyer_email').order('paid_at', { ascending: false }).limit(20) : Promise.resolve({ data: null }),
    ])

    const lastRun = runs?.[0] || null

    const result: Record<string, any> = {
      lastRun: lastRun ? {
        ranAt: lastRun.ran_at,
        listingsSaved: lastRun.listings_saved,
        errors: lastRun.errors,
      } : null,
      totalActiveListings: totalListings || 0,
      listingsAddedToday: todayListings || 0,
      nextRunAt: 'Daily at 00:00 UTC (automatic)',
    }

    if (isAdmin && revenue?.data) {
      const totalRevenue = revenue.data.reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
      result.totalRevenue = totalRevenue
      result.recentPayments = revenue.data
    }

    return res.status(200).json(result)
  } catch (e: any) {
    return res.status(500).json({ error: e.message })
  }
}
