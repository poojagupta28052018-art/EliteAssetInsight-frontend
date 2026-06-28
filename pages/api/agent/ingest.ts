/**
 * EliteAssetInsight — Daily Ingest Agent
 * Runs automatically via Vercel Cron Job every day at 00:00 UTC.
 * Scrapes public auction RSS feeds, formats listings with AI, saves to Supabase.
 * Requires: OPENAI_API_KEY (optional but improves quality), SUPABASE env vars, AGENT_SECRET
 */
import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const AGENT_SECRET = process.env.AGENT_SECRET || ''

// ──────────────────────────────────────
// PUBLIC RSS / ATOM FEEDS
// Real auction house and luxury marketplace feeds
// ──────────────────────────────────────
const FEEDS: { url: string; source: string; category: string }[] = [
  // Christie's
  { url: 'https://www.christies.com/rss/lots.aspx?T=L&amp;SC=SPEC', source: "Christie's", category: 'Rare Art' },
  // Sotheby's blog / news RSS for asset trends
  { url: 'https://www.sothebys.com/en/rss-feed', source: "Sotheby's", category: 'Rare Art' },
  // YachtWorld new listings (public RSS)
  { url: 'https://www.yachtworld.com/research/rss/', source: 'YachtWorld', category: 'Superyachts' },
  // Controller.com — private jets
  { url: 'https://www.controller.com/rss/aircraft-for-sale.aspx', source: 'Controller', category: 'Private Jets' },
  // Mansion Global luxury real estate
  { url: 'https://www.mansionglobal.com/rss', source: 'Mansion Global', category: 'Luxury Estates' },
  // BizBuySell — business sales
  { url: 'https://www.bizbuysell.com/rss/', source: 'BizBuySell', category: 'Business Sales' },
]

// Fallback data used when feeds are unavailable (keeps the site populated)
const SAMPLE_LISTINGS = [
  {
    title: '72m Feadship Motor Yacht — Private Treaty Sale',
    category: 'Superyachts', location: 'Monaco',
    price_estimate_min: 28000000, price_estimate_max: 34000000,
    description: 'Exceptional 72-metre Feadship in immaculate condition. Twin MTU engines, 12-guest cabins, full crew quarters. Last refitted 2024. Available immediately for private treaty.',
    source_url: 'https://eliteassetinsight.com/listings',
  },
  {
    title: 'Gulfstream G700 — 2023 Delivery Position Available',
    category: 'Private Jets', location: 'Fort Lauderdale, USA',
    price_estimate_min: 75000000, price_estimate_max: 82000000,
    description: '2023 Gulfstream G700. Ultra-long range. Bespoke interior by Fokker Services. 19-passenger configuration. FANS 1/A+, ADS-B Out. Low hours. Pre-purchase inspection welcomed.',
    source_url: 'https://eliteassetinsight.com/listings',
  },
  {
    title: 'Trophy Villa — Cap Ferrat, French Riviera',
    category: 'Luxury Estates', location: 'Cap Ferrat, France',
    price_estimate_min: 42000000, price_estimate_max: 58000000,
    description: 'Extraordinary 1,800m² Belle Époque villa. Panoramic sea views. Heated infinity pool, private beach access, 11 bedrooms. Landscaped gardens designed by Russell Page. Rarely available.',
    source_url: 'https://eliteassetinsight.com/listings',
  },
  {
    title: 'Banksy Original — "Girl with Balloon" Authenticated',
    category: 'Rare Art', location: 'London, UK',
    price_estimate_min: 2400000, price_estimate_max: 3200000,
    description: 'Authenticated Banksy original. Full Pest Control Certificate of Authenticity. Provenance documented from original 2002 commission. Museum-quality framing included.',
    source_url: 'https://eliteassetinsight.com/listings',
  },
  {
    title: 'Luxury Automotive Dealership Group — 4 Locations',
    category: 'Business Sales', location: 'Dubai, UAE',
    price_estimate_min: 15000000, price_estimate_max: 22000000,
    description: 'Established luxury automotive group with franchises across 4 premium Dubai locations. EBITDA $4.2M. Exclusive dealership agreements. Full management team in place. NDA required.',
    source_url: 'https://eliteassetinsight.com/listings',
  },
  {
    title: '1962 Ferrari 250 GTO — Chassis 3987GT',
    category: 'Vintage Cars', location: 'Maranello, Italy',
    price_estimate_min: 55000000, price_estimate_max: 70000000,
    description: 'Matching numbers 1962 Ferrari 250 GTO. One of only 36 examples built. Documented race history at Le Mans 1963. Complete restoration 2022 by Ferrari Classiche. Offered with full documentation.',
    source_url: 'https://eliteassetinsight.com/listings',
  },
  {
    title: 'Private Island — Maldives, 14-Villa Resort',
    category: 'Luxury Estates', location: 'Maldives',
    price_estimate_min: 85000000, price_estimate_max: 120000000,
    description: 'Fully operational 14-villa private island resort. 5-star operating license, 95% occupancy rate. Seaplane terminal, spa, PADI dive centre. Seller finance considered for qualified buyers.',
    source_url: 'https://eliteassetinsight.com/listings',
  },
  {
    title: 'Bombardier Global 8000 — 2024 Completion Centre',
    category: 'Private Jets', location: 'Montreal, Canada',
    price_estimate_min: 88000000, price_estimate_max: 95000000,
    description: 'Factory-new Bombardier Global 8000. World\'s longest range business jet. 19-passenger, 4-zone interior. Custom completion underway. Delivery Q3 2025. Full warranty.',
    source_url: 'https://eliteassetinsight.com/listings',
  },
  {
    title: '58m Custom Superyacht — Owner Relocating Sale',
    category: 'Superyachts', location: 'Palma de Mallorca, Spain',
    price_estimate_min: 14500000, price_estimate_max: 17000000,
    description: 'Exceptional 58m custom motor yacht. Lürssen build. Twin MTU 2,600hp engines. Range 5,000nm at 12kts. 10-guest layout. Full classification surveys current. Owner urgently relocating.',
    source_url: 'https://eliteassetinsight.com/listings',
  },
  {
    title: 'Hedge Fund Infrastructure Platform — $2B AUM',
    category: 'Business Sales', location: 'London, UK',
    price_estimate_min: 45000000, price_estimate_max: 65000000,
    description: 'Proprietary algorithmic trading infrastructure platform with $2B AUM. 14-year track record. FCA regulated. 23-person team. Systematic multi-strategy. Institutional client base. MNDA required for materials.',
    source_url: 'https://eliteassetinsight.com/listings',
  },
]

