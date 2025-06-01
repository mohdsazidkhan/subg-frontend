import { useState } from "react";
import API from '../utils/api';
import { toast } from "react-toastify";


const Wallet = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const [showModal, setShowModal] = useState(false);
  const [selectedCoins, setSelectedCoins] = useState(0);

  const handleAddCoins = () => {
    if(selectedCoins > 0){
      handlePayment(selectedCoins)
      setShowModal(false);
    }else{
      toast.error('Please Select Amount First')
    }
  };
  const balanceCoinsData = [
    {
      coins: 100,
      amount: 10
    },
    {
      coins: 200,
      amount: 20
    },
    {
      coins: 300,
      amount: 30
    },
    {
      coins: 400,
      amount: 40
    },
    {
      coins: 500,
      amount: 50
    },
    {
      coins: 600,
      amount: 60
    },
    {
      coins: 700,
      amount: 70
    },
    {
      coins: 800,
      amount: 80
    },
    {
      coins: 900,
      amount: 90
    },
    {
      coins: 1000,
      amount: 100
    }
  ]
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
  const handlePayment = async (amount) => {

    const res = await loadRazorpayScript();

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }
    let orderData;
    try {
      const { data } = await API.post('/payment/create-order', {
        amount: amount, // amount in paise (if INR)
        userId: user?.publicId,
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
      description: `SUBG: StudentUnknown's BattleGrounds: ${user?.name || ''}`,
      order_id: orderData.id, // Razorpay order ID from backend

      handler: async function (response) {
        // Callback: payment success
        try {
          const verifyRes = await API.post('/payment/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            userId: user?.publicId, // Use publicId for server-side update
            amount: orderData.amount / 100 // Convert to INR from paise
          });

          if (verifyRes.data.success) {
            alert('✅ Payment verified successfully!');

            // Optionally refresh frontend user state
            const addedAmount = Number(orderData.amount / 100);
            const addedCoins = Number(addedAmount * 10);

            const updatedUser = {
              ...user,
              balance: Number(user?.balance || 0) + addedAmount,
              coins: Number(user?.coins || 0) + addedCoins
            };

            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            window.location.reload();
          } else {
            alert('❌ Payment verification failed. Please contact support.');
          }
        } catch (err) {
          console.error('Payment verification error:', err);
          alert('⚠️ Error verifying payment. Please try again later.');
        }
      },

      prefill: {
        name: user?.name || '',
        email: user?.email || '',
        contact: user?.phone || '',
      },

      theme: {
        color: '#84cc16',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

  };

  return (
    <div className="w-full md:w-80 mx-auto p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        My Wallet
      </h2>

      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-lg text-gray-600 dark:text-gray-300">Balance</span>
          <span className="text-xl font-semibold text-green-600 dark:text-green-400">
            💸 ₹{user?.balance}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-lg text-gray-600 dark:text-gray-300">Coins</span>
          <span className="text-xl font-semibold text-yellow-500 dark:text-yellow-400">🪙{user.coins}</span>
        </div>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-200"
      >
        Add Coins to Wallet
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-80">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Select Coins
            </h3>
            <select
              value={selectedCoins}
              onChange={(e) => setSelectedCoins(Number(e.target.value))}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-md p-2 mb-4"
            >
              <option value={0}>Select Amount</option>
              {balanceCoinsData?.map((item, index) => (
                <option key={index} value={item?.amount}>
                  {item?.coins} 🪙 Coins –  💸 ₹ {item?.amount}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCoins}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
