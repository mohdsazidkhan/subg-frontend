import UnifiedNavbar from '../../src/components/UnifiedNavbar.jsx';
import UnifiedFooter from '../../src/components/UnifiedFooter.jsx';
import AttemptQuizPage from '../../src/pages/AttemptQuizPage.jsx';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps({ params }) {
  return { props: { initialQuizId: params.quizId } };
}

export default function AttemptQuiz({ initialQuizId }) {
  return (
    <>
      <UnifiedNavbar isLandingPage={false} />
      <MemoryRouter initialEntries={[`/attempt-quiz/${initialQuizId}`]}>
        <AttemptQuizPage />
      </MemoryRouter>
      <UnifiedFooter isLandingPage={false} />
    </>
  );
}


