import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Target, Zap, Shield, Globe } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <span className="text-white font-bold text-xl">U</span>
            </div>
            <span className="text-2xl font-black tracking-tight">Upgradon</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <ThemeToggle />
            <Link to="/login" className="font-bold text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors px-4">
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-primary-500/25 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-full text-primary-600 dark:text-primary-400 text-sm font-bold border border-primary-100 dark:border-primary-900/30 animate-fade-in">
            <Sparkles size={16} />
            <span>AI-Powered Career Intelligence Platform</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1] animate-slide-in-from-bottom">
            Accelerate Your <br />
            <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
              Professional Destiny
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto animate-fade-in delay-200">
            Precision AI tools to map your career path, identify skill gaps, and optimize your resume for global market impact.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-6 animate-fade-in delay-300">
            <Link 
              to="/register" 
              className="group bg-primary-600 hover:bg-primary-700 text-white px-10 py-5 rounded-2xl font-black text-xl flex items-center space-x-3 transition-all shadow-xl shadow-primary-500/30 hover:scale-105 active:scale-95"
            >
              <span>Build My Roadmap</span>
              <ArrowRight className="transform group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link 
              to="/login" 
              className="px-10 py-5 rounded-2xl font-black text-xl border-2 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all active:scale-95"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={Target} 
              title="Career Roadmap" 
              desc="Deep-learning algorithms generate step-by-step phases to your target role."
              color="text-blue-600"
            />
            <FeatureCard 
              icon={Zap} 
              title="Skill Gap Analysis" 
              desc="Real-time industry requirements matching versus your current capabilities."
              color="text-indigo-600"
            />
            <FeatureCard 
              icon={Globe} 
              title="Resume Optimizer" 
              desc="Neural scoring and strategic feedback for maximum recruitment impact."
              color="text-emerald-600"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary-600 to-primary-900 rounded-[48px] p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Ready to transcend your limits?</h2>
            <p className="text-xl text-primary-100 font-medium max-w-lg mx-auto leading-relaxed">
              Join thousands of professionals using AI to navigate the complex world of modern tech careers.
            </p>
            <Link 
              to="/register" 
              className="inline-flex bg-white text-primary-900 px-12 py-5 rounded-3xl font-black text-xl hover:bg-primary-50 transition-all shadow-xl shadow-black/10 active:scale-95"
            >
              Start Free Trial
            </Link>
          </div>
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full -ml-32 -mb-32 blur-2xl opacity-30"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-500 font-medium space-y-6 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">U</span>
            </div>
            <span className="font-black text-gray-900 dark:text-white">Upgradon</span>
          </div>
          <p>© 2026 Upgradon AI Platform. All rights reserved.</p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="hover:text-primary-600">Privacy Policy</a>
            <a href="#" className="hover:text-primary-600">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, color }) => (
  <div className="bg-white dark:bg-gray-900 p-10 rounded-[36px] border border-gray-100 dark:border-gray-800 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
    <div className={`w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-8 ${color} group-hover:scale-110 transition-transform`}>
      <Icon size={32} />
    </div>
    <h3 className="text-2xl font-black mb-4 tracking-tight">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 font-bold leading-relaxed">{desc}</p>
  </div>
);

export default Landing;
