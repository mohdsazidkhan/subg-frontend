import { useState, useEffect } from 'react';
import API from '../../utils/api';

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
      title, category, subcategory, totalMarks, timeLimit
    });
    setTitle('');
    setCategory('');
    setSubcategory('');
    setTotalMarks('');
    setTimeLimit('');
    const quizzes = await API.get('/admin/quizzes');
    setQuizzes(quizzes.data);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Quizzes</h2>
      <form onSubmit={handleSubmit} className="space-y-2 mb-4">
        <input className="border p-2 w-full" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <select className="border p-2 w-full" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <select className="border p-2 w-full" value={subcategory} onChange={(e) => setSubcategory(e.target.value)}>
          <option value="">Select Subcategory</option>
          {subcategories.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
        <input className="border p-2 w-full" placeholder="Total Marks" type="number" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} />
        <input className="border p-2 w-full" placeholder="Time Limit (min)" type="number" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2">Add</button>
      </form>
      <ul>
        {quizzes.map(q => (
          <li key={q._id}>{q.title} - {q.category.name} / {q.subcategory.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default QuizPage;
