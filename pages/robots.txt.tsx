import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const SITE_URL = 'https://eliteassetinsight.com'

  const robots = `User-agent: *
Allow: /

Disallow: /api/
Disallow: /dashboard
Disallow: /_next/

User-agent: Googlebot
Allow: /
Disallow: /api/
Disallow: /dashboard

User-agent: Bingbot
Allow: /
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml

Host: ${SITE_URL}
`

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=86400')
  res.write(robots)
  res.end()
  return { props: {} }
}

export default function Robots() { return null }
