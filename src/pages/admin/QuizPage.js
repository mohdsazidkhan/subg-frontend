import { useState, useEffect } from 'react';
import API from '../../utils/api';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useSelector } from 'react-redux';

const QuizPage = () => {
  const [activeTab, setActiveTab] = useState('custom'); // 'custom' | 'ai'
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [numQuestions, setNumQuestions] = useState(10);
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

    const payload = {
      title,
      category,
      subcategory,
      totalMarks,
      timeLimit,
    };

    if (activeTab === 'ai') {
      payload.numQuestions = numQuestions;
      await API.post('/admin/quizzes/ai', payload);
    }else{
      await API.post('/admin/quizzes', payload);
    }
    setTitle('');
    setCategory('');
    setSubcategory('');
    setTotalMarks('');
    setTimeLimit('');
    setNumQuestions(5);
    const quizzes = await API.get('/admin/quizzes');
    setQuizzes(quizzes.data);
  };

  const user = JSON.parse(localStorage.getItem('userInfo'));
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isOpen = useSelector((state) => state.sidebar.isOpen);

  return (
    <div className={`adminPanel ${isOpen ? 'showPanel' : 'hidePanel'}`}>
      {user?.role === 'admin' && isAdminRoute && <Sidebar />}
      <div className="adminContent p-4 w-full text-gray-900 dark:text-white">
        <h2 className="text-2xl font-bold mb-4">Manage Quizzes</h2>

        {/* Tabs */}
        <div className="flex mb-4 gap-2">
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2 rounded ${activeTab === 'custom' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'}`}
          >
            Custom Quiz
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 rounded ${activeTab === 'ai' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'}`}
          >
            OpenAI Quiz
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-4 flex flex-wrap items-center gap-3">
          <input
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded flex-grow min-w-[100px]"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <select
            className="w-full md:w-auto border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded min-w-[100px]"
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
            className="w-full md:w-auto border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded min-w-[150px]"
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
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded w-full lg:w-24"
            placeholder="Total Marks"
            type="number"
            value={totalMarks}
            onChange={(e) => setTotalMarks(e.target.value)}
            required
          />
          <input
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded w-full lg:w-32"
            placeholder="Time Limit (min)"
            type="number"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            required
          />

          {/* Only show if AI tab is selected */}
          {activeTab === 'ai' && (
            <input
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded w-full lg:w-40"
              placeholder="No. of Questions"
              type="number"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              min={1}
              required
            />
          )}

          <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded whitespace-nowrap">
            Create {activeTab === 'ai' ? 'OpenAI' : 'Custom'} QUIZ
          </button>
        </form>

        {/* Quiz List */}
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
