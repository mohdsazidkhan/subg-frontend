import { useEffect } from 'react';
import { FaTrophy, FaBrain, FaShieldAlt, FaUsers, FaRocket, FaStar, FaAward, FaGraduationCap, FaLightbulb, FaHeart } from 'react-icons/fa';

const AboutUs = () => {
  useEffect(() => {
    // logUserActivity('page_view', { page: 'AboutUs' });
  }, []);

  return (
  <div className="min-h-screen bg-subg-light dark:bg-subg-dark">
      <div className="container mx-auto px-4 py-8 mt-16">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTrophy className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-yellow-600 via-red-600 to-yellow-700 bg-clip-text text-transparent mb-4">
            About SUBG QUIZ
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Where knowledge meets rewards, and learning becomes an exciting adventure
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          
          {/* Mission Statement */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-3 md:p-6 lg:p-8 border border-white/20 mb-12">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 lg:w-16 h-12 lg:h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center">
                <FaRocket className="text-white text-2xl" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
                Our Mission
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
              <strong>SUBG QUIZ</strong> is a revolutionary skill-based quiz platform where your knowledge can win you exciting rewards. We believe that learning should be engaging, rewarding, and accessible to everyone. Whether you're a trivia lover, competitive learner, or just looking to test your skills, SUBG QUIZ offers an unparalleled experience.
            </p>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              We host daily quiz challenges on various topics like general knowledge, sports, entertainment, science, technology, and more. Our platform is designed to make learning fun while providing real rewards for your intellectual achievements.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 lg:mb-12">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-3 lg:p-6 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                <FaBrain className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Skill-Based Learning</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Every quiz is designed to test your knowledge and skills. No luck involved - only your expertise matters.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-3 lg:p-6 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
                <FaAward className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Real Rewards</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Earn points, badges, and real rewards based on your performance and accuracy.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-3 lg:p-6 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                <FaUsers className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Live Competitions</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Participate in real-time quiz battles and compete with players worldwide.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-3 lg:p-6 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                <FaGraduationCap className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Diverse Topics</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Explore quizzes across general knowledge, sports, entertainment, science, and more.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-3 lg:p-6 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                <FaStar className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Premium Features</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Subscribe to premium plans for exclusive quizzes and advanced features.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-3 lg:p-6 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                <FaLightbulb className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Smart Learning</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Adaptive difficulty levels and personalized quiz recommendations.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-3 lg:p-6 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                <FaTrophy className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Annual Rewards</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Annual rewards system with ₹990 (Level 6), ₹9,980 (Level 9), and ₹99,999 pool (Level 10) for Top 3 performers.
              </p>
            </div>
          </div>

          {/* Company Info */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-3 md:p-6 lg:p-8 border border-white/20 mb-12">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 lg:w-16 h-12 lg:h-16 bg-gradient-to-r from-yellow-500 to-red-500 rounded-2xl flex items-center justify-center">
                <FaShieldAlt className="text-white text-2xl" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
                Trust & Credibility
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Our Commitment</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  What sets us apart is that we are <strong>100% skill-based</strong> — no gambling or luck involved. Every win is earned through your performance and knowledge. We promote fairness, data privacy, and responsible play.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  We are a <strong>UDYAM-registered Indian MSME</strong> led by <strong>Mohd Sazid Khan</strong>, committed to making learning both exciting and rewarding for everyone.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Why Choose SUBG QUIZ?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <FaHeart className="text-white text-xs" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">100% skill-based platform</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <FaHeart className="text-white text-xs" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Real rewards for real knowledge</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <FaHeart className="text-white text-xs" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Secure and transparent</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <FaHeart className="text-white text-xs" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">24/7 customer support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-yellow-100 to-red-100 dark:from-yellow-800 dark:to-red-800 rounded-3xl p-3 m:p-6 lg:p-8 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">Ready to Start <br/>Your Quiz Journey?</h2>
              <p className="text-xl mb-6 opacity-90 text-gray-800 dark:text-white">
                Join thousands of learners who are already turning their knowledge into success
              </p>
              <button className="bg-white text-gray-700 dark:text-red-600  px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
