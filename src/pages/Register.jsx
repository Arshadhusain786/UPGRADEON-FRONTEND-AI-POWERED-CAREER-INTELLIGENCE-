import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { registerUser } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';
import { setTokens } from '../utils/tokenStorage';
import ErrorMessage from '../components/ErrorMessage';
import Input from '../components/Input';
import Button from '../components/Button';
import { UserPlus, ShieldCheck } from 'lucide-react';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
    if (validationError) return setError(validationError);

    setError('');
    setLoading(true);

    try {
      const response = await registerUser(form);
      if (response.success) {
        const { accessToken, refreshToken } = response.data || {};
        
        if (accessToken && refreshToken) {
          setTokens(accessToken, refreshToken);
          login(response.data);
          navigate('/dashboard');
        } else {
          navigate('/login', { state: { message: 'Registration successful! Please sign in.' } });
        }
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.join(', '));
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
