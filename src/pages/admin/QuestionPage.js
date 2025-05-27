import { useState, useEffect } from 'react';
import API from '../../utils/api';

const QuestionPage = () => {
  const [quiz, setQuiz] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
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
      correctAnswerIndex
    });
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectAnswerIndex(0);
    const questionRes = await API.get('/admin/questions');
    setQuestions(questionRes.data);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Questions</h2>
      <form onSubmit={handleSubmit} className="space-y-2 mb-4">
        <select className="border p-2 w-full" value={quiz} onChange={(e) => setQuiz(e.target.value)}>
          <option value="">Select Quiz</option>
          {quizzes.map((q) => <option key={q._id} value={q._id}>{q.title}</option>)}
        </select>
        <input className="border p-2 w-full" placeholder="Question" value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
        {options.map((opt, idx) => (
          <input
            key={idx}
            className="border p-2 w-full"
            placeholder={`Option ${idx + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(idx, e.target.value)}
          />
        ))}
        <select className="border p-2 w-full" value={correctAnswerIndex} onChange={(e) => setCorrectAnswerIndex(Number(e.target.value))}>
          {[0, 1, 2, 3].map(i => (
            <option key={i} value={i}>Correct Option: {i + 1}</option>
          ))}
        </select>
        <button className="bg-blue-600 text-white px-4 py-2">Add</button>
      </form>
      <ul>
        {questions.map(q => (
          <li key={q._id}>{q.quiz.title} - {q.questionText}</li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionPage;
