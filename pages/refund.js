import UnifiedNavbar from '../src/components/UnifiedNavbar.jsx';
import UnifiedFooter from '../src/components/UnifiedFooter.jsx';
import RefundPolicy from '../src/pages/RefundPolicy.jsx';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps() { return { props: {} }; }

export default function Refund() {
  return (
    <>
      <UnifiedNavbar isLandingPage={false} />
      <MemoryRouter initialEntries={["/refund"]}>
        <RefundPolicy />
      </MemoryRouter>
      <UnifiedFooter isLandingPage={false} />
    </>
  );
}


