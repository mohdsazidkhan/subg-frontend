import React from 'react';
import { FaExclamationTriangle, FaHome, FaSync } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console for debugging
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if(userInfo?.role === 'admin'){
      window.location.href = '/admin/dashboard';
    }else{
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-subg-light dark:bg-subg-dark flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-red-200 dark:border-red-700">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle className="text-white text-2xl" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Oops! Something went wrong
              </h1>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We encountered an unexpected error. Please try refreshing the page or go back to the homepage.
              </p>

              <div className="space-y-3">
                <button
                  onClick={this.handleRefresh}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <FaSync />
                  Refresh Page
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <FaHome />
                  Go to Homepage
                </button>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                    Error Details (Development)
                  </summary>
                  <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-mono text-red-600 dark:text-red-400 overflow-auto max-h-40">
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error.toString()}
                    </div>
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                    </div>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 