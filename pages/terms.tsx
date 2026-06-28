import Layout from '../components/Layout'

export default function Terms() {
  const sections = [
    {
      title: 'Acceptance of Terms',
      body: `By accessing or using EliteAssetInsight.com, you agree to be bound by these Terms of Use. If you do not agree, please do not use the platform. These terms apply to all visitors, members, and businesses who submit listings.`,
    },
    {
      title: 'Use of the Platform',
      body: `EliteAssetInsight is a curated marketplace for luxury asset listings. You may browse listings, submit enquiries, and list assets for sale. You agree not to misuse the platform, submit false listings, or use automated tools to scrape or copy content without written permission.`,
    },
    {
      title: 'Listing Submissions',
      body: `By submitting an asset for listing, you confirm that you have the legal right to sell or represent that asset. You agree to the commission structure displayed at submission. Listings are subject to verification and may be rejected at our discretion. We reserve the right to remove any listing that violates these terms.`,
    },
    {
      title: 'Commission & Payments',
      body: `Listing on EliteAssetInsight is free of charge. A commission is earned by EliteAssetInsight only when a sale is completed via our platform. The agreed commission percentage is disclosed before listing is approved. Payments are processed via PayPal and are subject to PayPal's terms of service.`,
    },
    {
      title: 'Membership',
      body: `Membership grants access to premium features including early listing access, market reports, and priority support. Memberships are billed monthly or annually as selected. You may cancel at any time; no refunds are provided for partial billing periods unless required by applicable law.`,
    },
    {
      title: 'Intellectual Property',
      body: `All content on EliteAssetInsight.com — including text, design, logos, and data — is the property of EliteAssetInsight and its founder Mr. Hamdan. You may not reproduce, distribute, or create derivative works without prior written consent.`,
    },
    {
      title: 'Disclaimer of Warranties',
      body: `EliteAssetInsight provides the platform "as is" without warranties of any kind. We do not guarantee the accuracy of listing data, asset valuations, or market reports. All investment decisions are made at your own risk. We strongly recommend independent due diligence before any asset purchase.`,
    },
    {
      title: 'Limitation of Liability',
      body: `To the maximum extent permitted by law, EliteAssetInsight shall not be liable for any indirect, incidental, or consequential damages arising from use of the platform. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.`,
    },
    {
      title: 'Governing Law',
      body: `These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.`,
    },
    {
      title: 'Contact',
      body: `Questions about these terms? Contact us at enquiries@eliteassetinsight.com. These terms were last updated June 2025.`,
    },
  ]

  return (
    <Layout
      title="Terms of Use"
      description="EliteAssetInsight terms of use — rules governing use of the platform, listing submissions, membership, and payments."
    >
      <div className="page-hero">
        <div className="container">
          <p className="section-label">Legal</p>
          <h1>Terms of Use</h1>
          <p>Please read these terms carefully before using EliteAssetInsight.com.</p>
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
