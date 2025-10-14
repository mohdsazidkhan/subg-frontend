import { Helmet } from 'react-helmet';
import LevelsShowcase from '../components/LevelsShowcase';

const PublicLevelsPage = () => {
  return (
    <>
      <Helmet>
        <title>All Levels - SUBG Quiz</title>
        <meta name="description" content="Explore all quiz levels from Starter to Legend. Progress through challenging quizzes and unlock new levels!" />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <LevelsShowcase />
      </div>
    </>
  );
};

export default PublicLevelsPage;

