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
}

function formatPrice(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

const ALERTS = [
  { time: '2h ago', text: 'New superyacht listed in Monaco — 78m Azimut' },
  { time: '5h ago', text: 'Gulfstream G700 asking price reduced by $2M' },
  { time: '1d ago', text: 'Off-market estate opportunity in St. Barts' },
]

const MARKET = [
  { label: 'Superyachts', change: '+12%', dir: 'up' },
  { label: 'Private Jets', change: '+7%', dir: 'up' },
  { label: 'Luxury Estates', change: '-3%', dir: 'down' },
  { label: 'Rare Art', change: '+21%', dir: 'up' },
]

export default function Dashboard() {
  const [listings, setListings] = useState<Listing[]>([])

  useEffect(() => {
    fetch('/api/listings').then(r => r.json()).then(setListings).catch(() => {})
  }, [])

  return (
    <Layout
      title="Dashboard"
      description="Your personalized luxury asset investment dashboard with daily updates, market trends, and saved listings."
    >
      <div style={{ padding: '3rem 0', background: 'var(--dark2)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p className="section-label">Member Dashboard</p>
              <h1 style={{ fontSize: '2rem' }}>Welcome Back</h1>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link href="/listings" className="btn btn-outline" style={{ padding: '0.55rem 1.2rem', fontSize: '0.85rem' }}>Browse Listings</Link>
              <Link href="/submit" className="btn btn-gold" style={{ padding: '0.55rem 1.2rem', fontSize: '0.85rem' }}>+ List Asset</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

          {/* Main column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
              {[
                { label: 'Active Listings', value: `${listings.length}` },
                { label: 'Saved Searches', value: '4' },
                { label: 'Enquiries Sent', value: '2' },
              ].map(s => (
                <div key={s.label} className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', color: 'var(--gold)', fontFamily: 'Georgia', marginBottom: '0.3rem' }}>{s.value}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Latest listings */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.15rem' }}>Latest Listings</h2>
                <Link href="/listings" style={{ fontSize: '0.85rem', color: 'var(--gold)' }}>View all →</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {listings.map(l => (
                  <div key={l.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <p style={{ fontSize: '0.95rem', marginBottom: '0.3rem' }}>{l.title}</p>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>{l.category}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>📍 {l.location}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: 'var(--gold)', fontFamily: 'Georgia', fontSize: '1.1rem' }}>{formatPrice(l.price_estimate_min)}</div>
                      <Link href="/contact" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enquire →</Link>
                    </div>
                  </div>
                ))}
                {listings.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading listings…</div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Alerts */}
            <div className="card">
              <h3 style={{ fontSize: '1rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--gold)' }}>⚡</span> Live Alerts
              </h3>
              {ALERTS.map(a => (
                <div key={a.text} style={{ paddingBottom: '0.9rem', marginBottom: '0.9rem', borderBottom: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>{a.text}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.time}</span>
                </div>
              ))}
              <Link href="/listings" className="btn btn-outline" style={{ width: '100%', textAlign: 'center', padding: '0.55rem 1rem', fontSize: '0.82rem' }}>
                View All Listings
              </Link>
            </div>

            {/* Market pulse */}
            <div className="card">
              <h3 style={{ fontSize: '1rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--gold)' }}>📊</span> Market Pulse
              </h3>
              {MARKET.map(m => (
                <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem' }}>
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{m.label}</span>
                  <span style={{ fontSize: '0.88rem', color: m.dir === 'up' ? '#4caf76' : '#e05c5c', fontWeight: 'bold' }}>{m.change}</span>
                </div>
              ))}
              <Link href="/trends" style={{ fontSize: '0.82rem', color: 'var(--gold)' }}>Full trend report →</Link>
            </div>

            {/* Upgrade CTA */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(201,168,76,0.12) 0%, rgba(13,13,13,0) 100%)',
              border: '1px solid var(--gold)',
              borderRadius: 'var(--radius)',
              padding: '1.5rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>◆</div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Upgrade to Ultra</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1rem' }}>Access private deals and bespoke asset sourcing.</p>
              <Link href="/membership" className="btn btn-gold" style={{ width: '100%', textAlign: 'center', padding: '0.6rem', fontSize: '0.85rem' }}>
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`@media(max-width:768px){div[style*="2fr 1fr"]{grid-template-columns:1fr !important;}}`}</style>
    </Layout>
  )
}
