// pages/api/submissions.ts — Edge runtime, Cloudflare Pages compatible
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const config = { runtime: 'edge' }

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') return new NextResponse(null, { status: 405 })

  const payload = await req.json()
  const { name, email, asset_type, location, asking_price, description } = payload

  if (!name || !email) return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (url && serviceKey) {
      const supabase = createClient(url, serviceKey)
      const { data, error } = await supabase.from('submissions').insert([{
        name, email, asset_type: asset_type || null, location: location || null,
        asking_price: asking_price ? parseInt(asking_price) : null,
        description: description || null, status: 'pending', submitted_at: new Date().toISOString(),
      }])
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true, message: 'Submission received', submission: data })
    }
    return NextResponse.json({ ok: true, message: 'Submission received', payload })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
