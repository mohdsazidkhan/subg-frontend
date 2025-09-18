import UnifiedNavbar from '../../../src/components/UnifiedNavbar.jsx';
import UnifiedFooter from '../../../src/components/UnifiedFooter.jsx';
import ArticleTagPage from '../../../src/pages/ArticleTagPage.jsx';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps({ params }) {
  return { props: { initialTag: params.tagName } };
}

export default function ArticleTag({ initialTag }) {
  return (
    <>
      <UnifiedNavbar isLandingPage={false} />
      <MemoryRouter initialEntries={[`/articles/tag/${encodeURIComponent(initialTag)}`]}>
        <ArticleTagPage />
      </MemoryRouter>
      <UnifiedFooter isLandingPage={false} />
    </>
  );
}


