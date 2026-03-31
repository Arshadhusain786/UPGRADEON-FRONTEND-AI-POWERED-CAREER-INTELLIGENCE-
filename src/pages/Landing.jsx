import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Target, 
  Zap, 
  Globe, 
  ChevronRight, 
  Star, 
  ShieldCheck, 
  PlayCircle,
  Users,
  Trophy
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-all duration-500 overflow-x-hidden">
      
      {/* ── Background Blobs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-[30%] right-[10%] w-[400px] h-[400px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      {/* ── Navigation ── */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-gray-100/50 dark:border-gray-800/50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-12 h-12 bg-primary-600 rounded-[14px] flex items-center justify-center shadow-lg shadow-primary-500/40 group-hover:rotate-12 transition-transform duration-300">
              <Sparkles className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Upgradon
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-10 text-sm font-bold text-gray-500 dark:text-gray-400">
            <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary-600 transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-primary-600 transition-colors">Pricing</a>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link to="/login" className="hidden sm:block font-bold text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors px-4">
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2.5 rounded-2xl font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-xl shadow-gray-200 dark:shadow-none"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative pt-48 pb-32 px-6 z-10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-50/50 dark:bg-primary-900/10 rounded-full text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-widest border border-primary-100/50 dark:border-primary-900/20 mb-10 animate-fade-in shadow-sm">
            <Star size={12} fill="currentColor" />
            <span>Trusted by 10,000+ professionals globally</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.95] mb-8 animate-slide-in-from-bottom">
            Your Career, <br />
            <span className="text-primary-600 dark:text-primary-400 relative">
              AI-Engineered
              <div className="absolute -bottom-2 left-0 w-full h-3 bg-primary-500/20 -rotate-1 rounded-full"></div>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto mb-12 animate-fade-in delay-200 leading-relaxed">
            The world's most advanced AI platform for mapping career roadmaps, detecting skill gaps, and optimizing resumes for the global market.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in delay-300">
            <Link 
              to="/register" 
              className="group bg-primary-600 hover:bg-primary-700 text-white px-10 py-5 rounded-[24px] font-black text-xl flex items-center gap-3 transition-all shadow-2xl shadow-primary-500/40 hover:scale-105 active:scale-95"
            >
              Start Free Today
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <button className="flex items-center gap-3 px-8 py-5 rounded-[24px] font-black text-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all active:scale-95">
              <PlayCircle className="text-primary-600" />
              Watch Demo
            </button>
          </div>

          {/* Social Proof Placeholder */}
          <div className="mt-24 pt-12 border-t border-gray-100 dark:border-gray-800 flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale animate-fade-in delay-500">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" className="h-6" alt="Google" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" className="h-8" alt="IBM" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Microsoft_logo.svg" className="h-6" alt="Microsoft" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" className="h-6" alt="Amazon" />
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="py-32 bg-gray-50/50 dark:bg-gray-900/30 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-sm font-black text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em]">Core Capabilities</h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight">Precision tools for modern talent.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Target} 
              title="Career Roadmap" 
              desc="Deep-learning algorithms map your journey from where you are to where you want to be."
              color="blue"
            />
            <FeatureCard 
              icon={Zap} 
              title="Skill Gap Detection" 
              desc="Real-time analysis of industry demands vs your current skill set to keep you competitive."
              color="indigo"
            />
            <FeatureCard 
              icon={Globe} 
              title="Resume Intelligence" 
              desc="Advanced neural scoring and feedback to help you bypass ATS filters and land interviews."
              color="emerald"
            />
          </div>
        </div>
      </section>

      {/* ── Stats / Impact ── */}
      <section className="py-32 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <StatItem value="98%" label="Success Rate" />
          <StatItem value="50k+" label="Roadmaps Created" />
          <StatItem value="24/7" label="AI Support" />
          <StatItem value="150+" label="Target Roles" />
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-40 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto bg-gray-900 dark:bg-white rounded-[64px] p-20 text-center text-white dark:text-gray-900 relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
          <div className="relative z-10 space-y-10">
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">Ready to upgrade your reality?</h2>
            <p className="text-xl text-gray-400 dark:text-gray-500 font-medium max-w-lg mx-auto">
              Join the elite circle of professionals navigating their careers with AI-powered clarity.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-4">
              <Link 
                to="/register" 
                className="bg-primary-600 hover:bg-primary-700 text-white px-12 py-5 rounded-[24px] font-black text-xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary-500/30"
              >
                Join Now Free
              </Link>
              <div className="flex items-center gap-4 text-sm font-bold opacity-60">
                <ShieldCheck size={20} />
                No credit card required
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Sparkles size={200} />
          </div>
          <div className="absolute bottom-0 left-0 p-10 opacity-10 rotate-180">
            <Target size={150} />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-20 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <div className="space-y-6 max-w-xs">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <span className="text-xl font-black tracking-tight">Upgradon</span>
              </div>
              <p className="text-sm font-medium text-gray-500 leading-relaxed">
                Empowering the next generation of global talent through autonomous career intelligence.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-24">
              <FooterLinks title="Product" links={['Features', 'Roadmaps', 'Pricing', 'API']} />
              <FooterLinks title="Platform" links={['About Us', 'Success Stories', 'Community', 'Security']} />
              <FooterLinks title="Legal" links={['Privacy', 'Terms', 'Cookie Policy']} />
            </div>
          </div>
          
          <div className="pt-12 border-t border-gray-50 dark:border-gray-900 flex flex-col sm:flex-row justify-between items-center gap-6 text-xs font-black text-gray-400 uppercase tracking-widest">
            <p>© 2026 Upgradon AI Labs. Made for the Future.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-primary-600 transition-colors">Twitter</a>
              <a href="#" className="hover:text-primary-600 transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-primary-600 transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, color }) => (
  <div className="bg-white dark:bg-gray-950 p-12 rounded-[48px] border border-gray-100 dark:border-gray-800 group hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] dark:hover:shadow-none transition-all duration-500 hover:-translate-y-4">
    <div className={`w-20 h-20 bg-${color}-50 dark:bg-${color}-900/20 rounded-[28px] flex items-center justify-center mb-10 text-${color}-600 dark:text-${color}-400 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
      <Icon size={40} />
    </div>
    <h3 className="text-2xl font-black mb-6 tracking-tight">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 font-bold leading-relaxed">{desc}</p>
    <div className="mt-8 flex items-center gap-2 text-primary-600 dark:text-primary-400 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
      Learn More <ChevronRight size={14} />
    </div>
  </div>
);

const StatItem = ({ value, label }) => (
  <div className="space-y-2">
    <p className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">{value}</p>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{label}</p>
  </div>
);

const FooterLinks = ({ title, links }) => (
  <div className="space-y-6">
    <h4 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">{title}</h4>
    <ul className="space-y-4">
      {links.map(link => (
        <li key={link}>
          <a href="#" className="text-sm font-bold text-gray-500 hover:text-primary-600 transition-colors">{link}</a>
        </li>
      ))}
    </ul>
  </div>
);

export default Landing;
