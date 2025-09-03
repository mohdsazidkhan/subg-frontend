import MobileAppWrapper from '../components/MobileAppWrapper';

const HowItWorks = () => (
  <MobileAppWrapper title="How It Works">
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800 dark:text-gray-200 transition-colors duration-300">
    <h1 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
      How It Works
    </h1>

    <ol className="space-y-6 list-decimal list-inside">
      <li>
        <strong>Register / Login: </strong>  
        Sign up using your mobile number or email to create your SUBG QUIZ account.
      </li>

      <li>
        <strong>Choose Subscription / Join Quiz: </strong>  
        Subscribe to our premium plans to access exclusive quizzes and features. Free quizzes are available for all users.
      </li>

      <li>
        <strong>Play Timed Quiz: </strong>  
        Participate in exciting multiple-choice quizzes. Each question is skill-based and timed.
      </li>

      <li>
        <strong>Score & Leaderboard: </strong>  
        Your score depends on correct answers and speed. Top scorers are automatically listed.
      </li>

      <li>
        <strong>Monthly Rewards System: </strong>  
        Top 3 eligible users at Level 10 (110 monthly wins with ≥75% accuracy) earn ₹9,999 each month. Rewards reset and recalculate every month.
      </li>

      <li>
        <strong>Track Progress: </strong>  
        Monitor your performance, view detailed analytics, and track your improvement over time.
      </li>
    </ol>

    <p className="mt-6 text-sm text-orange-400 font-bold">
      Note: SUBG QUIZ is a 100% skill-based platform. There is no gambling, betting, or chance involved. Only knowledge, accuracy, and speed decide your rewards.
    </p>
    </div>
  </MobileAppWrapper>
);

export default HowItWorks;
