import { useState, useEffect } from 'react';
import API from '../../utils/api';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

const QuizPage = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const cats = await API.get('/admin/categories');
      const subs = await API.get('/admin/subcategories');
      const quizzes = await API.get('/admin/quizzes');
      setCategories(cats.data);
      setSubcategories(subs.data);
      setQuizzes(quizzes.data);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post('/admin/quizzes', {
      title,
      category,
      subcategory,
      totalMarks,
      timeLimit,
    });
    setTitle('');
    setCategory('');
    setSubcategory('');
    setTotalMarks('');
    setTimeLimit('');
    const quizzes = await API.get('/admin/quizzes');
    setQuizzes(quizzes.data);
  };
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  return (
    <div className='adminPanel'>
      {user?.role === 'admin' && isAdminRoute && <Sidebar />}
      <div className="adminContent p-4 w-full text-gray-900 dark:text-white">
        <h2 className="text-2xl font-bold mb-4">Manage Quizzes</h2>
        <form onSubmit={handleSubmit} className="space-y-2 mb-4">
          <input
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white p-2 w-full rounded"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <select
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white p-2 w-full rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white p-2 w-full rounded"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            required
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
          <input
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white p-2 w-full rounded"
            placeholder="Total Marks"
            type="number"
            value={totalMarks}
            onChange={(e) => setTotalMarks(e.target.value)}
            required
          />
          <input
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white p-2 w-full rounded"
            placeholder="Time Limit (min)"
            type="number"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            required
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Add
          </button>
        </form>
        <ul>
          {quizzes.map((q) => (
            <li
              key={q._id}
              className="mb-2 border-b border-gray-200 dark:border-gray-700 pb-2"
            >
              {q.title} - {q.category.name} / {q.subcategory.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuizPage;
