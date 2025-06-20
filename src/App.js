import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminRoute from './components/AdminRoute';
import Footer from './components/Footer';
import StudentRoute from './components/StudentRoute';
import DashboardPage from './pages/admin/DashboardPage';
import CategoryPage from './pages/admin/CategoryPage';
import SubcategoryPage from './pages/admin/SubcategoryPage';
import QuizPage from './pages/admin/QuizPage';
import QuestionPage from './pages/admin/QuestionPage';
import StudentsPage from './pages/admin/StudentsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutUs from './pages/AboutUs';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import ContactUs from './pages/ContactUs';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import AttemptQuizPage from './pages/AttemptQuizPage';
import LiveQuizPage from './pages/admin/LiveQuizPage';
import LiveQuizPlay from './pages/LiveQuizPlay';
import Wallet from './pages/Wallet';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import store from './store';
import QuizResult from './pages/QuizResult';
import HowItWorks from './pages/HowItWorks';

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
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/refund" element={<RefundPolicy />} />
            <Route path="/contact" element={<ContactUs />} />

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
            <Route path="/quiz-result" element={<StudentRoute><QuizResult /></StudentRoute>} />

            {/* Add more student routes here, like profile */}
          </Routes>
          
            <Footer />
        </>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </Provider>
  );
}
