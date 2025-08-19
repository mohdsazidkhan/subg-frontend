const TermsAndConditions = () => (
  <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800 dark:text-gray-200 transition-colors duration-300">
    <h1 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white">
      Terms & Conditions
    </h1>

    <p className="mb-4">
      By using <strong>SUBG QUIZ</strong>, you agree to participate fairly and follow all platform rules. You must be at least <strong>18 years old</strong> to register and play.
    </p>

    <p className="mb-4">
      SUBG QUIZ is a <strong>skill-based quiz platform</strong>. Success depends on your knowledge, accuracy, and speed. All participation is voluntary.
    </p>

    <p className="mb-4">
      We offer 4 subscription plans: Free, Basic, Premium, and Pro — each with access to different quiz levels. Once subscribed, all fees are <strong>non-refundable</strong>, regardless of performance or disqualification.
    </p>

    <div className="mb-4 space-y-2">
      <p>
        Rewards are based on Top 3 leaderboard ranks at specific levels:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>Level 6</strong>: Top 1–3 rank prize ₹990 (locked reward)</li>
        <li><strong>Level 9</strong>: Top 1–3 rank prize ₹9,980 (locked reward)</li>
        <li><strong>Level 10</strong>: Top 1–3 rank prize ₹99,999 split in a <strong>3:2:1</strong> ratio</li>
      </ul>
      <p>
        Final payout for Level 10 Top 3 = the user’s share of ₹99,999 (3:2:1) <strong>plus</strong> any locked prizes from Level 6 and Level 9, subject to eligibility and unlock requirements.
      </p>
    </div>

    <p className="mb-4">
      To claim prizes, users must complete at least <strong>1024 quizzes within a year</strong> and rank in the Top 3 on the <strong>Level 10</strong> leaderboard. Locked prizes from Level 6 and Level 9 are unlocked together only when the Level 10 conditions are met.
    </p>

    <p className="mb-4">
      Any attempt to cheat, use automated tools, impersonate others, or manipulate the system will lead to an immediate and permanent ban. We monitor all activity to maintain fairness.
    </p>

    <p>
      We reserve the right to update our terms, quiz rules, leaderboard conditions, subscription pricing, or reward structure at any time without prior notice. By continuing to use SUBG QUIZ, you agree to accept all such updates automatically.
    </p>
  </div>
);

export default TermsAndConditions;
