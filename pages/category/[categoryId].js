import UnifiedNavbar from '../../src/components/UnifiedNavbar.jsx';
import UnifiedFooter from '../../src/components/UnifiedFooter.jsx';
import CategoryDetailPage from '../../src/pages/CategoryDetailPage.jsx';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps({ params }) {
  return { props: { initialCategoryId: params.categoryId } };
}

export default function CategoryDetail({ initialCategoryId }) {
  return (
    <>
      <UnifiedNavbar isLandingPage={false} />
      <MemoryRouter initialEntries={[`/category/${initialCategoryId}`]}>
        <CategoryDetailPage />
      </MemoryRouter>
      <UnifiedFooter isLandingPage={false} />
    </>
  );
}


