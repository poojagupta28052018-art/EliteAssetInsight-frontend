import Layout from '../components/Layout'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Listing {
  id: string
  title: string
  category: string
  location: string
  price_estimate_min: number
  description: string
  slug: string
}

const STATS = [
  { value: '$2.4B+', label: 'Assets Listed' },
  { value: '1,200+', label: 'Elite Members' },
  { value: '98', label: 'Countries Served' },
  { value: '≤2%', label: 'Commission Rate' },
]

const CATEGORIES = ['Superyachts', 'Private Jets', 'Luxury Estates', 'Rare Art', 'Business Sales', 'Vintage Cars']
const CATEGORY_ICONS: Record<string, string> = {
  Superyachts: '⚓', 'Private Jets': '✈', 'Luxury Estates': '🏛',
  'Rare Art': '🖼', 'Business Sales': '💼', 'Vintage Cars': '🚗',
}

const TESTIMONIALS = [
  { quote: 'Found our 72m Feadship through EliteAssetInsight. The process was completely discreet and the advisor was exceptional.', name: 'J. Hartmann', title: 'Family Office, Switzerland' },
  { quote: 'Listed our Miami hotel and had three qualified buyers within a week. Commission structure is the fairest I\'ve seen.', name: 'R. Al-Mansoori', title: 'Private Equity, UAE' },
  { quote: 'The market intelligence reports alone justify the membership fee ten times over.', name: 'C. Beaumont', title: 'Asset Manager, London' },
]

