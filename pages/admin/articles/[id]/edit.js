import AdminNavbar from '../../../../src/components/AdminNavbar.jsx';
import AdminMobileBottomNavigation from '../../../../src/components/AdminMobileBottomNavigation.jsx';
import Sidebar from '../../../../src/components/Sidebar';
import AdminArticleForm from '../../../../src/pages/admin/AdminArticleForm.jsx';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps({ params }) { return { props: { initialId: params.id } }; }

export default function AdminArticleEdit({ initialId }) {
  return (
    <>
      <AdminNavbar />
      <AdminMobileBottomNavigation />
      <Sidebar />
      <MemoryRouter initialEntries={[`/admin/articles/${initialId}/edit`] }>
        <AdminArticleForm />
      </MemoryRouter>
    </>
  );
}


