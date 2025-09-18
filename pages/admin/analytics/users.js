import AdminNavbar from '../../../src/components/AdminNavbar.jsx';
import AdminMobileBottomNavigation from '../../../src/components/AdminMobileBottomNavigation.jsx';
import Sidebar from '../../../src/components/Sidebar';
import UserAnalytics from '../../../src/pages/admin/UserAnalytics.jsx';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps() { return { props: {} }; }

export default function AdminAnalyticsUsers() {
  return (
    <>
      <AdminNavbar />
      <AdminMobileBottomNavigation />
      <Sidebar />
      <MemoryRouter initialEntries={["/admin/analytics/users"]}>
        <UserAnalytics />
      </MemoryRouter>
    </>
  );
}


