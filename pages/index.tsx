import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>EliteAssetInsight — Luxury Assets</title>
        <meta name="description" content="Premium yachts, private jets, and luxury assets" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main style={{ fontFamily: 'sans-serif', maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>EliteAssetInsight</h1>
        <p style={{ color: '#555', fontSize: '1.2rem', marginBottom: '2rem' }}>
          Premium listings for yachts, private jets, and luxury assets.
        </p>
        <nav style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem' }}>
          <a href="/listings" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 600 }}>Listings</a>
          <a href="/contact" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 600 }}>Contact</a>
        </nav>
        <section>
          <h2>Welcome</h2>
          <p>
            Browse our curated selection of ultra-premium assets — from superyachts in Monaco to
            Gulfstream jets with full maintenance histories. Listings are updated continuously.
          </p>
        </section>
      </main>
    </>
  )
}
