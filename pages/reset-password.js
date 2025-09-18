import UnifiedNavbar from '../src/components/UnifiedNavbar.jsx';
import UnifiedFooter from '../src/components/UnifiedFooter.jsx';
import ResetPasswordPage from '../src/pages/ResetPasswordPage.jsx';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps() { return { props: {} }; }

export default function ResetPassword() {
  return (
    <>
      <UnifiedNavbar isLandingPage={false} />
      <MemoryRouter initialEntries={["/reset-password"]}>
        <ResetPasswordPage />
      </MemoryRouter>
      <UnifiedFooter isLandingPage={false} />
    </>
  );
}


