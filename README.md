# SUBG Frontend

A modern React-based quiz platform frontend with advanced admin analytics, user level system, subscription management, monthly highscore rewards, and smart referral system.

## 🚀 Features

### Core Features
- **User Interface**: Modern, fully responsive design with Tailwind CSS (all pages are now mobile, tablet, and desktop friendly)
- **Admin Panel**: Comprehensive analytics dashboard with charts
- **Quiz System**: Level-based quiz interface with single attempt system
- **Subscription Management**: Plan selection and payment integration
- **User Dashboard**: Personal progress tracking and achievements
- **Responsive Design**: Mobile-first approach with desktop optimization

### Advanced Features
- **Analytics Dashboard**: Real-time charts and data visualization
- **Level System**: Visual level progression with badges
- **Payment Integration**: Razorpay payment gateway integration
- **State Management**: Redux for global state management
- **Security**: Protected routes and role-based access control
- **Export Functionality**: CSV export for analytics data
- **Monthly Highscore System**: Monthly quiz competitions with prize tracking
- **Referral System**: Smart referral rewards with progress tracking
- **Rewards Dashboard**: Comprehensive rewards and progress visualization

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- SUBG Backend API running (not included in this directory)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd subg-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
subg-frontend/
├── public/           # Static files
├── src/
│   ├── components/   # Reusable components
│   ├── pages/        # Page components
│   ├── store/        # Redux store
│   ├── utils/        # Utility functions
│   ├── config/       # Configuration files
│   ├── assets/       # Images and static assets
│   ├── contexts/     # React contexts
│   ├── hooks/        # Custom React hooks
│   ├── App.js        # Main app component
│   └── index.js      # Entry point
├── package.json
├── tailwind.config.js
└── README.md
```

## 🖼️ UI Components

- **Navbar**: Navigation with user authentication status
- **Sidebar**: Admin navigation panel
- **Footer**: Site footer with links
- **Pagination**: Data pagination component
- **SearchFilter**: Search and filter functionality
- **ViewToggle**: Toggle between different view modes
- **LevelBasedQuizzes**: Quiz interface with level system
- **SubscriptionGuard**: Route protection for subscription features
- **Wallet**: User wallet and transaction management
- **ProfilePage**: User profile and settings
- **RewardsDashboard**: Monthly rewards and progress tracking
- **MonthlyRewardsInfo**: Monthly reward rules and information
- **RewardNotification**: Reward achievement notifications
- **TopPerformers**: Top monthly performers display

## 📊 Analytics Pages

- **Dashboard Analytics**: Overview, level distribution, subscription stats, recent activity, top users
- **User Analytics**: User growth, level distribution, subscription stats, top performers
- **Quiz Analytics**: Category stats, difficulty stats, top quizzes, recent quizzes
- **Financial Analytics**: Revenue trend, plan distribution, payment stats, top revenue plans
- **Performance Analytics**: Score distribution, level performance, category performance, leaderboard stats

## 🏆 Level System Interface

- **Visual Progress**: Progress bars and level indicators
- **Badge Display**: Achievement badges for each level
- **Quiz Access**: Level-appropriate quiz recommendations
- **Statistics**: Personal performance metrics
- **Current Level**: Display current level and progress
- **Next Level**: Requirements for level advancement
- **High Score Tracking**: Quizzes with 75%+ scores
- **Achievement System**: Badges and rewards

### Level Progression
1. **Starter** (Level 0) - 0 high-score quizzes (75%+) required
2. **Rookie** (Level 1) - 2 high-score quizzes (75%+) required
3. **Explorer** (Level 2) - 6 high-score quizzes (75%+) required
4. **Thinker** (Level 3) - 12 high-score quizzes (75%+) required
5. **Strategist** (Level 4) - 20 high-score quizzes (75%+) required
6. **Achiever** (Level 5) - 30 high-score quizzes (75%+) required
7. **Mastermind** (Level 6) - 42 high-score quizzes (75%+) required
8. **Champion** (Level 7) - 56 high-score quizzes (75%+) required
9. **Prodigy** (Level 8) - 72 high-score quizzes (75%+) required
10. **Wizard** (Level 9) - 90 high-score quizzes (75%+) required
11. **Legend** (Level 10) - 110 high-score quizzes (75%+) required

## 🏅 Monthly Highscore System

### Monthly Competition Interface
- **Progress Tracking**: Real-time monthly quiz progress
- **Target Display**: 110 high-score quizzes (75%+ accuracy) target
- **Prize Information**: ₹9,999 total prize pool details
- **Leaderboard**: Monthly top performers ranking

### Prize Distribution Display
- **1st Place**: ₹4,999 (50% of pool) - Gold trophy
- **2nd Place**: ₹3,333 (33.33% of pool) - Silver trophy  
- **3rd Place**: ₹1,667 (16.67% of pool) - Bronze trophy

### Features
- **Monthly Reset**: Automatic reset on last day of month
- **Progress Visualization**: Visual progress bars and charts
- **Reward Notifications**: Achievement notifications
- **Performance History**: Monthly performance tracking

## 🎁 Referral System Interface

### Referral Progress Tracking
- **Referral Count**: Current referral count display
- **Progress Bars**: Visual progress to next milestone
- **Milestone Display**: Next reward milestone information

### Referral Rewards
- **2 Referrals**: Basic Plan (₹9/month for 30 days)
- **5 Referrals**: Premium Plan (₹49/month for 30 days)
- **10 Referrals**: Pro Plan (₹99/month for 30 days)

### Smart Upgrade System
- **No Downgrades**: Users keep better existing plans
- **Plan Hierarchy**: free < basic < premium < pro
- **Automatic Upgrades**: Only when beneficial
- **Badge System**: Referral Starter, Master, Legend badges

### Features
- **Referral Code Generation**: Unique referral codes
- **Progress Visualization**: Milestone progress bars
- **Reward Information**: Clear reward details
- **Social Sharing**: Easy referral code sharing

## 💳 Subscription System

- **Plan Selection**: Free, Basic, Premium, Pro
- **Payment Integration**: Razorpay payment gateway
- **Plan Comparison**: Feature comparison table
- **Payment History**: Transaction records
- **Renewal Management**: Subscription renewal options

### Updated Plan Pricing
- **Free Plan**: Basic access to levels 0-3 (₹0/month)
- **Basic Plan**: Access to levels 0-6 - ₹9/month
- **Premium Plan**: Access to levels 0-9 - ₹49/month
- **Pro Plan**: Full access to all levels (0-10) - ₹99/month

## 🔒 Security Features

- **Route Protection**: AdminRoute, StudentRoute, SubscriptionRoute, PlanRoute
- **Authentication**: JWT tokens, role-based access, session management, logout

## 📱 Responsive Design

- **Mobile-first**: Designed for mobile devices first
- **Touch-friendly**: Optimized for touch interactions
- **Responsive Charts**: Charts adapt to screen size
- **Collapsible Sidebar**: Mobile-friendly navigation
- **Desktop Features**: Full dashboard, multi-column layout, advanced filters, export functionality

## 🎨 Styling

- **Tailwind CSS**: Utility-first, custom components, dark mode, responsive classes
- **Design System**: Consistent color palette, typography, spacing, reusable UI components

## 📈 Chart Integration

- **Chart.js**: Bar, pie, line charts, responsive and interactive

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
NODE_ENV=production
```

