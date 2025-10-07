import { 
  FaPlay, 
  FaClock, 
  FaQuestionCircle, 
  FaExclamationTriangle,
  FaDesktop,
  FaTimes
} from 'react-icons/fa';

const QuizStartModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  quiz = {} 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 md:p-4 max-w-md w-full shadow-2xl border border-yellow-200 dark:border-yellow-700">
        <div className="text-center">
          {/* Header */}
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
            <FaPlay className="text-white text-2xl" />
          </div>
          
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Start Quiz?
          </h2>
          
          {/* Quiz Info */}
          {quiz.title && (
            <div className="bg-gradient-to-r from-yellow-50 to-red-50 dark:from-yellow-900/20 dark:to-red-900/20 rounded-xl p-2 md:p-4 mb-2 border border-yellow-200 dark:border-yellow-600">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                {quiz.title}
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {quiz.questions && (
                  <div className="flex items-center justify-center space-x-2">
                    <FaQuestionCircle className="text-yellow-500" />
                    <span>{quiz.questions.length} Questions</span>
                  </div>
                )}
                {quiz.timeLimit && (
                  <div className="flex items-center justify-center space-x-2">
                    <FaClock className="text-green-500" />
                    <span>{quiz.timeLimit} minutes time limit</span>
                  </div>
                )}
                {quiz.category && (
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-red-500">📚</span>
                    <span>{quiz.category.name}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Important Notice */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-2 md:p-4 mb-2 border border-yellow-200 dark:border-yellow-600">
            <div className="flex items-start space-x-3">
              <FaExclamationTriangle className="text-yellow-600 text-xl mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  Important Information
                </h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• Quiz will open in fullscreen mode</li>
                  <li>• You must complete the quiz in one session</li>
                  <li>• Exiting fullscreen will submit your quiz</li>
                  <li>• Browser back/refresh will submit the quiz</li>
                  <li>• Make sure you have a stable internet connection</li>
                </ul>
              </div>
            </div>
          </div>

          {/* System Requirements */}
          <div className="bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 rounded-xl p-2 mdp-4 mb-2 border border-green-200 dark:border-green-600">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <FaDesktop className="text-green-600" />
              <span className="font-semibold text-green-800 dark:text-green-200">System Requirements</span>
            </div>
            <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <div>• Modern browser with fullscreen support</div>
              <div>• Stable internet connection</div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <FaTimes className="text-sm" />
              <span>Cancel</span>
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-red-600 hover:from-yellow-600 hover:to-red-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <FaPlay className="text-sm" />
              <span>Start Quiz</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizStartModal; 