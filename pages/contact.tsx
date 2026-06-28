import Layout from '../components/Layout'
import { useState } from 'react'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const ENQUIRY_TYPES = ['General Enquiry', 'Listing Enquiry', 'Membership Support', 'Business Partnership', 'Media & Press', 'Technical Support']

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', type: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_name: form.name,
          contact_email: form.email,
          company: form.company,
          payload: { type: form.type, message: form.message },
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <Layout
      title="Contact Us"
      description="Get in touch with EliteAssetInsight. Enquire about listings, partnerships, memberships, or business opportunities."
    >
      <div className="page-hero">
        <div className="container">
          <p className="section-label">Get in Touch</p>
          <h1>Contact EliteAssetInsight</h1>
          <p>Our team of luxury asset advisors is available Monday–Friday, 9am–7pm GMT.</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem', alignItems: 'start' }}>
          {/* Contact info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { icon: '✉', label: 'Email', value: 'enquiries@eliteassetinsight.com' },
              { icon: '📞', label: 'Direct Line', value: '+44 20 7946 0321' },
              { icon: '📍', label: 'Registered', value: 'London, United Kingdom' },
            ].map(c => (
              <div key={c.label} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '1.2rem', color: 'var(--gold)', marginTop: '2px' }}>{c.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>{c.label}</div>
                    <div style={{ fontSize: '0.92rem' }}>{c.value}</div>
                  </div>
                </div>
              </div>
            ))}

            <div className="card" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.1) 0%, transparent 100%)', border: '1px solid var(--gold)' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                ◆ <strong style={{ color: 'var(--text)' }}>Elite Members</strong> receive priority support with a dedicated advisor responding within 2 hours.
              </p>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Response Times</p>
              {[
                ['General enquiries', '24 hours'],
                ['Elite members', '2 hours'],
                ['Ultra members', '30 minutes'],
              ].map(([type, time]) => (
                <div key={type} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{type}</span>
                  <span style={{ color: 'var(--gold)' }}>{time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="card" style={{ padding: '2rem' }}>
            {status === 'sent' ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Message Sent</h2>
                <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
                  Thank you, {form.name}. Our team will respond to {form.email} within the committed timeframe.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Send a Message</h2>
                <div className="grid-2">
                  <div>
                    <label>Full Name *</label>
                    <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="James Sterling" />
                  </div>
                  <div>
                    <label>Email Address *</label>
                    <input required type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="james@company.com" />
                  </div>
                </div>
                <div className="grid-2">
                  <div>
                    <label>Company / Fund</label>
                    <input value={form.company} onChange={e => set('company', e.target.value)} placeholder="Sterling Capital" />
                  </div>
                  <div>
                    <label>Enquiry Type *</label>
                    <select required value={form.type} onChange={e => set('type', e.target.value)}>
                      <option value="">Select…</option>
                      {ENQUIRY_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label>Message *</label>
                  <textarea required rows={5} value={form.message} onChange={e => set('message', e.target.value)} placeholder="Please describe your enquiry in detail…" />
                </div>
                {status === 'error' && (
                  <p style={{ color: '#e05c5c', fontSize: '0.88rem' }}>⚠ Something went wrong. Please try again or email us directly.</p>
                )}
                <button type="submit" className="btn btn-gold" disabled={status === 'sending'} style={{ alignSelf: 'flex-start' }}>
                  {status === 'sending' ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`@media(max-width:768px){div[style*="1fr 2fr"]{grid-template-columns:1fr !important;}}`}</style>
    </Layout>
  )
}
