import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
      if (res.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="authPage flex items-center justify-center w-full bg-gray-100 dark:bg-gray-900 transition-colors">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-8 rounded-lg shadow-md max-w-sm w-full"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">🔐 Login</h2>
        {error && <div className="text-red-600 dark:text-red-400 mb-2">{error}</div>}
        
        <input
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-black dark:text-white p-2 mb-4 rounded"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-black dark:text-white p-2 mb-4 rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
