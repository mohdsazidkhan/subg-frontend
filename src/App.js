import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AdminRoute from './components/AdminRoute';
import StudentRoute from './components/StudentRoute';
import DashboardPage from './pages/admin/DashboardPage';
import CategoryPage from './pages/admin/CategoryPage';
import SubcategoryPage from './pages/admin/SubcategoryPage';
import QuizPage from './pages/admin/QuizPage';
import QuestionPage from './pages/admin/QuestionPage';
import StudentsPage from './pages/admin/StudentsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import AttemptQuizPage from './pages/AttemptQuizPage';
import LiveQuizPage from './pages/admin/LiveQuizPage';
import LiveQuizPlay from './pages/LiveQuizPlay';
import './App.css';

function AppLayout() {
  
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Navbar always shows */}
      <Navbar />
      <div className="appContainer">
        {/* Sidebar only for logged-in admin on admin routes */}
        {user?.role === 'admin' && isAdminRoute && <Sidebar />}
        <>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Admin Routes */}
            
            <Route path="/admin/dashboard" element={<AdminRoute><DashboardPage /></AdminRoute>} />
            <Route path="/admin/live-quiz" element={<AdminRoute><LiveQuizPage /></AdminRoute>} />
            <Route path="/admin/categories" element={<AdminRoute><CategoryPage /></AdminRoute>} />
            <Route path="/admin/sub-categories" element={<AdminRoute><SubcategoryPage /></AdminRoute>} />
            <Route path="/admin/quizzes" element={<AdminRoute><QuizPage /></AdminRoute>} />
            <Route path="/admin/questions" element={<AdminRoute><QuestionPage /></AdminRoute>} />
            <Route path="/admin/students" element={<AdminRoute><StudentsPage /></AdminRoute>} />

            {/* Student Routes */}
            <Route exact path="/" element={<HomePage />} />
            <Route path="/student/live-quiz/:id" element={<StudentRoute><LiveQuizPlay /></StudentRoute>} />
            <Route path="/student/profile" element={<StudentRoute><ProfilePage /></StudentRoute>} />
            <Route path="/student/attempt-quiz/:quizId" element={<StudentRoute><AttemptQuizPage /></StudentRoute>} />

            {/* Add more student routes here, like profile */}
          </Routes>
        </>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
