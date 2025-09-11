import MobileAppWrapper from '../components/MobileAppWrapper';

const PrivacyPolicy = () => (
  <MobileAppWrapper title="Privacy Policy">
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800 dark:text-gray-200 transition-colors duration-300">
    <h1 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white">
      Privacy Policy
    </h1>

    <p className="mb-4">
      This Privacy Policy explains how <strong>SUBG QUIZ</strong> collects, uses, stores, and protects your information when you use our platform. By using SUBG QUIZ, you agree to the practices described below.
    </p>

    <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white">1) Information We Collect</h2>
    <ul className="list-disc pl-6 space-y-2">
      <li>
        <strong>Account Information:</strong> name, email, phone number, password (hashed), referral code.
      </li>
      <li>
        <strong>Profile/Student Data:</strong> level progression, badges, leaderboard placement, high‑score quizzes count, quiz best scores, total quizzes played.
      </li>
      <li>
        <strong>Quiz Activity:</strong> quiz attempts, scores, timings, and related analytics used to calculate levels, leaderboard ranks, and rewards eligibility.
      </li>
      <li>
        <strong>Rewards & Wallet:</strong> locked/unlocked/claimed rewards history, claimable balance, and monthly rewards processing status.
      </li>
      <li>
        <strong>Bank/Withdrawal Details (optional):</strong> if you provide bank information for rewards withdrawal, we store it securely and use it only for payout verification and processing.
      </li>
      <li>
        <strong>Subscription & Payments:</strong> plan details and payment status handled via secure third‑party processors (e.g., Razorpay). We do not store full card/UPI details.
      </li>
      <li>
        <strong>Device/Log Data:</strong> IP, browser type, device information, timestamps, and limited logs for security and troubleshooting.
      </li>
      <li>
        <strong>Support/Contact:</strong> messages you send via forms or email.
      </li>
    </ul>

    <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white">2) How We Use Your Information</h2>
    <ul className="list-disc pl-6 space-y-2">
      <li>To create and manage your account, authenticate logins, and provide core features.</li>
      <li>To run quizzes, compute scores, determine level progression, and show leaderboard rankings.</li>
      <li>To process rewards, including the <strong>Monthly Rewards System</strong>:
        <ul className="list-disc pl-6 mt-1 space-y-1">
          <li><strong>Monthly:</strong> Top 3 eligible users at (Level 10 and Minimum 110 Quizzes with ≥75% Accuracy) win ₹9,999 each</li>
          <li><strong>Eligibility:</strong> Must reach Level 10 and minimum 110 quizzes ≥75% accuracy in the current month</li>
          <li><strong>Reset:</strong> Progress and rewards reset every month on the 1st</li>
        </ul>
      </li>
      <li>To send important updates (e.g., account notices, reward status, subscription reminders).</li>
      <li>To improve platform performance, safety, and user experience.</li>
    </ul>

    <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white">3) Sharing & Third‑Party Services</h2>
    <ul className="list-disc pl-6 space-y-2">
      <li>
        <strong>Payments:</strong> We use trusted payment processors (e.g., Razorpay) to handle subscription payments securely. Necessary transaction data is shared with them to complete payment processing.
      </li>
      <li>
        <strong>Email/SMS:</strong> We may use reputable communication providers to deliver OTPs, receipts, or important notifications.
      </li>
      <li>
        <strong>No Ads/No Sale of Data:</strong> We do not sell your personal information or share it for third‑party advertising.
      </li>
      <li>
        <strong>Legal/Safety:</strong> We may disclose information if required by law or to protect users, our rights, and the platform.
      </li>
    </ul>

    <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white">4) Data Security</h2>
    <p className="mb-4">
      We use industry‑standard safeguards to protect data in transit and at rest where applicable (e.g., HTTPS, hashed passwords, access controls). Only authorized personnel/business partners with a need to know may access relevant data. No method of transmission or storage is 100% secure; however, we continuously improve our protections.
    </p>

    <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white">5) Data Retention</h2>
    <ul className="list-disc pl-6 space-y-2">
      <li>Account, quiz, and rewards records are retained for service continuity, audits, and legal compliance.</li>
      <li>Bank details (if provided) are retained only as long as necessary for payouts and compliance, or until you request deletion (subject to legal requirements).</li>
      <li>Transaction logs are retained as required by applicable laws and platform security needs.</li>
    </ul>

    <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white">6) Your Rights & Choices</h2>
    <ul className="list-disc pl-6 space-y-2">
      <li>Access, update, or correct your profile information.</li>
      <li>Request deletion of optional data (e.g., bank details) where not legally required to retain.</li>
      <li>Export your data upon reasonable request.</li>
      <li>Opt out of non‑essential communications.</li>
    </ul>

    <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white">7) Cookies & Authentication</h2>
    <p className="mb-4">
      We use essential cookies/tokens for authentication and session management. Disabling them may limit functionality such as login persistence.
    </p>

    <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white">8) Eligibility (Students)</h2>
    <p className="mb-4">
      You must be <strong>18 years or older</strong> to use SUBG QUIZ. By registering, you confirm that you meet this requirement.
    </p>

    <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white">9) Changes to This Policy</h2>
    <p className="mb-4">
      We may update this policy to reflect product, legal, or security changes. The updated version will be posted here with a revised date. Continued use of SUBG QUIZ after updates constitutes acceptance of the revised policy.
    </p>

    <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white">8) Contact Us</h2>
    <p>
      For privacy questions or requests, please contact: <strong>support@mohdsazidkhan.com</strong>
    </p>
    </div>
  </MobileAppWrapper>
);

export default PrivacyPolicy;
