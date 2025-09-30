import React, { useCallback, useEffect, useState } from 'react';
import API from '../utils/api';
import MobileAppWrapper from '../components/MobileAppWrapper';
import PublicQuestionsList from '../components/PublicQuestionsList';
import { toast } from 'react-toastify';
// Removed SearchFilter; using inline search tailored to this page

const PublicUserQuestions = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0); // reserved for future pagination
  const [loading, setLoading] = useState(false); // reserved for future skeletons
  const [searchTerm, setSearchTerm] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.getPublicUserQuestions({ page, limit, search: searchTerm });
      if (res?.success) {
        setItems(res.data || []);
        setTotal(res.pagination?.total || 0);
      }
    } catch (e) {
      console.error('Failed to load public questions', e);
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm]);

  useEffect(() => { load(); }, [load]);

  const answer = async (q, idx) => {
    try {
      if (typeof q.selectedOptionIndex === 'number') return;
      
      // Immediately show visual feedback
      setItems(prev => prev.map(it => it._id === q._id ? { ...it, selectedOptionIndex: idx, isAnswered: true } : it));
      
      await API.answerUserQuestion(q._id, idx);
      toast.success('Answer submitted successfully!');
    } catch (e) {
      toast.error(e?.message || 'Failed to submit Answer!');
      // Revert the visual feedback on error
      setItems(prev => prev.map(it => it._id === q._id ? { ...it, selectedOptionIndex: undefined, isAnswered: false } : it));
    }
  };

  const like = async (q) => {
    try {
      const res = await API.likeUserQuestion(q._id);
      if (res?.data?.firstTime) {
        setItems(prev => prev.map(it => it._id === q._id ? { ...it, likesCount: (it.likesCount||0) + 1 } : it));
      }
    } catch (e) {}
  };

  const share = async (q) => {
    try {
      await API.shareUserQuestion(q._id);
      setItems(prev => prev.map(it => it._id === q._id ? { ...it, sharesCount: (it.sharesCount||0) + 1 } : it));
      if (navigator.share) {
        navigator.share({ title: 'User Question', text: q.questionText, url: window.location.href }).catch(()=>{});
      }
    } catch (e) {}
  };

  const view = async (q) => {
    try {
      const res = await API.incrementUserQuestionView(q._id);
      if (res?.data?.firstTime) {
        setItems(prev => prev.map(it => it._id === q._id ? { ...it, viewsCount: (it.viewsCount||0) + 1 } : it));
      }
    } catch (e) {}
  };

  // Not using generic table columns; page has a custom list UI

  const content = (
    <div className="min-h-screen bg-subg-light dark:bg-subg-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-2 lg:py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Questions ({total})</h1>
          <p className="text-gray-600 dark:text-gray-400">Answer, like, share user questions</p>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions..."
              className="w-full sm:w-72 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <button
              onClick={() => { setPage(1); load(); }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
            >Search</button>
          </div>
        </div>

        {loading && (
          <div className="mb-3">
            <div className="h-2 w-24 bg-blue-200 dark:bg-blue-900 rounded animate-pulse"></div>
          </div>
        )}

        <PublicQuestionsList
          items={items}
          onAnswer={answer}
          onLike={like}
          onShare={share}
          onView={view}
        />
      </div>
    </div>
  );

  return (
    <MobileAppWrapper>
      {content}
    </MobileAppWrapper>
  );
};

export default PublicUserQuestions;


