import AdminNavbar from '../../src/components/AdminNavbar.jsx';
import AdminMobileBottomNavigation from '../../src/components/AdminMobileBottomNavigation.jsx';
import Sidebar from '../../src/components/Sidebar';
import AdminSubscriptions from '../../src/pages/admin/AdminSubscriptions.jsx';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps() { return { props: {} }; }

export default function AdminSubscriptionsRoute() {
  return (
    <>
      <AdminNavbar />
      <AdminMobileBottomNavigation />
      <Sidebar />
      <MemoryRouter initialEntries={["/admin/subscriptions"]}>
        <AdminSubscriptions />
      </MemoryRouter>
    </>
  );
}


