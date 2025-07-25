/**
 * Application Configuration
 * All static data and configuration values from environment variables
 */

const config = {
  // API Configuration
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  BACKEND_URL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000',

  // Application Configuration
  APP_NAME: process.env.REACT_APP_APP_NAME || 'SUBG Quiz',
  APP_VERSION: process.env.REACT_APP_APP_VERSION || '1.0.0',
  APP_DESCRIPTION: process.env.REACT_APP_APP_DESCRIPTION || 'Quiz Platform',
  APP_AUTHOR: process.env.REACT_APP_APP_AUTHOR || 'SUBG Team',

  // Security Configuration
  SECURITY_LEVEL: process.env.REACT_APP_SECURITY_LEVEL || 'high',
  ADMIN_LOGGING: process.env.REACT_APP_ADMIN_LOGGING === 'true',
  SESSION_TIMEOUT: parseInt(process.env.REACT_APP_SESSION_TIMEOUT) || 3600000, // 1 hour
  MAX_LOGIN_ATTEMPTS: parseInt(process.env.REACT_APP_MAX_LOGIN_ATTEMPTS) || 5,

  // Payment Configuration
  RAZORPAY_KEY_ID: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_your_key_here',
  RAZORPAY_KEY_SECRET: process.env.REACT_APP_RAZORPAY_KEY_SECRET || 'your_secret_here',
  CURRENCY: process.env.REACT_APP_CURRENCY || 'INR',
  PAYMENT_TIMEOUT: parseInt(process.env.REACT_APP_PAYMENT_TIMEOUT) || 300000, // 5 minutes

  // Subscription Plans
  SUBSCRIPTION_PLANS: {
    FREE: {
      name: 'Free',
      price: 0,
      duration: '1 year',
      features: [
        'Unlimited Quiz Access (Levels 0-3)',
        'Community Access',
        'Basic Analytics',
        'Email Support'
      ]
    },
    BASIC: {
      name: 'Basic',
      price: 99,
      duration: '1 year',
      features: [
        'Unlimited Quiz Access (Levels 0-6)',
        'Community Access',
        'Detailed Analytics',
        'Email Support'
      ]
    },
    PREMIUM: {
      name: 'Premium',
      price: 499,
      duration: '1 year',
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
      price: 999,
      duration: '1 year',
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
    DEFAULT_TIME_LIMIT: parseInt(process.env.REACT_APP_DEFAULT_QUIZ_TIME_LIMIT) || 30, // minutes
    MAX_QUESTIONS_PER_QUIZ: parseInt(process.env.REACT_APP_MAX_QUESTIONS_PER_QUIZ) || 50,
    MIN_QUESTIONS_PER_QUIZ: parseInt(process.env.REACT_APP_MIN_QUESTIONS_PER_QUIZ) || 5,
    PASSING_SCORE: parseInt(process.env.REACT_APP_PASSING_SCORE) || 60, // percentage
    SHOW_RESULTS_IMMEDIATELY: process.env.REACT_APP_SHOW_RESULTS_IMMEDIATELY === 'true',
    ALLOW_RETAKES: process.env.REACT_APP_ALLOW_RETAKES === 'true',
    MAX_RETAKES: parseInt(process.env.REACT_APP_MAX_RETAKES) || 3
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
    EMAIL: process.env.REACT_APP_CONTACT_EMAIL || 'support@subgquiz.com',
    PHONE: process.env.REACT_APP_CONTACT_PHONE || '+91-9876543210',
    ADDRESS: process.env.REACT_APP_CONTACT_ADDRESS || 'Delhi, India',
    WEBSITE: process.env.REACT_APP_WEBSITE_URL || 'https://subgquiz.com'
  },

  // Social Media Links
  SOCIAL_MEDIA: {
    FACEBOOK: process.env.REACT_APP_FACEBOOK_URL || 'https://facebook.com/subgquizz',
    TWITTER: process.env.REACT_APP_TWITTER_URL || 'https://twitter.com/subgquiz',
    INSTAGRAM: process.env.REACT_APP_INSTAGRAM_URL || 'https://instagram.com/subgquiz',
    YOUTUBE: process.env.REACT_APP_YOUTUBE_URL || 'https://youtube.com/subgquiz',
    LINKEDIN: process.env.REACT_APP_LINKEDIN_URL || 'https://www.linkedin.com/company/subgquiz'
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

export const getSocialMediaLinks = () => {
  return config.SOCIAL_MEDIA;
};

export const getLegalLinks = () => {
  return config.LEGAL;
};

export default config; 