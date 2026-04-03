import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Map, Target, FileText, ChevronRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-1">
          <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter transition-colors">
            System Dashboard
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 font-semibold tracking-tight transition-colors">
            Hi, {user?.name || user?.email?.split('@')[0]}! Precision insights for your <span className="text-primary-600 dark:text-primary-400 capitalize">{user?.role?.toLowerCase() || 'Student'}</span> profile.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-gradient-to-br from-gray-900 to-gray-800 p-2 rounded-2xl shadow-xl shadow-black/10">
          <div className="px-5 py-2 bg-white/10 rounded-xl text-white font-black text-sm uppercase tracking-widest border border-white/10">
            Internal Access
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <ToolCard
          onClick={() => navigate('/roadmap')}
          icon={Map}
          iconBg="bg-blue-50 dark:bg-blue-900/20"
          iconColor="text-blue-600 dark:text-blue-400"
          title="Career Roadmap"
          description="Algorithmic phase-by-phase strategic pathing for senior placements."
          accent="border-blue-100 dark:border-blue-900/30"
        />
        <ToolCard
          onClick={() => navigate('/skill-gap')}
          icon={Target}
          iconBg="bg-indigo-50 dark:bg-indigo-900/20"
          iconColor="text-indigo-600 dark:text-indigo-400"
          title="Skill Gap Analysis"
          description="Critical alignment testing vs live industry requirements."
          accent="border-indigo-100 dark:border-indigo-900/30"
        />
        <ToolCard
          onClick={() => navigate('/resume-score')}
          icon={FileText}
          iconBg="bg-emerald-50 dark:bg-emerald-900/20"
          iconColor="text-emerald-600 dark:text-emerald-400"
          title="Resume Optimizer"
          description="Deep-neural analysis of impact metrics and quantifiable results."
          accent="border-emerald-100 dark:border-emerald-900/30"
        />
        <ToolCard
          onClick={() => navigate('/opportunities')}
          icon={Zap}
          iconBg="bg-violet-50 dark:bg-violet-900/20"
          iconColor="text-violet-600 dark:text-violet-400"
          title="Opportunity Board"
          description="Connect with professional opportunities using your platform credits."
          accent="border-violet-100 dark:border-violet-900/30"
        />
      </div>

      {/* Premium Content Card */}
      <div className="bg-white dark:bg-gray-900 rounded-[40px] p-12 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:border-primary-100 dark:hover:border-primary-900">
        <div className="relative z-10">
          <div className="w-16 h-16 bg-primary-600 rounded-[22px] flex items-center justify-center shadow-lg shadow-primary-500/30 mb-8 transform group-hover:rotate-12 transition-transform">
            <Zap className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">AI Acceleration</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-bold leading-relaxed mb-8 max-w-md">
            Leverage our state-of-the-art models to analyze industry shifts and optimize your professional trajectory in real-time.
          </p>
          <button className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 font-black text-lg uppercase tracking-wider group/btn">
            <span>Explore Analytics</span>
            <ChevronRight size={22} className="transform group-hover/btn:translate-x-2 transition-transform" />
          </button>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary-50 dark:bg-primary-900/10 rounded-full opacity-50 blur-3xl transform group-hover:scale-125 transition-transform duration-700"></div>
      </div>
    </div>
  );
};

const ToolCard = ({ onClick, icon: Icon, iconBg, iconColor, title, description, accent }) => (
  <button
    onClick={onClick}
    className={`
      flex flex-col text-left group bg-white dark:bg-gray-900 p-10 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm 
      hover:shadow-2xl hover:-translate-y-2 transition-all duration-500
      relative overflow-hidden ${accent} hover:border-transparent dark:hover:border-primary-900/50
    `}
  >
    <div className={`${iconBg} w-20 h-20 rounded-[28px] flex items-center justify-center mb-8 transition-all group-hover:scale-110 group-hover:shadow-lg transition-colors duration-300`}>
      <Icon className={iconColor} size={36} />
    </div>
    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 tracking-tight transition-colors">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 font-semibold leading-relaxed mb-8 transition-colors">{description}</p>
    <div className="mt-auto flex items-center space-x-2 text-primary-600 dark:text-primary-400 font-black uppercase tracking-[0.2em] text-sm">
      <span>Initialize</span>
      <ChevronRight size={18} className="transform group-hover:translate-x-2 transition-transform" />
    </div>
    <div className={`absolute top-0 right-0 w-32 h-32 ${iconBg} opacity-20 rounded-bl-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
  </button>
);

export default Dashboard;
