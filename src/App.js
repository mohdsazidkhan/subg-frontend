import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import Wallet from './pages/Wallet';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppLayout() {

  return (
    <>
      {/* Navbar always shows */}
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="appContainer">
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
            <Route path="/wallet" element={<StudentRoute><Wallet /></StudentRoute>} />

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
