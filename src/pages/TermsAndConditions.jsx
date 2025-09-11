import MobileAppWrapper from '../components/MobileAppWrapper';

const TermsAndConditions = () => (
  <MobileAppWrapper title="Terms & Conditions">
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800 dark:text-gray-200 transition-colors duration-300">
    <h1 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white">
      Terms & Conditions
    </h1>

    <p className="mb-4">
      By using <strong>SUBG QUIZ</strong>, you agree to participate fairly and follow all platform rules. You must be at least <strong>14 years old</strong> to register and play.
    </p>

    <p className="mb-4">
      SUBG QUIZ is a <strong>skill-based quiz platform</strong>. Success depends on your knowledge, accuracy, and speed. All participation is voluntary.
    </p>

    <p className="mb-4">
      We offer 4 subscription plans: Free, Basic, Premium, and Pro — each with access to different quiz levels. Once subscribed, all fees are <strong>non-refundable</strong>, regardless of performance or disqualification.
    </p>

    <div className="mb-4 space-y-2">
      <p>
        <strong>Monthly Rewards System:</strong> Rewards are processed monthly based on Top 3 leaderboard ranks:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>Monthly:</strong> Top 3 eligible users at (Level 10 and Minimum 110 Quizzes with ≥75% Accuracy) win prizes in 3:2:1 ratio from ₹9,999 total pool</li>
        <li><strong>Eligibility:</strong> Must reach Level 10 and minimum 110 quizzes ≥75% accuracy in the current month</li>
        <li><strong>Reset:</strong> Progress and rewards reset every month on the 1st</li>
      </ul>
      <p>
        Monthly rewards are based on current month performance only. Each month is independent and previous month achievements do not carry forward.
      </p>
    </div>

    <p className="mb-4">
      To qualify for monthly rewards, users must complete at least <strong>(Level 10 and Minimum 110 Quizzes with ≥75% accuracy)</strong> and rank in the Top 3 on the <strong>Level 10</strong> leaderboard by the end of the month. All progress resets monthly.
    </p>

    <p className="mb-4">
      Any attempt to cheat, use automated tools, impersonate others, or manipulate the system will lead to an immediate and permanent ban. We monitor all activity to maintain fairness.
    </p>

    <p>
      We reserve the right to update our terms, quiz rules, leaderboard conditions, subscription pricing, or reward structure at any time without prior notice. By continuing to use SUBG QUIZ, you agree to accept all such updates automatically.
    </p>
    </div>
  </MobileAppWrapper>
);

export default TermsAndConditions;
