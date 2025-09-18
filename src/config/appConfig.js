/**
 * Application Configuration
 * All static data and configuration values from environment variables
 */

const config = {
  // API Configuration
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  BACKEND_URL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000',

  // Application Configuration
  APP_NAME: process.env.REACT_APP_APP_NAME || 'SUBG QUIZ',
  APP_VERSION: process.env.REACT_APP_APP_VERSION || '1.0.0',
  APP_DESCRIPTION: process.env.REACT_APP_APP_DESCRIPTION || 'Quiz Platform',
  APP_AUTHOR: process.env.REACT_APP_APP_AUTHOR || 'SUBG TEAM',

  // Security Configuration
  SECURITY_LEVEL: process.env.REACT_APP_SECURITY_LEVEL || 'high',
  ADMIN_LOGGING: process.env.REACT_APP_ADMIN_LOGGING === 'true',
  SESSION_TIMEOUT: parseInt(process.env.REACT_APP_SESSION_TIMEOUT) || 3600000, // 1 hour
  MAX_LOGIN_ATTEMPTS: parseInt(process.env.REACT_APP_MAX_LOGIN_ATTEMPTS) || 5,

  // Payment Configuration
  CURRENCY: process.env.REACT_APP_CURRENCY || 'INR',
  PAYMENT_TIMEOUT: parseInt(process.env.REACT_APP_PAYMENT_TIMEOUT) || 300000, // 5 minutes

  // PayU Configuration
  PAYU_MERCHANT_KEY: process.env.REACT_APP_PAYU_MERCHANT_KEY || 'your_payu_merchant_key',
  PAYU_MERCHANT_ID: process.env.REACT_APP_PAYU_MERCHANT_ID || 'your_payu_merchant_id',
  PAYU_PAYMENT_URL: process.env.REACT_APP_PAYU_PAYMENT_URL || 'https://test.payu.in/_payment',
  PAYU_SUCCESS_URL: process.env.REACT_APP_PAYU_SUCCESS_URL || 'http://localhost:3000/subscription/payu-success',
  PAYU_FAILURE_URL: process.env.REACT_APP_PAYU_FAILURE_URL || 'http://localhost:3000/subscription/payu-failure',

  // Subscription Plans
  SUBSCRIPTION_PLANS: {
    FREE: {
      name: 'Free',
      price: 0,
      duration: '1 month',
      features: [
        'Unlimited Quiz Access (Levels 0-3)',
        'Community Access',
        'Basic Analytics',
        'Email Support'
      ]
    },
    BASIC: {
      name: 'Basic',
      price: 9,
      duration: '1 month',
      features: [
        'Unlimited Quiz Access (Levels 0-6)',
        'Community Access',
        'Detailed Analytics',
        'Email Support'
      ]
    },
    PREMIUM: {
      name: 'Premium',
      price: 49,
      duration: '1 month',
      features: [
        'Unlimited Quiz Access (Levels 0-9)',
        'Community Access',
        'Advanced Analytics',
        'Priority Support',
        'Live Quizzes',
        'Exclusive Badges',
        'Bonus Content',
        'Advanced Reports'
      ]
    },
    PRO: {
      name: 'Pro',
      price: 99,
      duration: '1 month',
      features: [
        'Unlimited Quiz Access (All Levels 0-10)',
        'Community Access',
        'Advanced Analytics',
        'Priority Support',
        'Live Quizzes',
        'Exclusive Badges',
        'Bonus Content',
        'Advanced Reports',
        'Data Export',
        'API Access',
        'Custom Categories',
        'All Premium Features'
      ]
    }
  },

  // Quiz Configuration
  QUIZ_CONFIG: {
    DEFAULT_TIME_LIMIT: parseInt(process.env.REACT_APP_DEFAULT_QUIZ_TIME_LIMIT) || 5, // minutes
    MAX_QUESTIONS_PER_QUIZ: parseInt(process.env.REACT_APP_MAX_QUESTIONS_PER_QUIZ) || 10,
    MIN_QUESTIONS_PER_QUIZ: parseInt(process.env.REACT_APP_MIN_QUESTIONS_PER_QUIZ) || 5,
    PASSING_SCORE: parseInt(process.env.REACT_APP_PASSING_SCORE) || 60, // percentage
    SHOW_RESULTS_IMMEDIATELY: process.env.REACT_APP_SHOW_RESULTS_IMMEDIATELY === 'true',
    ALLOW_RETAKES: process.env.REACT_APP_ALLOW_RETAKES === 'true',
    MAX_RETAKES: parseInt(process.env.REACT_APP_MAX_RETAKES) || 1
  },

  // UI Configuration
  UI_CONFIG: {
    DEFAULT_THEME: process.env.REACT_APP_DEFAULT_THEME || 'light',
    ENABLE_DARK_MODE: process.env.REACT_APP_ENABLE_DARK_MODE === 'true',
    TOAST_DURATION: parseInt(process.env.REACT_APP_TOAST_DURATION) || 3000,
    LOADING_TIMEOUT: parseInt(process.env.REACT_APP_LOADING_TIMEOUT) || 10000
  },

  // Contact Information
  CONTACT: {
    EMAIL: process.env.REACT_APP_CONTACT_EMAIL || 'subgquiz@gmail.com',
    PHONE: process.env.REACT_APP_CONTACT_PHONE || '+91-7678131912',
    ADDRESS: process.env.REACT_APP_CONTACT_ADDRESS || 'Delhi, India',
    WEBSITE: process.env.REACT_APP_WEBSITE_URL || 'https://subgquiz.com'
  },

  // Legal Information
  LEGAL: {
    PRIVACY_POLICY: process.env.REACT_APP_PRIVACY_POLICY_URL || '/privacy',
    TERMS: process.env.REACT_APP_TERMS_URL || '/terms',
    REFUND_POLICY: process.env.REACT_APP_REFUND_POLICY_URL || '/refund',
    HALAL_DISCLAIMER: process.env.REACT_APP_HALAL_DISCLAIMER_URL || '/halal-disclaimer'
  },

  // Analytics and Monitoring
  ANALYTICS: {
    GOOGLE_ANALYTICS_ID: process.env.REACT_APP_GOOGLE_ANALYTICS_ID || 'GA_MEASUREMENT_ID',
    SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN || 'your_sentry_dsn',
    MIXPANEL_TOKEN: process.env.REACT_APP_MIXPANEL_TOKEN || 'your_mixpanel_token'
  },

  // Feature Flags
  FEATURES: {
    ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    LEADERBOARD: process.env.REACT_APP_ENABLE_LEADERBOARD === 'true',
    BADGES: process.env.REACT_APP_ENABLE_BADGES === 'true',
    LEVELS: process.env.REACT_APP_ENABLE_LEVELS === 'true',
    WALLET: process.env.REACT_APP_ENABLE_WALLET === 'true',
    SUBSCRIPTIONS: process.env.REACT_APP_ENABLE_SUBSCRIPTIONS === 'true'
  },

  // Development Configuration
  DEVELOPMENT: {
    DEBUG_MODE: process.env.REACT_APP_DEBUG_MODE === 'true',
    LOG_LEVEL: process.env.REACT_APP_LOG_LEVEL || 'info',
    ENABLE_MOCK_DATA: process.env.REACT_APP_ENABLE_MOCK_DATA === 'true',
    MOCK_API_DELAY: parseInt(process.env.REACT_APP_MOCK_API_DELAY) || 1000
  },

  // Performance Configuration
  PERFORMANCE: {
    CACHE_DURATION: parseInt(process.env.REACT_APP_CACHE_DURATION) || 3600000, // 1 hour
    IMAGE_OPTIMIZATION: process.env.REACT_APP_IMAGE_OPTIMIZATION === 'true',
    LAZY_LOADING: process.env.REACT_APP_LAZY_LOADING === 'true',
    PRELOAD_CRITICAL_RESOURCES: process.env.REACT_APP_PRELOAD_CRITICAL_RESOURCES === 'true'
  }
};

// Helper functions
export const getConfig = (key) => {
  const keys = key.split('.');
  let value = config;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return undefined;
    }
  }
  
  return value;
};

export const isFeatureEnabled = (feature) => {
  return config.FEATURES[feature] === true;
};

export const getSubscriptionPlan = (planName) => {
  return config.SUBSCRIPTION_PLANS[planName.toUpperCase()];
};

export const getContactInfo = () => {
  return config.CONTACT;
};

export const getLegalLinks = () => {
  return config.LEGAL;
};

export default config; 