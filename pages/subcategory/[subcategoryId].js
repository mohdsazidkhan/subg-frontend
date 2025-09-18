import UnifiedNavbar from '../../src/components/UnifiedNavbar.jsx';
import UnifiedFooter from '../../src/components/UnifiedFooter.jsx';
import SubcategoryDetailPage from '../../src/pages/SubcategoryDetailPage.jsx';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps({ params }) {
  return { props: { initialSubcategoryId: params.subcategoryId } };
}

export default function SubcategoryDetail({ initialSubcategoryId }) {
  return (
    <>
      <UnifiedNavbar isLandingPage={false} />
      <MemoryRouter initialEntries={[`/subcategory/${initialSubcategoryId}`]}>
        <SubcategoryDetailPage />
      </MemoryRouter>
      <UnifiedFooter isLandingPage={false} />
    </>
  );
}


