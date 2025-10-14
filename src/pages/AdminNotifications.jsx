import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useSelector } from 'react-redux';
import AdminMobileAppWrapper from '../components/AdminMobileAppWrapper';

const AdminNotifications = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchPage = async (p = 1) => {
    try {
      setLoading(true);
      const res = await API.getAdminNotifications(p, limit, { unreadOnly: false });
      const data = res?.data || res?.notifications || [];
      setItems(data);
      const pg = res?.pagination || { page: p, totalPages: 1 };
      setPage(pg.page || p);
      setTotalPages(pg.totalPages || 1);
    } catch (e) {
      // noop
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPage(1); }, []);

  const user = JSON.parse(localStorage.getItem('userInfo'));
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isOpen = useSelector((state) => state.sidebar.isOpen);

  const typeToPath = {
    question: '/admin/user-questions',
    quiz: '/admin/user-quizzes',
    withdraw: '/admin/withdraw-requests',
    contact: '/admin/contacts',
    bank: '/admin/bank-details',
    subscription: '/admin/subscriptions',
    registration: '/admin/students',
    quiz_attempt: '/admin/analytics/performance'
  };

  return (
    <AdminMobileAppWrapper title="Notifications">
      <div className={`adminPanel ${isOpen ? 'showPanel' : 'hidePanel'}`}>
        {user?.role === 'admin' && isAdminRoute && <Sidebar />}
        <div className="adminContent p-2 md:p-6 w-full text-gray-900 dark:text-white">
          <div className="mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Notifications</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage recent admin notifications</p>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-2">
                <select value={limit} onChange={(e)=>{setLimit(parseInt(e.target.value)); fetchPage(1);}} className="w-full lg:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  {[10,20,50,100].map(n => <option key={n} value={n}>{n} / page</option>)}
                </select>
                <button onClick={()=>API.clearAdminNotifications().then(()=>fetchPage(1))} className="w-full md:-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">Clear All</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                <div className="col-span-full flex items-center justify-center h-48">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                </div>
              ) : items.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🔔</div>
                  <h3 className="text-md md:text-lg font-medium text-gray-900 dark:text-white mb-2">No notifications</h3>
                  <p className="text-gray-600 dark:text-gray-400">You're all caught up.</p>
                </div>
              ) : (
                items.map(n => {
                  const href = typeToPath[n.type] || '/admin/notifications';
                  return (
                    <a
                      key={n._id}
                      href={href}
                      className={`block rounded-lg shadow-md border overflow-hidden ${n.isRead ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800' : 'border-blue-300 dark:border-blue-700 ring-1 ring-blue-200 dark:ring-blue-900/40 bg-blue-50 dark:bg-blue-900/20'}`}
                      onClick={async (e) => {
                        if (!n.isRead) {
                          try {
                            // optimistically update UI
                            setItems(prev => prev.map(it => it._id === n._id ? { ...it, isRead: true } : it));
                            await API.markAdminNotificationRead(n._id);
                          } catch (_) {
                            // revert on failure
                            setItems(prev => prev.map(it => it._id === n._id ? { ...it, isRead: false } : it));
                          }
                        }
                      }}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{n.type}</div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="font-semibold text-gray-900 dark:text-white mb-1">{n.title}</div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">{n.description}</div>
                      </div>
                    </a>
                  );
                })
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-2 mt-6">
                <button onClick={()=>fetchPage(Math.max(1, page-1))} disabled={page<=1} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50">Prev</button>
                <div className="text-sm text-gray-700 dark:text-gray-300">Page {page} / {totalPages}</div>
                <button onClick={()=>fetchPage(Math.min(totalPages, page+1))} disabled={page>=totalPages} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50">Next</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminMobileAppWrapper>
  );
};

export default AdminNotifications;


