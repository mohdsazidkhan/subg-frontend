import AdminNavbar from '../../src/components/AdminNavbar.jsx';
import AdminMobileBottomNavigation from '../../src/components/AdminMobileBottomNavigation.jsx';
import Sidebar from '../../src/components/Sidebar';
import StudentPage from '../../src/pages/admin/StudentsPage.jsx';
import { MemoryRouter } from 'react-router-dom';

export async function getServerSideProps() { return { props: {} }; }

export default function AdminStudents() {
  return (
    <>
      <AdminNavbar />
      <AdminMobileBottomNavigation />
      <Sidebar />
      <MemoryRouter initialEntries={["/admin/students"]}>
        <StudentPage />
      </MemoryRouter>
    </>
  );
}


