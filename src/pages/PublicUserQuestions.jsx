import React, { useCallback, useEffect, useState, useRef } from 'react';
import API from '../utils/api';
import MobileAppWrapper from '../components/MobileAppWrapper';
import PublicQuestionsList from '../components/PublicQuestionsList';
import { toast } from 'react-toastify';
// Removed SearchFilter; using inline search tailored to this page

const PublicUserQuestions = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const observerTarget = useRef(null);

  // Initial load - replaces all items
  const load = useCallback(async (resetPage = false) => {
    const currentPage = resetPage ? 1 : page;
    setLoading(true);
    try {
      const res = await API.getPublicUserQuestions({ page: currentPage, limit, search: searchTerm });
      if (res?.success) {
        let list = res.data || [];
        // Fallback client-side filter (username/name) if backend misses
        if (searchTerm && String(searchTerm).trim()) {
          const q = String(searchTerm).trim().toLowerCase();
          list = list.filter(row => {
            const text = (row.questionText || row.question || '').toLowerCase();
            const name = (row.userId?.name || row.author?.name || '').toLowerCase();
            const username = (row.userId?.username || row.author?.username || '').toLowerCase();
            return text.includes(q) || name.includes(q) || username.includes(q);
          });
        }
        setItems(list);
        setTotal(res.pagination?.total || 0);
        setPage(currentPage);
        setHasMore(list.length === limit && list.length < (res.pagination?.total || 0));
      }
    } catch (e) {
      console.error('Failed to load public questions', e);
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm]);

  // Load more - appends to existing items
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const res = await API.getPublicUserQuestions({ page: nextPage, limit, search: searchTerm });
      if (res?.success) {
        let newItems = res.data || [];
        if (searchTerm && String(searchTerm).trim()) {
          const q = String(searchTerm).trim().toLowerCase();
          newItems = newItems.filter(row => {
            const text = (row.questionText || row.question || '').toLowerCase();
            const name = (row.userId?.name || row.author?.name || '').toLowerCase();
            const username = (row.userId?.username || row.author?.username || '').toLowerCase();
            return text.includes(q) || name.includes(q) || username.includes(q);
          });
        }
        setItems(prev => [...prev, ...newItems]);
        setPage(nextPage);
        setHasMore(newItems.length === limit && (items.length + newItems.length) < (res.pagination?.total || 0));
      }
    } catch (e) {
      console.error('Failed to load more questions', e);
    } finally {
      setLoadingMore(false);
    }
  }, [page, limit, searchTerm, loadingMore, hasMore, items.length]);

  // Initial load
  useEffect(() => { 
    load(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    const currentTarget = observerTarget.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, loadingMore, loadMore]);

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
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  setPage(1);
                  setHasMore(true);
                  load(true);
                }
              }}
              placeholder="Search questions..."
              className="w-full sm:w-72 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <button
              onClick={() => { 
                setPage(1); 
                setHasMore(true);
                load(true); 
              }}
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
          startIndex={0}
        />

        {/* Loading More Indicator */}
        {loadingMore && (
          <div className="flex justify-center items-center py-8">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}

        {/* Observer Target for Infinite Scroll */}
        <div ref={observerTarget} className="h-10"></div>

        {/* End of Results Message */}
        {!hasMore && items.length > 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="text-sm">🎉 You've reached the end!</p>
            <p className="text-xs mt-1">No more questions to load</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-lg mb-2">📝 No questions found</p>
            <p className="text-sm">Try a different search term</p>
          </div>
        )}
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


