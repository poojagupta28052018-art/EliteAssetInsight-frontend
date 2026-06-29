// pages/api/newsletter.ts — Edge runtime, Cloudflare Pages compatible
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const config = { runtime: 'edge' }

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') return new NextResponse(null, { status: 405 })

  const { email, name } = await req.json()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (url && key) {
      const supabase = createClient(url, key)
      const { error } = await supabase.from('newsletter_subscribers').upsert([{ email, name: name || null, subscribed_at: new Date().toISOString() }], { onConflict: 'email' })
      if (error && error.code !== '42P01') return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true, message: 'Subscribed successfully' })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
