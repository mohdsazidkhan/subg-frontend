import AdminNavbar from '../../src/components/AdminNavbar.jsx';
import AdminMobileBottomNavigation from '../../src/components/AdminMobileBottomNavigation.jsx';
import Sidebar from '../../src/components/Sidebar';
import SubcategoryPage from '../../src/pages/admin/SubcategoryPage.jsx';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps() { return { props: {} }; }

export default function AdminSubcategories() {
  return (
    <>
      <AdminNavbar />
      <AdminMobileBottomNavigation />
      <Sidebar />
      <MemoryRouter initialEntries={["/admin/subcategories"]}>
        <SubcategoryPage />
      </MemoryRouter>
    </>
  );
}


