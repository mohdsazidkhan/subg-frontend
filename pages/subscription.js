import UnifiedNavbar from '../src/components/UnifiedNavbar.jsx';
import UnifiedFooter from '../src/components/UnifiedFooter.jsx';
import SubscriptionPage from '../src/pages/SubscriptionPage.jsx';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps() { return { props: {} }; }

export default function Subscription() {
  return (
    <>
      <UnifiedNavbar isLandingPage={false} />
      <MemoryRouter initialEntries={["/subscription"]}>
        <SubscriptionPage />
      </MemoryRouter>
      <UnifiedFooter isLandingPage={false} />
    </>
  );
}


