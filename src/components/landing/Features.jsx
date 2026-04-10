import { motion } from 'framer-motion';
import { Target, TrendingUp, Users, CreditCard, ShieldCheck } from 'lucide-react';

const Features = () => {
  return (
    <section id="features" className="py-40 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-20 mb-32">
          {/* Main Feature Highlight */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-8"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 border border-cyan-500/20">
              <Target size={28} className="md:w-8 md:h-8" />
            </div>
            <h3 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1] text-white">AI-Powered Personalized Roadmaps.</h3>
            <p className="text-lg text-gray-400 font-medium leading-relaxed">
              Stop guessing your next move. Our deep-learning engine analyzes millions of data points to create a step-by-step evolution path tailored specifically for you.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 font-bold text-gray-300">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <ShieldCheck size={12} strokeWidth={4} />
                </div>
                Step-by-step Growth Plans
              </li>
              <li className="flex items-center gap-3 font-bold text-gray-300">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <ShieldCheck size={12} strokeWidth={4} />
                </div>
                Adaptive Skill Development
              </li>
            </ul>
          </motion.div>
          
          {/* Aesthetic Mockup Placeholder */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full aspect-square glass rounded-[64px] border-white/5 relative overflow-hidden group"
          >
            <div className="absolute inset-10 bg-black/40 backdrop-blur-3xl rounded-[40px] border border-white/5 shadow-2xl p-8 transform rotate-3 group-hover:rotate-0 transition-transform duration-700">
                <div className="h-4 w-1/3 bg-white/5 rounded-full mb-6"></div>
                <div className="h-8 w-2/3 bg-cyan-500/10 rounded-xl mb-12"></div>
                <div className="space-y-6">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex gap-4 items-center">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20"></div>
                      <div className="h-3 flex-1 bg-white/5 rounded"></div>
                    </div>
                  ))}
                </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5 font-black text-9xl pointer-events-none">PATH</div>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <FeatureAltCard 
            icon={Target} 
            title="Career Roadmap" 
            desc="Personalized plan with step-by-step growth tailored to your target roles."
            tag="AI Engine"
            index={0}
          />
          <FeatureAltCard 
            icon={TrendingUp} 
            title="Skill Gap Analysis" 
            desc="Know exactly what you lack to bridge the gap and improve faster."
            tag="Analytics"
            index={1}
          />
          <FeatureAltCard 
            icon={Users} 
            title="Opportunities" 
            desc="Post jobs, request premium referrals, and build lasting industry connections."
            tag="Community"
            index={2}
          />
        </div>
      </div>
    </section>
  );
};

const FeatureAltCard = ({ icon: Icon, title, desc, tag, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="glass p-8 md:p-10 rounded-[32px] md:rounded-[40px] hover:bg-white/10 transition-all duration-500 neon-border-hover group"
  >
     <div className="flex justify-between items-start mb-8 md:mb-10">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-500 border border-white/5">
           <Icon size={24} className="md:w-8 md:h-8" />
        </div>
        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-cyan-400 opacity-60">{tag}</span>
     </div>
     <h4 className="text-2xl md:text-3xl font-black mb-4 tracking-tight text-white">{title}</h4>
     <p className="text-sm md:text-gray-400 font-bold leading-relaxed">{desc}</p>
  </motion.div>
);

export default Features;
