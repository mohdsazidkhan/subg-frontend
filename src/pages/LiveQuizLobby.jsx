import { useEffect, useState } from 'react';
import API from '../utils/api';
import { Link } from 'react-router-dom';
import { FaClock, FaQuestionCircle, FaStar } from 'react-icons/fa';

const LiveQuizLobby = () => {
  const [liveQuizzes, setLiveQuizzes] = useState([]);
  console.log(liveQuizzes, 'liveQuizzes')
  useEffect(() => {
    const fetchLiveQuizzes = async () => {
      try {
        const res = await API.get('/live-quizzes/active');
        setLiveQuizzes(res.data);
      } catch (error) {
        console.error('Error fetching live quizzes:', error);
      }
    };
    fetchLiveQuizzes();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Active Live Quizzes</h2>
      {liveQuizzes?.length === 0 && <span className='text-gray-500'>No Live Quiz Found!</span>}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {liveQuizzes?.map((lq) => (
          <div
            key={lq._id}
            className="bg-white border rounded shadow p-4 hover:shadow-lg transition duration-300"
          >
            <div className='flex justify-start gap-2 items-center'>
            <span
              className={`live_now relative inline-block px-4 py-1 text-xs font-semibold rounded-sm 
              ${lq?.isActive ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {lq?.isActive ? 'LIVE' : 'Live Ended'}
            </span>

            <span
              className={`inline-block px-3 py-1 text-xs font-semibold rounded-sm bg-green-600 text-white`}
            >
              {'FREE'}
            </span>
            </div>

            <h3 className="text-lg font-semibold my-2">{lq.quiz?.title}</h3>
            <div className='flex justify-start gap-2 items-center mb-4'>
            <p className="inline-block px-3 py-1 text-xs font-semibold rounded-sm bg-red-200 text-black">{lq.quiz?.category?.name || 'N/A'}</p>
            <p className="inline-block px-3 py-1 text-xs font-semibold rounded-sm bg-blue-200 text-black">{lq.quiz?.subcategory?.name || 'N/A'}</p>
            </div>

<div className='flex justify-start gap-4 items-center mb-2 text-gray-700'>
  <div className='flex items-center gap-1'>
    <FaQuestionCircle className="text-blue-600" />
    <span>{lq.quiz?.questionCount} Questions</span>
  </div>
  <div className='flex items-center gap-1'>
    <FaClock className="text-green-600" />
    <span>{lq.quiz?.timeLimit} Mins</span>
  </div>
  <div className='flex items-center gap-1'>
    <FaStar className="text-yellow-600" />
    <span>{lq.quiz?.totalMarks} Marks</span>
  </div>
</div>

            <Link
              to={`/student/live-quiz/${lq.quiz?._id}`}
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Start Now
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveQuizLobby;
