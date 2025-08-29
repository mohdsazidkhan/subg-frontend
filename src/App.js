import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar';
import AdminRoute from './components/AdminRoute';
import Footer from './components/Footer.jsx';
import StudentRoute from './components/StudentRoute';
import ErrorBoundary from './components/ErrorBoundary';
import GlobalErrorProvider from './contexts/GlobalErrorContext';
import GlobalErrorBanner from './components/GlobalErrorBanner';
import TokenValidationWrapper from './components/TokenValidationWrapper';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage.jsx';
import DashboardPage from './pages/admin/DashboardPage';
import CategoryPage from './pages/admin/CategoryPage';
import SubcategoryPage from './pages/admin/SubcategoryPage';
import QuizManagementPage from './pages/admin/QuizPage';
import QuestionPage from './pages/admin/QuestionPage';
import StudentPage from './pages/admin/StudentsPage';
import QuizResult from './pages/QuizResult';
import HowItWorks from './pages/HowItWorks.jsx';
import LevelsPage from './pages/LevelsPage.jsx';
import LevelBasedQuizzesPage from './pages/LevelBasedQuizzesPage.jsx';
import AboutUs from './pages/AboutUs.jsx';
import TermsAndConditions from './pages/TermsAndConditions.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import RefundPolicy from './pages/RefundPolicy.jsx';
import ContactUs from './pages/ContactUs.jsx';
import SubscriptionPage from './pages/SubscriptionPage.jsx';
import AttemptQuizPage from './pages/AttemptQuizPage.jsx';
import { isAdmin, hasAdminPrivileges } from './utils/adminUtils';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import store from './store';
import DashboardAnalytics from './pages/admin/DashboardAnalytics';
import UserAnalytics from './pages/admin/UserAnalytics';
import QuizAnalytics from './pages/admin/QuizAnalytics';
import FinancialAnalytics from './pages/admin/FinancialAnalytics';
import PerformanceAnalytics from './pages/admin/PerformanceAnalytics';
import CategoryDetailPage from './pages/CategoryDetailPage';
import SubcategoryDetailPage from './pages/SubcategoryDetailPage';
import LevelDetailPage from './pages/LevelDetailPage';
import RewardsPage from './pages/RewardsPage';
import AdminContacts from './pages/admin/AdminContacts';
import AdminBankDetails from './pages/admin/AdminBankDetails';
import AdminRewards from './pages/admin/AdminRewards.jsx';
import ReactGA from 'react-ga4';
import SearchPage from './pages/SearchPage.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

function usePageTracking() {
  const location = useLocation();
  React.useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
  }, [location]);
}

function AppLayout() {
  const location = useLocation();
  usePageTracking();

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      {/* Global Error Banner */}
      <GlobalErrorBanner />
      
      {/* Navbar always shows */}
      <Navbar />
      
      {/* Sidebar only for admin users */}
      {isAdmin() && hasAdminPrivileges() && <Sidebar />}
      
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="appContainer">
        <>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/refund" element={<RefundPolicy />} />
            <Route path="/contact" element={<ContactUs />} />

            {/* Public Homepage Route */}
            <Route path="/" element={<TokenValidationWrapper showWarning={false}><HomePage /></TokenValidationWrapper>} />
            <Route path="/search" element={<TokenValidationWrapper showWarning={false}><SearchPage /></TokenValidationWrapper>} />
            <Route path="/profile" element={<StudentRoute><TokenValidationWrapper><ProfilePage /></TokenValidationWrapper></StudentRoute>} />
            <Route path="/attempt-quiz/:quizId" element={<StudentRoute><TokenValidationWrapper><AttemptQuizPage /></TokenValidationWrapper></StudentRoute>} />
            <Route path="/subscription" element={<StudentRoute><TokenValidationWrapper><SubscriptionPage /></TokenValidationWrapper></StudentRoute>} />
            <Route path="/quiz-result" element={<StudentRoute><TokenValidationWrapper><QuizResult /></TokenValidationWrapper></StudentRoute>} />
            <Route path="/levels" element={<StudentRoute><TokenValidationWrapper><LevelsPage /></TokenValidationWrapper></StudentRoute>} />
            <Route path="/level-quizzes" element={<StudentRoute><TokenValidationWrapper><LevelBasedQuizzesPage /></TokenValidationWrapper></StudentRoute>} />
            <Route path="/rewards" element={<StudentRoute><TokenValidationWrapper><RewardsPage /></TokenValidationWrapper></StudentRoute>} />
            <Route path="/category/:categoryId" element={<StudentRoute><TokenValidationWrapper><CategoryDetailPage /></TokenValidationWrapper></StudentRoute>} />
            <Route path="/subcategory/:subcategoryId" element={<StudentRoute><TokenValidationWrapper><SubcategoryDetailPage /></TokenValidationWrapper></StudentRoute>} />
            <Route path="/level/:levelNumber" element={<StudentRoute><TokenValidationWrapper><LevelDetailPage /></TokenValidationWrapper></StudentRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminRoute><TokenValidationWrapper><DashboardPage /></TokenValidationWrapper></AdminRoute>} />
            <Route path="/admin/categories" element={<AdminRoute><TokenValidationWrapper><CategoryPage /></TokenValidationWrapper></AdminRoute>} />
            <Route path="/admin/subcategories" element={<AdminRoute><TokenValidationWrapper><SubcategoryPage /></TokenValidationWrapper></AdminRoute>} />
            <Route path="/admin/quizzes" element={<AdminRoute><TokenValidationWrapper><QuizManagementPage /></TokenValidationWrapper></AdminRoute>} />
            <Route path="/admin/questions" element={<AdminRoute><TokenValidationWrapper><QuestionPage /></TokenValidationWrapper></AdminRoute>} />
            <Route path="/admin/students" element={<AdminRoute><TokenValidationWrapper><StudentPage /></TokenValidationWrapper></AdminRoute>} />
            <Route path="/admin/contacts" element={<AdminRoute><TokenValidationWrapper><AdminContacts /></TokenValidationWrapper></AdminRoute>} />
            <Route path="/admin/bank-details" element={<AdminRoute><TokenValidationWrapper><AdminBankDetails /></TokenValidationWrapper></AdminRoute>} />
            <Route path="/admin/rewards" element={<AdminRoute><TokenValidationWrapper><AdminRewards /></TokenValidationWrapper></AdminRoute>} />
            
            {/* Analytics Admin Routes */}
            <Route path="/admin/analytics/dashboard" element={<AdminRoute><TokenValidationWrapper><DashboardAnalytics /></TokenValidationWrapper></AdminRoute>} />
            <Route path="/admin/analytics/users" element={<AdminRoute><TokenValidationWrapper><UserAnalytics /></TokenValidationWrapper></AdminRoute>} />
            <Route path="/admin/analytics/quizzes" element={<AdminRoute><TokenValidationWrapper><QuizAnalytics /></TokenValidationWrapper></AdminRoute>} />
            <Route path="/admin/analytics/financial" element={<AdminRoute><TokenValidationWrapper><FinancialAnalytics /></TokenValidationWrapper></AdminRoute>} />
            <Route path="/admin/analytics/performance" element={<AdminRoute><TokenValidationWrapper><PerformanceAnalytics /></TokenValidationWrapper></AdminRoute>} />


            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          {/* Footer only shows on non-admin pages */}
          {!location.pathname.startsWith('/admin') && <Footer />}
        </>
      </div>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || "your-google-client-id"}>
        <GlobalErrorProvider>
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </GlobalErrorProvider>
      </GoogleOAuthProvider>
    </Provider>
  );
}
