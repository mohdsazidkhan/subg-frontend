import AdminNavbar from '../../../src/components/AdminNavbar.jsx';
import AdminMobileBottomNavigation from '../../../src/components/AdminMobileBottomNavigation.jsx';
import Sidebar from '../../../src/components/Sidebar';
import QuizAnalytics from '../../../src/pages/admin/QuizAnalytics.jsx';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps() { return { props: {} }; }

export default function AdminAnalyticsQuizzes() {
  return (
    <>
      <AdminNavbar />
      <AdminMobileBottomNavigation />
      <Sidebar />
      <MemoryRouter initialEntries={["/admin/analytics/quizzes"]}>
        <QuizAnalytics />
      </MemoryRouter>
    </>
  );
}


