import UnifiedNavbar from '../src/components/UnifiedNavbar.jsx';
import UnifiedFooter from '../src/components/UnifiedFooter.jsx';
import QuizResult from '../src/pages/QuizResult.js';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps() { return { props: {} }; }

export default function QuizResultRoute() {
  return (
    <>
      <UnifiedNavbar isLandingPage={false} />
      <MemoryRouter initialEntries={["/quiz-result"]}>
        <QuizResult />
      </MemoryRouter>
      <UnifiedFooter isLandingPage={false} />
    </>
  );
}


