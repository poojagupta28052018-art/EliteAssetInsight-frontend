// pages/api/listings.ts — Edge runtime, Cloudflare Pages compatible
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const config = { runtime: 'edge' }

export default async function handler(req: NextRequest) {
  if (req.method !== 'GET') return new NextResponse('Method Not Allowed', { status: 405 })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (url && serviceKey) {
    const supabase = createClient(url, serviceKey)
    const { data, error } = await supabase.from('listings').select('*').eq('status', 'active').order('created_at', { ascending: false }).limit(50)
    if (error) return NextResponse.json([])
    return NextResponse.json(data)
  }

  return NextResponse.json([
    { id: '1', slug: 'azimut-78-yacht', title: '2024 Azimut 78 Yacht', category: 'Superyachts', location: 'Monaco', price_estimate_min: 1200000, description: 'Azimut 78 in excellent condition' },
    { id: '2', slug: 'gulfstream-g650', title: 'Gulfstream G650 Private Jet', category: 'Private Jets', location: 'Teterboro, NJ', price_estimate_min: 32000000, description: 'Low hours, full maintenance history' },
  ])
}
