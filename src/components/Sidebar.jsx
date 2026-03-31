import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  LayoutDashboard, 
  Map, 
  Target, 
  FileText, 
  LogOut, 
  User,
  ChevronRight,
  ShieldAlert,
  Settings,
  CreditCard,
  Gift,
  Briefcase,
  Users,
  Send
} from 'lucide-react';
import CreditBadge from './CreditBadge';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const commonItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/roadmap', label: 'Career Roadmap', icon: Map },
    { to: '/skill-gap', label: 'Skill Gap Analysis', icon: Target },
    { to: '/resume-score', label: 'Resume Optimizer', icon: FileText },
    { to: '/credits', label: 'Credits & Billing', icon: CreditCard },
    { to: '/referrals', label: 'Refer & Earn', icon: Gift },
    { to: '/opportunities', label: 'Opportunity Board', icon: Briefcase },
    { to: '/my-opportunities', label: 'My Opportunities', icon: Users },
    { to: '/sent-requests', label: 'Sent Requests', icon: Send },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const adminItems = [
    { to: '/admin', label: 'Admin Console', icon: ShieldAlert },
  ];

  const navItems = user?.role === 'ADMIN' ? [...commonItems, ...adminItems] : commonItems;

  return (
    <div className="w-72 bg-white dark:bg-gray-900 h-screen border-r border-gray-100 dark:border-gray-800 flex flex-col sticky top-0 transition-colors duration-300">
      <div className="p-8">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
            <span className="text-white font-bold text-xl">U</span>
          </div>
          <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight transition-colors">Upgradon</span>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center justify-between group px-4 py-3.5 rounded-2xl transition-all duration-200
                ${isActive 
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}
              `}
            >
              <div className="flex items-center space-x-3">
                <item.icon size={20} className="transition-colors" />
                <span className="font-semibold tracking-wide">{item.label}</span>
              </div>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-50 dark:border-gray-800">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 mb-4 flex items-center space-x-3 transition-colors">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 transition-colors">
            <User size={20} />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate transition-colors">
              {user?.name || user?.email?.split('@')[0] || 'User'}
            </p>
            <div className="flex flex-col items-start space-y-1">
              <p className="text-[10px] bg-primary-600 text-white px-1.5 py-0.5 rounded font-black uppercase tracking-tighter w-fit">
                {user?.role || 'STUDENT'}
              </p>
              <CreditBadge />
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-gray-500 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all font-semibold"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
