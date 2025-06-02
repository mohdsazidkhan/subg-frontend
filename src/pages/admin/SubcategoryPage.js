import { useState, useEffect } from 'react';
import API from '../../utils/api';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useSelector } from 'react-redux';
const SubcategoryPage = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const catRes = await API.get('/admin/categories');
      const subRes = await API.get('/admin/subcategories');
      setCategories(catRes.data);
      setSubcategories(subRes.data);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post('/admin/subcategories', { name, category });
    setName('');
    setCategory('');
    const subRes = await API.get('/admin/subcategories');
    setSubcategories(subRes.data);
  };
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  return (
    <div className={`adminPanel ${isOpen ? 'showPanel' : 'hidePanel'}`}>
      {user?.role === 'admin' && isAdminRoute && <Sidebar />}
      <div className="adminContent p-4 w-full text-gray-900 dark:text-white">
        <h2 className="text-2xl font-bold mb-4">Manage Subcategories</h2>
        <form onSubmit={handleSubmit} className="space-y-2 mb-4">
          <input
            type="text"
            placeholder="Subcategory Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 p-2 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 p-2 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="" className="text-gray-700 dark:text-gray-300">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id} className="text-gray-900 dark:text-gray-100">
                {cat.name}
              </option>
            ))}
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Add
          </button>
        </form>
        <ul>
          {subcategories.map((sub) => (
            <li key={sub._id} className="mb-2 border-b border-gray-300 dark:border-gray-600 pb-1">
              {sub.name} (Category: {sub.category.name})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SubcategoryPage;
