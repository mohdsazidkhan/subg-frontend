import UnifiedNavbar from '../src/components/UnifiedNavbar.jsx';
import UnifiedFooter from '../src/components/UnifiedFooter.jsx';
import LandingPage from '../src/pages/LandingPage.jsx';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps() { return { props: {} }; }

export default function Home() {
  return (
    <>
      <UnifiedNavbar isLandingPage={true} />
      <MemoryRouter initialEntries={["/"]}>
        <LandingPage />
      </MemoryRouter>
      <UnifiedFooter isLandingPage={true} />
    </>
  );
}


