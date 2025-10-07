import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import { getCurrentUser } from '../../utils/authUtils';
import { toast } from 'react-toastify';

const MyUserQuizzes = () => {
	const navigate = useNavigate();
	const user = getCurrentUser();
	const isPro = (user?.subscriptionStatus || '').toLowerCase() === 'pro';

	const [quizzes, setQuizzes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
	const [stats, setStats] = useState(null);

	useEffect(() => {
		if (!isPro) {
			toast.error('Pro subscription required');
			navigate('/subscription');
			return;
		}
		fetchQuizzes();
		fetchStats();
	}, [filter, isPro, navigate]);

	const fetchQuizzes = async () => {
		setLoading(true);
		try {
			const params = filter !== 'all' ? { status: filter } : {};
			const response = await API.getMyQuizzes(params);
			if (response?.success) {
				setQuizzes(response.data || []);
			}
		} catch (err) {
			console.error('Error fetching quizzes:', err);
			toast.error('Failed to load quizzes');
		} finally {
			setLoading(false);
		}
	};

	const fetchStats = async () => {
		try {
			const response = await API.getQuizCreationStats();
			if (response?.success) {
				setStats(response.data);
			}
		} catch (err) {
			console.error('Error fetching stats:', err);
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Are you sure you want to delete this quiz?')) return;
		
		try {
			await API.deleteUserQuiz(id);
			toast.success('Quiz deleted successfully');
			fetchQuizzes();
		} catch (err) {
			toast.error(err?.message || 'Failed to delete quiz');
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
			case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
			default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
		}
	};

	if (!isPro) return null;

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
					<div className="flex justify-between items-center mb-4">
						<h1 className="text-3xl font-bold text-gray-800 dark:text-white">
							My Quizzes
						</h1>
						<button
							onClick={() => navigate('/pro/quiz/create')}
							className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
						>
							+ Create New Quiz
						</button>
					</div>

					{/* Statistics */}
					{stats && (
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
							<div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
								<div className="text-sm text-gray-600 dark:text-gray-400">Approved</div>
								<div className="text-2xl font-bold text-green-600 dark:text-green-400">
									{stats.totalApproved || 0}
								</div>
							</div>
							<div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
								<div className="text-sm text-gray-600 dark:text-gray-400">This Month</div>
								<div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
									{stats.monthlyCount || 0} / {stats.monthlyLimit || 99}
								</div>
							</div>
							{stats.nextMilestone && (
								<>
									<div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
										<div className="text-sm text-gray-600 dark:text-gray-400">Next Milestone</div>
										<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
											{stats.nextMilestone.count}
										</div>
										<div className="text-xs text-gray-500 mt-1">
											{stats.nextMilestone.tier}
										</div>
									</div>
									<div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
										<div className="text-sm text-gray-600 dark:text-gray-400">Progress</div>
										<div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
											{stats.progressToNextMilestone}%
										</div>
									</div>
								</>
							)}
						</div>
					)}

					{/* Filters */}
					<div className="flex gap-2">
						{['all', 'pending', 'approved', 'rejected'].map(f => (
							<button
								key={f}
								onClick={() => setFilter(f)}
								className={`px-4 py-2 rounded-lg font-medium capitalize ${
									filter === f
										? 'bg-blue-600 text-white'
										: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
								}`}
							>
								{f}
							</button>
						))}
					</div>
				</div>

				{/* Quiz List */}
				{loading ? (
					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
						<p className="mt-4 text-gray-600 dark:text-gray-400">Loading quizzes...</p>
					</div>
				) : quizzes.length === 0 ? (
					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
						<p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
							No quizzes found
						</p>
						<button
							onClick={() => navigate('/pro/quiz/create')}
							className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
						>
							Create Your First Quiz
						</button>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{quizzes.map(quiz => (
							<div key={quiz._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
								<div className="p-6">
									<div className="flex justify-between items-start mb-3">
										<h3 className="text-xl font-bold text-gray-800 dark:text-white line-clamp-2">
											{quiz.title}
										</h3>
										<span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(quiz.status)}`}>
											{quiz.status}
										</span>
									</div>

									<p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
										{quiz.description || 'No description'}
									</p>

									<div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
										<div className="flex justify-between">
											<span>Category:</span>
											<span className="font-medium text-gray-800 dark:text-white">
												{quiz.category?.name || 'N/A'}
											</span>
										</div>
										<div className="flex justify-between">
											<span>Difficulty:</span>
											<span className="font-medium text-gray-800 dark:text-white capitalize">
												{quiz.difficulty}
											</span>
										</div>
										<div className="flex justify-between">
											<span>Questions:</span>
											<span className="font-medium text-gray-800 dark:text-white">
												{quiz.questionCount || 0}
											</span>
										</div>
										<div className="flex justify-between">
											<span>Level:</span>
											<span className="font-medium text-gray-800 dark:text-white">
												{quiz.requiredLevel}
											</span>
										</div>
										{quiz.viewsCount !== undefined && (
											<div className="flex justify-between">
												<span>Views:</span>
												<span className="font-medium text-gray-800 dark:text-white">
													{quiz.viewsCount}
												</span>
											</div>
										)}
									</div>

									{quiz.adminNotes && (
										<div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
											<div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
												Admin Notes:
											</div>
											<p className="text-sm text-gray-600 dark:text-gray-400">
												{quiz.adminNotes}
											</p>
										</div>
									)}

									<div className="mt-4 flex gap-2">
										{quiz.status === 'pending' && (
											<button
												onClick={() => handleDelete(quiz._id)}
												className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-semibold"
											>
												Delete
											</button>
										)}
										<button
											onClick={() => navigate(`/pro/quiz/${quiz._id}`)}
											className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-semibold"
										>
											View Details
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default MyUserQuizzes;

