import React, { useState, useEffect } from 'react';
import API from '../../utils/api';
import { toast } from 'react-toastify';
import AdminMobileAppWrapper from '../../components/AdminMobileAppWrapper';
import { useSelector } from 'react-redux';
import Sidebar from '../../components/Sidebar';
import { useLocation } from 'react-router-dom';
import { getCurrentUser } from "../../utils/authUtils";

const AdminUserQuizzes = () => {
	const location = useLocation();
	const [activeTab, setActiveTab] = useState('quizzes'); // quizzes, categories, subcategories
	const [quizzes, setQuizzes] = useState([]);
	const [categories, setCategories] = useState([]);
	const [subcategories, setSubcategories] = useState([]);
	const [loading, setLoading] = useState(false);
	const [selectedQuiz, setSelectedQuiz] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [adminNotes, setAdminNotes] = useState('');
	const [actionType, setActionType] = useState(''); // approve, reject
	// always in admin route in this page
	const isOpen = useSelector((state) => state.sidebar.isOpen);
	const isAdminRoute = location.pathname.startsWith("/admin");
	const user = getCurrentUser();

	useEffect(() => {
		fetchData();
	}, [activeTab]);

	const fetchData = async () => {
		setLoading(true);
		try {
			if (activeTab === 'quizzes') {
				const response = await API.adminGetPendingQuizzes();
				if (response?.success) setQuizzes(response.data || []);
			} else if (activeTab === 'categories') {
				const response = await API.adminGetPendingCategories();
				if (response?.success) setCategories(response.data || []);
			} else if (activeTab === 'subcategories') {
				const response = await API.adminGetPendingSubcategories();
				if (response?.success) setSubcategories(response.data || []);
			}
		} catch (err) {
			console.error('Error fetching data:', err);
			toast.error('Failed to load data');
		} finally {
			setLoading(false);
		}
	};

	const handleViewQuiz = async (quizId) => {
		try {
			const response = await API.adminGetPendingQuizDetails(quizId);
			if (response?.success) {
				setSelectedQuiz(response.data);
				setShowModal(true);
			}
		} catch (err) {
			toast.error('Failed to load quiz details');
		}
	};

	const handleApproveQuiz = async (id) => {
		try {
			const response = await API.adminApproveQuiz(id, adminNotes);
			if (response?.success) {
				toast.success(response.message || 'Quiz approved successfully');
				if (response.data?.milestoneAchieved) {
					toast.success(`🎉 Milestone achieved! User upgraded to ${response.data.milestoneDetails.tier}`, { autoClose: 5000 });
				}
			}
			setShowModal(false);
			setAdminNotes('');
			fetchData();
		} catch (err) {
			toast.error(err?.message || 'Failed to approve quiz');
		}
	};

	const handleRejectQuiz = async (id) => {
		if (!adminNotes.trim()) {
			toast.error('Please provide rejection reason');
			return;
		}
		try {
			await API.adminRejectQuiz(id, adminNotes);
			toast.success('Quiz rejected');
			setShowModal(false);
			setAdminNotes('');
			fetchData();
		} catch (err) {
			toast.error(err?.message || 'Failed to reject quiz');
		}
	};

	const handleApproveCategory = async (id) => {
		try {
			await API.adminApproveCategory(id, '');
			toast.success('Category approved');
			fetchData();
		} catch (err) {
			toast.error(err?.message || 'Failed to approve category');
		}
	};

	const handleRejectCategory = async (id) => {
		const reason = prompt('Enter rejection reason:');
		if (!reason) return;
		try {
			await API.adminRejectCategory(id, reason);
			toast.success('Category rejected');
			fetchData();
		} catch (err) {
			toast.error(err?.message || 'Failed to reject category');
		}
	};

	const handleApproveSubcategory = async (id) => {
		try {
			await API.adminApproveSubcategory(id, '');
			toast.success('Subcategory approved');
			fetchData();
		} catch (err) {
			toast.error(err?.message || 'Failed to approve subcategory');
		}
	};

	const handleRejectSubcategory = async (id) => {
		const reason = prompt('Enter rejection reason:');
		if (!reason) return;
		try {
			await API.adminRejectSubcategory(id, reason);
			toast.success('Subcategory rejected');
			fetchData();
		} catch (err) {
			toast.error(err?.message || 'Failed to reject subcategory');
		}
	};

	return (
		<AdminMobileAppWrapper title="User Questions">
      	<div className={`adminPanel ${isOpen ? "showPanel" : "hidePanel"}`}>
        	{user?.role === "admin" && isAdminRoute && <Sidebar />}
        	<div className="adminContent w-full text-gray-900 dark:text-white">
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="mx-auto p-4">
				{/* Header */}
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
					<h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
						User Quiz Management
					</h1>

					{/* Tabs */}
					<div className="flex gap-2">
						{['quizzes', 'categories', 'subcategories'].map(tab => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`px-6 py-3 rounded-lg font-medium capitalize ${
									activeTab === tab
										? 'bg-blue-600 text-white'
										: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
								}`}
							>
								{tab}
							</button>
						))}
					</div>
				</div>

				{/* Content */}
				{loading ? (
					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
						<p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
					</div>
				) : (
					<>
						{/* Quizzes Tab */}
						{activeTab === 'quizzes' && (
							<div className="space-y-4">
								{quizzes.length === 0 ? (
									<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
										<p className="text-xl text-gray-600 dark:text-gray-400">
											No pending quizzes
										</p>
									</div>
								) : (
									quizzes.map(quiz => (
										<div key={quiz._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
											<div className="flex justify-between items-start">
												<div className="flex-1">
													<h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
														{quiz.title}
													</h3>
													<p className="text-gray-600 dark:text-gray-400 mb-3">
														{quiz.description}
													</p>
													<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
														<div>
															<span className="text-gray-500">Creator:</span>
															<p className="font-medium text-gray-800 dark:text-white">
																{quiz.createdBy?.name || 'Unknown'}
															</p>
														</div>
														<div>
															<span className="text-gray-500">Category:</span>
															<p className="font-medium text-gray-800 dark:text-white">
																{quiz.category?.name || 'N/A'}
															</p>
														</div>
														<div>
															<span className="text-gray-500">Difficulty:</span>
															<p className="font-medium text-gray-800 dark:text-white capitalize">
																{quiz.difficulty}
															</p>
														</div>
														<div>
															<span className="text-gray-500">Questions:</span>
															<p className="font-medium text-gray-800 dark:text-white">
																{quiz.questionCount || 0}
															</p>
														</div>
													</div>
												</div>
												<button
													onClick={() => handleViewQuiz(quiz._id)}
													className="ml-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
												>
													Review
												</button>
											</div>
										</div>
									))
								)}
							</div>
						)}

						{/* Categories Tab */}
						{activeTab === 'categories' && (
							<div className="space-y-4">
								{categories.length === 0 ? (
									<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
										<p className="text-xl text-gray-600 dark:text-gray-400">
											No pending categories
										</p>
									</div>
								) : (
									categories.map(cat => (
										<div key={cat._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
											<div className="flex justify-between items-start">
												<div className="flex-1">
													<h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
														{cat.name}
													</h3>
													<p className="text-gray-600 dark:text-gray-400 mb-3">
														{cat.description || 'No description'}
													</p>
													<div className="text-sm">
														<span className="text-gray-500">Created by:</span>
														<span className="font-medium text-gray-800 dark:text-white ml-2">
															{cat.createdBy?.name || 'Unknown'}
														</span>
													</div>
												</div>
												<div className="flex gap-2 ml-4">
													<button
														onClick={() => handleApproveCategory(cat._id)}
														className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
													>
														✓ Approve
													</button>
													<button
														onClick={() => handleRejectCategory(cat._id)}
														className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
													>
														✗ Reject
													</button>
												</div>
											</div>
										</div>
									))
								)}
							</div>
						)}

						{/* Subcategories Tab */}
						{activeTab === 'subcategories' && (
							<div className="space-y-4">
								{subcategories.length === 0 ? (
									<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
										<p className="text-xl text-gray-600 dark:text-gray-400">
											No pending subcategories
										</p>
									</div>
								) : (
									subcategories.map(sub => (
										<div key={sub._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
											<div className="flex justify-between items-start">
												<div className="flex-1">
													<h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
														{sub.name}
													</h3>
													<p className="text-gray-600 dark:text-gray-400 mb-3">
														{sub.description || 'No description'}
													</p>
													<div className="grid grid-cols-2 gap-4 text-sm">
														<div>
															<span className="text-gray-500">Category:</span>
															<span className="font-medium text-gray-800 dark:text-white ml-2">
																{sub.category?.name || 'N/A'}
															</span>
														</div>
														<div>
															<span className="text-gray-500">Created by:</span>
															<span className="font-medium text-gray-800 dark:text-white ml-2">
																{sub.createdBy?.name || 'Unknown'}
															</span>
														</div>
													</div>
												</div>
												<div className="flex gap-2 ml-4">
													<button
														onClick={() => handleApproveSubcategory(sub._id)}
														className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
													>
														✓ Approve
													</button>
													<button
														onClick={() => handleRejectSubcategory(sub._id)}
														className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
													>
														✗ Reject
													</button>
												</div>
											</div>
										</div>
									))
								)}
							</div>
						)}
					</>
				)}

				{/* Quiz Review Modal */}
				{showModal && selectedQuiz && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
						<div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
							<h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
								Review Quiz: {selectedQuiz.title}
							</h2>

							<div className="space-y-4 mb-6">
								<div className="grid grid-cols-2 gap-4 text-sm">
									<div>
										<span className="text-gray-500">Category:</span>
										<p className="font-medium text-gray-800 dark:text-white">
											{selectedQuiz.category?.name} / {selectedQuiz.subcategory?.name}
										</p>
									</div>
									<div>
										<span className="text-gray-500">Difficulty:</span>
										<p className="font-medium text-gray-800 dark:text-white capitalize">
											{selectedQuiz.difficulty}
										</p>
									</div>
									<div>
										<span className="text-gray-500">Level:</span>
										<p className="font-medium text-gray-800 dark:text-white">
											{selectedQuiz.requiredLevel}
										</p>
									</div>
									<div>
										<span className="text-gray-500">Time Limit:</span>
										<p className="font-medium text-gray-800 dark:text-white">
											{selectedQuiz.timeLimit} minutes
										</p>
									</div>
								</div>

								<div>
									<h3 className="font-bold text-gray-800 dark:text-white mb-2">Description:</h3>
									<p className="text-gray-600 dark:text-gray-400">
										{selectedQuiz.description || 'No description'}
									</p>
								</div>

								<div>
									<h3 className="font-bold text-gray-800 dark:text-white mb-3">
										Questions ({selectedQuiz.questions?.length || 0}):
									</h3>
									<div className="space-y-4">
										{selectedQuiz.questions?.map((q, i) => (
											<div key={i} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
												<p className="font-medium text-gray-800 dark:text-white mb-2">
													{i + 1}. {q.questionText}
												</p>
												<div className="grid grid-cols-2 gap-2 ml-4">
													{q.options.map((opt, j) => (
														<div key={j} className={`p-2 rounded ${
															j === q.correctAnswerIndex
																? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 font-semibold'
																: 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300'
														}`}>
															{j + 1}. {opt}
															{j === q.correctAnswerIndex && ' ✓'}
														</div>
													))}
												</div>
												<div className="text-xs text-gray-500 mt-2">
													Time: {q.timeLimit}s
												</div>
											</div>
										))}
									</div>
								</div>
							</div>

							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Admin Notes (optional for approval, required for rejection):
								</label>
								<textarea
									value={adminNotes}
									onChange={(e) => setAdminNotes(e.target.value)}
									className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
									rows={3}
									placeholder="Enter notes for the creator..."
								/>
							</div>

							<div className="flex gap-4">
								<button
									onClick={() => {
										setShowModal(false);
										setAdminNotes('');
									}}
									className="flex-1 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold"
								>
									Cancel
								</button>
								<button
									onClick={() => handleRejectQuiz(selectedQuiz._id)}
									className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
								>
									✗ Reject
								</button>
								<button
									onClick={() => handleApproveQuiz(selectedQuiz._id)}
									className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
								>
									✓ Approve
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
			</div>
			</div>
		</div>
		</AdminMobileAppWrapper>
	);
};

export default AdminUserQuizzes;

