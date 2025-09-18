import Head from 'next/head';
import UnifiedNavbar from '../../src/components/UnifiedNavbar.jsx';
import UnifiedFooter from '../../src/components/UnifiedFooter.jsx';
import ArticlesPage from '../../src/pages/ArticlesPage.jsx';
import { MemoryRouter } from 'react-router-dom';
import API from '../../src/utils/api';

export async function getServerSideProps(context) {
  // Map query params for the existing page API
  const { page = 1, search = '', category = '', featured = '' } = context.query || {};
  try {
    const params = { page, limit: 9 };
    if (search) params.search = search;
    if (category) params.category = category;
    if (featured) params.featured = featured === 'true';

    const [articlesResp, categoriesResp] = await Promise.all([
      API.getPublishedArticles(params),
      API.getPublicCategories()
    ]);

    return {
      props: {
        ssrData: {
          articles: articlesResp.articles || [],
          pagination: articlesResp.pagination || {},
          categories: categoriesResp || []
        }
      }
    };
  } catch (e) {
    return { props: { ssrData: { articles: [], pagination: {}, categories: [], error: 'Failed to load' } } };
  }
}

export default function Articles({ ssrData }) {
  return (
    <>
      <Head>
        <title>Articles | SUBG</title>
        <meta name="description" content="Read articles and insights from SUBG." />
      </Head>
      <UnifiedNavbar isLandingPage={false} />
      <MemoryRouter initialEntries={["/articles"]}>
        <ArticlesPage ssrData={ssrData} />
      </MemoryRouter>
      <UnifiedFooter isLandingPage={false} />
    </>
  );
}


