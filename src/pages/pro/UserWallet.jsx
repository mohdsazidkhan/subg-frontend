import React, { useEffect, useState, useCallback } from 'react';
import API from '../../utils/api';
import { getCurrentUser } from '../../utils/authUtils';
import { toast } from 'react-toastify';
const UserWallet = () => {
	const user = getCurrentUser();
	const [wallet, setWallet] = useState({ balance: 0, totalEarned: 0, approvedCount: 0, totalQuestions: 0 });
	const [amount, setAmount] = useState('');
	const [upi, setUpi] = useState('');
	const [loading, setLoading] = useState(false);
	const [walletLoading, setWalletLoading] = useState(true);
	const [focusedField, setFocusedField] = useState(null);

	const load = useCallback(async () => {
		setWalletLoading(true);
		try {
			const res = await API.getUserWallet(user.id || user._id);
			if (res?.success) setWallet(res.data);
		} catch (e) {
			console.error('Error loading wallet:', e);
		} finally {
			setWalletLoading(false);
		}
	}, [user.id, user._id]);

	useEffect(() => { load(); }, [load]);

	const submitWithdraw = async (e) => {
		e.preventDefault();
		
		if (!amount || Number(amount) <= 0) {
			toast.error('Please enter a valid amount');
			return;
		}
		
		if (Number(amount) > wallet.balance) {
			toast.error('Insufficient balance');
			return;
		}
		
		if (Number(amount) < 1000) {
			toast.error('Minimum withdrawal amount is ₹1000');
			return;
		}
		
		setLoading(true);
		try {
			const res = await API.createWithdrawRequest({ amount: Number(amount), upi });
			if (res?.success) {
				toast.success('Withdrawal request submitted successfully! 💰');
				setAmount('');
				setUpi('');
				load();
			}
		} catch (err) {
			toast.error(err?.response?.data?.message || err?.message || 'Failed to submit withdrawal request');
		} finally {
			setLoading(false);
		}
	};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat('en-IN', {
			style: 'currency',
			currency: 'INR',
			minimumFractionDigits: 0,
			maximumFractionDigits: 2
		}).format(amount);
	};

	const canWithdraw = wallet.approvedCount >= 100;
	const remainingForWithdraw = Math.max(0, 100 - wallet.approvedCount);
	const progressPercentage = Math.min((wallet.approvedCount / 100) * 100, 100);

	return (
		<div className="min-h-screen bg-subg-light dark:bg-subg-dark py-4 lg:py-8 px-4">
			<div className="max-w-4xl mx-auto">
				{/* Header Section */}
				<div className="text-center mb-6 md:mb-8">
					<div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-yellow-600 to-red-600 rounded-full mb-3 md:mb-4">
						<span className="text-xl md:text-2xl">💰</span>
					</div>
					<h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
						My Wallet
					</h1>
					<p className="text-sm md:text-lg text-gray-600 dark:text-gray-300 px-4">
						Track your earnings and manage withdrawals
					</p>
				</div>

				{/* Wallet Stats Cards */}
				{walletLoading ? (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
						{[1, 2, 3].map(i => (
							<div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse">
								<div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
								<div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
								<div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
							</div>
						))}
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
						{/* Current Balance Card */}
						<div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200">
							<div className="flex items-center justify-between mb-4">
								<div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
									<span className="text-xl md:text-2xl">💳</span>
								</div>
								<div className="text-right">
									<p className="text-xs md:text-sm font-medium text-yellow-600 dark:text-yellow-400">Available Balance</p>
								</div>
							</div>
							<div className="space-y-2">
								<h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
									{formatCurrency(wallet.balance)}
								</h3>
								<p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
									Ready to withdraw
								</p>
							</div>
						</div>

						{/* Total Earned Card */}
						<div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200">
							<div className="flex items-center justify-between mb-4">
								<div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
									<span className="text-xl md:text-2xl">📈</span>
								</div>
								<div className="text-right">
									<p className="text-xs md:text-sm font-medium text-red-600 dark:text-red-400">Total Earned</p>
								</div>
							</div>
							<div className="space-y-2">
								<h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
									{formatCurrency(wallet.totalEarned)}
								</h3>
								<p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
									All time earnings
								</p>
							</div>
						</div>

						{/* Approved Questions Card */}
						<div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200">
							<div className="flex items-center justify-between mb-4">
								<div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
									<span className="text-xl md:text-2xl">✅</span>
								</div>
								<div className="text-right">
									<p className="text-xs md:text-sm font-medium text-purple-600 dark:text-purple-400">Approved Questions</p>
								</div>
							</div>
							<div className="space-y-2">
								<h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
									{wallet.approvedCount}
								</h3>
								<p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
									{canWithdraw ? 'Withdrawal enabled' : `${remainingForWithdraw} more for withdrawal`}
								</p>
								{!canWithdraw && (
									<div className="mt-2">
										<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
											<div 
												className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
												style={{ width: `${progressPercentage}%` }}
											></div>
										</div>
										<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
											{Math.round(progressPercentage)}% complete
										</p>
									</div>
								)}
							</div>
						</div>
					</div>
				)}

				{/* Withdrawal Section */}
				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
					{/* Section Header */}
					<div className="bg-gradient-to-r from-yellow-600 to-red-600 px-4 md:px-8 py-4 md:py-6">
						<div className="flex items-center space-x-3">
							<div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-lg flex items-center justify-center">
								<span className="text-lg md:text-xl">💸</span>
							</div>
							<div>
								<h2 className="text-lg md:text-xl font-bold text-white">Withdraw Funds</h2>
								<p className="text-yellow-100 text-sm md:text-base">
									{canWithdraw ? 'You can withdraw your earnings' : 'Complete 100 approved questions to enable withdrawal'}
								</p>
							</div>
						</div>
					</div>

					{/* Withdrawal Info */}
					{!canWithdraw && (
						<div className="p-4 md:p-6 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
							<div className="flex items-start space-x-3">
								<div className="flex-shrink-0">
									<span className="text-xl md:text-2xl">⏳</span>
								</div>
								<div>
									<h3 className="text-sm md:text-base font-medium text-yellow-800 dark:text-yellow-200 mb-1">
										Withdrawal Not Yet Available
									</h3>
									<p className="text-xs md:text-sm text-yellow-700 dark:text-yellow-300 mb-2">
										You need {remainingForWithdraw} more approved questions to enable withdrawal. (100 questions = ₹1000)
									</p>
									<div className="w-full bg-yellow-200 dark:bg-yellow-800 rounded-full h-2">
										<div 
											className="bg-yellow-600 dark:bg-yellow-400 h-2 rounded-full transition-all duration-500"
											style={{ width: `${progressPercentage}%` }}
										></div>
									</div>
									<p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
										Progress: {wallet.approvedCount}/100 approved questions ({Math.round(progressPercentage)}%)
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Withdrawal Form */}
					{canWithdraw && (
						<form onSubmit={submitWithdraw} className="p-4 md:p-8 space-y-4 md:space-y-6">
							{/* Amount Input */}
							<div className="space-y-2">
								<label className="block text-sm md:text-base font-semibold text-gray-900 dark:text-white">
									💰 Withdrawal Amount
								</label>
								<div className="relative">
									<input 
										type="number" 
										className={`w-full border-2 rounded-lg md:rounded-xl p-3 md:p-4 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 transition-all duration-200 text-sm md:text-base ${
											focusedField === 'amount' 
												? 'border-red-500 ring-2 md:ring-4 ring-red-200 dark:ring-red-800' 
												: 'border-gray-300 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600'
										}`}
										placeholder="Enter amount (min ₹1000)"
										value={amount} 
										onChange={e => setAmount(e.target.value)}
										onFocus={() => setFocusedField('amount')}
										onBlur={() => setFocusedField(null)}
										min="1000"
										max={wallet.balance}
										step="1"
									/>
									<div className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2">
										<span className="text-gray-500 dark:text-gray-400 text-sm">₹</span>
									</div>
								</div>
								<p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
									Available balance: {formatCurrency(wallet.balance)} • Minimum: ₹1000
								</p>
							</div>

							{/* UPI Input */}
							<div className="space-y-2">
								<label className="block text-sm md:text-base font-semibold text-gray-900 dark:text-white">
									📱 UPI ID or Bank Details
								</label>
								<input 
									type="text" 
									className={`w-full border-2 rounded-lg md:rounded-xl p-3 md:p-4 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 transition-all duration-200 text-sm md:text-base ${
										focusedField === 'upi' 
											? 'border-red-500 ring-2 md:ring-4 ring-red-200 dark:ring-red-800' 
											: 'border-gray-300 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600'
									}`}
									placeholder="Enter UPI ID (e.g., username@paytm) or bank details"
									value={upi} 
									onChange={e => setUpi(e.target.value)}
									onFocus={() => setFocusedField('upi')}
									onBlur={() => setFocusedField(null)}
								/>
								<p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
									You can also update bank details in your profile
								</p>
							</div>

							{/* Submit Button */}
							<button 
								disabled={loading || !amount || !upi || Number(amount) < 1000 || Number(amount) > wallet.balance} 
								type="submit"
								className="w-full bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-lg md:rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none text-sm md:text-base"
							>
								{loading ? (
									<div className="flex items-center justify-center space-x-2">
										<div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white"></div>
										<span>Processing Withdrawal...</span>
									</div>
								) : (
									<div className="flex items-center justify-center space-x-2">
										<span>🚀</span>
										<span>Request Withdrawal</span>
			</div>
								)}
							</button>
			</form>
					)}

					{/* Help Section */}
					<div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
						<div className="flex items-start space-x-3">
							<div className="flex-shrink-0">
								<span className="text-lg md:text-xl">💡</span>
							</div>
							<div>
								<h3 className="text-sm md:text-base font-medium text-gray-900 dark:text-white mb-2">
									How it works:
								</h3>
								<ul className="space-y-1 text-xs md:text-sm text-gray-600 dark:text-gray-400">
									<li className="flex items-start space-x-2">
										<span className="text-yellow-600 dark:text-yellow-400 mt-1">•</span>
										<span>Earn ₹10 per approved question</span>
									</li>
									<li className="flex items-start space-x-2">
										<span className="text-yellow-600 dark:text-yellow-400 mt-1">•</span>
										<span>100 approved questions = ₹1000 = Withdrawal enabled</span>
									</li>
									<li className="flex items-start space-x-2">
										<span className="text-yellow-600 dark:text-yellow-400 mt-1">•</span>
										<span>Questions are reviewed by admin before approval</span>
									</li>
									<li className="flex items-start space-x-2">
										<span className="text-yellow-600 dark:text-yellow-400 mt-1">•</span>
										<span>Minimum withdrawal amount is ₹1000</span>
									</li>
									<li className="flex items-start space-x-2">
										<span className="text-yellow-600 dark:text-yellow-400 mt-1">•</span>
										<span>Withdrawal requests are processed within 24-48 hours</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Info */}
				<div className="mt-6 md:mt-8 text-center px-4">
					<p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
						Keep creating quality questions to increase your earnings! 🎯
					</p>
				</div>
			</div>
		</div>
	);
};

export default UserWallet;


