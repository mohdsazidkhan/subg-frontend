import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../utils/api';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import SearchFilter from '../../components/SearchFilter';
import Pagination from '../../components/Pagination';

const AdminRewards = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, limit: 10 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ level: '', onlyLocked: '' });
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const location = useLocation();
  const isOpen = useSelector((state) => state.sidebar.isOpen);

  const fetchData = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: itemsPerPage };
      if (searchTerm) params.search = searchTerm;
      if (filters.level) params.level = filters.level;
      if (filters.onlyLocked) params.onlyLocked = filters.onlyLocked;
      const res = await API.getAdminRewardUsers(params);
      setUsers(res.users || []);
      setPagination(res.pagination || { page: 1, totalPages: 1, total: 0, limit: itemsPerPage });
    } catch (err) {
      console.error('Failed to fetch reward users:', err);
      toast.error(err.response?.data?.message || 'Failed to fetch reward users');
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage, searchTerm, filters]);

  useEffect(() => {
    fetchData(1);
  }, [itemsPerPage, searchTerm, filters, fetchData]);

  const filterOptions = useMemo(() => ({
    level: {
      label: 'Level',
      options: Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: `Level ${i + 1}` }))
    },
    onlyLocked: {
      label: 'Locked Only',
      options: [
        { value: '1', label: 'Show only users with locked rewards' }
      ]
    }
  }), []);

  const currency = (n) => (n || 0).toLocaleString('en-IN');

  return (
    <div className={`adminPanel ${isOpen ? 'showPanel' : 'hidePanel'}`}>
      {location.pathname.startsWith('/admin') && <Sidebar />}
      <div className="adminContent p-2 md:p-6 w-full text-gray-900 dark:text-white">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">🏆</span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Rewards Tracking</h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Monitor users' locked, unlocked, and claimed rewards</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-600">
              <div className="text-sm text-blue-600 dark:text-blue-400">Total Users</div>
              <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">{pagination.total || 0}</div>
            </div>
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-600">
              <div className="text-sm text-yellow-700 dark:text-yellow-400">Total Locked</div>
              <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">₹{currency(users.reduce((a,u)=>a+(u.totals?.locked||0),0))}</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-600">
              <div className="text-sm text-green-700 dark:text-green-400">Total Unlocked</div>
              <div className="text-2xl font-bold text-green-800 dark:text-green-200">₹{currency(users.reduce((a,u)=>a+(u.totals?.unlocked||0),0))}</div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-600">
              <div className="text-sm text-purple-700 dark:text-purple-400">Total Claimed</div>
              <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">₹{currency(users.reduce((a,u)=>a+(u.totals?.claimed||0),0))}</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            onFilterChange={(k,v)=>setFilters(prev=>({...prev,[k]:v}))}
            onClearFilters={()=>setFilters({ level: '' })}
            filterOptions={filterOptions}
            placeholder="Search by name, email, phone, or referral code..."
          />
          <div className="flex items-center justify-end mt-4">
            <label className="text-sm mr-2">Show:</label>
            <select className="px-2 py-1 border rounded text-sm bg-white dark:bg-gray-700" value={itemsPerPage} onChange={(e)=>setItemsPerPage(Number(e.target.value))}>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-[1100px] md:w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Level</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quizzes</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Locked</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Unlocked</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Claimed</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Claimable</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Counts</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Locked Levels</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr><td colSpan="9" className="px-4 py-6 text-center text-gray-600 dark:text-gray-300">Loading...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan="9" className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">No users found</td></tr>
                ) : (
                  users.map(u => (
                    <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3">
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{u.email}</div>
                        {u.phone && <div className="text-xs text-gray-500 dark:text-gray-400">{u.phone}</div>}
                      </td>
                      <td className="px-4 py-3">Level {u.level?.currentLevel || 0}</td>
                      <td className="px-4 py-3">{u.totalQuizzesPlayed}</td>
                      <td className="px-4 py-3 text-yellow-700 dark:text-yellow-300">₹{currency(u.totals?.locked)}</td>
                      <td className="px-4 py-3 text-green-700 dark:text-green-300">₹{currency(u.totals?.unlocked)}</td>
                      <td className="px-4 py-3 text-purple-700 dark:text-purple-300">₹{currency(u.totals?.claimed)}</td>
                      <td className="px-4 py-3 text-emerald-700 dark:text-emerald-300">₹{currency(u.claimableRewards)}</td>
                      <td className="px-4 py-3 text-sm">
                        L:{u.counts?.locked || 0} U:{u.counts?.unlocked || 0} C:{u.counts?.claimed || 0}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {(u.lockedLevels && u.lockedLevels.length > 0) ? u.lockedLevels.sort((a,b)=>a-b).join(', ') : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {pagination.totalPages > 1 && (
          <div className="mt-4">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(p)=>fetchData(p)}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRewards;


