import AdminNavbar from '../../../src/components/AdminNavbar.jsx';
import AdminMobileBottomNavigation from '../../../src/components/AdminMobileBottomNavigation.jsx';
import Sidebar from '../../../src/components/Sidebar';
import AdminArticleForm from '../../../src/pages/admin/AdminArticleForm.jsx';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps() { return { props: {} }; }

export default function AdminArticleCreate() {
  return (
    <>
      <AdminNavbar />
      <AdminMobileBottomNavigation />
      <Sidebar />
      <MemoryRouter initialEntries={["/admin/articles/create"]}>
        <AdminArticleForm />
      </MemoryRouter>
    </>
  );
}


