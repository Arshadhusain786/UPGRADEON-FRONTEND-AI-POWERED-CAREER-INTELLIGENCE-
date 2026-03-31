import React from 'react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <>
      {/* ── SECTION 4: TRUST & VALUE ── */}
      <section className="py-32 bg-gray-900 dark:bg-white text-white dark:text-gray-950 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="space-y-6 max-w-xl">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Engineered for Students & Developers.</h2>
              <p className="text-lg opacity-60 font-medium leading-relaxed">
                 Upgradon is more than a tool; it's your permanent career advisor. Built by engineers who understand the gap between university and high-scale production.
              </p>
           </div>
           <div className="grid grid-cols-2 gap-8 shrink-0">
              <div className="p-8 bg-white/5 dark:bg-gray-900/5 rounded-3xl backdrop-blur-md border border-white/10 dark:border-gray-900/10">
                 <p className="text-4xl font-black mb-2 tracking-tighter text-primary-400">10k+</p>
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Active Users</p>
              </div>
              <div className="p-8 bg-white/5 dark:bg-gray-900/5 rounded-3xl backdrop-blur-md border border-white/10 dark:border-gray-900/10">
                 <p className="text-4xl font-black mb-2 tracking-tighter text-emerald-400">95%</p>
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-50">ATS Score Up</p>
              </div>
           </div>
        </div>
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary-500/20 to-transparent"></div>
      </section>

      {/* ── SECTION 5: FINAL CTA ── */}
      <section className="relative py-48 px-6 text-center">
         <div className="absolute inset-0 bg-primary-600/5 dark:bg-primary-500/5 pointer-events-none"></div>
         <div className="max-w-3xl mx-auto space-y-12 relative z-10">
            <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-[1] text-gray-900 dark:text-white">
               Start building your <br />
               future today.
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 font-bold leading-relaxed max-w-lg mx-auto">
               Join thousands of others taking the data-driven path to their dream career.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <Link 
                to="/register" 
                className="bg-primary-600 hover:bg-primary-700 text-white px-12 py-5 rounded-[24px] font-black text-xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary-500/40"
               >
                 Sign Up Free
               </Link>
               <Link 
                to="/login" 
                className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 px-12 py-5 rounded-[24px] font-black text-xl transition-all hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 shadow-xl shadow-black/5"
               >
                 Go to Dashboard
               </Link>
            </div>
         </div>
      </section>
    </>
  );
};

export default CTA;
