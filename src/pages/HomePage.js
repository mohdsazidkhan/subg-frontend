import { useEffect, useState } from 'react';
import API from '../utils/api';
import { Link } from 'react-router-dom';
import { FaClock, FaQuestionCircle, FaStar } from 'react-icons/fa';

const HomePage = () => {
  const storedUser = JSON.parse(localStorage.getItem('userInfo'));
  const [liveQuizzes, setLiveQuizzes] = useState([]);

  const fetchLiveQuizzes = async () => {
    try {
      const res = await API.get('/live-quizzes/active');
      setLiveQuizzes(res.data);
    } catch (error) {
      console.error('Error fetching live quizzes:', error);
    }
  };

  useEffect(() => {
    fetchLiveQuizzes();
  }, []);

  const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const handlePayment = async (lq) => {

  const res = await loadRazorpayScript();

  if (!res) {
    alert('Razorpay SDK failed to load. Are you online?');
    return;
  }
  console.log(storedUser, 'storedUser')
  let orderData;
  try {
    const { data } = await API.post('/payment/create-order', {
      amount: lq.amount, // amount in paise (if INR)
      userId: storedUser?.id,
      liveQuizId: lq._id,
    });
    orderData = data;
  } catch (error) {
    alert('Failed to create order. Try again.');
    return;
  }

  const options = {
    key: orderData.key, // Razorpay keyId from backend config
    amount: orderData.amount,
    currency: orderData.currency,
    name: 'SUBG',
    description: `SUBG: StudentUnknown's BattleGrounds Live Quiz: ${lq.quiz?.title || ''}`,
    order_id: orderData.id, // Razorpay order ID
    handler: async function (response) {
      // On successful payment, verify on backend
      try {
        const verifyRes = await API.post('/payment/verify', {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          userId: storedUser?.id,
          liveQuizId: lq._id,
        });

        if (verifyRes.data.success) {
          fetchLiveQuizzes();
          alert('Payment verified successfully!');
          // Optionally refresh UI or unlock content
        } else {
          alert('Payment verification failed! Contact support.');
        }
      } catch (err) {
        alert('Error verifying payment. Try again later.');
      }
    },
    prefill: {
      name: storedUser?.name || '',
      email: storedUser?.email || '',
      contact: storedUser?.phone || '',
    },
    theme: {
      color: '#84cc16',
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};



  return (
    <div className="container mx-auto">
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-6">🎮 Active Live Quizzes</h2>
      {liveQuizzes?.length === 0 && (
        <span className="text-gray-500 dark:text-gray-400">No Live Quiz Found!</span>
      )}

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {liveQuizzes?.map((lq) => (
          <div
            key={lq._id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow p-4 hover:shadow-lg transition duration-300"
          >
            <div className="flex justify-start gap-2 items-center">
              <span
                className={`relative inline-block px-4 py-1 text-xs font-semibold rounded-sm 
                ${lq?.isActive ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-white'}`}
              >
                {lq?.isActive ? 'LIVE' : 'Live Ended'}
              </span>

              <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-sm ${lq?.accessType === "free" ? "bg-green-600": "bg-yellow-600"} text-white`}>
                {lq?.accessType === "free" ? 'FREE' : "PRO"}
              </span>
            </div>

            <h3 className="text-lg font-semibold my-2">{lq.quiz?.title}</h3>

            <div className="flex justify-start gap-2 items-center mb-4">
              <p className="inline-block px-3 py-1 text-xs font-semibold rounded-sm bg-pink-200 text-black dark:bg-pink-600 dark:text-white">
                {lq.quiz?.category?.name || 'N/A'}
              </p>
              <p className="inline-block px-3 py-1 text-xs font-semibold rounded-sm bg-blue-200 text-black dark:bg-blue-600 dark:text-white">
                {lq.quiz?.subcategory?.name || 'N/A'}
              </p>
            </div>

            <div className="flex justify-start gap-4 items-center mb-4 text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-1">
                <FaQuestionCircle className="text-blue-600" />
                <span>{lq.quiz?.questionCount} Questions</span>
              </div>
              <div className="flex items-center gap-1">
                <FaClock className="text-green-600" />
                <span>{lq.quiz?.timeLimit} Mins</span>
              </div>
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-500" />
                <span>{lq.quiz?.totalMarks} Marks</span>
              </div>
            </div>
            {lq?.accessType === "free" &&
            <Link
              to={`/student/live-quiz/${lq.quiz?._id}`}
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-500"
            >
              Start Now
            </Link>
            }
            {lq?.accessType === "pro" &&
            <>
            {storedUser !== null ?
            <>
            {lq?.paidUsers?.includes(storedUser?.id) 
            ? 
            <Link
              to={`/student/live-quiz/${lq.quiz?._id}`}
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-500"
            >
              Start Now
            </Link>
            :
            <button
              className="inline-block bg-lime-600 text-white px-4 py-2 rounded hover:bg-lime-700 dark:hover:bg-lime-500"
              onClick={() => handlePayment(lq)}
            >
              Pay ₹ {lq?.amount}
            </button>
            }
            </>
            :
            <Link
              to={`/login`}
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-500"
            >
              Pay ₹ {lq?.amount}
            </Link>
            }
            </>
            }
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default HomePage;
