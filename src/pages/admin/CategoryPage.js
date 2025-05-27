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
    await API.post('/admin/categories', { name });
    setName('');
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>
      <form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2"
        />
        <button className="bg-blue-600 text-white px-4 py-2">Add</button>
      </form>
      <ul>
        {categories.map((cat) => (
          <li key={cat._id} className="mb-2">{cat.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryPage;
