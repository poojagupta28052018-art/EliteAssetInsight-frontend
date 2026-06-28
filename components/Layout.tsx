import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

interface LayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export default function Layout({ children, title, description }: LayoutProps) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const pageTitle = title
    ? `${title} | EliteAssetInsight`
    : 'EliteAssetInsight — Luxury Asset Auctions & Private Sales'

  const pageDesc = description ||
    'Curated luxury asset auctions, private jet sales, superyacht listings, and exclusive business sales for ultra-high-net-worth investors.'

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/listings', label: 'Listings' },
    { href: '/membership', label: 'Membership' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/submit', label: 'List Asset' },
    { href: '/trends', label: 'Trends' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta name="keywords" content="luxury asset auctions, private jet sales, superyacht listings, exclusive business sales, high-net-worth investments, luxury investment trends, rare business opportunities" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(13,13,13,0.97)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(10px)',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            <span style={{ fontSize: '1.5rem', color: 'var(--gold)' }}>◆</span>
            <span style={{ fontFamily: 'Georgia', fontSize: '1.1rem', color: 'var(--text)', letterSpacing: '0.05em' }}>
              Elite<strong style={{ color: 'var(--gold)' }}>Asset</strong>Insight
            </span>
          </Link>

          <nav style={{ display: 'flex', gap: '1.8rem', alignItems: 'center' }} className="desktop-nav">
            {navLinks.slice(0, 6).map(l => (
              <Link key={l.href} href={l.href} style={{
                fontSize: '0.85rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: router.pathname === l.href ? 'var(--gold)' : 'var(--text-muted)',
                transition: 'color 0.2s',
              }}>{l.label}</Link>
            ))}
          </nav>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link href="/membership" className="btn btn-gold" style={{ padding: '0.55rem 1.4rem', fontSize: '0.85rem' }}>
              Join Elite
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer style={{ background: 'var(--dark2)', borderTop: '1px solid var(--border)', padding: '4rem 0 2rem', marginTop: '6rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.2rem', color: 'var(--gold)' }}>◆</span>
                <span style={{ fontFamily: 'Georgia', fontSize: '1rem', letterSpacing: '0.05em' }}>
                  Elite<strong style={{ color: 'var(--gold)' }}>Asset</strong>Insight
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '280px', lineHeight: '1.8' }}>
                The world&apos;s most exclusive marketplace for luxury asset auctions, private jet sales, and superyacht listings.
              </p>
            </div>
            <div>
              <p style={{ color: 'var(--gold)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Platform</p>
              {[['/', 'Home'], ['/listings', 'Listings'], ['/membership', 'Membership'], ['/dashboard', 'Dashboard']].map(([h, l]) => (
                <div key={h} style={{ marginBottom: '0.5rem' }}>
                  <Link href={h} style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{l}</Link>
                </div>
              ))}
            </div>
            <div>
              <p style={{ color: 'var(--gold)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Resources</p>
              {[['/submit', 'List Asset'], ['/trends', 'Trends'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([h, l]) => (
                <div key={h} style={{ marginBottom: '0.5rem' }}>
                  <Link href={h} style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{l}</Link>
                </div>
              ))}
            </div>
            <div>
              <p style={{ color: 'var(--gold)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Categories</p>
              {['Superyachts', 'Private Jets', 'Luxury Estates', 'Business Sales', 'Rare Assets'].map(c => (
                <div key={c} style={{ marginBottom: '0.5rem' }}>
                  <Link href={`/listings?category=${c}`} style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{c}</Link>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>© 2025 EliteAssetInsight.com — All rights reserved.</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              SSL Secured · Premium listings for UHNW investors
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .desktop-nav a:hover { color: var(--gold) !important; }
        @media(max-width:900px) { .desktop-nav { display: none !important; } }
        footer .container > div:first-child { grid-template-columns: 1fr 1fr !important; }
        @media(max-width:600px) { footer .container > div:first-child { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  )
}
