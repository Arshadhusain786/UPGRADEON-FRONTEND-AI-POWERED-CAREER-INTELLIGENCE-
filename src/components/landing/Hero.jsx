import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Gift } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-60 pb-40 px-6 z-10">
      <div className="max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-6 py-2.5 bg-primary-50/50 dark:bg-primary-900/10 rounded-full text-primary-600 dark:text-primary-400 text-[11px] font-black uppercase tracking-[0.2em] border border-primary-100/50 dark:border-primary-900/20 mb-12 animate-in fade-in slide-in-from-top duration-700">
          <Sparkles size={14} fill="currentColor" />
          <span>AI-Powered Career Growth Engine</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl lg:text-[110px] font-black tracking-tight leading-[0.9] mb-10 animate-in fade-in slide-in-from-bottom duration-1000">
          Build Your <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-indigo-600 to-violet-600 font-black relative">
            Career with Clarity
            <div className="absolute -bottom-4 left-0 w-full h-4 bg-primary-500/5 -rotate-1 rounded-full blur-xl"></div>
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-medium max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom delay-200 duration-1000 leading-relaxed">
          Unlock personalized AI roadmaps, deep skill gap insights, and real professional opportunities. Stop guessing your next move.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-in fade-in slide-in-from-bottom delay-300 duration-1000">
          <Link 
            to="/register" 
            className="group bg-primary-600 hover:bg-primary-700 text-white px-12 py-6 rounded-[28px] font-black text-xl flex items-center gap-4 transition-all shadow-[0_30px_60px_-15px_rgba(37,99,235,0.4)] hover:shadow-[0_40px_80px_-20px_rgba(37,99,235,0.6)] hover:-translate-y-1 active:scale-95"
          >
            Start Free (20 Credits)
            <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center gap-4 px-10 py-6 rounded-[28px] font-black text-xl text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-800 transition-all active:scale-95"
          >
            <span>Log In to Dashboard</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
