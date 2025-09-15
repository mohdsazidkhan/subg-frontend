import MobileAppWrapper from '../components/MobileAppWrapper';

const HowItWorks = () => (
  <MobileAppWrapper title="How It Works">
    <div className="max-w-4xl mx-auto p-4 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <h1 className="text-xl lg:text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
        How It Works
      </h1>

      <ol className="space-y-6 list-decimal list-inside text-base leading-relaxed">
        <li>
          <strong>Register / Login: </strong>
          Sign up using your mobile number or email to create your SUBG QUIZ account.
        </li>

        <li>
          <strong>Choose Subscription & Access Levels: </strong>
          Access quizzes based on your subscription:
          <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li>Free Plan – Levels 0 to 3</li>
            <li>Basic Plan – Levels 0 to 6</li>
            <li>Premium Plan – Levels 0 to 9</li>
            <li>Pro Plan – All Levels (0 to 10)</li>
          </ul>
        </li>

        <li>
          <strong>Play Timed Quizzes: </strong>
          Participate in daily multiple-choice quizzes. Each quiz is skill-based and carefully curated.
        </li>

        <li>
          <strong>Track Progress: </strong>
          View your quiz performance, accuracy stats, and level advancement in your dashboard.
        </li>

        <li>
          <strong>Monthly Rewards System: </strong>
          Every month, rewards are given to the <strong>Top 3 eligible users</strong> who meet these criteria:
          <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li>Reached Level 10</li>
            <li>Played at least 110 quizzes</li>
            <li>Maintained an accuracy of ≥75%</li>
          </ul>
          <p className="mt-2 text-sm">
            <strong>Ranking is based on:</strong> 1) High-scoring quizzes, 2) Accuracy, 3) Total score, 4) Total quizzes played.
            In case of a tie, these same metrics are used again in order as tie-breakers.
          </p>
        </li>

        <li>
          <strong>Result & Prize Distribution: </strong>
          Results are declared on the <strong>last day of every month after 9:00 PM</strong>. The Top 3 winners receive their rewards within <strong>7 days</strong>.
        </li>
      </ol>

      <p className="mt-8 text-sm text-orange-400 font-semibold">
        Note: SUBG QUIZ is a 100% skill-based platform. There is no gambling or betting involved. Rewards are purely based on consistent knowledge, accuracy, and performance.
      </p>
    </div>
  </MobileAppWrapper>
);

export default HowItWorks;
