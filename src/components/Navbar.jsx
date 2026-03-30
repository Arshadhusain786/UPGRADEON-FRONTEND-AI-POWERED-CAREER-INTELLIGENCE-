import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LayoutDashboard, LogOut, FileText, Target, Map } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">U</span>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
                Upgradon
              </span>
            </Link>
            
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              <NavLink to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
              <NavLink to="/roadmap" icon={<Map size={18} />} label="Roadmap" />
              <NavLink to="/skill-gap" icon={<Target size={18} />} label="Skill Gap" />
              <NavLink to="/resume-score" icon={<FileText size={18} />} label="Resume Score" />
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all"
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export default Navbar;
