import UnifiedNavbar from '../src/components/UnifiedNavbar.jsx';
import UnifiedFooter from '../src/components/UnifiedFooter.jsx';
import HomePage from '../src/pages/HomePage.js';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps() { return { props: {} }; }

export default function HomeRoute() {
  return (
    <>
      <UnifiedNavbar isLandingPage={false} />
      <MemoryRouter initialEntries={["/home"]}>
        <HomePage />
      </MemoryRouter>
      <UnifiedFooter isLandingPage={false} />
    </>
  );
}


