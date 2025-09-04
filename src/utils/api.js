const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' ? 'https://subg-backend.onrender.com' : 'http://localhost:5000');

// Validate API configuration
if (!process.env.REACT_APP_API_URL && process.env.NODE_ENV === 'production') {
  console.warn('⚠️ REACT_APP_API_URL not set in production. Using fallback URL:', API_BASE_URL);
}

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    console.log('🔧 API Service initialized with base URL:', this.baseURL);
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
    console.log('🔑 Token:', token ? 'Present' : 'Missing');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      console.log(`📡 Response status: ${response.status}`);
      
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      console.log('📦 Response data:', data);
      
      if (!response.ok) {
        console.error('❌ API Error1:', response);

        const error = new Error();
        error.response = { status: response.status, data };
        error.message = data.message || data.error || `HTTP ${response.status}: ${response.statusText}`;
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('💥 API Error2:', error);
      
      if (error.response) {
        throw error;
      }
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        const networkError = new Error('Network error: Unable to connect to server. Please check your internet connection.');
        networkError.isNetworkError = true;
        throw networkError;
      }
      
      if (!error.message) {
        error.message = 'An unexpected error occurred. Please try again.';
      }
      
      throw error;
    }
  }

  // ===== AUTH ENDPOINTS =====
  async login(credentials) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async googleAuth(googleData) {
    return this.request('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify(googleData)
    });
  }

  async updateProfile(profileData) {
    return this.request('/api/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async forgotPassword(email) {
    return this.request('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  async resetPassword(data) {
    return this.request('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // ===== STUDENT ENDPOINTS =====
  async getProfile() {
    return this.request('/api/student/profile');
  }

  async getQuizLeaderboard(quizId) {
    return this.request(`/api/student/leaderboard/quiz/${quizId}`);
  }

  // ===== QUIZ ENDPOINTS =====
  async getCategories() {
    return this.request('/api/student/categories');
  }

  async getSubcategories(categoryId) {
    return this.request(`/api/student/subcategories?category=${categoryId}`);
  }

  async getQuizById(id) {
    return this.request(`/api/student/quizzes/${id}`);
  }

  async submitQuiz(quizId, answers) {
    return this.request(`/api/student/quizzes/${quizId}/attempt`, {
      method: 'POST',
      body: JSON.stringify({ answers })
    });
  }

  async getQuizResult(quizId) {
    return this.request(`/api/student/quizzes/${quizId}/result`);
  }

  // ===== LEVEL-BASED QUIZ ENDPOINTS =====
  async getHomePageData() {
    return this.request('/api/student/homepage-data');
  }

  async getLevelQuizzes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/levels/quizzes?${queryString}`);
  }

  async getAllLevels() {
    return this.request('/api/levels/all-with-quiz-count');
  }

  async getLevelBasedQuizzes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/student/quizzes/level-based?${queryString}`);
  }

  async getQuizHistory(params = {}) {
    return this.request('/api/levels/history', { params });
  }

  // ===== SEARCH ENDPOINTS =====
  async searchAll({ query = '', page = 1, limit = 12 }) {
    const searchQuery = new URLSearchParams({ query, page, limit }).toString();
    return this.request(`/api/search?${searchQuery}`);
  }

  // ===== SUBSCRIPTION ENDPOINTS =====
  async getSubscriptionStatus(userId) {
    return this.request(`/api/subscription/status/${userId}`);
  }

  async getSubscriptionTransactions(userId) {
    return this.request(`/api/subscription/transactions/${userId}`);
  }

  // (Razorpay endpoints removed)

  // ===== PAYU PAYMENT ENDPOINTS =====
  async createPayuSubscriptionOrder(orderData) {
    return this.request('/api/subscription/create-payu-order', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  async verifyPayuSubscription(verificationData) {
    return this.request('/api/subscription/verify-payu', {
      method: 'POST',
      body: JSON.stringify(verificationData)
    });
  }

  // ===== BANK DETAILS ENDPOINTS =====
  async saveBankDetails(bankData) {
    return this.request('/api/bank-details', {
      method: 'POST',
      body: JSON.stringify(bankData)
    });
  }

  async getBankDetails() {
    return this.request('/api/bank-details/my-details');
  }

  // ===== PUBLIC ENDPOINTS =====
  async getPublicCategories() {
    return this.request('/api/public/categories');
  }

  async getPublicTopPerformers(limit = 10) {
    const queryString = new URLSearchParams({ limit }).toString();
    return this.request(`/api/public/top-performers?${queryString}`);
  }

  async getPublicTopPerformersMonthly(limit = 10, userId = null) {
    const params = new URLSearchParams({ limit });
    if (userId) params.append('userId', userId);
    return this.request(`/api/public/top-performers-monthly?${params}`);
  }

  async getPublicMonthlyLeaderboard(limit = 3) {
    const queryString = new URLSearchParams({ limit }).toString();
    return this.request(`/api/public/monthly-leaderboard?${queryString}`);
  }

  async getPublicLandingStats() {
    return this.request('/api/public/landing-stats');
  }

  async getPublicLevels() {
    return this.request('/api/public/levels');
  }

  async getPublicCategoriesEnhanced() {
    return this.request('/api/public/categories-enhanced');
  }

  async getPublicLandingTopPerformers(limit = 10) {
    const queryString = new URLSearchParams({ limit }).toString();
    return this.request(`/api/public/landing-top-performers?${queryString}`);
  }

  // ===== MONTHLY WINNERS ENDPOINTS =====
  async getMonthlyWinners(monthYear = null) {
    const endpoint = monthYear 
      ? `/api/monthly-winners/month/${monthYear}`
      : '/api/monthly-winners/current';
    return this.request(endpoint);
  }

  async getRecentMonthlyWinners(limit = 12, monthYear = null) {
    const params = { limit };
    if (monthYear) {
      params.monthYear = monthYear;
    }
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/monthly-winners/recent?${queryString}`);
  }

  async getMonthlyWinnersStats() {
    return this.request('/api/monthly-winners/stats');
  }

  async getUserWinningHistory(userId) {
    return this.request(`/api/monthly-winners/user/${userId}/history`);
  }

  // ===== ANALYTICS ENDPOINTS =====
  async getAnalyticsDashboard() {
    return this.request('/api/analytics/dashboard');
  }

  async getUserAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/analytics/users?${queryString}`);
  }

  async getQuizAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/analytics/quizzes?${queryString}`);
  }

  async getFinancialAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/analytics/financial?${queryString}`);
  }

  async getPerformanceAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/analytics/performance?${queryString}`);
  }

  async getMonthlyProgressAnalytics(month = null) {
    const params = month ? { month } : {};
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/analytics/monthly-progress?${queryString}`);
  }

  async getIndividualUserAnalytics(userId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/analytics/individual-user/${userId}?${queryString}`);
  }

  // ===== ADMIN ENDPOINTS =====
  async getAdminStats() {
    console.log('🔍 Calling getAdminStats...');
    try {
      const result = await this.request('/api/admin/stats');
      console.log('✅ getAdminStats result:', result);
      return result;
    } catch (error) {
      console.error('❌ getAdminStats error:', error);
      throw error;
    }
  }

  // Categories
  async getAdminCategories(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/admin/categories?${queryString}`);
  }

  async createCategory(categoryData) {
    return this.request('/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    });
  }

  async updateCategory(id, categoryData) {
    return this.request(`/api/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData)
    });
  }

  async deleteCategory(id) {
    return this.request(`/api/admin/categories/${id}`, {
      method: 'DELETE'
    });
  }

  // Subcategories
  async getAdminSubcategories(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/admin/subcategories?${queryString}`);
  }

  async createSubcategory(subcategoryData) {
    return this.request('/api/admin/subcategories', {
      method: 'POST',
      body: JSON.stringify(subcategoryData)
    });
  }

  async updateSubcategory(id, subcategoryData) {
    return this.request(`/api/admin/subcategories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(subcategoryData)
    });
  }

  async deleteSubcategory(id) {
    return this.request(`/api/admin/subcategories/${id}`, {
      method: 'DELETE'
    });
  }

  // Quizzes
  async getAdminQuizzes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/admin/quizzes?${queryString}`);
  }

  async getAdminAllQuizzes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/admin/allquizzes?${queryString}`);
  }

  async createQuiz(quizData) {
    return this.request('/api/admin/quizzes', {
      method: 'POST',
      body: JSON.stringify(quizData)
    });
  }

  async updateQuiz(id, quizData) {
    return this.request(`/api/admin/quizzes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(quizData)
    });
  }

  async deleteQuiz(id) {
    return this.request(`/api/admin/quizzes/${id}`, {
      method: 'DELETE'
    });
  }

  // Questions
  async getAdminQuestions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/admin/questions?${queryString}`);
  }

  async createQuestion(questionData) {
    return this.request('/api/admin/questions', {
      method: 'POST',
      body: JSON.stringify(questionData)
    });
  }

  async updateQuestion(id, questionData) {
    return this.request(`/api/admin/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(questionData)
    });
  }

  async deleteQuestion(id) {
    return this.request(`/api/admin/questions/${id}`, {
      method: 'DELETE'
    });
  }

  // Students
  async getAdminStudents(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/admin/students?${queryString}`);
  }

  async updateStudent(id, studentData) {
    return this.request(`/api/admin/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData)
    });
  }

  async deleteStudent(id) {
    return this.request(`/api/admin/students/${id}`, {
      method: 'DELETE'
    });
  }

  // Contacts
  async getAdminContacts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/admin/contacts?${queryString}`);
  }

  async deleteContact(id) {
    return this.request(`/api/admin/contacts/${id}`, {
      method: 'DELETE'
    });
  }

  // Badges
  async assignBadge(studentId, badge) {
    return this.request('/api/admin/assign-badge', {
      method: 'POST',
      body: JSON.stringify({ studentId, badge })
    });
  }

  // Admin Bank Details
  async getAdminBankDetails(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/admin/bank-details?${queryString}`);
  }
}

const API = new ApiService();
export default API;