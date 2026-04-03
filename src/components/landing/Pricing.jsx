import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    tagline: '20 credits on signup + 10/day',
    color: 'from-gray-900 to-gray-800',
    textColor: 'text-white',
    features: [
      '20 Signup Bonus Credits',
      '10 Free Credits Daily',
      'Career Roadmap (5 cr)',
      'Skill Gap Analysis (3 cr)',
      'Resume Scorer (4 cr)',
      '3 Free Connections/Week',
    ],
    cta: 'Start Free',
    href: '/register',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: '₹199',
    tagline: '100 credits pack — best value',
    color: 'from-indigo-600 to-primary-600',
    textColor: 'text-white',
    features: [
      'Everything in Starter',
      '100 Premium Credits',
      'Resume Upload Scanner',
      'AI Chatbot Access (1 cr/msg)',
      'AI Connection Summary',
      'Priority Support',
    ],
    cta: 'Get Growth Pack',
    href: '/register',
    highlighted: true,
  },
  {
    name: 'Pro',
    price: '₹399',
    tagline: '250 credits — for power users',
    color: 'from-emerald-600 to-teal-600',
    textColor: 'text-white',
    features: [
      'Everything in Growth',
      '250 Premium Credits',
      'Unlimited AI Chatbot',
      'Bulk Resume Scanning',
      'Advanced Analytics',
      'Dedicated Support',
    ],
    cta: 'Go Pro',
    href: '/register',
    highlighted: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-40 px-6 relative z-10 bg-gray-50/50 dark:bg-gray-950/30">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-primary-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-sm font-black text-primary-600 dark:text-primary-400 uppercase tracking-[0.3em] mb-4">
            Simple Pricing
          </p>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-gray-900 dark:text-white">
            Pay only when you <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">need more.</span>
          </h2>
          <p className="mt-6 text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto">
            Start for free with generous daily refills. Upgrade anytime with our transparent credit packs.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-[40px] overflow-hidden transition-all duration-500 ${
                plan.highlighted
                  ? 'scale-105 shadow-2xl shadow-primary-500/20 ring-2 ring-primary-500/30'
                  : 'hover:-translate-y-2 hover:shadow-xl'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-0 right-0 py-2 text-center bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest z-10">
                  Most Popular
                </div>
              )}

              <div className={`bg-gradient-to-br ${plan.color} p-10 ${plan.highlighted ? 'pt-12' : ''}`}>
                <p className="text-xs font-black uppercase tracking-widest text-white/60 mb-2">{plan.name}</p>
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-5xl font-black text-white">{plan.price}</span>
                </div>
                <p className="text-sm text-white/60 font-medium mb-8">{plan.tagline}</p>

                <Link
                  to={plan.href}
                  className={`block w-full py-4 rounded-2xl text-center font-black text-sm transition-all active:scale-95 ${
                    plan.highlighted
                      ? 'bg-white text-primary-700 hover:bg-white/90'
                      : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>

              <div className="bg-white dark:bg-gray-900 px-10 py-8 space-y-4 border border-gray-100 dark:border-gray-800 rounded-b-[40px]">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