### Deployment Platforms
- **Vercel**: Recommended for React apps
- **Netlify**: Static site hosting
- **AWS S3**: Static website hosting
- **Firebase**: Google's hosting platform

## 🧑‍💻 Development

### Available Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 🎨 UI Components

### Core Components
- **Navbar**: Navigation with user authentication status
- **Sidebar**: Admin navigation panel
- **Footer**: Site footer with links
- **Pagination**: Data pagination component
- **SearchFilter**: Search and filter functionality
- **ViewToggle**: Toggle between different view modes

### Admin Components
- **AnalyticsDashboard**: Main analytics overview
- **UserAnalytics**: User statistics and charts
- **QuizAnalytics**: Quiz performance analytics
- **FinancialAnalytics**: Revenue and payment analytics
- **PerformanceAnalytics**: Performance metrics and leaderboards

### User Components
- **LevelBasedQuizzes**: Quiz interface with level system
- **SubscriptionGuard**: Route protection for subscription features
- **Wallet**: User wallet and transaction management
- **ProfilePage**: User profile and settings
- **RewardsDashboard**: Monthly rewards and progress tracking
- **MonthlyRewardsInfo**: Monthly reward information
- **RewardNotification**: Achievement notifications
- **TopPerformers**: Top monthly performers

### Utility Components
- **Navbar**: Main navigation
- **Sidebar**: Admin navigation
- **Pagination**: Data pagination
- **SearchFilter**: Search functionality

## 📊 Analytics Pages

### Dashboard Analytics (`/admin/analytics/dashboard`)
- **Overview Cards**: Total users, quizzes, revenue
- **Level Distribution**: Bar chart showing user level distribution
- **Subscription Distribution**: Pie chart of subscription plans
- **Recent Activity**: Latest quiz attempts and user activities
- **Top Users**: Best performing users table

### User Analytics (`/admin/analytics/users`)
- **User Growth**: Line chart showing user registration trends
- **Level Distribution**: Bar chart of user levels
- **Subscription Stats**: Pie chart of subscription distribution
- **Top Performers**: Table with export functionality
- **Filters**: Date range, level, and subscription filters

### Quiz Analytics (`/admin/analytics/quizzes`)
- **Category Stats**: Bar chart of quiz categories
- **Difficulty Stats**: Pie chart of difficulty distribution
- **Top Quizzes**: Most popular quizzes with export
- **Recent Quizzes**: Latest created quizzes
- **Filters**: Date range, category, and difficulty filters

