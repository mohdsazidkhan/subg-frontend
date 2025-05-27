import { useState, useEffect } from 'react';
import API from '../../utils/api';

const CategoryPage = () => {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    const res = await API.get('/admin/categories');
    setCategories(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await API.post('/admin/categories', { name });
    setName('');
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-4 text-gray-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row sm:space-x-2 mb-4 space-y-2 sm:space-y-0">
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {categories.map((cat) => (
          <li
            key={cat._id}
            className="bg-gray-100 dark:bg-gray-700 p-2 rounded"
          >
            {cat.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryPage;
