import UnifiedNavbar from '../../src/components/UnifiedNavbar.jsx';
import UnifiedFooter from '../../src/components/UnifiedFooter.jsx';
import PayuSuccess from '../../src/pages/PayuSuccess.jsx';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps() { return { props: {} }; }

export default function PayuSuccessRoute() {
  return (
    <>
      <UnifiedNavbar isLandingPage={false} />
      <MemoryRouter initialEntries={["/subscription/payu-success"]}>
        <PayuSuccess />
      </MemoryRouter>
      <UnifiedFooter isLandingPage={false} />
    </>
  );
}


