import Layout from '../components/Layout'
import Link from 'next/link'

export default function NotFound() {
  return (
    <Layout title="Page Not Found" noindex>
      <div style={{ textAlign: 'center', padding: '8rem 1.5rem' }}>
        <div style={{ color: 'var(--gold)', fontSize: '5rem', fontFamily: 'Georgia', marginBottom: '1rem', opacity: 0.4 }}>404</div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Page Not Found</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 2.5rem', fontSize: '1rem', lineHeight: '1.7' }}>
          This page doesn&apos;t exist or may have moved. Browse our latest listings or return home.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/listings" className="btn btn-gold">Browse Listings</Link>
          <Link href="/" className="btn btn-outline">Back to Home</Link>
        </div>
      </div>
    </Layout>
  )
}
