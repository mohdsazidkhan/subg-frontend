import AdminNavbar from '../../src/components/AdminNavbar.jsx';
import AdminMobileBottomNavigation from '../../src/components/AdminMobileBottomNavigation.jsx';
import Sidebar from '../../src/components/Sidebar';
import CategoryPage from '../../src/pages/admin/CategoryPage.jsx';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps() { return { props: {} }; }

export default function AdminCategories() {
  return (
    <>
      <AdminNavbar />
      <AdminMobileBottomNavigation />
      <Sidebar />
      <MemoryRouter initialEntries={["/admin/categories"]}>
        <CategoryPage />
      </MemoryRouter>
    </>
  );
}


