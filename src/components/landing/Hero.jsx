import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 md:pt-60 pb-32 md:pb-40 px-6 z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 px-6 py-2.5 glass rounded-full text-cyan-400 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] mb-8 md:mb-12"
        >
          <Sparkles size={14} fill="currentColor" />
          <span>AI-Powered Career Intelligence</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-9xl lg:text-[130px] font-black tracking-tight leading-[0.95] md:leading-[0.85] mb-8 md:mb-10 text-slate-900 dark:text-white"
        >
          Build Your <br className="hidden md:block" />
          <span className="text-gradient font-black">
            Future Now
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-slate-600 dark:text-gray-400 font-medium max-w-3xl mx-auto mb-16 leading-relaxed"
        >
          The only career platform that uses RAG-powered AI and professional networks to guide your every move. Precision, not guesswork.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8"
        >
          <Link 
            to="/register" 
            className="group relative shimmer bg-cyan-600 hover:bg-cyan-500 text-white px-12 py-6 rounded-2xl font-black text-xl flex items-center gap-4 transition-all neon-border"
          >
            Start Your Journey
            <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center gap-4 px-10 py-6 rounded-2xl font-black text-xl text-slate-900 dark:text-white glass hover:bg-black/5 dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/10"
          >
            <span>Access Dashboard</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
