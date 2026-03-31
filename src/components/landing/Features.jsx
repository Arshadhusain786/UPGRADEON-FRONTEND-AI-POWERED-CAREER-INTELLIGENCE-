import React from 'react';
import { Target, TrendingUp, Users, CreditCard, ShieldCheck } from 'lucide-react';

const Features = () => {
  return (
    <section id="features" className="py-40 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-20 mb-32">
          {/* Main Feature Highlight */}
          <div className="flex-1 space-y-8">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600 shadow-xl shadow-primary-500/10">
              <Target size={32} />
            </div>
            <h3 className="text-5xl font-black tracking-tight leading-[1.1]">AI-Powered Personalized Roadmaps.</h3>
            <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Stop guessing your next move. Our deep-learning engine analyzes millions of data points to create a step-by-step evolution path tailored specifically for you.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 font-bold text-gray-700 dark:text-gray-300">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                  <ShieldCheck size={12} strokeWidth={4} />
                </div>
                Step-by-step Growth Plans
              </li>
              <li className="flex items-center gap-3 font-bold text-gray-700 dark:text-gray-300">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                  <ShieldCheck size={12} strokeWidth={4} />
                </div>
                Adaptive Skill Development
              </li>
            </ul>
          </div>
          
          {/* Aesthetic Mockup Placeholder */}
          <div className="flex-1 w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-[64px] border border-gray-200 dark:border-gray-800 shadow-inner relative overflow-hidden group">
            <div className="absolute inset-10 bg-white dark:bg-gray-950 rounded-[40px] shadow-2xl p-8 transform rotate-3 group-hover:rotate-0 transition-transform duration-700">
              <div className="space-y-4">
                <div className="h-4 w-1/3 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
                <div className="h-8 w-2/3 bg-primary-600/10 rounded-xl"></div>
                <div className="space-y-2 pt-6">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="flex gap-3 items-center">
                      <div className="w-6 h-6 rounded bg-emerald-500/20"></div>
                      <div className="h-3 flex-1 bg-gray-50 dark:bg-gray-900 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-500/20 font-black text-9xl">PATH</div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-8">
          <FeatureAltCard 
            icon={Target} 
            title="Career Roadmap" 
            desc="Personalized plan with step-by-step growth tailored to your target roles."
            tag="AI Engine"
          />
          <FeatureAltCard 
            icon={TrendingUp} 
            title="Skill Gap Analysis" 
            desc="Know exactly what you lack to bridge the gap and improve faster."
            tag="Analytics"
          />
          <FeatureAltCard 
            icon={Users} 
            title="Opportunities" 
            desc="Post jobs, request premium referrals, and build lasting industry connections."
            tag="Community"
          />
        </div>
        
        <div className="mt-8 max-w-3xl mx-auto">
          <FeatureAltCard 
            icon={CreditCard} 
            title="Transparent Credits System" 
            desc="Pay only when needed. Transparent AI usage. Earn more by referring friends."
            tag="Economics"
          />
        </div>
        
      </div>
    </section>
  );
};

const FeatureAltCard = ({ icon: Icon, title, desc, tag }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-10 rounded-[40px] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
     <div className="flex justify-between items-start mb-10">
        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-primary-600 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500">
           <Icon size={32} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 opacity-60">{tag}</span>
     </div>
     <h4 className="text-3xl font-black mb-4 tracking-tight">{title}</h4>
     <p className="text-gray-500 dark:text-gray-400 font-bold leading-relaxed">{desc}</p>
  </div>
);

export default Features;
