import UnifiedNavbar from '../src/components/UnifiedNavbar.jsx';
import UnifiedFooter from '../src/components/UnifiedFooter.jsx';
import ContactUs from '../src/pages/ContactUs.jsx';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps() { return { props: {} }; }

export default function Contact() {
  return (
    <>
      <UnifiedNavbar isLandingPage={false} />
      <MemoryRouter initialEntries={["/contact"]}>
        <ContactUs />
      </MemoryRouter>
      <UnifiedFooter isLandingPage={false} />
    </>
  );
}


