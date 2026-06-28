import Layout from '../components/Layout'
import { useState } from 'react'

const CATEGORIES = ['Superyacht', 'Private Jet', 'Luxury Estate', 'Business Sale', 'Rare Art', 'Vintage Car', 'Other']

interface FormData {
  contact_name: string
  contact_email: string
  company: string
  asset_title: string
  category: string
  location: string
  asking_price: string
  description: string
  agreed_commission_pct: string
  promoted_request: boolean
}

const COMMISSION_NOTE = `Our commission model is transparent and performance-based. We earn only when a sale completes via our platform. Standard rate: 2% on sales under $1M, 1.5% on $1M–$10M, and 1% above $10M.`

export default function Submit() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<FormData>({
    contact_name: '',
    contact_email: '',
    company: '',
    asset_title: '',
    category: '',
    location: '',
    asking_price: '',
    description: '',
    agreed_commission_pct: '',
    promoted_request: false,
  })

  const set = (k: keyof FormData, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <Layout title="Submission Received">
      <div className="container" style={{ textAlign: 'center', padding: '8rem 1.5rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>✅</div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Submission Received</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 2rem' }}>
          Thank you, {form.contact_name}. Our team will review your listing within 24 hours.
          {form.promoted_request && ' Your asset has been flagged for promoted placement.'}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="/listings" className="btn btn-gold">Browse Listings</a>
          <a href="/" className="btn btn-outline">Back to Home</a>
        </div>
      </div>
    </Layout>
  )

  return (
    <Layout
      title="List Your Asset"
      description="Submit your luxury asset — superyacht, private jet, luxury estate, or business — for listing on EliteAssetInsight. Free to list, commission on sale only."
    >
      <div className="page-hero">
        <div className="container">
          <p className="section-label">Free Listing</p>
          <h1>List Your Luxury Asset</h1>
          <p>Submit your asset for review. Listing is free — we earn a commission only when a sale completes.</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '6rem' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          {/* Steps */}
          <div style={{ display: 'flex', gap: '0', marginBottom: '2.5rem', background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
            {['Asset Details', 'Pricing & Commission', 'Contact Info'].map((s, i) => (
              <div key={s} style={{
                flex: 1, textAlign: 'center', padding: '0.85rem',
                background: step === i + 1 ? 'rgba(201,168,76,0.15)' : 'transparent',
                borderRight: i < 2 ? '1px solid var(--border)' : 'none',
                cursor: 'pointer',
              }} onClick={() => i < step - 1 && setStep(i + 1)}>
                <div style={{ fontSize: '0.75rem', color: step === i + 1 ? 'var(--gold)' : 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Step {i + 1}
                </div>
                <div style={{ fontSize: '0.88rem', color: step === i + 1 ? 'var(--text)' : 'var(--text-muted)', marginTop: '0.2rem' }}>{s}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1 */}
            {step === 1 && (
              <div className="card" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Asset Information</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div>
                    <label>Asset Title *</label>
                    <input required value={form.asset_title} onChange={e => set('asset_title', e.target.value)} placeholder="e.g. 2023 Azimut 78 Superyacht" />
                  </div>
                  <div className="grid-2">
                    <div>
                      <label>Category *</label>
                      <select required value={form.category} onChange={e => set('category', e.target.value)}>
                        <option value="">Select category…</option>
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label>Location *</label>
                      <input required value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Monaco, Monte Carlo" />
                    </div>
                  </div>
                  <div>
                    <label>Description *</label>
                    <textarea required rows={5} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the asset — condition, year, key features, maintenance history, inclusions…" />
                  </div>
                </div>
                <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                  <button type="button" className="btn btn-gold" onClick={() => { if (form.asset_title && form.category && form.location && form.description) setStep(2) }}>
                    Next Step →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="card" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Pricing & Commission</h2>
                <div style={{ background: 'rgba(201,168,76,0.07)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.2rem', marginBottom: '1.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                  ◆ {COMMISSION_NOTE}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div>
                    <label>Asking Price (USD) *</label>
                    <input required type="number" min="0" value={form.asking_price} onChange={e => set('asking_price', e.target.value)} placeholder="e.g. 3500000" />
                  </div>
                  <div>
                    <label>Agreed Commission % (leave blank to use standard rate)</label>
                    <input type="number" min="0" max="100" step="0.1" value={form.agreed_commission_pct} onChange={e => set('agreed_commission_pct', e.target.value)} placeholder="e.g. 1.5" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }} onClick={() => set('promoted_request', !form.promoted_request)}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '4px', border: '1px solid',
                      borderColor: form.promoted_request ? 'var(--gold)' : 'var(--border)',
                      background: form.promoted_request ? 'rgba(201,168,76,0.2)' : 'transparent',
                      flexShrink: 0, marginTop: '2px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {form.promoted_request && <span style={{ color: 'var(--gold)', fontSize: '0.8rem' }}>✓</span>}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem' }}>Request promoted placement</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Promoted listings appear at the top of search results and are included in our daily member digest.</div>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                  <button type="button" className="btn btn-gold" onClick={() => { if (form.asking_price) setStep(3) }}>Next Step →</button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="card" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Your Contact Information</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div className="grid-2">
                    <div>
                      <label>Full Name *</label>
                      <input required value={form.contact_name} onChange={e => set('contact_name', e.target.value)} placeholder="James Sterling" />
                    </div>
                    <div>
                      <label>Email Address *</label>
                      <input required type="email" value={form.contact_email} onChange={e => set('contact_email', e.target.value)} placeholder="james@company.com" />
                    </div>
                  </div>
                  <div>
                    <label>Company / Brokerage</label>
                    <input value={form.company} onChange={e => set('company', e.target.value)} placeholder="Sterling Capital Group" />
                  </div>
                </div>
                {error && <p style={{ color: '#e05c5c', marginTop: '1rem', fontSize: '0.88rem' }}>⚠ {error}</p>}
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
                  <button type="submit" className="btn btn-gold" disabled={loading}>
                    {loading ? 'Submitting…' : 'Submit Listing'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </Layout>
  )
}
