import Layout from '../components/Layout'

export default function Privacy() {
  const sections = [
    {
      title: 'Information We Collect',
      body: `We collect information you provide directly to us when you submit an asset listing, contact us, or sign up for membership. This includes your name, email address, company name, and any asset information you choose to share. We also collect standard web analytics data (pages visited, time on site, referring URL) to improve our service.`,
    },
    {
      title: 'How We Use Your Information',
      body: `We use your information to respond to enquiries, process listing submissions, send membership updates, and improve our platform. We do not sell your personal information to third parties under any circumstances. Your contact details are only used to facilitate genuine asset enquiries.`,
    },
    {
      title: 'Data Security',
      body: `All data is transmitted over SSL/TLS encrypted connections. We store data in Supabase, a SOC 2 Type II certified platform. Access to your personal data is restricted to authorised team members only. We perform regular security audits to ensure your data remains protected.`,
    },
    {
      title: 'Cookies',
      body: `We use essential cookies necessary for website functionality and analytics cookies to understand how visitors use our site. You can disable non-essential cookies in your browser settings. We do not use advertising cookies or cross-site tracking.`,
    },
    {
      title: 'Payments',
      body: `Payments are processed by PayPal. We do not store your payment card details on our servers. All payment transactions are handled directly by PayPal under their privacy policy and security standards.`,
    },
    {
      title: 'Your Rights',
      body: `You have the right to access, correct, or delete your personal data at any time. To exercise these rights, contact us at enquiries@eliteassetinsight.com. We will respond within 30 days. You may also withdraw consent to marketing communications at any time.`,
    },
    {
      title: 'Contact',
      body: `For any privacy-related questions, contact us at enquiries@eliteassetinsight.com or write to EliteAssetInsight, London, United Kingdom. This policy was last updated June 2025.`,
    },
  ]

  return (
    <Layout
      title="Privacy Policy"
      description="EliteAssetInsight privacy policy — how we collect, use, and protect your personal data."
    >
      <div className="page-hero">
        <div className="container">
          <p className="section-label">Legal</p>
          <h1>Privacy Policy</h1>
          <p>How EliteAssetInsight collects, uses, and protects your personal information.</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '6rem', maxWidth: '800px' }}>
        <div style={{ background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem', marginBottom: '2.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
          <strong style={{ color: 'var(--gold)' }}>Effective Date:</strong> 1 June 2025 &nbsp;|&nbsp;
          <strong style={{ color: 'var(--gold)' }}>Owner:</strong> Mr. Hamdan, EliteAssetInsight.com
        </div>

        {sections.map(s => (
          <div key={s.title} style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>{s.title}</h2>
            <div style={{ height: '2px', width: '40px', background: 'linear-gradient(90deg, var(--gold), transparent)', marginBottom: '1rem' }} />
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.9', fontSize: '0.95rem' }}>{s.body}</p>
          </div>
        ))}
      </div>
    </Layout>
  )
}
