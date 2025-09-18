import UnifiedNavbar from '../src/components/UnifiedNavbar.jsx';
import UnifiedFooter from '../src/components/UnifiedFooter.jsx';
import AboutUs from '../src/pages/AboutUs.jsx';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps() { return { props: {} }; }

export default function About() {
  return (
    <>
      <UnifiedNavbar isLandingPage={false} />
      <MemoryRouter initialEntries={["/about"]}>
        <AboutUs />
      </MemoryRouter>
      <UnifiedFooter isLandingPage={false} />
    </>
  );
}


