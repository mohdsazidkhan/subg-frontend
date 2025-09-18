export async function getServerSideProps({ res }) {
  res.setHeader('Content-Type', 'text/plain');
  res.write(`User-agent: *\nAllow: /\nSitemap: ${process.env.NEXT_PUBLIC_SITE_URL || ''}/sitemap.xml\n`);
  res.end();
  return { props: {} };
}

export default function Robots() { return null; }


