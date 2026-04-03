import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { loginUser } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';
import { setTokens } from '../utils/tokenStorage';
import ErrorMessage from '../components/ErrorMessage';
import Input from '../components/Input';
import Button from '../components/Button';
import { LogIn } from 'lucide-react';

import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const hasToastShown = React.useRef(false);

  React.useEffect(() => {
    const token = searchParams.get('token');
    const oauthError = searchParams.get('error');
    
    if (token && !hasToastShown.current) {
      hasToastShown.current = true;
      setTokens(token, '');
      const handleOAuthSuccess = async () => {
        toast.success('Successfully logged in!', { id: 'oauth-login-toast' });
        await login({ accessToken: token });
        // Clear params to avoid loop
        navigate('/dashboard', { replace: true });
      };
      handleOAuthSuccess();
    }
    
    if (oauthError && !hasToastShown.current) {
      hasToastShown.current = true;
      const errorMsg = `Auth Failed: ${oauthError}`;
      setError(errorMsg);
      toast.error(errorMsg);
      // Clear error from URL
      navigate('/login', { replace: true });
    }
  }, [searchParams, login, navigate]);

  const handleSocialLogin = () => {
    setSocialLoading(true);
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      if (response.success) {
        const { accessToken, refreshToken } = response.data;
        setTokens(accessToken, refreshToken);
        toast.success('Login successful! Welcome back.', { id: 'standard-login-toast' });
        await login(response.data);
        navigate('/dashboard');
      } else {
        const errorMsg = response.message || 'Login failed';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Invalid credentials or server error';
      setError(errorMsg);
      toast.error(errorMsg);
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

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100 dark:border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-900 px-4 text-gray-500 font-bold tracking-widest">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSocialLogin}
            disabled={socialLoading}
            className={`w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3.5 rounded-2xl font-bold text-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-[0.98] shadow-sm ${socialLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {socialLoading ? (
              <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {socialLoading ? 'Redirecting...' : 'Sign in with Google'}
          </button>
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
