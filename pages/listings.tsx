import Layout from '../components/Layout'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface Listing {
  id: string
  title: string
  category: string
  location: string
  price_estimate_min: number
  description: string
  slug: string
}

const CATEGORIES = ['All', 'Yacht', 'Jet', 'Superyachts', 'Private Jets', 'Luxury Estates', 'Business Sales', 'Rare Art', 'Vintage Cars']
const LOCATIONS = ['All', 'Monaco', 'Dubai', 'New York', 'London', 'Teterboro, NJ', 'Miami', 'Hong Kong']

function formatPrice(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

export default function Listings() {
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [location, setLocation] = useState('All')

  useEffect(() => {
    if (router.query.category) setCategory(router.query.category as string)
  }, [router.query])

  useEffect(() => {
    setLoading(true)
    fetch('/api/listings')
      .then(r => r.json())
      .then(d => { setListings(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = listings.filter(l => {
    const matchCat = category === 'All' || l.category?.toLowerCase().includes(category.toLowerCase())
    const matchLoc = location === 'All' || l.location?.toLowerCase().includes(location.toLowerCase())
    const matchSearch = !search ||
      l.title?.toLowerCase().includes(search.toLowerCase()) ||
      l.description?.toLowerCase().includes(search.toLowerCase()) ||
      l.location?.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchLoc && matchSearch
  })

  return (
    <Layout
      title="Luxury Asset Listings"
      description="Browse exclusive luxury asset auctions including superyachts, private jets, luxury estates, and rare business opportunities for high-net-worth investors."
    >
      <div className="page-hero">
        <div className="container">
          <p className="section-label">Premium Listings</p>
          <h1>Luxury Asset Auctions & Private Sales</h1>
          <p>Curated daily listings of superyachts, private jets, luxury estates, and exclusive business sales worldwide.</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '5rem' }}>
        {/* Filters */}
        <div style={{
          background: 'var(--dark3)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '1.5rem',
          marginBottom: '2.5rem',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gap: '1rem',
        }}>
          <div>
            <label>Search Listings</label>
            <input
              type="text"
              placeholder="Search by keyword, title, location…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div>
            <label>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label>Location</label>
            <select value={location} onChange={e => setLocation(e.target.value)}>
              {LOCATIONS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {loading ? 'Loading…' : `${filtered.length} listing${filtered.length !== 1 ? 's' : ''} found`}
          </p>
          <Link href="/submit" className="btn btn-outline" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>
            + List Your Asset
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading premium listings…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--dark3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
            <p style={{ color: 'var(--text-muted)' }}>No listings match your filters. Try adjusting your search.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {filtered.map(l => (
              <div key={l.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <span className="badge badge-gold">{l.category}</span>
                  <span className="badge badge-green">Active</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{l.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.2rem', lineHeight: '1.7' }}>{l.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Starting from</div>
                    <div style={{ color: 'var(--gold)', fontFamily: 'Georgia', fontSize: '1.2rem' }}>{formatPrice(l.price_estimate_min)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Location</div>
                    <div style={{ fontSize: '0.9rem' }}>{l.location}</div>
                  </div>
                </div>
                <div style={{ marginTop: '1.2rem' }}>
                  <Link href="/contact" className="btn btn-gold" style={{ width: '100%', textAlign: 'center', padding: '0.65rem 1rem', fontSize: '0.88rem' }}>
                    Enquire Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
