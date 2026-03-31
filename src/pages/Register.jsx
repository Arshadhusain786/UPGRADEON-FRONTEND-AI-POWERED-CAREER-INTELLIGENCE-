import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { registerUser } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';
import { setTokens } from '../utils/tokenStorage';
import ErrorMessage from '../components/ErrorMessage';
import Input from '../components/Input';
import Button from '../components/Button';
import { UserPlus, ShieldCheck, Gift } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref') || '';

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
    referralCode: referralCode, // Initialize from URL
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 🍪 Persist referral code for OAuth2 if present
    if (referralCode) {
      document.cookie = `referralCode=${referralCode}; path=/; max-age=3600; SameSite=Lax`;
    }

    const token = searchParams.get('token');
    const oauthError = searchParams.get('error');
    
    if (token) {
      setTokens(token, '');
      const handleOAuthSuccess = async () => {
        toast.success('Successfully registered & logged in!');
        await login({ accessToken: token });
        navigate('/dashboard');
      };
      handleOAuthSuccess();
    }
    
    if (oauthError) {
      const errorMsg = `Auth Failed: ${oauthError}`;
      setError(errorMsg);
      toast.error(errorMsg);
    }
  }, [searchParams, login, navigate]);

  const handleSocialLogin = () => {
    setSocialLoading(true);
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  // Strong password regex: 8+ chars, 1 upper, 1 lower, 1 digit, 1 special
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const validate = () => {
    if (form.name.length < 2) return "Name must be at least 2 characters";
    if (!form.email.includes("@")) return "Invalid email address";
    if (!strongPasswordRegex.test(form.password)) {
      return "Password must be 8+ characters and include uppercase, lowercase, number, and special character.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await registerUser(form);
      if (response.success) {
        toast.success('Registration successful! Welcome to Upgradon.');
        const { accessToken, refreshToken } = response.data || {};
        
        if (accessToken && refreshToken) {
          setTokens(accessToken, refreshToken);
          await login(response.data);
          navigate('/dashboard');
        } else {
          navigate('/login', { state: { message: 'Registration successful! Please sign in.' } });
        }
      } else {
        const errorMsg = response.message || 'Registration failed';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorMsg = err.response.data.errors.join(', ');
        setError(errorMsg);
        toast.error(errorMsg);
      } else {
        const errorMsg = err.response?.data?.message || 'Registration failed. Please try again.';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-[32px] shadow-2xl p-10 border border-gray-100 dark:border-gray-800 animate-zoom-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-2xl mb-4 shadow-inner">
            <UserPlus className="text-primary-600 dark:text-primary-400" size={40} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Join Upgradon</h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 font-medium text-lg italic">Build your future with AI</p>
        </div>

        <ErrorMessage message={error} />

        {form.referralCode && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl animate-bounce-subtle">
            <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Gift size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Referral Applied</p>
              <p className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400/70">You'll get +20 bonus credits on signup!</p>
            </div>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            placeholder="John Doe"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            disabled={loading}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            disabled={loading}
          />

          <div className="space-y-2">
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              disabled={loading}
            />
            {form.password && !strongPasswordRegex.test(form.password) && (
              <div className="flex items-center space-x-1.5 text-orange-500 text-xs font-bold px-1 animate-fade-in">
                <ShieldCheck size={14} />
                <span>Requires Uppercase, Number & Special Char</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Account Role</label>
            <select
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:bg-white dark:focus:bg-gray-800 transition-all font-medium text-gray-700 dark:text-gray-300"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              disabled={loading}
            >
              <option value="STUDENT">Student</option>
              <option value="MENTOR">Mentor</option>
              <option value="COMPANY">Company</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>

          <Button type="submit" loading={loading} fullWidth>
            Create Account
          </Button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100 dark:border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-900 px-4 text-gray-500 font-bold tracking-widest">Or join with</span>
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
            {socialLoading ? 'Redirecting...' : 'Sign up with Google'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-bold border-b-2 border-primary-100 dark:border-primary-900 transition-all">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
