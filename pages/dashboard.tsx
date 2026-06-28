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
  created_at?: string
  featured?: boolean
}

interface AgentStatus {
  lastRun: { ranAt: string; listingsSaved: number; errors: string | null } | null
  totalActiveListings: number
  listingsAddedToday: number
  nextRunAt: string
}

function formatPrice(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

const MARKET = [
  { label: 'Superyachts', change: '+12%', dir: 'up', icon: '⚓' },
  { label: 'Private Jets', change: '+7%', dir: 'up', icon: '✈' },
  { label: 'Luxury Estates', change: '+4%', dir: 'up', icon: '🏛' },
  { label: 'Rare Art', change: '+21%', dir: 'up', icon: '🖼' },
]

export default function Dashboard() {
  const [listings, setListings] = useState<Listing[]>([])
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null)
  const [adminKey, setAdminKey] = useState('')
  const [adminMode, setAdminMode] = useState(false)
  const [triggerStatus, setTriggerStatus] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/listings').then(r => r.json()).then(setListings).catch(() => {})
    fetch('/api/agent/status').then(r => r.json()).then(setAgentStatus).catch(() => {})
  }, [])

  const triggerAgent = async () => {
    setTriggerStatus('running')
    try {
      const res = await fetch('/api/agent/ingest', {
        headers: { 'x-agent-secret': adminKey },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setTriggerStatus(`Done — ${data.listings_saved} listings added`)
      fetch('/api/agent/status').then(r => r.json()).then(setAgentStatus).catch(() => {})
      fetch('/api/listings').then(r => r.json()).then(setListings).catch(() => {})
    } catch (e: any) {
      setTriggerStatus(`Error: ${e.message}`)
    }
  }

  return (
    <Layout
      title="Member Dashboard"
      description="Your EliteAssetInsight member dashboard — live listings, market intelligence, and agent status."
    >
      <div style={{ background: 'var(--dark2)', borderBottom: '1px solid var(--border)', padding: '2.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p className="section-label">Member Area</p>
              <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>Your Elite Dashboard</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Live listings updated daily by our automated agent
              </p>
            </div>
            <Link href="/listings" className="btn btn-gold">Browse All Listings</Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '5rem' }}>

        {/* Agent Status Banner */}
        <div style={{
          background: 'linear-gradient(90deg,rgba(201,168,76,0.08),transparent)',
          border: '1px solid var(--border)', borderRadius: 'var(--radius)',
          padding: '1.2rem 1.8rem', marginTop: '2rem', marginBottom: '2.5rem',
          display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#25c864', display: 'inline-block', boxShadow: '0 0 6px #25c864' }} />
            <span style={{ color: 'var(--text)', fontSize: '0.9rem', fontWeight: 'bold' }}>Ingest Agent: Active</span>
          </div>
          {agentStatus ? (
            <>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Last run: <strong style={{ color: 'var(--text)' }}>{agentStatus.lastRun ? timeAgo(agentStatus.lastRun.ranAt) : 'Not yet run'}</strong>
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Listings added today: <strong style={{ color: 'var(--gold)' }}>{agentStatus.listingsAddedToday}</strong>
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Total active: <strong style={{ color: 'var(--text)' }}>{agentStatus.totalActiveListings}</strong>
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Next: <strong style={{ color: 'var(--text)' }}>{agentStatus.nextRunAt}</strong>
              </span>
            </>
          ) : (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading agent status…</span>
          )}
        </div>

        {/* Stats */}
        <div className="dash-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { icon: '📋', label: 'Active Listings', value: agentStatus?.totalActiveListings ?? '—' },
            { icon: '🆕', label: 'Added Today', value: agentStatus?.listingsAddedToday ?? '—' },
            { icon: '🌍', label: 'Countries Covered', value: '98' },
            { icon: '⚡', label: 'Next Agent Run', value: 'Midnight UTC' },
          ].map(s => (
            <div key={s.label} className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div style={{ fontSize: '1.6rem', color: 'var(--gold)', fontFamily: 'Georgia', marginBottom: '0.3rem' }}>{s.value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="dash-cols" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Latest listings */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h2 style={{ fontSize: '1.1rem' }}>Today&apos;s Listings</h2>
              <Link href="/listings" style={{ color: 'var(--gold)', fontSize: '0.82rem' }}>View all →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {listings.length === 0 ? (
                <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Loading listings from agent…
                </div>
              ) : listings.slice(0, 8).map(l => (
                <div key={l.id} className="card" style={{ padding: '1.2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-gold" style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem' }}>{l.category}</span>
                      {l.featured && <span style={{ fontSize: '0.7rem', color: 'var(--gold)' }}>★ Featured</span>}
                    </div>
                    <p style={{ fontSize: '0.92rem', fontWeight: 'bold', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.title}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>📍 {l.location}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ color: 'var(--gold)', fontFamily: 'Georgia', fontSize: '1rem' }}>{formatPrice(l.price_estimate_min)}</p>
                    {l.created_at && <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '0.2rem' }}>{timeAgo(l.created_at)}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Market pulse */}
            <div className="card">
              <p style={{ color: 'var(--gold)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Market Pulse</p>
              {MARKET.map(m => (
                <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{m.icon} {m.label}</span>
                  <span style={{ fontSize: '0.88rem', color: m.dir === 'up' ? '#25c864' : '#e05c5c', fontWeight: 'bold' }}>
                    {m.dir === 'up' ? '↑' : '↓'} {m.change}
                  </span>
                </div>
              ))}
              <Link href="/trends" style={{ color: 'var(--gold)', fontSize: '0.8rem' }}>Full report →</Link>
            </div>

            {/* Upgrade prompt */}
            <div className="card" style={{ background: 'linear-gradient(135deg,rgba(201,168,76,0.08) 0%,var(--dark3) 100%)', border: '1px solid var(--gold)' }}>
              <p style={{ color: 'var(--gold)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Elite Members</p>
              <p style={{ fontSize: '0.88rem', marginBottom: '0.5rem' }}>Get listing alerts 24h early</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1rem' }}>Upgrade to Elite or Ultra and never miss a premium opportunity.</p>
              <Link href="/membership" className="btn btn-gold" style={{ display: 'block', textAlign: 'center', fontSize: '0.85rem', padding: '0.6rem 1rem' }}>Upgrade Membership</Link>
            </div>

            {/* Owner admin panel */}
            <div className="card">
              <p style={{ color: 'var(--gold)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                ◆ Owner Controls
              </p>
              {!adminMode ? (
                <button onClick={() => setAdminMode(true)} className="btn btn-outline" style={{ width: '100%', fontSize: '0.82rem', padding: '0.5rem' }}>
                  Admin Login
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <input
                    type="password"
                    placeholder="Agent secret key"
                    value={adminKey}
                    onChange={e => setAdminKey(e.target.value)}
                    style={{ fontSize: '0.85rem' }}
                  />
                  <button
                    onClick={triggerAgent}
                    disabled={!adminKey || triggerStatus === 'running'}
                    className="btn btn-gold"
                    style={{ fontSize: '0.82rem', padding: '0.5rem' }}
                  >
                    {triggerStatus === 'running' ? '⏳ Running agent…' : '▶ Run Agent Now'}
                  </button>
                  {triggerStatus && triggerStatus !== 'running' && (
                    <p style={{ fontSize: '0.78rem', color: triggerStatus.startsWith('Error') ? '#e05c5c' : '#25c864', marginTop: '0.3rem' }}>
                      {triggerStatus}
                    </p>
                  )}
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Agent runs automatically at midnight UTC.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dash-grid-4 { grid-template-columns: repeat(4,1fr); }
        .dash-cols { grid-template-columns: 2fr 1fr; }
        @media(max-width:900px) {
          .dash-grid-4 { grid-template-columns: 1fr 1fr !important; }
          .dash-cols { grid-template-columns: 1fr !important; }
        }
        @media(max-width:480px) {
          .dash-grid-4 { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </Layout>
  )
}
