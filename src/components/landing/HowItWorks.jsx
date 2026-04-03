import React from 'react';
import { Rocket, Gift, BrainCircuit, Target } from 'lucide-react';

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-40 relative z-10 border-y border-gray-100 dark:border-gray-800/50 bg-gray-50/30 dark:bg-gray-950/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
           <h3 className="text-sm font-black text-primary-600 dark:text-primary-400 uppercase tracking-[0.3em] mb-4">The Upgradon Cycle</h3>
           <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Engineered for Velocity.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <StepCard 
            number="01" 
            icon={Rocket} 
            title="Sign Up" 
            desc="Create your professional profile and authenticate securely to join the platform." 
          />
          <StepCard 
            number="02" 
            icon={Gift} 
            title="Get Free Credits" 
            desc="Instantly unlock 20 free platform credits to explore premium AI features." 
          />
          <StepCard 
            number="03" 
            icon={BrainCircuit} 
            title="Generate Roadmap" 
            desc="Input your target role and get a full AI-powered career growth progression." 
          />
          <StepCard 
            number="04" 
            icon={Target} 
            title="Explore Opportunities" 
            desc="Find real opportunities, score your resume, and connect with top prospects." 
          />
        </div>
      </div>
    </section>
  );
};

const StepCard = ({ number, icon: Icon, title, desc }) => (
  <div className="group space-y-6 p-10 rounded-[40px] hover:bg-white dark:hover:bg-gray-900/50 hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
    <div className="flex justify-between items-start">
       <div className="w-14 h-14 bg-primary-600/10 text-primary-600 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white">
          <Icon size={28} />
       </div>
       <span className="text-4xl font-black text-gray-100 dark:text-gray-800 transition-colors group-hover:text-primary-500/20">{number}</span>
    </div>
    <div className="space-y-3">
      <h3 className="text-2xl font-black tracking-tight">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 font-bold text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default HowItWorks;
