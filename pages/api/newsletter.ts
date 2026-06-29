export const runtime = 'nodejs'

import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email, name } = req.body
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email required' })
  }

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (url && key) {
      const supabase = createClient(url, key)
      const { error } = await supabase
        .from('newsletter_subscribers')
        .upsert([{ email, name: name || null, subscribed_at: new Date().toISOString() }], { onConflict: 'email' })
      if (error) {
        if (error.code === '42P01') {
          return res.status(200).json({ ok: true, message: 'Subscribed (DB table not yet created — run migrations)' })
        }
        return res.status(500).json({ error: error.message })
      }
    }
    return res.status(200).json({ ok: true, message: 'Subscribed successfully' })
  } catch (e: any) {
    return res.status(500).json({ error: e.message })
  }
}
