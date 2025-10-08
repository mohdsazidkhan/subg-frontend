import React, { useEffect, useState, useCallback } from 'react';
import API from '../../utils/api';
import { toast } from 'react-toastify';
import Sidebar from '../../components/Sidebar';
import { useSelector } from 'react-redux';
import AdminMobileAppWrapper from '../../components/AdminMobileAppWrapper';
import { useLocation } from 'react-router-dom';
import { getCurrentUser } from '../../utils/authUtils';
import ResponsiveTable from '../../components/ResponsiveTable';
import Pagination from '../../components/Pagination';
import SearchFilter from '../../components/SearchFilter';
// import { useLocation } from 'react-router-dom';

const AdminWithdrawRequests = () => {
	const [items, setItems] = useState([]);
	const [status, setStatus] = useState('pending');
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);
	const [updating, setUpdating] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [itemsPerPage, setItemsPerPage] = useState(20);
	const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });

	// const location = useLocation();
	// always in admin route in this page
	const isOpen = useSelector((state) => state.sidebar.isOpen);
	const location = useLocation();
	const isAdminRoute = location.pathname.startsWith('/admin');
	const user = getCurrentUser();

	const load = useCallback(async () => {
		setLoading(true);
		try {
			const params = {
				status,
				page,
				limit: itemsPerPage,
				...(searchTerm && { search: searchTerm })
			};
			const res = await API.adminGetWithdrawRequests(params);
			if (res?.success) {
				const dataWithIndex = (res.data || []).map((item, index) => ({
					...item,
					_sno: ((page - 1) * itemsPerPage) + index + 1
				}));
				setItems(dataWithIndex);
				setTotal(res.pagination?.total || 0);
				setPagination(res.pagination || { page: 1, limit: itemsPerPage, total: 0, totalPages: 1 });
			}
		} catch (err) {
			toast.error(err?.message || 'Failed to load withdraw requests');
		} finally {
			setLoading(false);
		}
	}, [status, page, itemsPerPage, searchTerm]);

	useEffect(() => { load(); }, [load]);

	const updateStatus = async (id, newStatus) => {
		setUpdating(id);
		try {
			await API.adminUpdateWithdrawStatus(id, newStatus);
			toast.success(`Withdraw request ${newStatus} successfully!`);
			load();
		} catch (err) {
			toast.error(err?.message || 'Update failed');
		} finally {
			setUpdating(null);
		}
	};

	const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

	const getStatusColor = (status) => {
		switch(status) {
			case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200';
			case 'approved': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200';
			case 'rejected': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200';
			case 'paid': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200';
			default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200';
		}
	};

	const getStatusIcon = (status) => {
		switch(status) {
			case 'pending': return '⏳';
			case 'approved': return '✅';
			case 'rejected': return '❌';
			case 'paid': return '💳';
			default: return '❓';
		}
	};

	const handleItemsPerPageChange = (e) => {
		setItemsPerPage(parseInt(e.target.value));
		setPage(1);
	};

	const handleSearch = (search) => {
		setSearchTerm(search);
		setPage(1);
	};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat('en-IN', {
			style: 'currency',
			currency: 'INR',
			minimumFractionDigits: 0,
			maximumFractionDigits: 2
		}).format(amount);
	};

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

	const formatTime = (date) => {
		return new Date(date).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});
	};

	// Define table columns for ResponsiveTable
	const columns = [
		{
			key: 'sno',
			header: 'S.No.',
			render: (value, req) => {
				return (
					<div className="text-sm text-gray-600 dark:text-gray-300">
						{req._sno || 'N/A'}
					</div>
				);
			}
		},
		{
			key: 'request',
			header: 'Request Details',
			render: (_, req) => (
				<div className="space-y-2">
					<div className="text-sm font-medium text-gray-900 dark:text-white">
						Request ID: {req._id?.slice(-8) || 'N/A'}
					</div>
					{req.processedAt && (
						<div className="text-xs text-gray-500 dark:text-gray-400">
							Processed: {formatDate(req.processedAt)} at {formatTime(req.processedAt)}
						</div>
					)}
				</div>
			)
		},
		{
			key: 'createdAt',
			header: 'Created At',
			render: (_, req) => (
				<div className="text-sm">
					<div className="font-medium text-gray-900 dark:text-white">
						{formatDate(req.requestedAt)}
					</div>
					<div className="text-xs text-gray-500 dark:text-gray-400">
						{formatTime(req.requestedAt)}
					</div>
				</div>
			)
		},
		{
			key: 'user',
			header: 'User Info',
			render: (_, req) => (
				<div className="text-sm space-y-1">
					<div className="font-medium text-gray-900 dark:text-white">
						{req.userId?.name || 'N/A'}
					</div>
					<div className="text-gray-600 dark:text-gray-400 text-xs">
						📧 {req.userId?.email || 'N/A'}
					</div>
					<div className="text-gray-600 dark:text-gray-400 text-xs">
						📱 {req.userId?.phone || 'N/A'}
					</div>
				</div>
			)
		},
		{
			key: 'amount',
			header: 'Amount',
			render: (_, req) => (
				<div className="space-y-1">
					<div className="text-lg font-bold text-green-600 dark:text-green-400">
						{formatCurrency(req.amount)}
					</div>
					{req.upi && (
						<div className="text-xs text-purple-600 dark:text-purple-400">
							<div className="font-semibold">UPI ID</div>
							<div className="font-mono">{req.upi}</div>
						</div>
					)}
				</div>
			)
		},
		{
			key: 'bankDetails',
			header: 'Bank Details',
			render: (_, req) => (
				<div className="text-xs">
					{req.bankDetail ? (
						<div className="space-y-1 text-gray-700 dark:text-gray-300">
							<div><strong>A/C Holder:</strong> {req.bankDetail.accountHolderName}</div>
							<div><strong>Bank:</strong> {req.bankDetail.bankName}</div>
							<div><strong>A/C No:</strong> <span className="font-mono">{req.bankDetail.accountNumber}</span></div>
							<div><strong>IFSC:</strong> <span className="font-mono">{req.bankDetail.ifscCode}</span></div>
							{req.bankDetail.branchName && <div><strong>Branch:</strong> {req.bankDetail.branchName}</div>}
						</div>
					) : (
						<div className="text-gray-500 dark:text-gray-400 italic">No bank details</div>
					)}
				</div>
			)
		},
		{
			key: 'status',
			header: 'Status & Actions',
			render: (_, req) => (
				<div className="space-y-2">
					<div className={`px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(req.status)}`}>
						{getStatusIcon(req.status)} {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
					</div>
					{req.status === 'pending' && (
						<div className="flex space-x-1">
							<button 
								onClick={()=>updateStatus(req._id, 'approved')} 
								disabled={updating === req._id}
								className="px-2 py-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded text-xs font-medium transition-colors flex items-center space-x-1"
							>
								{updating === req._id ? (
									<>
										<div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
										<span>Processing...</span>
									</>
								) : (
									<>
										<span>✅</span>
										<span>Approve</span>
									</>
								)}
							</button>
							<button 
								onClick={()=>updateStatus(req._id, 'rejected')} 
								disabled={updating === req._id}
								className="px-2 py-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded text-xs font-medium transition-colors flex items-center space-x-1"
							>
								{updating === req._id ? (
									<>
										<div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
										<span>Processing...</span>
									</>
								) : (
									<>
										<span>❌</span>
										<span>Reject</span>
									</>
								)}
							</button>
						</div>
					)}
					{req.status === 'approved' && (
						<button 
							onClick={()=>updateStatus(req._id, 'paid')} 
							disabled={updating === req._id}
							className="px-2 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded text-xs font-medium transition-colors flex items-center space-x-1"
						>
							{updating === req._id ? (
								<>
									<div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
									<span>Processing...</span>
								</>
							) : (
								<>
									<span>💳</span>
									<span>Mark as Paid</span>
								</>
							)}
						</button>
					)}
				</div>
			)
		}
	];

	// default view handled by custom mobile/desktop render below

	const content = (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="mx-auto p-4">
				{/* Header */}
				<div className="mb-4">
						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
							<div>
								<h1 className="text-xl lg:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
									<span className="text-xl lg:text-4xl mr-3">💰</span>
									Withdraw Requests ({total})
								</h1>
								<p className="mt-2 text-gray-600 dark:text-gray-400">
									Review and approve/reject user withdrawal requests
								</p>
							</div>
							<SearchFilter
								onSearch={handleSearch}
								placeholder="Search requests..."
								className="w-full sm:w-60"
							/>
							<div className="flex items-center space-x-2">
								<label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
									Status:
								</label>
								<select
									value={status}
									onChange={(e) => { setPage(1); setStatus(e.target.value); }}
									className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
								>
									<option value="pending">⏳ Pending</option>
									<option value="approved">✅ Approved</option>
									<option value="rejected">❌ Rejected</option>
									<option value="paid">💳 Paid</option>
				</select>
							</div>
							<div className="flex items-center space-x-2 flex-shrink-0">
							<label className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">Show:</label>
							<select
								value={itemsPerPage}
								onChange={handleItemsPerPageChange}
								className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-0"
							>
							 <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={250}>250</option>
              <option value={500}>500</option>
              <option value={1000}>1000</option>
							</select>
							</div>
						</div>
				</div>

				{/* Content */}
				{loading ? (
					<div className="flex items-center justify-center h-64">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
					</div>
				) : items.length === 0 ? (
					<div className="text-center py-12">
						<div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">💰</div>
						<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
							No withdraw requests found
						</h3>
						<p className="text-gray-600 dark:text-gray-400">
							{status === 'pending' ? 'No pending withdraw requests to review.' : `No ${status} withdraw requests found.`}
						</p>
					</div>
				) : (
						<>
							<div className="hidden md:block">
								<ResponsiveTable
									data={items}
									columns={columns}
									viewModes={['table']}
									defaultView={'table'}
									showPagination={false}
									showViewToggle={false}
								/>
							</div>
							<div className="md:hidden space-y-3">
								{items.map((req) => (
									<div key={req._id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
										<div className="flex items-center justify-between mb-3">
											<div className="text-lg font-bold text-green-600 dark:text-green-400">₹{req.amount}</div>
											<div className={`px-2 py-0.5 rounded text-xs border ${getStatusColor(req.status)}`}>{getStatusIcon(req.status)} {req.status}</div>
										</div>
										
										<div className="space-y-2 mb-3">
											<div className="text-sm">
												<div className="font-semibold text-gray-900 dark:text-white">{req.userId?.name || 'N/A'}</div>
												<div className="text-xs text-gray-600 dark:text-gray-400">📧 {req.userId?.email || 'N/A'}</div>
												<div className="text-xs text-gray-600 dark:text-gray-400">📱 {req.userId?.phone || 'N/A'}</div>
											</div>
											<div className="text-xs text-gray-500 dark:text-gray-400">
												Requested: {formatDate(req.requestedAt)} at {formatTime(req.requestedAt)}
											</div>
										</div>

										{req.bankDetail && (
											<div className="mb-3 text-xs bg-blue-50 dark:bg-blue-900/30 p-2 rounded border border-blue-200 dark:border-blue-800">
												<div className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Bank Details</div>
												<div className="text-blue-600 dark:text-blue-400 space-y-1">
													<div>{req.bankDetail.accountHolderName}</div>
													<div>{req.bankDetail.bankName}</div>
													<div className="font-mono">{req.bankDetail.accountNumber}</div>
													<div className="font-mono">{req.bankDetail.ifscCode}</div>
												</div>
											</div>
										)}

										{req.upi && (
											<div className="mb-3 text-xs bg-purple-50 dark:bg-purple-900/30 p-2 rounded border border-purple-200 dark:border-purple-800">
												<div className="font-semibold text-purple-700 dark:text-purple-300 mb-1">UPI ID</div>
												<div className="text-purple-600 dark:text-purple-400 font-mono">{req.upi}</div>
											</div>
										)}

										{req.status === 'pending' && (
											<div className="mt-2 flex gap-2">
												<button onClick={()=>updateStatus(req._id, 'approved')} className="flex-1 px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs">✅ Approve</button>
												<button onClick={()=>updateStatus(req._id, 'rejected')} className="flex-1 px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs">❌ Reject</button>
											</div>
										)}
										{req.status === 'approved' && (
											<button onClick={()=>updateStatus(req._id, 'paid')} className="w-full px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs">💳 Mark as Paid</button>
										)}
									</div>
								))}
							</div>
						
						{/* Pagination */}
						{pagination.totalPages > 1 && (
							<div className="mt-6">
								<Pagination
									currentPage={pagination.page || page}
									totalPages={pagination.totalPages || totalPages}
									onPageChange={setPage}
									totalItems={pagination.total || total}
									itemsPerPage={pagination.limit || itemsPerPage}
								/>
							</div>
						)}
						</>
					)}
			</div>
		</div>
	);

	return (
		<AdminMobileAppWrapper title="Withdraw Requests">
			<div className={`adminPanel ${isOpen ? 'showPanel' : 'hidePanel'}`}>
				{user?.role === 'admin' && isAdminRoute && <Sidebar />}
				<div className="adminContent w-full text-gray-900 dark:text-white">
					{content}
				</div>
			</div>
		</AdminMobileAppWrapper>
	);
};

export default AdminWithdrawRequests;
