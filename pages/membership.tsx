import Layout from '../components/Layout'
import Link from 'next/link'
import { useState } from 'react'

const PLANS = [
  {
    id: 'starter',
    name: 'Insider',
    price: { monthly: 97, yearly: 79 },
    badge: '',
    features: [
      'Daily curated listings (email digest)',
      'Access to 50+ new listings/week',
      'Basic search & filter tools',
      'Email support',
      'Cancel anytime',
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    price: { monthly: 297, yearly: 247 },
    badge: 'Most Popular',
    features: [
      'Everything in Insider',
      'Real-time listing alerts',
      'Early access — 24h before public',
      'Dedicated deal advisor',
      'Exclusive trend reports',
      'Priority support',
    ],
  },
  {
    id: 'ultra',
    name: 'Ultra',
    price: { monthly: 997, yearly: 797 },
    badge: 'Best Value',
    features: [
      'Everything in Elite',
      'Bespoke asset sourcing',
      'Direct broker introductions',
      'Private deal flow network',
      'White-glove onboarding',
      'Quarterly strategy call',
      'NDA-protected deal access',
    ],
  },
]

const PERKS = [
  { icon: '⚡', title: 'Early Access', desc: 'See premium listings 24–48 hours before they reach any other platform.' },
  { icon: '📊', title: 'Market Intelligence', desc: 'Weekly briefings on luxury asset trends, price movements, and emerging markets.' },
  { icon: '🤝', title: 'Broker Network', desc: 'Direct introductions to vetted yacht brokers, jet dealers, and estate agents.' },
  { icon: '🔒', title: 'Private Deals', desc: 'Access off-market opportunities never listed publicly.' },
]

export default function Membership() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly')

  return (
    <Layout
      title="Membership Plans"
      description="Join EliteAssetInsight and gain exclusive early access to luxury asset auctions, private jet sales, and superyacht listings before they reach the public."
    >
      <div className="page-hero">
        <div className="container">
          <p className="section-label">Membership</p>
          <h1>Exclusive Access for Serious Investors</h1>
          <p>Join 1,200+ ultra-high-net-worth members who use EliteAssetInsight to source deals before the competition.</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '6rem' }}>
        {/* Billing toggle */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex',
            background: 'var(--dark3)',
            border: '1px solid var(--border)',
            borderRadius: '50px',
            padding: '4px',
          }}>
            {(['monthly', 'yearly'] as const).map(b => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                style={{
                  padding: '0.6rem 1.8rem',
                  borderRadius: '50px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s',
                  background: billing === b ? 'var(--gold)' : 'transparent',
                  color: billing === b ? 'var(--dark)' : 'var(--text-muted)',
                  fontWeight: billing === b ? 'bold' : 'normal',
                }}
              >
                {b.charAt(0).toUpperCase() + b.slice(1)}
                {b === 'yearly' && <span style={{ fontSize: '0.75rem', marginLeft: '0.4rem' }}>–20%</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div className="grid-3" style={{ marginBottom: '5rem' }}>
          {PLANS.map(plan => (
            <div key={plan.id} className="card" style={{
              position: 'relative',
              border: plan.id === 'elite' ? '1px solid var(--gold)' : '1px solid var(--border)',
              padding: '2rem',
            }}>
              {plan.badge && (
                <div style={{
                  position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--gold)', color: 'var(--dark)', fontSize: '0.75rem',
                  fontWeight: 'bold', padding: '0.3rem 1rem', borderRadius: '50px',
                  letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                }}>
                  {plan.badge}
                </div>
              )}
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ color: 'var(--gold)', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{plan.name}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                  <span style={{ fontSize: '2.8rem', fontFamily: 'Georgia', color: 'var(--text)' }}>${plan.price[billing]}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/mo</span>
                </div>
                {billing === 'yearly' && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    Billed ${plan.price.yearly * 12}/year
                  </p>
                )}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--gold)', marginTop: '0.1rem', flexShrink: 0 }}>✓</span>
                    <span style={{ color: 'var(--text-muted)' }}>{f}</span>
                  </div>
                ))}
              </div>
              <button className={`btn ${plan.id === 'elite' ? 'btn-gold' : 'btn-outline'}`} style={{ width: '100%', textAlign: 'center' }}>
                Get Started
              </button>
            </div>
          ))}
        </div>

        {/* Perks */}
        <div style={{ marginBottom: '5rem' }}>
          <p className="section-label" style={{ textAlign: 'center' }}>Why Become a Member</p>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Members Get More</h2>
          <div className="gold-line" style={{ margin: '1rem auto 2.5rem' }} />
          <div className="grid-2" style={{ gap: '1.5rem' }}>
            {PERKS.map(p => (
              <div key={p.title} className="card" style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>{p.icon}</div>
                <div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>{p.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <p className="section-label" style={{ textAlign: 'center' }}>FAQ</p>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>Common Questions</h2>
          <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              ['Can I cancel anytime?', 'Yes. All plans are month-to-month. Annual subscribers receive a pro-rated refund on request.'],
              ['Is my payment secure?', 'All payments are processed via PayPal with full buyer protection. We never store card details.'],
              ['What assets are listed?', 'Superyachts, private jets, luxury real estate, rare art, vintage automobiles, and off-market business acquisitions.'],
              ['Can I list my own asset?', 'Yes — listing is free. We earn a commission only if a sale is completed via our platform.'],
            ].map(([q, a]) => (
              <div key={q} className="card">
                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{q}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
