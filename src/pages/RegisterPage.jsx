import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', {
        name,
        email,
        phone,
        password,
        role: 'student', // Ensure role is student
      });
      setError('');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="authPage flex items-center justify-center bg-gray-100 dark:bg-gray-900 w-full transition-colors">
      <form
        onSubmit={handleRegister}
        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-8 rounded-lg shadow-md max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">📝 Registration</h2>
        
        {error && <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-black dark:text-white p-2 mb-4 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-black dark:text-white p-2 mb-4 rounded"
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-black dark:text-white p-2 mb-4 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-black dark:text-white p-2 mb-6 rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
        >
          Register
        </button>
        
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
