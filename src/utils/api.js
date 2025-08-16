const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Validate API configuration
if (!process.env.REACT_APP_API_URL && process.env.NODE_ENV === 'production') {
  console.warn('⚠️ REACT_APP_API_URL not set in production. Using fallback URL.');
}

class ApiService {
  async resetPassword(data) {
    return this.request('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  constructor() {
    this.baseURL = API_BASE_URL;
    console.log('🔧 API Service initialized with base URL:', this.baseURL);
  }

  async request(endpoint, options = {}) {
  const url = `${this.baseURL}${endpoint}`;
  const token = localStorage.getItem('token');
  const publicPaths = ['/login', '/register', '/forgot-password'];
  // if (!token && !publicPaths.includes(window.location.pathname)) {
  //   localStorage.clear();
  //   window.location.href = '/login'; // Or use navigate('/login') if using React Router
  //   return; // Stop further execution
  // }
  
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

      // ✅ Handle Unauthorized: Clear storage and redirect
      // if (response.status === 401) {
      //   localStorage.clear();
      //   window.location.href = '/login'; // Or use navigate('/login') if in React Router
      //   return; // Stop further execution
      // }

      const error = new Error();
      error.response = { status: response.status, data };
      error.message = data.message || data.error || `HTTP ${response.status}: ${response.statusText}`;
      throw error;
    }
    
    return data;
  } catch (error) {
    
    console.error('💥 API Error2:', error);
    
    // if (error.response?.status === 401) {
    //   localStorage.clear();
    //   window.location.href = '/login';
    //   return;
    // }

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

  // Auth endpoints
  async login(credentials) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async forgotPassword(data) {
    return this.request('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async getProfile() {
    return this.request('/api/student/profile');
  }

  async searchAll({ query = '', page = 1, limit = 12 }) {
    const searchQuery = new URLSearchParams({ query, page, limit }).toString();
    return this.request(`/api/search?${searchQuery}`);
  }

  // Quiz methods
  async getQuizzes(params = {}) {
    return this.request('/api/student/quizzes', { params });
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

  // Level-based quiz methods
  async getHomePageLevelQuizzes(params = {}) {
    return this.request('/api/levels/home-quizzes', { params });
  }

  async getHomePageData() {
    return this.request('/api/student/homepage-data');
  }

  async getLevelQuizzes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/levels/quizzes?${queryString}`);
  }

  async getUserLevel() {
    return this.request('/api/levels/user-level');
  }

  async getLevelProgress() {
    return this.request('/api/levels/progress');
  }

  async getQuizHistory(params = {}) {
    return this.request('/api/levels/history', { params });
  }

  async getLevelBasedQuizzes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/student/quizzes/level-based?${queryString}`);
  }

  async getRecommendedQuizzes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/student/quizzes/recommended?${queryString}`);
  }

  async getQuizDifficultyDistribution() {
    return this.request('/api/student/quizzes/difficulty-distribution');
  }

  async getCategories() {
    return this.request('/api/student/categories');
  }

  async getSubcategories(categoryId) {
    return this.request(`/api/student/subcategories?category=${categoryId}`);
  }

  async getWallet() {
    return this.request('/api/student/wallet');
  }

  async getLeaderboard() {
    return this.request('/api/student/leaderboard');
  }

  async getQuizLeaderboard(quizId) {
    return this.request(`/api/student/leaderboard/quiz/${quizId}`);
  }

  async updateProfile(profileData) {
    return this.request('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  // Admin endpoints
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

  async getAdminStudents(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/admin/students?${queryString}`);
  }

  async getAdminContacts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/admin/contacts?${queryString}`);
  }

  async deleteContact(id) {
    return this.request(`/api/admin/contacts/${id}`, {
      method: 'DELETE'
    });
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

  async assignBadge(studentId, badge) {
    return this.request('/api/admin/assign-badge', {
      method: 'POST',
      body: JSON.stringify({ studentId, badge })
    });
  }

  // Live Quiz endpoints
  async createLiveQuiz(quizData) {
    return this.request('/api/admin/live-quiz/create', {
      method: 'POST',
      body: JSON.stringify(quizData)
    });
  }

  async startLiveQuiz(id) {
    return this.request(`/api/admin/live-quiz/start/${id}`, {
      method: 'PATCH'
    });
  }

  async endLiveQuiz(id) {
    return this.request(`/api/admin/live-quiz/end/${id}`, {
      method: 'PATCH'
    });
  }

  async getAllLiveQuizzes() {
    return this.request('/api/live-quizzes/all');
  }

  // Analytics endpoints
  async getDashboardAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/analytics/dashboard?${queryString}`);
  }

  async getUserAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/analytics/users?${queryString}`);
  }

  async getQuizAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/analytics/quizzes?${queryString}`);
  }

  async getLevelAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/admin/analytics/levels?${queryString}`);
  }

  // Admin Bank Details
  async getAdminBankDetails(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/admin/bank-details?${queryString}`);
  }

  // Subscription endpoints
  async getSubscriptionStatus(userId) {
    return this.request(`/api/subscription/status/${userId}`);
  }

  async getSubscriptionTransactions(userId) {
    return this.request(`/api/subscription/transactions/${userId}`);
  }

  async createSubscriptionOrder(orderData) {
    return this.request('/api/subscription/create-order', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  async verifySubscription(verificationData) {
    return this.request('/api/subscription/verify', {
      method: 'POST',
      body: JSON.stringify(verificationData)
    });
  }

  // Bank Details endpoints
  async saveBankDetails(bankData) {
    return this.request('/api/bank-details', {
      method: 'POST',
      body: JSON.stringify(bankData)
    });
  }

  async getBankDetails() {
    return this.request('/api/bank-details/my-details');
  }

  async getAllBankDetails(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/bank-details?${queryString}`);
  }
}

const API = new ApiService();
export default API;