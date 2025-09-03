import LevelBasedQuizzes from '../components/LevelBasedQuizzes';
import MobileAppWrapper from '../components/MobileAppWrapper';

const LevelBasedQuizzesPage = () => {
  return (
    <MobileAppWrapper title="Level Quizzes">
      <div className="min-h-screen bg-subg-light dark:bg-subg-dark">
        <LevelBasedQuizzes />
      </div>
    </MobileAppWrapper>
  );
};

export default LevelBasedQuizzesPage; 