function formatPrice(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

const MARKETPLACE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Luxury Asset Listings — EliteAssetInsight',
  description: 'Curated luxury asset auctions including superyachts, private jets, luxury estates and exclusive business sales',
  url: 'https://eliteassetinsight.com/listings',
}

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([])
  const [email, setEmail] = useState('')
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  useEffect(() => {
    fetch('/api/listings').then(r => r.json()).then(setListings).catch(() => {})
  }, [])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('Failed')
      setSubStatus('done')
      setEmail('')
    } catch {
      setSubStatus('error')
    }
  }

  return (
    <Layout
      title="Luxury Asset Auctions — Superyachts, Private Jets & Exclusive Sales"
      description="EliteAssetInsight curates daily luxury asset auctions: superyacht sales, private jet listings, luxury estate auctions, and exclusive business opportunities for ultra-high-net-worth investors."
      keywords="luxury asset auctions, superyacht for sale, private jet for sale, luxury estate auction, exclusive business sales, UHNW investments, buy superyacht, buy private jet, luxury asset marketplace"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(MARKETPLACE_JSON_LD) }}
      />

      {/* ── HERO ── */}
      <section style={{
        minHeight: '92vh',
        background: 'linear-gradient(160deg, #0d0d0d 0%, #161610 50%, #0d0d0d 100%)',
        display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(201,168,76,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
          <div style={{ maxWidth: '740px' }}>
            <div className="badge badge-gold" style={{ marginBottom: '1.5rem' }}>◆ Exclusively for UHNW Investors — Founded by Mr. Hamdan</div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', marginBottom: '1.5rem', lineHeight: '1.15' }}>
              The World&apos;s Most{' '}
              <span style={{ color: 'var(--gold)' }}>Exclusive</span>{' '}
              Luxury Asset Marketplace
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '2.5rem', maxWidth: '600px' }}>
              Curated daily listings of superyacht auctions, private jet sales, luxury estate listings,
              and rare business opportunities — sourced exclusively for ultra-high-net-worth investors worldwide.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <Link href="/listings" className="btn btn-gold">Explore Listings</Link>
              <Link href="/membership" className="btn btn-outline">Join Elite Membership</Link>
            </div>
            {/* Trust badges */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {['🔒 SSL Secured', '◆ Verified Listings', '🌍 98 Countries', '💳 PayPal Protected'].map(b => (
                <span key={b} style={{ fontSize: '0.78rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: 'var(--dark2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
          <div className="stats-bar" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2rem', textAlign: 'center' }}>
            {STATS.map(s => (
              <div key={s.label}>
                <div style={{ fontSize: '2rem', color: 'var(--gold)', fontFamily: 'Georgia', marginBottom: '0.3rem' }}>{s.value}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <p className="section-label">Asset Categories</p>
          <h2 className="section-title">Browse by Asset Class</h2>
          <div className="gold-line" />
          <div className="grid-3" style={{ gap: '1rem' }}>
            {CATEGORIES.map(cat => (
              <Link href={`/listings?category=${encodeURIComponent(cat)}`} key={cat} style={{ display: 'block', textDecoration: 'none' }}>
                <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem', cursor: 'pointer' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{CATEGORY_ICONS[cat]}</div>
                  <div style={{ color: 'var(--text)', fontSize: '0.95rem' }}>{cat}</div>
                  <div style={{ color: 'var(--gold)', fontSize: '0.78rem', marginTop: '0.4rem' }}>Browse →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED LISTINGS ── */}
      <section style={{ padding: '3rem 0 5rem', background: 'var(--dark2)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p className="section-label">Today&apos;s Top Picks</p>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Featured Listings</h2>
            </div>
            <Link href="/listings" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.6rem 1.4rem' }}>View All Listings</Link>
          </div>
          {listings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading premium listings…</div>
          ) : (
            <div className="grid-3">
              {listings.slice(0, 3).map(l => (
                <div key={l.id} className="card" style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span className="badge badge-gold">{l.category}</span>
                    <span style={{ color: 'var(--gold)', fontFamily: 'Georgia', fontSize: '1.1rem' }}>{formatPrice(l.price_estimate_min)}</span>
                  </div>
                  <h3 style={{ fontSize: '1.02rem', marginBottom: '0.5rem' }}>{l.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.87rem', marginBottom: '1rem', lineHeight: '1.7' }}>{l.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>📍 {l.location}</span>
                    <Link href="/contact" style={{ fontSize: '0.82rem', color: 'var(--gold)' }}>Enquire →</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <p className="section-label">Our Process</p>
          <h2 className="section-title">How EliteAssetInsight Works</h2>
          <div className="gold-line" />
          <div className="grid-3" style={{ marginTop: '1rem' }}>
            {[
              { step: '01', title: 'AI-Curated Daily', desc: 'Our intelligence engine scours global auction houses and private brokers to surface the most exclusive listings every day.' },
              { step: '02', title: 'Verified & Vetted', desc: 'Every asset is verified for authenticity before appearing on our platform. No noise — only serious opportunities.' },
              { step: '03', title: 'Commission on Sale Only', desc: 'List for free. We earn only when a deal closes via our platform — aligning our incentives with yours.' },
            ].map(item => (
              <div key={item.step} className="card">
                <div style={{ color: 'var(--gold)', fontSize: '2rem', fontFamily: 'Georgia', marginBottom: '1rem', opacity: 0.5 }}>{item.step}</div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.7' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUATION CTA ── */}
      <section style={{ padding: '4rem 0', background: 'var(--dark2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }} className="val-grid">
            <div>
              <p className="section-label">Free Service</p>
              <h2 style={{ fontSize: '1.9rem', marginBottom: '0.75rem' }}>Get a Free Asset Valuation</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                Not sure what your superyacht, private jet, or luxury estate is worth in today&apos;s market?
                Submit your asset details and our advisors will provide a confidential valuation within 48 hours.
              </p>
              <Link href="/contact" className="btn btn-gold">Request Free Valuation</Link>
            </div>
            <div className="card" style={{ padding: '2rem' }}>
              <p style={{ color: 'var(--gold)', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>What you receive</p>
              {[
                'Current market value range',
                'Comparable recent sales data',
                'Optimal listing price recommendation',
                'Commission & timeline estimate',
                'Confidential — NDA on request',
              ].map(f => (
                <div key={f} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', marginBottom: '0.75rem', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--gold)', flexShrink: 0 }}>✓</span>
                  <span style={{ color: 'var(--text-muted)' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <p className="section-label" style={{ textAlign: 'center' }}>Client Voices</p>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>What Our Members Say</h2>
          <div className="gold-line" style={{ margin: '1rem auto 2.5rem' }} />
          <div className="grid-3">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card" style={{ padding: '2rem' }}>
                <div style={{ color: 'var(--gold)', fontSize: '2rem', lineHeight: 1, marginBottom: '1rem', opacity: 0.6 }}>&ldquo;</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.8', marginBottom: '1.5rem', fontStyle: 'italic' }}>{t.quote}</p>
                <div>
                  <p style={{ fontSize: '0.88rem', fontWeight: 'bold' }}>{t.name}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{t.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEMBERSHIP CTA ── */}
      <section style={{
        padding: '5rem 0',
        background: 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(13,13,13,0) 60%)',
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="section-label" style={{ textAlign: 'center' }}>Elite Membership</p>
          <h2 style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>Gain an Unfair Advantage</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto 2.5rem', fontSize: '1.05rem' }}>
            Members receive daily briefings on the most time-sensitive opportunities — 24 hours before they reach any other platform.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/membership" className="btn btn-gold">View Membership Plans</Link>
            <Link href="/trends" className="btn btn-outline">Read Market Reports</Link>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section style={{ padding: '5rem 0', background: 'var(--dark2)' }}>
        <div className="container" style={{ maxWidth: '640px', textAlign: 'center' }}>
          <p className="section-label" style={{ textAlign: 'center' }}>Free Weekly Digest</p>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Stay Ahead of the Market</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.7' }}>
            Join 4,000+ investors who receive our weekly luxury asset market digest — top listings, trend alerts, and deal insights. Free, no spam.
          </p>
          {subStatus === 'done' ? (
            <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <span style={{ fontSize: '1.5rem' }}>✅</span>
              <p style={{ marginTop: '0.5rem', color: 'var(--gold)' }}>You&apos;re subscribed. Welcome to the inner circle.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                style={{ flex: 1, minWidth: '220px' }}
                disabled={subStatus === 'loading'}
              />
              <button type="submit" className="btn btn-gold" disabled={subStatus === 'loading'}>
                {subStatus === 'loading' ? 'Subscribing…' : 'Subscribe Free'}
              </button>
            </form>
          )}
          {subStatus === 'error' && (
            <p style={{ color: '#e05c5c', fontSize: '0.85rem', marginTop: '0.75rem' }}>Something went wrong. Please try again.</p>
          )}
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '1rem' }}>
            No spam. Unsubscribe anytime. Read our <Link href="/privacy">Privacy Policy</Link>.
          </p>
        </div>
      </section>

      <style jsx>{`
        .stats-bar { grid-template-columns: repeat(4,1fr); }
        .val-grid { grid-template-columns: 1fr 1fr; }
        @media(max-width:768px) {
          .stats-bar { grid-template-columns: 1fr 1fr !important; gap: 1.5rem; }
          .val-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </Layout>
  )
}
