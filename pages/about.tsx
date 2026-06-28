import Layout from '../components/Layout'
import Link from 'next/link'

const VALUES = [
  { icon: '◆', title: 'Transparency', desc: 'We publish our commission rates upfront. No hidden fees, no ambiguity. Every seller knows exactly what they pay.' },
  { icon: '🔒', title: 'Discretion', desc: 'NDA-protected deal flow. Seller and buyer identities are never disclosed without explicit written consent.' },
  { icon: '⚡', title: 'Speed', desc: 'Every serious enquiry receives a response within 24 hours from a dedicated asset advisor.' },
  { icon: '🌍', title: 'Global Network', desc: 'Vetted brokers and principals across 98 countries, active in every major luxury asset market.' },
]

const TEAM = [
  {
    name: 'Mr. Hamdan',
    role: 'Founder & Owner',
    bio: 'Visionary entrepreneur and luxury asset specialist. Mr. Hamdan founded EliteAssetInsight with a mission to bring radical transparency and global reach to the world\'s most exclusive asset transactions.',
    highlight: true,
  },
  {
    name: 'Isabelle Fontaine',
    role: 'Head of Acquisitions',
    bio: 'Former Christie\'s specialist with 18 years of experience in rare art, vintage automobiles, and trophy real estate across Europe and the Middle East.',
    highlight: false,
  },
  {
    name: 'Marcus Chen',
    role: 'Chief Technology Officer',
    bio: 'Built AI-powered deal sourcing platforms for leading hedge funds before joining EliteAssetInsight. Expert in luxury market data intelligence.',
    highlight: false,
  },
]

const MILESTONES = [
  ['2023', 'EliteAssetInsight founded by Mr. Hamdan'],
  ['2024', 'Reached $1B+ in total listed asset value'],
  ['2024', 'Expanded coverage to 98 countries'],
  ['2024', 'First $100M private deal closed via platform'],
  ['2025', '1,200+ active elite members worldwide'],
  ['2025', 'Launch of AI-powered listing intelligence'],
]

const PERSON_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Mr. Hamdan',
  jobTitle: 'Founder & Owner',
  worksFor: { '@type': 'Organization', name: 'EliteAssetInsight', url: 'https://eliteassetinsight.com' },
  description: 'Founder and Owner of EliteAssetInsight, the world\'s most exclusive luxury asset marketplace.',
}

export default function About() {
  return (
    <Layout
      title="About Us — Founded by Mr. Hamdan"
      description="EliteAssetInsight was founded by Mr. Hamdan to bring transparency, speed, and global reach to the world's most exclusive luxury asset transactions. Learn about our mission, team, and values."
      keywords="EliteAssetInsight founder, Mr. Hamdan luxury assets, about elite asset insight, luxury asset marketplace founders, UHNW investment platform"
    >
      {/* JSON-LD for founder */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }}
      />

      <div className="page-hero">
        <div className="container">
          <p className="section-label">Our Story</p>
          <h1>Built for the World&apos;s Most Discerning Investors</h1>
          <p>EliteAssetInsight was founded by <strong style={{ color: 'var(--gold)' }}>Mr. Hamdan</strong> on a simple premise: ultra-premium asset transactions deserve a platform built to the same standard.</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '6rem' }}>

        {/* Mission */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '5rem', alignItems: 'center' }} className="mission-grid">
          <div>
            <p className="section-label">Mission</p>
            <h2 className="section-title">Connecting Capital with Exceptional Opportunities</h2>
            <div className="gold-line" />
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.9', marginBottom: '1.5rem' }}>
              The global luxury asset market moves at the speed of relationships — but finding the right deal has always required the right introduction. EliteAssetInsight changes that.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.9', marginBottom: '2rem' }}>
              We aggregate and curate the world&apos;s most exclusive superyacht listings, private jet sales, trophy real estate, and off-market business acquisition opportunities — presenting them in one elegant platform built for serious investors.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/listings" className="btn btn-gold">Explore Listings</Link>
              <Link href="/contact" className="btn btn-outline">Get in Touch</Link>
            </div>
          </div>
          <div style={{ background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2.5rem' }}>
            <p style={{ color: 'var(--gold)', fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Company Timeline</p>
            {MILESTONES.map(([year, event]) => (
              <div key={event} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                <div style={{ color: 'var(--gold)', fontSize: '0.85rem', fontFamily: 'Georgia', minWidth: '44px', paddingTop: '2px' }}>{year}</div>
                <div style={{ flex: 1, borderLeft: '1px solid var(--border)', paddingLeft: '1.2rem', color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>{event}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div style={{ marginBottom: '5rem' }}>
          <p className="section-label" style={{ textAlign: 'center' }}>Leadership</p>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Founder &amp; Team</h2>
          <div className="gold-line" style={{ margin: '1rem auto 2.5rem' }} />
          <div className="grid-3">
            {TEAM.map(m => (
              <div key={m.name} className="card" style={{
                textAlign: 'center', padding: '2rem',
                border: m.highlight ? '1px solid var(--gold)' : '1px solid var(--border)',
                background: m.highlight ? 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, var(--dark3) 100%)' : 'var(--dark3)',
                position: 'relative',
              }}>
                {m.highlight && (
                  <div style={{
                    position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--gold)', color: 'var(--dark)', fontSize: '0.7rem',
                    fontWeight: 'bold', padding: '0.25rem 1rem', borderRadius: '50px',
                    letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                  }}>Founder &amp; Owner</div>
                )}
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: m.highlight
                    ? 'linear-gradient(135deg, var(--gold), #8b6914)'
                    : 'linear-gradient(135deg, var(--dark4), #333)',
                  margin: '0 auto 1.2rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.8rem', color: m.highlight ? 'var(--dark)' : 'var(--text-muted)',
                  fontFamily: 'Georgia', border: m.highlight ? '2px solid var(--gold)' : 'none',
                }}>
                  {m.name.charAt(0)}
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>{m.name}</h3>
                <p style={{ color: 'var(--gold)', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{m.role}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.7' }}>{m.bio}</p>
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
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.7' }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, transparent 100%)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '3rem', marginBottom: '4rem' }}>
          <p className="section-label" style={{ textAlign: 'center' }}>By the Numbers</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2rem', textAlign: 'center', marginTop: '1.5rem' }} className="stats-grid">
            {[
              ['$2.4B+', 'Total assets listed'],
              ['98', 'Countries served'],
              ['1,200+', 'Elite members'],
              ['2%', 'Max commission rate'],
            ].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontSize: '2rem', color: 'var(--gold)', fontFamily: 'Georgia', marginBottom: '0.4rem' }}>{v}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>Ready to Explore?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '460px', margin: '0 auto 2rem' }}>
            Browse today&apos;s curated listings or submit your asset. No listing fee — commission only on completed sales.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/listings" className="btn btn-gold">Browse Listings</Link>
            <Link href="/contact" className="btn btn-outline">Contact Mr. Hamdan&apos;s Team</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .mission-grid { grid-template-columns: 1fr 1fr; }
        .stats-grid { grid-template-columns: repeat(4,1fr); }
        @media(max-width:768px) {
          .mission-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </Layout>
  )
}
