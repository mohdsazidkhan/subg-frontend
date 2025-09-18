import AdminNavbar from '../../../src/components/AdminNavbar.jsx';
import AdminMobileBottomNavigation from '../../../src/components/AdminMobileBottomNavigation.jsx';
import Sidebar from '../../../src/components/Sidebar';
import AdminArticles from '../../../src/pages/admin/AdminArticles.jsx';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps() { return { props: {} }; }

export default function AdminArticlesRoute() {
  return (
    <>
      <AdminNavbar />
      <AdminMobileBottomNavigation />
      <Sidebar />
      <MemoryRouter initialEntries={["/admin/articles"]}>
        <AdminArticles />
      </MemoryRouter>
    </>
  );
}


