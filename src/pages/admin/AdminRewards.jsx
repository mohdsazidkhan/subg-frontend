import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../utils/api';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import SearchFilter from '../../components/SearchFilter';
import Pagination from '../../components/Pagination';
import ViewToggle from '../../components/ViewToggle';
import { isMobile } from 'react-device-detect';

const AdminRewards = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, limit: 10 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ level: '', onlyLocked: '' });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState(isMobile ? 'list' : 'table');

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

  // List View Component
  const ListView = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {loading ? (
          <div className="p-6 text-center text-gray-600 dark:text-gray-300">Loading...</div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">No users found</div>
        ) : (
          users.map(u => (
            <div key={u._id} className="p-4 md:p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start">
                <div className="flex items-center mb-4 md:mb-0 md:mr-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-full flex items-center justify-center mr-3">
                    <span className="text-lg">🏆</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{u.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{u.email}</p>
                    {u.phone && <p className="text-sm text-gray-500 dark:text-gray-400">{u.phone}</p>}
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Level & Quizzes</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Level:</span>
                        <span className="font-medium">Level {u.level?.currentLevel || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quizzes:</span>
                        <span className="font-medium">{u.totalQuizzesPlayed}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rewards</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-yellow-600">Locked:</span>
                        <span className="font-medium text-yellow-700 dark:text-yellow-300">₹{currency(u.totals?.locked)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-600">Unlocked:</span>
                        <span className="font-medium text-green-700 dark:text-green-300">₹{currency(u.totals?.unlocked)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-600">Claimed:</span>
                        <span className="font-medium text-purple-700 dark:text-purple-300">₹{currency(u.totals?.claimed)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Details</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-emerald-600">Claimable:</span>
                        <span className="font-medium text-emerald-700 dark:text-emerald-300">₹{currency(u.claimableRewards)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Counts:</span>
                        <span className="font-medium">L:{u.counts?.locked || 0} U:{u.counts?.unlocked || 0} C:{u.counts?.claimed || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Joined:</span>
                        <span className="font-medium">{new Date(u.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {u.lockedLevels && u.lockedLevels.length > 0 && (
                  <div className="mt-4 md:mt-0 md:ml-4">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-700">
                      <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">Locked Levels</h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        {u.lockedLevels.sort((a,b)=>a-b).join(', ')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Card View Component
  const CardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {loading ? (
        <div className="col-span-full text-center py-12 text-gray-600 dark:text-gray-300">Loading...</div>
      ) : users.length === 0 ? (
        <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">No users found</div>
      ) : (
        users.map(u => (
          <div key={u._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-full flex items-center justify-center mr-3">
                    <span className="text-lg">🏆</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{u.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{u.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Level {u.level?.currentLevel || 0}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{u.totalQuizzesPlayed} quizzes</div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Locked:</span>
                  <span className="font-medium text-yellow-700 dark:text-yellow-300">₹{currency(u.totals?.locked)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Unlocked:</span>
                  <span className="font-medium text-green-700 dark:text-green-300">₹{currency(u.totals?.unlocked)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Claimed:</span>
                  <span className="font-medium text-purple-700 dark:text-purple-300">₹{currency(u.totals?.claimed)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Claimable:</span>
                  <span className="font-medium text-emerald-700 dark:text-emerald-300">₹{currency(u.claimableRewards)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Counts: L:{u.counts?.locked || 0} U:{u.counts?.unlocked || 0} C:{u.counts?.claimed || 0}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Joined: {new Date(u.createdAt).toLocaleDateString()}
                </div>
                {u.lockedLevels && u.lockedLevels.length > 0 && (
                  <div className="mt-2">
                    <div className="inline-block bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-1 rounded">
                      Locked: {u.lockedLevels.sort((a,b)=>a-b).join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className={`adminPanel ${isOpen ? 'showPanel' : 'hidePanel'}`}>
      {location.pathname.startsWith('/admin') && <Sidebar />}
      <div className="adminContent p-2 md:p-6 w-full text-gray-900 dark:text-white">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-4 mb-4">

            <div>
              <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold">Rewards Tracking</h1>
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
          <div className="flex items-center justify-between mt-4">
            <ViewToggle
              currentView={viewMode}
              onViewChange={setViewMode}
              views={['table', 'list', 'grid']}
            />
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Show:</label>
              <select className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={itemsPerPage} onChange={(e)=>setItemsPerPage(Number(e.target.value))}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🏆</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No users found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm ? 'Try adjusting your search terms.' : 'No reward users found yet.'}
            </p>
          </div>
        ) : (
          <>
            {viewMode === 'table' && (
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
                      {users.map(u => (
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {viewMode === 'grid' && <CardView />}
            {viewMode === 'list' && <ListView />}
          </>
        )}

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


