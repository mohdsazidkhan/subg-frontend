import AdminNavbar from '../../../src/components/AdminNavbar.jsx';
import AdminMobileBottomNavigation from '../../../src/components/AdminMobileBottomNavigation.jsx';
import Sidebar from '../../../src/components/Sidebar';
import DashboardAnalytics from '../../../src/pages/admin/DashboardAnalytics.jsx';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps() { return { props: {} }; }

export default function AdminAnalyticsDashboard() {
  return (
    <>
      <AdminNavbar />
      <AdminMobileBottomNavigation />
      <Sidebar />
      <MemoryRouter initialEntries={["/admin/analytics/dashboard"]}>
        <DashboardAnalytics />
      </MemoryRouter>
    </>
  );
}


