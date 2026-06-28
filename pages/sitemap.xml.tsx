import { GetServerSideProps } from 'next'

const SITE_URL = 'https://eliteassetinsight.com'

const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/listings', priority: '0.9', changefreq: 'daily' },
  { path: '/membership', priority: '0.9', changefreq: 'weekly' },
  { path: '/trends', priority: '0.8', changefreq: 'weekly' },
  { path: '/submit', priority: '0.8', changefreq: 'monthly' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/dashboard', priority: '0.6', changefreq: 'daily' },
  { path: '/privacy', priority: '0.4', changefreq: 'yearly' },
  { path: '/terms', priority: '0.4', changefreq: 'yearly' },
]

function generateSitemap(pages: typeof STATIC_PAGES): string {
  const today = new Date().toISOString().split('T')[0]
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${pages.map(p => `  <url>
    <loc>${SITE_URL}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemap = generateSitemap(STATIC_PAGES)
  res.setHeader('Content-Type', 'text/xml; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate')
  res.write(sitemap)
  res.end()
  return { props: {} }
}

export default function Sitemap() { return null }
