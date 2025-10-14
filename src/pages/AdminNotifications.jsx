import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { Link } from 'react-router-dom';

const AdminNotifications = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchPage = async (p = 1) => {
    try {
      setLoading(true);
      const res = await API.getAdminNotifications(p, limit);
      const data = res?.data || [];
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

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Notifications</h1>
        <Link to="/admin/dashboard" className="text-red-600">Back to Dashboard</Link>
      </div>
      <div className="mb-3 flex items-center gap-3">
        <select value={limit} onChange={(e)=>{setLimit(parseInt(e.target.value)); fetchPage(1);}} className="border p-2 rounded">
          {[10,20,50,100].map(n => <option key={n} value={n}>{n} / page</option>)}
        </select>
        <button onClick={()=>API.clearAdminNotifications().then(()=>fetchPage(1))} className="px-3 py-2 bg-red-600 text-white rounded">Clear All</button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {loading ? (
          <div>Loading...</div>
        ) : items.length === 0 ? (
          <div>No notifications</div>
        ) : (
          items.map(n => (
            <div key={n._id} className="border rounded p-3">
              <div className="text-sm text-gray-500">{n.type}</div>
              <div className="font-medium">{n.title}</div>
              <div className="text-sm text-gray-600">{n.description}</div>
              <div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
            </div>
          ))
        )}
      </div>
      <div className="flex items-center gap-2 mt-4">
        <button onClick={()=>fetchPage(Math.max(1, page-1))} disabled={page<=1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
        <div>Page {page} / {totalPages}</div>
        <button onClick={()=>fetchPage(Math.min(totalPages, page+1))} disabled={page>=totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
      </div>
    </div>
  );
};

export default AdminNotifications;


