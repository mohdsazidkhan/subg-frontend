import UnifiedNavbar from '../../../src/components/UnifiedNavbar.jsx';
import UnifiedFooter from '../../../src/components/UnifiedFooter.jsx';
import ArticleCategoryPage from '../../../src/pages/ArticleCategoryPage.jsx';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps({ params }) {
  return { props: { initialCategoryId: params.categoryId } };
}

export default function ArticleCategory({ initialCategoryId }) {
  return (
    <>
      <UnifiedNavbar isLandingPage={false} />
      <MemoryRouter initialEntries={[`/articles/category/${initialCategoryId}`]}>
        <ArticleCategoryPage />
      </MemoryRouter>
      <UnifiedFooter isLandingPage={false} />
    </>
  );
}


