import API from '../src/utils/api';

export async function getServerSideProps({ res }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  let urls = [
    '',
    '/articles'
  ];
  try {
    const { articles = [] } = await API.getPublishedArticles({ page: 1, limit: 100 });
    urls = urls.concat(articles.map(a => `/articles/${a.slug}`));
  } catch (e) {}

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls.map(path => `\n  <url><loc>${baseUrl}${path}</loc></url>`).join('') +
    `\n</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.write(xml);
  res.end();
  return { props: {} };
}

export default function Sitemap() { return null; }


