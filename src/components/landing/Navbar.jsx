import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

const LandingNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-gray-950/70 backdrop-blur-2xl border-b border-gray-100/50 dark:border-gray-800/50 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-11 h-11 bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[12px] flex items-center justify-center shadow-2xl shadow-primary-500/40 group-hover:rotate-12 transition-all duration-500 ease-out">
            <BrainCircuit className="text-white" size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            Upgradon
          </span>
        </div>
        
        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center space-x-10 text-sm font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
          <a href="#how-it-works" className="hover:text-primary-600 transition-colors">How it Works</a>
          <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
          <a href="#testimonials" className="hover:text-primary-600 transition-colors">Reviews</a>
          <a href="#pricing" className="hover:text-primary-600 transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-primary-600 transition-colors">FAQ</a>
        </div>

        {/* Right: Theme + Auth Buttons */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <Link
            to="/login"
            className="hidden sm:block font-black uppercase tracking-widest text-xs text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors px-4"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-gray-200 dark:shadow-none"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
