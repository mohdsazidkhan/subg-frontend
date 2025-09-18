import UnifiedNavbar from '../src/components/UnifiedNavbar.jsx';
import UnifiedFooter from '../src/components/UnifiedFooter.jsx';
import PrivacyPolicy from '../src/pages/PrivacyPolicy.jsx';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps() { return { props: {} }; }

export default function Privacy() {
  return (
    <>
      <UnifiedNavbar isLandingPage={false} />
      <MemoryRouter initialEntries={["/privacy"]}>
        <PrivacyPolicy />
      </MemoryRouter>
      <UnifiedFooter isLandingPage={false} />
    </>
  );
}