### Financial Analytics (`/admin/analytics/financial`)
- **Revenue Trend**: Line chart of revenue over time
- **Plan Distribution**: Pie chart of subscription plans
- **Payment Stats**: Bar chart of payment statuses
- **Top Revenue Plans**: Revenue breakdown with export
- **Filters**: Date range filtering

### Performance Analytics (`/admin/analytics/performance`)
- **Score Distribution**: Bar chart of user scores
- **Level Performance**: Line chart of level-based performance
- **Category Performance**: Bar chart of category performance
- **Leaderboard Stats**: Quiz leaderboard statistics
- **Top Performers**: Best users with export functionality

## 🎯 Level System Interface

### Level Progression
- **Visual Progress**: Progress bars and level indicators
- **Badge Display**: Achievement badges for each level
- **Quiz Access**: Level-appropriate quiz recommendations
- **Statistics**: Personal performance metrics

### Level Features
- **Current Level**: Display current level and progress
- **Next Level**: Requirements for level advancement
- **High Score Tracking**: Quizzes with 75%+ scores
- **Achievement System**: Badges and rewards

## 💳 Subscription System

### Plan Selection
- **Free Plan**: Basic access to levels 0-3 (₹0/month)
- **Basic Plan**: Access to levels 0-6 (₹9/month)
- **Premium Plan**: Access to levels 0-9 (₹49/month)
- **Pro Plan**: Full access to all levels (0-10) (₹99/month)

### Payment Integration
- **Razorpay Gateway**: Secure payment processing
- **Plan Comparison**: Feature comparison table
- **Payment History**: Transaction records
- **Renewal Management**: Subscription renewal options

## 🔐 Security Features

### Route Protection
- **AdminRoute**: Admin-only route protection
- **StudentRoute**: Student-only route protection
- **SubscriptionRoute**: Subscription-required routes
- **PlanRoute**: Plan-specific route access

### Authentication
- **JWT Tokens**: Secure authentication
- **Role-based Access**: Admin and student separation
- **Session Management**: Automatic token refresh
- **Logout Functionality**: Secure session termination

## 📱 Responsive Design

### Mobile Optimization
- **Mobile-first**: Designed for mobile devices first
- **Touch-friendly**: Optimized for touch interactions
- **Responsive Charts**: Charts adapt to screen size
- **Collapsible Sidebar**: Mobile-friendly navigation

### Desktop Features
- **Full Dashboard**: Complete analytics dashboard
- **Multi-column Layout**: Efficient use of screen space
- **Advanced Filters**: Comprehensive filtering options
- **Export Functionality**: Data export capabilities

## 🎨 Styling

### Tailwind CSS
- **Utility-first**: Rapid UI development
- **Custom Components**: Reusable styled components
- **Dark Mode**: Dark/light theme support
- **Responsive Classes**: Mobile-responsive utilities

### Design System
- **Color Palette**: Consistent color scheme
- **Typography**: Unified font system
- **Spacing**: Consistent spacing scale
- **Components**: Reusable UI components

## 📊 Chart Integration

### Chart.js Integration
- **Bar Charts**: For distributions and comparisons
- **Pie Charts**: For proportions and categories
- **Line Charts**: For trends and time series
- **Responsive Charts**: Auto-resize to container

### Chart Features
- **Interactive**: Hover effects and tooltips
- **Exportable**: Chart data export functionality
- **Customizable**: Configurable colors and options
- **Real-time**: Live data updates

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
NODE_ENV=production
```

### Deployment Platforms
- **Vercel**: Recommended for React apps
- **Netlify**: Static site hosting
- **AWS S3**: Static website hosting
- **Firebase**: Google's hosting platform

## 🔧 Development

### Available Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Development Tools
- **React Developer Tools**: Browser extension
- **Redux DevTools**: State management debugging
- **ESLint**: Code linting
- **Prettier**: Code formatting

## 📝 Component Documentation

### Admin Components
- **AnalyticsDashboard**: Main analytics overview page
- **UserAnalytics**: User statistics and management
- **QuizAnalytics**: Quiz performance tracking
- **FinancialAnalytics**: Revenue and payment analysis
- **PerformanceAnalytics**: Performance metrics

### User Components
- **LevelBasedQuizzes**: Quiz interface with level system
- **ProfilePage**: User profile management
- **Wallet**: Financial management
- **SubscriptionGuard**: Route protection
- **RewardsDashboard**: Monthly rewards tracking
- **MonthlyRewardsInfo**: Reward information display

### Utility Components
- **Navbar**: Main navigation
- **Sidebar**: Admin navigation
- **Pagination**: Data pagination
- **SearchFilter**: Search functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0** - Initial release with basic quiz interface
- **v2.0.0** - Added level system and user dashboard
- **v3.0.0** - Enhanced admin panel and analytics
- **v4.0.0** - Advanced analytics with charts and export
- **v5.0.0** - Monthly highscore system and rewards dashboard
- **v6.0.0** - Smart referral system and comprehensive UI updates 