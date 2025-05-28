import { useState, useEffect } from 'react';
import API from '../../utils/api';

const QuestionPage = () => {
  const [quiz, setQuiz] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [timeLimit, setTimeLimit] = useState(30); // <-- New state
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const quizRes = await API.get('/admin/quizzes');
      const questionRes = await API.get('/admin/questions');
      setQuizzes(quizRes.data);
      setQuestions(questionRes.data);
    };
    fetchData();
  }, []);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post('/admin/questions', {
      quiz,
      questionText,
      options,
      correctAnswerIndex,
      timeLimit, // <-- Include in payload
    });
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectAnswerIndex(0);
    setTimeLimit(30); // reset
    const questionRes = await API.get('/admin/questions');
    setQuestions(questionRes.data);
  };

  return (
    <div className="p-4 text-gray-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-4">Manage Questions</h2>
      <form onSubmit={handleSubmit} className="space-y-2 mb-4">
        <select
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white p-2 w-full rounded"
          value={quiz}
          onChange={(e) => setQuiz(e.target.value)}
          required
        >
          <option value="">Select Quiz</option>
          {quizzes.map((q) => (
            <option key={q._id} value={q._id}>
              {q.title}
            </option>
          ))}
        </select>

        <input
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white p-2 w-full rounded"
          placeholder="Question"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          required
        />

        {options.map((opt, idx) => (
          <input
            key={idx}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white p-2 w-full rounded"
            placeholder={`Option ${idx + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(idx, e.target.value)}
            required
          />
        ))}

        <select
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white p-2 w-full rounded"
          value={correctAnswerIndex}
          onChange={(e) => setCorrectAnswerIndex(Number(e.target.value))}
          required
        >
          {[0, 1, 2, 3].map((i) => (
            <option key={i} value={i}>
              Correct Option: {i + 1}
            </option>
          ))}
        </select>

        {/* Time Limit Input */}
        <input
          type="number"
          min="5"
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white p-2 w-full rounded"
          placeholder="Time limit (seconds)"
          value={timeLimit}
          onChange={(e) => setTimeLimit(Number(e.target.value))}
          required
        />

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Add
        </button>
      </form>

      <ul>
        {questions.map((q) => (
          <li key={q._id} className="mb-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            <span className="font-semibold">{q.quiz.title}</span> - {q.questionText} ({q.timeLimit}s)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionPage;
