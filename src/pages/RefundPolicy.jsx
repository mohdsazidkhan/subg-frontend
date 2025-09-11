import MobileAppWrapper from '../components/MobileAppWrapper';

const RefundPolicy = () => (
  <MobileAppWrapper title="Refund Policy">
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800 dark:text-gray-200 transition-colors duration-300">
    <h1 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white">
      Refund & Subscription Policy
    </h1>

    <p className="mb-4">
      Thank you for using <strong>SUBG QUIZ</strong>. Please read this Refund & Subscription Policy carefully. By subscribing or purchasing any plan, you agree to the terms below.
    </p>

    <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white">1) General Policy</h2>
    <ul className="list-disc pl-6 space-y-2">
      <li>All subscription purchases are <strong>final and non‑refundable</strong>.</li>
      <li>Subscriptions provide access to content and features for a fixed duration. Access is not contingent on performance, leaderboard position, or rewards outcomes.</li>
      <li>SUBG QUIZ is a <strong>skill‑based</strong> platform. Fees are charged for access to premium content/features, not for winning rewards.</li>
    </ul>

    <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white">2) Subscriptions</h2>
    <ul className="list-disc pl-6 space-y-2">
      <li><strong>Plan Access:</strong> Each plan grants access to specific levels/features as shown on the subscription page.</li>
      <li><strong>Validity:</strong> Plans are prepaid and remain active until their stated expiry date.</li>
      <li><strong>Renewals:</strong> If auto‑renewal is enabled on your account or payment method, the plan may renew automatically at the then‑current price. You can disable renewal any time before the next billing date from your account or payment provider.</li>
      <li><strong>Upgrades:</strong> If supported, upgrades may take effect immediately; the new plan price applies. No pro‑rated refunds for the remaining period of the previous plan.</li>
      <li><strong>Downgrades/Cancellations:</strong> Downgrades or cancellations apply from the next cycle. We do not provide partial/remaining‑period refunds.</li>
    </ul>

    <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white">3) Payments & Invoicing</h2>
    <ul className="list-disc pl-6 space-y-2">
      <li><strong>Processors:</strong> Payments are handled securely via trusted third‑party processors (e.g., Razorpay). We do not store full card/UPI details.</li>
      <li><strong>Failed/Declined Payments:</strong> If a payment fails or is declined, access to premium features may be paused until the payment is completed successfully.</li>
      <li><strong>Taxes/Fees:</strong> Prices may be subject to applicable taxes/charges as per law.</li>
    </ul>

    <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white">4) Refund Eligibility (Exceptional Cases Only)</h2>
    <p className="mb-2">While plans are non‑refundable, we may review limited cases such as:</p>
    <ul className="list-disc pl-6 space-y-2">
      <li><strong>Duplicate Charge:</strong> You were charged more than once for the same order.</li>
      <li><strong>Technical Failure:</strong> A verified payment was made but your subscription did not activate and we are unable to provision access within a reasonable time.</li>
    </ul>
    <p className="mt-2">
      To request a review, contact us within <strong>7 days</strong> of the transaction with order ID, payment proof, and account details. Approved cases (if any) are refunded to the original payment method within standard banking timelines.
    </p>

    <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white">5) Monthly Rewards & Refunds</h2>
    <ul className="list-disc pl-6 space-y-2">
      <li>Monthly rewards are <strong>not purchases</strong> and are <strong>not refundable</strong>. They are prizes based on performance, leaderboard position, and eligibility.</li>
      <li>
        <strong>Monthly Rewards System:</strong> Top 3 eligible users at (Level 10 and Minimum 110 Quizzes with ≥75% Accuracy) win ₹9,999 each month. Eligibility is based on current month performance only.
      </li>
      <li>Monthly rewards are processed at the end of each month and reset for the next month. Previous month achievements do not carry forward.</li>
      <li>Withdrawals (if enabled) may require bank details/KYC verification to comply with regulations.</li>
    </ul>

    <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white">6) Chargebacks & Disputes</h2>
    <ul className="list-disc pl-6 space-y-2">
      <li>Unauthorized or fraudulent transactions should be reported promptly to both us and your payment provider.</li>
      <li>Filing a chargeback after successfully receiving plan access may result in account restrictions and recovery actions as per our Terms.</li>
    </ul>

    <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white">7) Responsible Play & Eligibility</h2>
    <ul className="list-disc pl-6 space-y-2">
      <li>SUBG QUIZ is a <strong>skill‑based</strong> platform. There is no gambling or chance involved.</li>
      <li>You must be <strong>18 years or older</strong> to register and play.</li>
    </ul>

    <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white">8) Contact Us</h2>
    <p>
      Need help with a payment or subscription? Contact <strong>support@mohdsazidkhan.com</strong> with your registered email/phone and order details.
    </p>
    </div>
  </MobileAppWrapper>
);

export default RefundPolicy;
