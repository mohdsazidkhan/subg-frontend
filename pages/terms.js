import UnifiedNavbar from '../src/components/UnifiedNavbar.jsx';
import UnifiedFooter from '../src/components/UnifiedFooter.jsx';
import TermsAndConditions from '../src/pages/TermsAndConditions.jsx';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps() { return { props: {} }; }

export default function Terms() {
  return (
    <>
      <UnifiedNavbar isLandingPage={false} />
      <MemoryRouter initialEntries={["/terms"]}>
        <TermsAndConditions />
      </MemoryRouter>
      <UnifiedFooter isLandingPage={false} />
    </>
  );
}


