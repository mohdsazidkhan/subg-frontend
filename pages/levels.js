import UnifiedNavbar from '../src/components/UnifiedNavbar.jsx';
import UnifiedFooter from '../src/components/UnifiedFooter.jsx';
import LevelsPage from '../src/pages/LevelsPage.jsx';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps() { return { props: {} }; }

export default function Levels() {
  return (
    <>
      <UnifiedNavbar isLandingPage={false} />
      <MemoryRouter initialEntries={["/levels"]}>
        <LevelsPage />
      </MemoryRouter>
      <UnifiedFooter isLandingPage={false} />
    </>
  );
}


