import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

interface LayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  ogImage?: string
  keywords?: string
  noindex?: boolean
}

const SITE_URL = 'https://eliteassetinsight.com'
const SITE_NAME = 'EliteAssetInsight'
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`
const DEFAULT_KEYWORDS = 'luxury asset auctions, private jet sales, superyacht listings, exclusive business sales, high-net-worth investments, luxury investment trends, rare business opportunities, yacht auction, jet charter purchase, luxury real estate investment, UHNW investors'

const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'EliteAssetInsight',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  founder: { '@type': 'Person', name: 'Mr. Hamdan' },
  description: 'The world\'s most exclusive marketplace for luxury asset auctions, private jet sales, superyacht listings, and rare business opportunities.',
  contactPoint: { '@type': 'ContactPoint', email: 'enquiries@eliteassetinsight.com', contactType: 'customer service' },
  sameAs: [],
}

const WEBSITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'EliteAssetInsight',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/listings?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

export default function Layout({ children, title, description, ogImage, keywords, noindex }: LayoutProps) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const pageTitle = title
    ? `${title} | EliteAssetInsight — Luxury Asset Auctions`
    : 'EliteAssetInsight — Luxury Asset Auctions, Private Jets & Superyacht Sales'

  const pageDesc = description ||
    'Curated daily listings of superyacht auctions, private jet sales, luxury estates, and exclusive business opportunities — for ultra-high-net-worth investors worldwide.'

  const canonicalUrl = `${SITE_URL}${router.asPath.split('?')[0]}`
  const ogImg = ogImage || DEFAULT_OG_IMAGE
  const pageKeywords = keywords || DEFAULT_KEYWORDS

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
        {/* Primary */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="keywords" content={pageKeywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Mr. Hamdan — EliteAssetInsight" />
        <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1'} />
        <meta name="googlebot" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImg} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="EliteAssetInsight — Luxury Asset Marketplace" />
        <meta property="og:locale" content="en_GB" />

        {/* Twitter / X */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={ogImg} />
        <meta name="twitter:site" content="@EliteAssetInsight" />

        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }}
        />
      </Head>

      {/* Sticky nav */}
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
            {navLinks.slice(0, 7).map(l => (
              <Link key={l.href} href={l.href} style={{
                fontSize: '0.82rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: router.pathname === l.href ? 'var(--gold)' : 'var(--text-muted)',
                transition: 'color 0.2s',
              }}>{l.label}</Link>
            ))}
          </nav>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="mobile-menu-btn"
              aria-label="Toggle menu"
              style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text)', fontSize: '1.4rem', cursor: 'pointer', padding: '0.25rem' }}
            >☰</button>
            <Link href="/membership" className="btn btn-gold" style={{ padding: '0.55rem 1.4rem', fontSize: '0.85rem' }}>
              Join Elite
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            background: 'var(--dark2)', borderBottom: '1px solid var(--border)',
            padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem',
          }}>
            {navLinks.map(l => (
              <Link key={l.href} href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{ color: router.pathname === l.href ? 'var(--gold)' : 'var(--text-muted)', fontSize: '0.95rem' }}>
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main id="main-content">{children}</main>

      {/* Footer */}
      <footer style={{ background: 'var(--dark2)', borderTop: '1px solid var(--border)', padding: '4rem 0 2rem', marginTop: '6rem' }}>
        <div className="container">
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.2rem', color: 'var(--gold)' }}>◆</span>
                <span style={{ fontFamily: 'Georgia', fontSize: '1rem', letterSpacing: '0.05em' }}>
                  Elite<strong style={{ color: 'var(--gold)' }}>Asset</strong>Insight
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '280px', lineHeight: '1.8', marginBottom: '1rem' }}>
                The world&apos;s most exclusive marketplace for luxury asset auctions, private jet sales, and superyacht listings.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                Founded by <strong style={{ color: 'var(--gold)' }}>Mr. Hamdan</strong>
              </p>
            </div>
            <div>
              <p style={{ color: 'var(--gold)', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Platform</p>
              {[['/', 'Home'], ['/listings', 'Listings'], ['/membership', 'Membership'], ['/dashboard', 'Dashboard']].map(([h, l]) => (
                <div key={h} style={{ marginBottom: '0.5rem' }}>
                  <Link href={h} style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{l}</Link>
                </div>
              ))}
            </div>
            <div>
              <p style={{ color: 'var(--gold)', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Company</p>
              {[['/about', 'About Us'], ['/trends', 'Market Trends'], ['/submit', 'List an Asset'], ['/contact', 'Contact'], ['/privacy', 'Privacy Policy'], ['/terms', 'Terms of Use']].map(([h, l]) => (
                <div key={h} style={{ marginBottom: '0.5rem' }}>
                  <Link href={h} style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{l}</Link>
                </div>
              ))}
            </div>
            <div>
              <p style={{ color: 'var(--gold)', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Categories</p>
              {['Superyachts', 'Private Jets', 'Luxury Estates', 'Business Sales', 'Rare Art', 'Vintage Cars'].map(c => (
                <div key={c} style={{ marginBottom: '0.5rem' }}>
                  <Link href={`/listings?category=${encodeURIComponent(c)}`} style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{c}</Link>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              © {new Date().getFullYear()} EliteAssetInsight.com — Founded by Mr. Hamdan. All rights reserved.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              🔒 SSL Secured · Premium listings for UHNW investors worldwide
            </p>
          </div>
        </div>
      </footer>

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/message/ELITEASSETINSIGHT"
        target="_blank"
        rel="noopener noreferrer"
        title="Chat on WhatsApp"
        style={{
          position: 'fixed', bottom: '1.8rem', right: '1.8rem', zIndex: 999,
          width: '56px', height: '56px', borderRadius: '50%',
          background: '#25d366',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(37,211,102,0.4)',
          textDecoration: 'none', fontSize: '1.5rem',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <svg viewBox="0 0 32 32" width="28" height="28" fill="white">
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.648 4.801 1.778 6.816L2 30l7.395-1.739A13.93 13.93 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.54 11.54 0 01-5.882-1.606l-.421-.252-4.39 1.032 1.065-4.276-.276-.44A11.557 11.557 0 014.4 16C4.4 9.59 9.59 4.4 16 4.4c6.41 0 11.6 5.19 11.6 11.6 0 6.41-5.19 11.6-11.6 11.6zm6.356-8.674c-.348-.174-2.063-1.018-2.382-1.134-.32-.116-.552-.174-.784.174-.232.347-.9 1.134-1.102 1.367-.203.232-.406.261-.753.087-.348-.174-1.47-.542-2.8-1.726-1.034-.922-1.732-2.062-1.935-2.41-.203-.347-.022-.535.152-.708.157-.156.348-.406.522-.61.174-.203.232-.347.348-.578.116-.232.058-.435-.029-.61-.087-.174-.784-1.888-1.074-2.586-.282-.68-.57-.587-.784-.598l-.668-.012c-.232 0-.61.087-.928.435-.32.347-1.218 1.19-1.218 2.904 0 1.714 1.247 3.37 1.42 3.602.174.232 2.455 3.748 5.95 5.256.832.36 1.481.574 1.987.735.835.266 1.595.228 2.196.138.67-.1 2.063-.843 2.354-1.658.29-.814.29-1.512.203-1.658-.087-.145-.32-.232-.668-.406z" />
        </svg>
      </a>

      <style jsx global>{`
        .desktop-nav a:hover { color: var(--gold) !important; }
        @media(max-width:960px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        @media(max-width:768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media(max-width:480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