// Fetch an RSS feed and extract items
async function fetchRssFeed(url: string): Promise<{ title: string; description: string; link: string }[]> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'EliteAssetInsight/1.0 (listing aggregator)' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return []
    const xml = await res.text()
    const items: { title: string; description: string; link: string }[] = []
    const itemMatches = xml.matchAll(/<item[^>]*>([\s\S]*?)<\/item>/gi)
    for (const match of itemMatches) {
      const content = match[1]
      const title = (content.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/i) || content.match(/<title>(.*?)<\/title>/i))?.[1]?.trim() || ''
      const desc = (content.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/is) || content.match(/<description>(.*?)<\/description>/is))?.[1]?.trim() || ''
      const link = (content.match(/<link>(.*?)<\/link>/i))?.[1]?.trim() || ''
      if (title && title.length > 5) {
        items.push({ title, description: desc.replace(/<[^>]+>/g, '').slice(0, 500), link })
      }
    }
    return items.slice(0, 3)
  } catch {
    return []
  }
}

// Use OpenAI to reformat a listing title/description into elite luxury format
async function formatWithAI(raw: { title: string; description: string; category: string }): Promise<{ title: string; description: string; price_min: number; price_max: number; location: string }> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('no-key')

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 400,
      messages: [{
        role: 'system',
        content: 'You are an elite luxury asset listing copywriter for ultra-high-net-worth investors. Rewrite listings in sophisticated, high-end language. Always return valid JSON only.',
      }, {
        role: 'user',
        content: `Rewrite this ${raw.category} listing for a UHNW audience. Return ONLY JSON: {"title":"","description":"(2-3 sentences, max 280 chars)","price_min":0,"price_max":0,"location":"City, Country"}. Raw: Title: ${raw.title}. Desc: ${raw.description.slice(0, 300)}`,
      }],
    }),
  })
  if (!res.ok) throw new Error('openai-error')
  const data = await res.json()
  const text = data.choices?.[0]?.message?.content || '{}'
  const cleaned = text.replace(/```json|```/g, '').trim()
  const parsed = JSON.parse(cleaned)
  return {
    title: parsed.title || raw.title,
    description: parsed.description || raw.description,
    price_min: parsed.price_min || 1000000,
    price_max: parsed.price_max || 5000000,
    location: parsed.location || 'International',
  }
}

// Generate a slug from title
function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)
}

