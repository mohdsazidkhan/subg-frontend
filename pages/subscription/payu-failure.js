import UnifiedNavbar from '../../src/components/UnifiedNavbar.jsx';
import UnifiedFooter from '../../src/components/UnifiedFooter.jsx';
import PayuFailure from '../../src/pages/PayuFailure.jsx';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps() { return { props: {} }; }

export default function PayuFailureRoute() {
  return (
    <>
      <UnifiedNavbar isLandingPage={false} />
      <MemoryRouter initialEntries={["/subscription/payu-failure"]}>
        <PayuFailure />
      </MemoryRouter>
      <UnifiedFooter isLandingPage={false} />
    </>
  );
}


