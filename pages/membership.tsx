import Layout from '../components/Layout'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const PLANS = [
  {
    id: 'insider',
    name: 'Insider',
    price: { monthly: 97, annual: 970 },
    badge: '',
    color: false,
    features: [
      'Daily curated listing digest (email)',
      'Access to 50+ new listings per week',
      'Basic search and filter tools',
      'Market trend summaries',
      'Email support',
      'Cancel anytime',
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    price: { monthly: 297, annual: 2970 },
    badge: 'Most Popular',
    color: true,
    features: [
      'Everything in Insider',
      'Real-time listing alerts (instant)',
      'Early access — 24h before public',
      'Dedicated deal advisor',
      'Exclusive weekly trend reports',
      'Priority support',
      'Off-market deal access',
    ],
  },
  {
    id: 'ultra',
    name: 'Ultra',
    price: { monthly: 997, annual: 9970 },
    badge: 'Best Value',
    color: false,
    features: [
      'Everything in Elite',
      'Bespoke asset sourcing',
      'Direct broker introductions',
      'Private deal flow network',
      'White-glove onboarding call',
      'Quarterly strategy session',
      'NDA-protected deal access',
    ],
  },
]

const PERKS = [
  { icon: '⚡', title: 'Early Access', desc: 'See premium listings 24–48 hours before they reach any other platform.' },
  { icon: '📊', title: 'Market Intelligence', desc: 'Weekly briefings on luxury asset trends, price movements, and emerging markets.' },
  { icon: '🤝', title: 'Broker Network', desc: 'Direct introductions to vetted yacht brokers, jet dealers, and estate agents.' },
  { icon: '🔒', title: 'Private Deals', desc: 'Access off-market opportunities never listed publicly — NDA on request.' },
]

export default function Membership() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const [loading, setLoading] = useState<string | null>(null)
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (router.query.success === 'true') {
      setNotice({ type: 'success', msg: `Welcome to EliteAssetInsight! Your ${router.query.plan || ''} membership is now active.` })
    } else if (router.query.cancelled === 'true') {
      setNotice({ type: 'error', msg: 'Payment cancelled. You have not been charged.' })
    }
  }, [router.query])

  const handleJoin = async (planId: string) => {
    const planKey = `${planId}_${billing}`
    setLoading(planKey)
    setNotice(null)
    try {
      const res = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create order')
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl
      } else {
        throw new Error('No PayPal approval URL returned')
      }
    } catch (e: any) {
      setNotice({ type: 'error', msg: e.message || 'Payment error. Please try again.' })
    } finally {
      setLoading(null)
    }
  }

  return (
    <Layout
      title="Membership Plans — Join Elite"
      description="Join EliteAssetInsight membership and gain early access to superyacht auctions, private jet sales, and luxury estate listings before the public. Plans from $97/month."
      keywords="luxury asset membership, elite investor club, superyacht alert service, private jet listing alerts, UHNW membership, luxury investment membership"
    >
      <div className="page-hero">
        <div className="container">
          <p className="section-label">Elite Membership</p>
          <h1>Exclusive Access for Serious Investors</h1>
          <p>Join 1,200+ ultra-high-net-worth members who use EliteAssetInsight to source deals before the competition.</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '6rem' }}>

        {/* Success/Cancel notice */}
        {notice && (
          <div style={{
            background: notice.type === 'success' ? 'rgba(37,200,100,0.1)' : 'rgba(220,60,60,0.1)',
            border: `1px solid ${notice.type === 'success' ? '#25c864' : '#dc3c3c'}`,
            borderRadius: 'var(--radius)', padding: '1.2rem 1.5rem', marginBottom: '2rem',
            color: notice.type === 'success' ? '#25c864' : '#e05c5c', textAlign: 'center',
          }}>
            {notice.type === 'success' ? '✅ ' : '⚠️ '}{notice.msg}
          </div>
        )}

        {/* Billing toggle */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex', background: 'var(--dark3)',
            border: '1px solid var(--border)', borderRadius: '50px', padding: '4px',
          }}>
            {(['monthly', 'annual'] as const).map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{
                padding: '0.6rem 1.8rem', borderRadius: '50px', border: 'none',
                cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem', transition: 'all 0.2s',
                background: billing === b ? 'var(--gold)' : 'transparent',
                color: billing === b ? 'var(--dark)' : 'var(--text-muted)',
                fontWeight: billing === b ? 'bold' : 'normal',
              }}>
                {b.charAt(0).toUpperCase() + b.slice(1)}
                {b === 'annual' && <span style={{ fontSize: '0.72rem', marginLeft: '0.4rem' }}>Save 17%</span>}
              </button>
            ))}
          </div>
          {billing === 'annual' && (
            <p style={{ color: 'var(--gold)', fontSize: '0.82rem', marginTop: '0.75rem' }}>
              ◆ Annual billing saves you up to $2,994/year
            </p>
          )}
        </div>

        {/* Plans */}
        <div className="grid-3" style={{ marginBottom: '5rem', alignItems: 'stretch' }}>
          {PLANS.map(plan => {
            const planKey = `${plan.id}_${billing}`
            const isLoading = loading === planKey
            const price = billing === 'monthly' ? plan.price.monthly : plan.price.annual
            return (
              <div key={plan.id} className="card" style={{
                position: 'relative', padding: '2rem',
                border: plan.color ? '1px solid var(--gold)' : '1px solid var(--border)',
                background: plan.color ? 'linear-gradient(135deg,rgba(201,168,76,0.06) 0%,var(--dark3) 100%)' : 'var(--dark3)',
                display: 'flex', flexDirection: 'column',
              }}>
                {plan.badge && (
                  <div style={{
                    position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--gold)', color: 'var(--dark)', fontSize: '0.72rem',
                    fontWeight: 'bold', padding: '0.3rem 1rem', borderRadius: '50px',
                    letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                  }}>{plan.badge}</div>
                )}
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ color: 'var(--gold)', fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{plan.name}</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                    <span style={{ fontSize: '2.8rem', fontFamily: 'Georgia' }}>${price}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>/{billing === 'annual' ? 'year' : 'mo'}</span>
                  </div>
                  {billing === 'monthly' && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.2rem' }}>
                      or ${plan.price.annual}/year (save 17%)
                    </p>
                  )}
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginBottom: '1.5rem', flex: 1 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.75rem', fontSize: '0.88rem' }}>
                      <span style={{ color: 'var(--gold)', marginTop: '0.1rem', flexShrink: 0 }}>✓</span>
                      <span style={{ color: 'var(--text-muted)' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => handleJoin(plan.id)}
                  disabled={!!loading}
                  className={`btn ${plan.color ? 'btn-gold' : 'btn-outline'}`}
                  style={{ width: '100%', textAlign: 'center', opacity: loading && !isLoading ? 0.5 : 1 }}
                >
                  {isLoading ? 'Redirecting to PayPal…' : `Join ${plan.name} via PayPal`}
                </button>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '0.75rem' }}>
                  💳 PayPal secured · Cancel anytime
                </p>
              </div>
            )
          })}
        </div>

        {/* PayPal trust note */}
        <div style={{ textAlign: 'center', marginBottom: '4rem', padding: '1.5rem', background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            💳 All payments are processed securely by <strong style={{ color: 'var(--text)' }}>PayPal</strong>. You do not need a PayPal account — pay with any major card. We never store your payment details.
          </p>
        </div>

        {/* Perks */}
        <div style={{ marginBottom: '5rem' }}>
          <p className="section-label" style={{ textAlign: 'center' }}>Why Join</p>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Members Get More</h2>
          <div className="gold-line" style={{ margin: '1rem auto 2.5rem' }} />
          <div className="grid-2" style={{ gap: '1.5rem' }}>
            {PERKS.map(p => (
              <div key={p.title} className="card" style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>{p.icon}</div>
                <div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>{p.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{p.desc}</p>
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
              ['Can I cancel anytime?', 'Yes. All plans are flexible. Cancel before your next billing date and you will not be charged again. No questions asked.'],
              ['Is my payment secure?', 'All payments are processed via PayPal with full buyer protection. We never see or store your card details.'],
              ['What assets are listed?', 'Superyachts, private jets, luxury real estate, rare art, vintage automobiles, and off-market business acquisitions — added automatically every day.'],
              ['Can I list my own asset?', 'Yes — listing is free. We earn a commission only when a sale is completed via our platform. No upfront cost.'],
              ['Do I need a PayPal account?', 'No. PayPal allows payment by credit or debit card with no account needed. Simply select "Pay as guest" on the PayPal page.'],
            ].map(([q, a]) => (
              <div key={q} className="card">
                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{q}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.7' }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