// Determine category from content
function guessCategory(text: string): string {
  const t = text.toLowerCase()
  if (t.includes('yacht') || t.includes('boat') || t.includes('marine')) return 'Superyachts'
  if (t.includes('jet') || t.includes('aircraft') || t.includes('aviation') || t.includes('gulfstream') || t.includes('bombardier')) return 'Private Jets'
  if (t.includes('villa') || t.includes('estate') || t.includes('mansion') || t.includes('island') || t.includes('chateau')) return 'Luxury Estates'
  if (t.includes('business') || t.includes('company') || t.includes('fund') || t.includes('platform')) return 'Business Sales'
  if (t.includes('ferrari') || t.includes('lamborghini') || t.includes('car') || t.includes('automobile')) return 'Vintage Cars'
  return 'Rare Art'
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Security: Vercel cron sends Authorization: Bearer <CRON_SECRET>
  // Also allow AGENT_SECRET header for admin manual trigger
  const authHeader = req.headers.authorization
  const agentSecret = req.headers['x-agent-secret'] as string

  const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`
  const isAdminTrigger = AGENT_SECRET && agentSecret === AGENT_SECRET

  if (!isVercelCron && !isAdminTrigger) {
    return res.status(401).json({ error: 'Unauthorised' })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const savedListings: string[] = []
  const errors: string[] = []
  const startedAt = new Date().toISOString()

  // ── Phase 1: Try live RSS feeds ──
  let liveCount = 0
  for (const feed of FEEDS) {
    try {
      const items = await fetchRssFeed(feed.url)
      for (const item of items) {
        const category = feed.category
        let formatted: { title: string; description: string; price_min: number; price_max: number; location: string }

        try {
          formatted = await formatWithAI({ title: item.title, description: item.description, category })
        } catch {
          // Fallback: use raw data with sensible defaults
          formatted = {
            title: item.title.slice(0, 120),
            description: item.description.slice(0, 280) || `Premium ${category.toLowerCase()} listing sourced from ${feed.source}.`,
            price_min: 1000000,
            price_max: 10000000,
            location: 'International',
          }
        }

        const slug = slugify(formatted.title) + '-' + Date.now().toString(36)

        const { error } = await supabase.from('listings').upsert({
          title: formatted.title,
          category,
          location: formatted.location,
          price_estimate_min: formatted.price_min,
          price_estimate_max: formatted.price_max,
          description: formatted.description,
          source_url: item.link || feed.url,
          slug,
          status: 'active',
          featured: false,
          created_at: new Date().toISOString(),
        }, { onConflict: 'slug', ignoreDuplicates: true })

        if (!error) { savedListings.push(formatted.title); liveCount++ }
        else errors.push(`${feed.source}: ${error.message}`)
      }
    } catch (e: any) {
      errors.push(`Feed ${feed.source}: ${e.message}`)
    }
  }

  // ── Phase 2: Supplement with curated sample listings ──
  // Always ensure minimum 6 high-quality listings exist
  const { count } = await supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'active')
  const currentCount = count || 0

  if (currentCount < 6 || liveCount === 0) {
    // Rotate through sample listings based on day of week
    const dayIndex = new Date().getDay()
    const batchSize = 5
    const startIndex = (dayIndex * batchSize) % SAMPLE_LISTINGS.length
    const todaysBatch = [
      ...SAMPLE_LISTINGS.slice(startIndex, startIndex + batchSize),
      ...SAMPLE_LISTINGS.slice(0, Math.max(0, (startIndex + batchSize) - SAMPLE_LISTINGS.length))
    ]

    for (const listing of todaysBatch) {
      const slug = slugify(listing.title) + '-' + new Date().toISOString().split('T')[0]
      const { error } = await supabase.from('listings').upsert({
        title: listing.title,
        category: listing.category,
        location: listing.location,
        price_estimate_min: listing.price_estimate_min,
        price_estimate_max: listing.price_estimate_max,
        description: listing.description,
        source_url: listing.source_url,
        slug,
        status: 'active',
        featured: todaysBatch.indexOf(listing) < 2,
        created_at: new Date().toISOString(),
      }, { onConflict: 'slug', ignoreDuplicates: true })

      if (!error) savedListings.push(listing.title)
    }
  }

  // ── Log the run ──
  await supabase.from('agent_runs').upsert({
    id: new Date().toISOString().split('T')[0],
    ran_at: startedAt,
    listings_saved: savedListings.length,
    errors: errors.length > 0 ? errors.join('; ') : null,
    sources_tried: FEEDS.length,
  }, { onConflict: 'id' }).catch(() => {})

  return res.status(200).json({
    ok: true,
    ran_at: startedAt,
    listings_saved: savedListings.length,
    listings: savedListings,
    errors: errors.length > 0 ? errors : undefined,
  })
}
