import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      tagline: '20 credits on signup + 10/day',
      features: [
        '20 Signup Bonus Credits',
        '10 Free Credits Daily',
        'Career Roadmap (5 cr)',
        'Skill Gap Analysis (3 cr)',
        'Resume Scorer (4 cr)',
      ],
      cta: 'Start Free',
      highlighted: false,
    },
    {
      name: 'Growth',
      price: '₹199',
      tagline: '100 credits pack',
      features: [
        'Everything in Starter',
        '100 Premium Credits',
        'Resume Upload Scanner',
        'Free AI Chatbot Access',
        'Priority Support',
      ],
      cta: 'Get Growth Pack',
      highlighted: true,
    },
    {
      name: 'Pro',
      price: '₹399',
      tagline: '250 credits pack',
      features: [
        'Everything in Growth',
        '250 Premium Credits',
        'Free AI Chatbot Access',
        'Bulk Resume Scanning',
        'Advanced Analytics',
      ],
      cta: 'Go Pro',
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-40 px-6 relative z-10">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-sm font-black text-cyan-400 uppercase tracking-[0.3em] mb-4"
          >
            Simple Pricing
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-7xl font-black tracking-tighter text-white px-4"
          >
            Pay for Value, <br className="md:hidden" />
            <span className="text-gradient">Not Overheads.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative group p-0.5 md:p-1 rounded-[32px] md:rounded-[40px] transition-all duration-500 ${
                plan.highlighted ? 'scale-105 neon-border z-10' : 'scale-100'
              }`}
            >
              <div className="glass p-8 md:p-10 rounded-[30px] md:rounded-[38px] h-full flex flex-col hover:bg-white/10 transition-all">
                {plan.highlighted && (
                   <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-500 rounded-full text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2">
                     <Sparkles size={10} /> Best Value
                   </div>
                )}
                
                <p className="text-xs font-black uppercase tracking-widest text-cyan-400 mb-2">{plan.name}</p>
                <div className="mb-4">
                  <span className="text-5xl font-black text-white">{plan.price}</span>
                </div>
                <p className="text-sm text-gray-400 font-medium mb-8">{plan.tagline}</p>

                <div className="space-y-4 mb-10 flex-1">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm font-semibold text-gray-300">{f}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/register"
                  className={`block w-full py-5 rounded-2xl text-center font-black text-sm transition-all active:scale-95 shimmer ${
                    plan.highlighted
                      ? 'bg-cyan-600 text-white shadow-xl shadow-cyan-500/20'
                      : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
