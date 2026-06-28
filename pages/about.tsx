import Layout from '../components/Layout'
import Link from 'next/link'

const VALUES = [
  { icon: '◆', title: 'Transparency', desc: 'We publish our commission rates upfront. No hidden fees, no ambiguity.' },
  { icon: '🔒', title: 'Discretion', desc: 'NDA-protected deal flow. Seller and buyer identities are never disclosed without consent.' },
  { icon: '⚡', title: 'Speed', desc: 'Every serious enquiry receives a response within 24 hours from a dedicated advisor.' },
  { icon: '🌍', title: 'Global Network', desc: 'Vetted brokers and principals across 98 countries, active in every major luxury market.' },
]

const TEAM = [
  { name: 'Alexander Worthington', role: 'Founder & CEO', bio: '20+ years in private wealth management and luxury asset brokerage across Europe and the Gulf.' },
  { name: 'Isabelle Fontaine', role: 'Head of Acquisitions', bio: 'Former Christie\'s specialist. Expert in rare art, vintage automobiles, and trophy real estate.' },
  { name: 'Marcus Chen', role: 'Chief Technology Officer', bio: 'Built AI-powered deal sourcing platforms for leading hedge funds before joining EliteAssetInsight.' },
]

export default function About() {
  return (
    <Layout
      title="About Us"
      description="EliteAssetInsight was founded to bring transparency, speed, and global reach to the world's most exclusive asset transactions. Learn about our mission and team."
    >
      <div className="page-hero">
        <div className="container">
          <p className="section-label">Our Story</p>
          <h1>Built for the World&apos;s Most Discerning Investors</h1>
          <p>EliteAssetInsight was founded on a simple premise: ultra-premium asset transactions deserve a platform built to the same standard.</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '6rem' }}>
        {/* Mission */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '5rem', alignItems: 'center' }}>
          <div>
            <p className="section-label">Mission</p>
            <h2 className="section-title">Connecting Capital with Exceptional Opportunities</h2>
            <div className="gold-line" />
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.9', marginBottom: '1.5rem' }}>
              The global luxury asset market moves at the speed of relationships — but finding the right deal has always required the right introduction. EliteAssetInsight changes that.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.9', marginBottom: '2rem' }}>
              We aggregate and curate the world&apos;s most exclusive superyacht listings, private jet sales, trophy real estate, and off-market business acquisition opportunities — presenting them in a single, elegant platform engineered for serious investors.
            </p>
            <Link href="/listings" className="btn btn-gold">Explore Listings</Link>
          </div>
          <div style={{ background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2.5rem' }}>
            {[
              ['2023', 'EliteAssetInsight founded'],
              ['2024', 'Reached $1B in listed assets'],
              ['2024', 'Expanded to 50+ countries'],
              ['2025', '1,200+ active elite members'],
              ['2025', 'First $100M private deal closed'],
            ].map(([year, event]) => (
              <div key={event} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                <div style={{ color: 'var(--gold)', fontSize: '0.85rem', fontFamily: 'Georgia', minWidth: '44px', paddingTop: '2px' }}>{year}</div>
                <div style={{ flex: 1, borderLeft: '1px solid var(--border)', paddingLeft: '1.2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{event}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div style={{ marginBottom: '5rem' }}>
          <p className="section-label" style={{ textAlign: 'center' }}>Our Values</p>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>What We Stand For</h2>
          <div className="gold-line" style={{ margin: '1rem auto 2.5rem' }} />
          <div className="grid-2" style={{ gap: '1.5rem' }}>
            {VALUES.map(v => (
              <div key={v.title} className="card" style={{ display: 'flex', gap: '1.2rem' }}>
                <div style={{ fontSize: '1.5rem', color: 'var(--gold)', flexShrink: 0 }}>{v.icon}</div>
                <div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>{v.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div style={{ marginBottom: '5rem' }}>
          <p className="section-label" style={{ textAlign: 'center' }}>The Team</p>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Founders & Leadership</h2>
          <div className="gold-line" style={{ margin: '1rem auto 2.5rem' }} />
          <div className="grid-3">
            {TEAM.map(m => (
              <div key={m.name} className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--gold), var(--dark4))',
                  margin: '0 auto 1.2rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', color: 'var(--dark)',
                }}>
                  {m.name.charAt(0)}
                </div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.3rem' }}>{m.name}</h3>
                <p style={{ color: 'var(--gold)', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{m.role}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.7' }}>{m.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>Ready to Explore?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '460px', margin: '0 auto 2rem' }}>
            Browse today&apos;s curated listings or list your own asset. No listing fee — we earn only on completed sales.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/listings" className="btn btn-gold">Browse Listings</Link>
            <Link href="/contact" className="btn btn-outline">Get in Touch</Link>
          </div>
        </div>
      </div>

      <style jsx>{`@media(max-width:768px){div[style*="1fr 1fr"]{grid-template-columns:1fr !important;}}`}</style>
    </Layout>
  )
}
