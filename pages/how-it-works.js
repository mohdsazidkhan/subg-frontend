import UnifiedNavbar from '../src/components/UnifiedNavbar.jsx';
import UnifiedFooter from '../src/components/UnifiedFooter.jsx';
import HowItWorks from '../src/pages/HowItWorks.jsx';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps() { return { props: {} }; }

export default function HowItWorksRoute() {
  return (
    <>
      <UnifiedNavbar isLandingPage={false} />
      <MemoryRouter initialEntries={["/how-it-works"]}>
        <HowItWorks />
      </MemoryRouter>
      <UnifiedFooter isLandingPage={false} />
    </>
  );
}


