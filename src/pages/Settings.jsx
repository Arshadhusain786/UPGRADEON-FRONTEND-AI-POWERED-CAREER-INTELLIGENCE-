import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { updateProfile, changePassword } from '../api/authApi';
import toast from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle,
  Camera,
  Trash2,
  ChevronRight,
  Moon,
  Sun,
  Lock
} from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';

const Settings = () => {
  const { user, refreshUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  
  // Profile State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await updateProfile({ name, email });
      if (res.success) {
        toast.success('Profile updated successfully!');
        await refreshUser();
      } else {
        toast.error(res.message || 'Update failed');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error('New passwords do not match');
    }
    
    setPwdLoading(true);

    try {
      const res = await changePassword({ currentPassword, newPassword });
      if (res.success) {
        toast.success('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(res.message || 'Failed to change password');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update credentials');
    } finally {
      setPwdLoading(false);
    }
  };

  const handleThemeChange = async (newTheme) => {
    // Only update if it's a change
    const themeStr = newTheme ? 'dark' : 'light';
    if (user?.theme === themeStr) return;

    try {
      toggleTheme(); // Local update
      const res = await updateProfile({ name: user.name, email: user.email, theme: themeStr });
      if (res.success) {
        toast.success('Theme preference saved!');
        await refreshUser();
      }
    } catch (err) {
      console.error('Failed to save theme to profile:', err);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* ── Header ── */}
      <div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Account Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Manage your profile, security, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* ── Left Column: Profile Card ── */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-[32px] p-8 shadow-sm border border-gray-100 dark:border-gray-800 text-center">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-[40px] bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-black text-4xl">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <button className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 hover:scale-110 transition-transform">
                <Camera size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{user?.name}</h3>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">{user?.role}</p>
            
            <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-800 grid grid-cols-2 gap-4">
              <div className="text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                  <CheckCircle2 size={14} />
                  <span>Active</span>
                </div>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Member Since</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Mar 2026</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50/50 dark:bg-red-900/10 rounded-[32px] p-8 border border-red-100 dark:border-red-900/20">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-4">
              <Trash2 size={20} />
              <h4 className="text-sm font-black uppercase tracking-widest">Danger Zone</h4>
            </div>
            <p className="text-sm font-medium text-red-700/70 dark:text-red-400/60 mb-6 leading-relaxed">
              Permanently delete your account and all associated data. This action is irreversible.
            </p>
            <button className="w-full py-4 rounded-2xl bg-white dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-black text-sm hover:bg-red-600 hover:text-white dark:hover:bg-red-600 transition-all active:scale-[0.98]">
              Delete Account
            </button>
          </div>
        </div>

        {/* ── Right Column: Settings Sections ── */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section: Profile Information */}
          <div className="bg-white dark:bg-gray-900 rounded-[32px] p-10 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">Profile Information</h3>
                <p className="text-sm font-bold text-gray-400">Update your primary account details here.</p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="Full Name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={User}
                />
                <Input 
                  label="Email Address"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={Mail}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" loading={loading} className="px-12 py-4">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Section: Theme Preferences */}
          <div className="bg-white dark:bg-gray-900 rounded-[32px] p-10 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Moon size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">Theme & Appearance</h3>
                <p className="text-sm font-bold text-gray-400">Customize how Upgradon looks on your device.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                onClick={() => handleThemeChange(false)}
                className={`p-6 rounded-[24px] border-2 flex flex-col items-center gap-4 transition-all ${!isDarkMode ? 'border-primary-50 bg-primary-50/30 dark:bg-primary-900/10' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'}`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${!isDarkMode ? 'bg-white text-primary-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                  <Sun size={32} />
                </div>
                <div className="text-center">
                  <p className="font-black text-gray-900 dark:text-white">Light Mode</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Clean & Crisp</p>
                </div>
              </button>

              <button 
                onClick={() => handleThemeChange(true)}
                className={`p-6 rounded-[24px] border-2 flex flex-col items-center gap-4 transition-all ${isDarkMode ? 'border-primary-500 bg-primary-500/5' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'}`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${isDarkMode ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                  <Moon size={32} />
                </div>
                <div className="text-center">
                  <p className="font-black text-gray-900 dark:text-white">Dark Mode</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Sleek & Tactical</p>
                </div>
              </button>
            </div>
          </div>

          {/* Section: Security */}
          <div className="bg-white dark:bg-gray-900 rounded-[32px] p-10 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">Security & Password</h3>
                  <p className="text-sm font-bold text-gray-400">Keep your account protected.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input 
                  label="Current Password"
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  icon={Lock}
                  required
                />
                <Input 
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  icon={Shield}
                  required
                />
                <Input 
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  icon={Shield}
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" loading={pwdLoading} className="px-12 py-4" icon={Lock}>
                  Update Password
                </Button>
              </div>
            </form>

            <div className="mt-10 pt-10 border-t border-gray-50 dark:border-gray-800 space-y-4">
              <SettingsLink 
                icon={Smartphone} 
                title="Two-Factor Authentication" 
                desc="Add an extra layer of security to your account" 
                status="Disabled"
              />
              <SettingsLink 
                icon={Bell} 
                title="Login Notifications" 
                desc="Get alerted whenever someones logs into your account" 
                status="Enabled"
              />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

const SettingsLink = ({ icon: Icon, title, desc, status }) => (
  <div className="flex items-center justify-between p-6 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition-all cursor-pointer group">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center text-gray-500 group-hover:text-primary-600 transition-colors shadow-sm">
        <Icon size={20} />
      </div>
      <div>
        <h4 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h4>
        <p className="text-xs font-medium text-gray-400">{desc}</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      {status && (
        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${status === 'Enabled' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
          {status}
        </span>
      )}
      <ChevronRight size={18} className="text-gray-300 group-hover:text-primary-400 transition-colors" />
    </div>
  </div>
);

export default Settings;
