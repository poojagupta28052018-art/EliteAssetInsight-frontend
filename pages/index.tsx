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
  { value: '15%', label: 'Avg. Commission Saved' },
]

const CATEGORIES = ['Superyachts', 'Private Jets', 'Luxury Estates', 'Rare Art', 'Business Sales', 'Vintage Cars']

const CATEGORY_ICONS: Record<string, string> = {
  Superyachts: '⚓',
  'Private Jets': '✈',
  'Luxury Estates': '🏛',
  'Rare Art': '🖼',
  'Business Sales': '💼',
  'Vintage Cars': '🚗',
}

function formatPrice(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([])

  useEffect(() => {
    fetch('/api/listings').then(r => r.json()).then(setListings).catch(() => {})
  }, [])

  return (
    <Layout>
      {/* HERO */}
      <section style={{
        minHeight: '90vh',
        background: 'linear-gradient(160deg, #0d0d0d 0%, #161610 50%, #0d0d0d 100%)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(201,168,76,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
          <div style={{ maxWidth: '720px' }}>
            <div className="badge badge-gold" style={{ marginBottom: '1.5rem' }}>
              ◆ Exclusively for UHNW Investors
            </div>
            <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', marginBottom: '1.5rem', lineHeight: '1.15' }}>
              The World&apos;s Most{' '}
              <span style={{ color: 'var(--gold)' }}>Exclusive</span>{' '}
              Luxury Asset Marketplace
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '2.5rem', maxWidth: '580px' }}>
              Curated daily listings of superyacht auctions, private jet sales, luxury estates,
              and rare business opportunities — sourced for ultra-high-net-worth investors worldwide.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/listings" className="btn btn-gold">Explore Listings</Link>
              <Link href="/membership" className="btn btn-outline">Join Elite Membership</Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: 'var(--dark2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ padding: '3rem 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2rem', textAlign: 'center' }}>
            {STATS.map(s => (
              <div key={s.label}>
                <div style={{ fontSize: '2.2rem', color: 'var(--gold)', fontFamily: 'Georgia', marginBottom: '0.4rem' }}>{s.value}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <style jsx>{`@media(max-width:600px){div[style*="repeat(4"]{grid-template-columns:1fr 1fr !important;}}`}</style>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <p className="section-label">Asset Categories</p>
          <h2 className="section-title">Browse by Asset Class</h2>
          <div className="gold-line" />
          <div className="grid-3" style={{ gap: '1rem', marginTop: '1rem' }}>
            {CATEGORIES.map(cat => (
              <Link href={`/listings?category=${encodeURIComponent(cat)}`} key={cat}
                style={{ display: 'block', textDecoration: 'none' }}>
                <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem', cursor: 'pointer' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>{CATEGORY_ICONS[cat]}</div>
                  <div style={{ color: 'var(--text)', fontSize: '1rem' }}>{cat}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section style={{ padding: '3rem 0 5rem', background: 'var(--dark2)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p className="section-label">Today&apos;s Top Picks</p>
              <h2 className="section-title" style={{ marginBottom: '0' }}>Featured Listings</h2>
            </div>
            <Link href="/listings" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.6rem 1.4rem' }}>View All</Link>
          </div>
          {listings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading premium listings…</div>
          ) : (
            <div className="grid-3">
              {listings.slice(0, 3).map(l => (
                <Link href={`/listings`} key={l.id} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span className="badge badge-gold">{l.category}</span>
                      <span style={{ color: 'var(--gold)', fontFamily: 'Georgia', fontSize: '1.1rem' }}>{formatPrice(l.price_estimate_min)}</span>
                    </div>
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', color: 'var(--text)' }}>{l.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1rem' }}>{l.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      <span>📍</span><span>{l.location}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <p className="section-label">Our Process</p>
          <h2 className="section-title">How EliteAssetInsight Works</h2>
          <div className="gold-line" />
          <div className="grid-3" style={{ marginTop: '1rem' }}>
            {[
              { step: '01', title: 'Curated Daily', desc: 'Our AI-powered engine scours global auction houses and private brokers to surface the most exclusive listings.' },
              { step: '02', title: 'Verified Listings', desc: 'Every asset is verified for authenticity before appearing on our platform. No spam, no noise.' },
              { step: '03', title: 'Commission on Sale', desc: 'List for free. We earn only when a deal closes — aligning our incentives with yours.' },
            ].map(item => (
              <div key={item.step} className="card">
                <div style={{ color: 'var(--gold)', fontSize: '2rem', fontFamily: 'Georgia', marginBottom: '1rem', opacity: 0.6 }}>{item.step}</div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA MEMBERSHIP */}
      <section style={{
        padding: '5rem 0',
        background: 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(13,13,13,0) 60%)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="section-label" style={{ textAlign: 'center' }}>Elite Membership</p>
          <h2 style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>Gain an Unfair Advantage</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto 2.5rem', fontSize: '1.05rem' }}>
            Members receive daily briefings on the most time-sensitive opportunities before they hit the public market.
          </p>
          <Link href="/membership" className="btn btn-gold">View Membership Plans</Link>
        </div>
      </section>
    </Layout>
  )
}
