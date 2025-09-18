import Head from 'next/head';
import UnifiedNavbar from '../../src/components/UnifiedNavbar.jsx';
import UnifiedFooter from '../../src/components/UnifiedFooter.jsx';
import ArticleDetailPage from '../../src/pages/ArticleDetailPage.jsx';
import { MemoryRouter } from 'react-router-dom';
import API from '../../src/utils/api';

export async function getServerSideProps({ params }) {
  try {
    const article = await API.getArticleBySlug(params.slug);
    let related = [];
    if (article?.category?._id) {
      const rel = await API.getArticlesByCategory(article.category._id, { limit: 3 });
      related = rel.articles || [];
    }
    return { props: { ssrData: { article, related } } };
  } catch (e) {
    return { notFound: true };
  }
}

export default function ArticleDetail({ ssrData }) {
  const title = ssrData?.article?.title || 'Article';
  const desc = ssrData?.article?.excerpt || 'Read this article on SUBG';
  return (
    <>
      <Head>
        <title>{title} | SUBG</title>
        <meta name="description" content={desc} />
      </Head>
      <UnifiedNavbar isLandingPage={false} />
      <MemoryRouter initialEntries={[`/articles/${ssrData?.article?.slug || ''}`]}>
        <ArticleDetailPage ssrData={ssrData} />
      </MemoryRouter>
      <UnifiedFooter isLandingPage={false} />
    </>
  );
}


