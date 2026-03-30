import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';
import { setTokens } from '../utils/tokenStorage';
import ErrorMessage from '../components/ErrorMessage';
import Input from '../components/Input';
import Button from '../components/Button';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      if (response.success) {
        const { accessToken, refreshToken } = response.data;
        setTokens(accessToken, refreshToken);
        login(response.data);
        navigate('/dashboard');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials or server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-[32px] shadow-2xl p-10 border border-gray-100 dark:border-gray-800">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-2xl mb-4 shadow-inner">
            <LogIn className="text-primary-600 dark:text-primary-400" size={40} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Welcome Back</h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 font-medium text-lg">Access your AI-powered career hub</p>
        </div>

        <ErrorMessage message={error} />

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            type="email"
            required
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <Input
            label="Password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <Button type="submit" loading={loading} fullWidth>
            Sign In
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
          New to Upgradon?{' '}
          <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-bold border-b-2 border-primary-100 dark:border-primary-900 transition-all">
            Join Now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
