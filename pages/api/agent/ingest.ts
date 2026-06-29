/**
 * EliteAssetInsight — Daily Ingest Agent (Groq AI powered)
 * Edge runtime — works on Cloudflare Pages Workers.
 * Auth: x-agent-secret header (admin manual) or Authorization: Bearer CRON_SECRET (cron-job.org)
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const config = { runtime: 'edge' }

const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'

const FEEDS = [
  { url: 'https://www.christies.com/rss/lots.aspx?T=L&SC=SPEC', source: "Christie's", category: 'Rare Art' },
  { url: 'https://www.sothebys.com/en/rss-feed', source: "Sotheby's", category: 'Rare Art' },
  { url: 'https://www.yachtworld.com/research/rss/', source: 'YachtWorld', category: 'Superyachts' },
  { url: 'https://www.controller.com/rss/aircraft-for-sale.aspx', source: 'Controller', category: 'Private Jets' },
  { url: 'https://www.mansionglobal.com/rss', source: 'Mansion Global', category: 'Luxury Estates' },
  { url: 'https://www.bizbuysell.com/rss/', source: 'BizBuySell', category: 'Business Sales' },
]

const CURATED = [
  { title: '72m Feadship Motor Yacht — Private Treaty Sale', category: 'Superyachts', location: 'Monaco', price_min: 28000000, price_max: 34000000, description: 'Exceptional 72-metre Feadship in immaculate condition. Twin MTU engines, 12-guest cabins, full crew quarters. Last refitted 2024.' },
  { title: 'Gulfstream G700 — 2023 Delivery Position Available', category: 'Private Jets', location: 'Fort Lauderdale, USA', price_min: 75000000, price_max: 82000000, description: '2023 Gulfstream G700. Ultra-long range, 19-passenger configuration. Bespoke interior. FANS 1/A+, ADS-B Out. Low hours.' },
  { title: 'Trophy Villa — Cap Ferrat, French Riviera', category: 'Luxury Estates', location: 'Cap Ferrat, France', price_min: 42000000, price_max: 58000000, description: 'Extraordinary 1,800m² Belle Époque villa. Panoramic sea views, heated infinity pool, private beach access, 11 bedrooms.' },
  { title: 'Banksy Original — "Girl with Balloon" Authenticated', category: 'Rare Art', location: 'London, UK', price_min: 2400000, price_max: 3200000, description: 'Authenticated Banksy original. Full Pest Control Certificate of Authenticity. Provenance documented from original 2002 commission.' },
  { title: 'Luxury Automotive Dealership Group — 4 UAE Locations', category: 'Business Sales', location: 'Dubai, UAE', price_min: 15000000, price_max: 22000000, description: 'Established luxury automotive group. EBITDA $4.2M. Exclusive dealership agreements, full management team in place.' },
  { title: '1962 Ferrari 250 GTO — Chassis 3987GT', category: 'Vintage Cars', location: 'Maranello, Italy', price_min: 55000000, price_max: 70000000, description: 'Matching numbers 1962 Ferrari 250 GTO. One of only 36 built. Documented Le Mans 1963 race history.' },
  { title: 'Private Island Resort — Maldives, 14 Villas', category: 'Luxury Estates', location: 'Maldives', price_min: 85000000, price_max: 120000000, description: 'Fully operational 14-villa private island resort. 5-star operating license, 95% occupancy. Seaplane terminal, spa.' },
  { title: 'Bombardier Global 8000 — Factory New 2024', category: 'Private Jets', location: 'Montreal, Canada', price_min: 88000000, price_max: 95000000, description: "World's longest range business jet. 19-passenger, 4-zone interior. Custom completion underway. Full factory warranty." },
  { title: '58m Custom Superyacht — Owner Relocating', category: 'Superyachts', location: 'Palma de Mallorca, Spain', price_min: 14500000, price_max: 17000000, description: 'Exceptional 58m custom motor yacht. Lürssen build, twin MTU engines. Range 5,000nm at 12kts. 10-guest layout.' },
  { title: 'Algorithmic Trading Platform — $2B AUM', category: 'Business Sales', location: 'London, UK', price_min: 45000000, price_max: 65000000, description: 'Proprietary algorithmic trading infrastructure with $2B AUM. 14-year track record, FCA regulated. 23-person team.' },
  { title: '85m Explorer Yacht — World Voyage Ready', category: 'Superyachts', location: 'Fort Lauderdale, USA', price_min: 52000000, price_max: 68000000, description: 'Spectacular 85m explorer yacht. Ice-class hull, helipad, submarine. Range 10,000nm. 12 guest suites, owner deck.' },
  { title: 'Dassault Falcon 10X — Preview Flight Available', category: 'Private Jets', location: 'Paris, France', price_min: 78000000, price_max: 85000000, description: 'Brand new Dassault Falcon 10X. Widest cabin in class, 13-passenger ultra-luxury interior. Transatlantic non-stop capability.' },
]

async function formatWithGroq(raw: { title: string; description: string; category: string }) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('no-groq-key')
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: GROQ_MODEL, max_tokens: 350, temperature: 0.7,
      messages: [
        { role: 'system', content: 'You are an elite luxury asset listing copywriter for ultra-high-net-worth investors. Always respond with valid JSON only, no markdown.' },
        { role: 'user', content: `Rewrite this ${raw.category} listing for UHNW investors. Return ONLY this JSON: {"title":"","description":"2-3 sentences max 280 chars","price_min":0,"price_max":0,"location":"City, Country"}. Source: Title: ${raw.title}. Desc: ${raw.description.slice(0, 400)}` },
      ],
    }),
  })
  if (!res.ok) throw new Error(`Groq ${res.status}`)
  const data = await res.json()
  const text = data.choices?.[0]?.message?.content || '{}'
  const cleaned = text.replace(/```(?:json)?|```/g, '').trim()
  const parsed = JSON.parse(cleaned)
  return {
    title: (parsed.title || raw.title).slice(0, 140),
    description: (parsed.description || raw.description).slice(0, 400),
    price_min: Number(parsed.price_min) || 1_000_000,
    price_max: Number(parsed.price_max) || 5_000_000,
    location: parsed.location || 'International',
  }
}

async function fetchRss(url: string) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'EliteAssetInsight/2.0' }, signal: AbortSignal.timeout(8000) })
    if (!res.ok) return []
    const xml = await res.text()
    const items: { title: string; description: string; link: string }[] = []
    const matches = [...xml.matchAll(/<item[^>]*>([\s\S]*?)<\/item>/gi)]
    for (const m of matches) {
      const block = m[1]
      const title = (block.match(/<title[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i) || block.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1] || ''
      const desc = (block.match(/<description[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i) || block.match(/<description[^>]*>([^<]*)<\/description>/i) || [])[1] || ''
      const link = (block.match(/<link[^>]*>([^<]*)<\/link>/i) || [])[1] || ''
      if (title.length > 5) items.push({ title: title.trim(), description: desc.replace(/<[^>]+>/g, '').trim().slice(0, 500), link: link.trim() })
    }
    return items.slice(0, 4)
  } catch { return [] }
}

function slugify(t: string) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) }

export default async function handler(req: NextRequest) {
  const agentSecret = process.env.AGENT_SECRET || ''
  const isVercelCron = req.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`
  const isAdmin = agentSecret && req.headers.get('x-agent-secret') === agentSecret
  if (!isVercelCron && !isAdmin) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseKey) return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })

  const supabase = createClient(supabaseUrl, supabaseKey)
  const savedListings: string[] = []
  const errors: string[] = []
  const ranAt = new Date().toISOString()
  let liveCount = 0

  for (const feed of FEEDS) {
    try {
      const items = await fetchRss(feed.url)
      for (const item of items) {
        let formatted: any
        try { formatted = await formatWithGroq({ title: item.title, description: item.description, category: feed.category }) }
        catch (e: any) {
          errors.push(`Groq: ${e.message}`)
          formatted = { title: item.title.slice(0, 140), description: item.description.slice(0, 280) || `Premium ${feed.category}`, price_min: 1_000_000, price_max: 10_000_000, location: 'International' }
        }
        const slug = slugify(formatted.title) + '-' + Date.now().toString(36)
        const { error: dbErr } = await supabase.from('listings').upsert({
          title: formatted.title, category: feed.category, location: formatted.location,
          price_estimate_min: formatted.price_min, price_estimate_max: formatted.price_max,
          description: formatted.description, source_url: item.link || feed.url,
          slug, status: 'active', featured: false, created_at: ranAt,
        }, { onConflict: 'slug', ignoreDuplicates: true })
        if (!dbErr) { savedListings.push(formatted.title); liveCount++ }
        else errors.push(`DB: ${dbErr.message}`)
      }
    } catch (e: any) { errors.push(`Feed ${feed.source}: ${e.message}`) }
  }

  const dayIndex = new Date().getDay()
  const start = (dayIndex * 4) % CURATED.length
  const batch = [...CURATED.slice(start, start + 4), ...CURATED.slice(0, Math.max(0, start + 4 - CURATED.length))]
  const today = ranAt.split('T')[0]

  for (const listing of batch) {
    const slug = slugify(listing.title) + '-' + today
    const { error: dbErr } = await supabase.from('listings').upsert({
      title: listing.title, category: listing.category, location: listing.location,
      price_estimate_min: listing.price_min, price_estimate_max: listing.price_max,
      description: listing.description, source_url: 'https://eliteassetinsight.com/listings',
      slug, status: 'active', featured: batch.indexOf(listing) === 0, created_at: ranAt,
    }, { onConflict: 'slug', ignoreDuplicates: true })
    if (!dbErr) savedListings.push(listing.title)
  }

  await supabase.from('agent_runs').upsert({
    id: today, ran_at: ranAt, listings_saved: savedListings.length,
    live_from_rss: liveCount, errors: errors.length > 0 ? errors.slice(0, 5).join(' | ') : null,
  }, { onConflict: 'id' }).catch(() => {})

  return NextResponse.json({ ok: true, ran_at: ranAt, listings_saved: savedListings.length, live_from_rss: liveCount, listings: savedListings, errors: errors.length > 0 ? errors.slice(0, 5) : undefined })
}
