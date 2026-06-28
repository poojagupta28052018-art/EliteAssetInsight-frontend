import Layout from '../components/Layout'
import Link from 'next/link'

const ARTICLES = [
  {
    date: 'June 2025',
    category: 'Superyachts',
    title: 'Superyacht Market Hits Record $8B in Q1 2025',
    excerpt: 'Demand from Middle Eastern and Asian UHNW buyers has pushed superyacht transaction volumes to an all-time high. 70m+ vessels are seeing 12-week waiting lists at top shipyards.',
    readTime: '4 min read',
  },
  {
    date: 'June 2025',
    category: 'Private Jets',
    title: 'Gulfstream G700 Resale Values Surge 18% YoY',
    excerpt: 'Supply constraints and record corporate travel budgets have driven pre-owned G700 pricing well above MSRP. Buyers are locking in deals up to 18 months before delivery.',
    readTime: '3 min read',
  },
  {
    date: 'May 2025',
    category: 'Luxury Estates',
    title: 'Monaco Land Scarcity Drives Penthouse Prices to €90K/m²',
    excerpt: 'With zero buildable land remaining, ultra-prime Monaco penthouses are commanding prices not seen since the pre-2008 boom. Demand from crypto billionaires is accelerating the trend.',
    readTime: '5 min read',
  },
  {
    date: 'May 2025',
    category: 'Business Sales',
    title: 'Private Equity Dry Powder Reaches $3.7T — What It Means for Sellers',
    excerpt: 'Record levels of uninvested capital are compressing multiples in mid-market luxury hospitality and aviation MRO businesses. Sellers in these sectors have rarely been better positioned.',
    readTime: '6 min read',
  },
  {
    date: 'April 2025',
    category: 'Rare Art',
    title: 'Contemporary Asian Art Sets Three New Auction Records in 30 Days',
    excerpt: 'Christie\'s and Sotheby\'s Hong Kong reported combined record sales as Southeast Asian collectors pivot from financial instruments to hard luxury assets amid dollar uncertainty.',
    readTime: '4 min read',
  },
  {
    date: 'April 2025',
    category: 'Investment Trends',
    title: 'Tangible Assets as Inflation Hedge: The UHNW Playbook for 2025',
    excerpt: 'From vintage Patek Philippe to Monet water lilies, high-net-worth portfolios are rotating into hard assets at a pace not seen since 2011. We break down the allocation strategies.',
    readTime: '7 min read',
  },
]

const MARKET_SUMMARY = [
  { sector: 'Superyachts (60m+)', sentiment: 'Bullish', change: '+12%', note: 'Order books full through 2027' },
  { sector: 'Business Jets (ultra-long)', sentiment: 'Bullish', change: '+7%', note: 'Supply constrained' },
  { sector: 'Monaco Real Estate', sentiment: 'Strongly Bullish', change: '+19%', note: 'Record €/m²' },
  { sector: 'Rare Art (blue chip)', sentiment: 'Bullish', change: '+21%', note: 'Asian demand driving' },
  { sector: 'Luxury Hotels (off-market)', sentiment: 'Neutral', change: '+2%', note: 'Rate pressure' },
  { sector: 'Vintage Cars (pre-1975)', sentiment: 'Bearish', change: '-4%', note: 'Market softening' },
]

const CATEGORY_COLORS: Record<string, string> = {
  Superyachts: 'var(--gold)',
  'Private Jets': '#7ecfc0',
  'Luxury Estates': '#a48fde',
  'Business Sales': '#5faef5',
  'Rare Art': '#e88f5a',
  'Investment Trends': '#e08080',
}

export default function Trends() {
  return (
    <Layout
      title="Luxury Investment Trends"
      description="Stay ahead with EliteAssetInsight's luxury investment trend reports. Expert analysis on superyacht markets, private jet valuations, luxury real estate, and rare asset investment."
    >
      <div className="page-hero">
        <div className="container">
          <p className="section-label">Market Intelligence</p>
          <h1>Luxury Asset Investment Trends</h1>
          <p>Expert analysis for ultra-high-net-worth investors navigating the global luxury asset market.</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '6rem' }}>
        {/* Market Summary Table */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--gold)' }}>📊</span> June 2025 Market Summary
          </h2>
          <div style={{ background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Sector', '12-Month Change', 'Sentiment', 'Note'].map(h => (
                    <th key={h} style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 'normal' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MARKET_SUMMARY.map((row, i) => (
                  <tr key={row.sector} style={{ borderBottom: i < MARKET_SUMMARY.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.9rem' }}>{row.sector}</td>
                    <td style={{ padding: '0.9rem 1.25rem', fontFamily: 'Georgia', color: row.change.startsWith('+') ? '#4caf76' : '#e05c5c', fontWeight: 'bold' }}>{row.change}</td>
                    <td style={{ padding: '0.9rem 1.25rem' }}>
                      <span style={{ fontSize: '0.8rem', color: row.sentiment.includes('Bullish') ? '#4caf76' : row.sentiment === 'Neutral' ? 'var(--text-muted)' : '#e05c5c' }}>{row.sentiment}</span>
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Articles */}
        <div>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Latest Reports & Analysis</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {ARTICLES.map(a => (
              <div key={a.title} className="card" style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{
                    fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: CATEGORY_COLORS[a.category] || 'var(--gold)',
                    background: 'rgba(255,255,255,0.05)',
                    padding: '0.25rem 0.7rem', borderRadius: '50px',
                    border: `1px solid ${CATEGORY_COLORS[a.category] || 'var(--border)'}30`,
                  }}>{a.category}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{a.date}</span>
                </div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', lineHeight: '1.4' }}>{a.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.7', marginBottom: '1.2rem' }}>{a.excerpt}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>📖 {a.readTime}</span>
                  <Link href="/membership" style={{ fontSize: '0.82rem', color: 'var(--gold)' }}>Read full report →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          marginTop: '4rem',
          background: 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, transparent 80%)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '3rem',
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>Get Weekly Intelligence Reports</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 2rem', fontSize: '0.95rem' }}>
            Elite and Ultra members receive comprehensive weekly briefings covering all six asset classes, plus private deal alerts.
          </p>
          <Link href="/membership" className="btn btn-gold">View Membership Plans</Link>
        </div>
      </div>
    </Layout>
  )
}
