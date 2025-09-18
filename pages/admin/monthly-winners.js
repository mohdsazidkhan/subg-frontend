import AdminNavbar from '../../src/components/AdminNavbar.jsx';
import AdminMobileBottomNavigation from '../../src/components/AdminMobileBottomNavigation.jsx';
import Sidebar from '../../src/components/Sidebar';
import AdminMonthlyWinners from '../../src/pages/admin/AdminMonthlyWinners.jsx';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps() { return { props: {} }; }

export default function AdminMonthlyWinnersRoute() {
  return (
    <>
      <AdminNavbar />
      <AdminMobileBottomNavigation />
      <Sidebar />
      <MemoryRouter initialEntries={["/admin/monthly-winners"]}>
        <AdminMonthlyWinners />
      </MemoryRouter>
    </>
  );
}


