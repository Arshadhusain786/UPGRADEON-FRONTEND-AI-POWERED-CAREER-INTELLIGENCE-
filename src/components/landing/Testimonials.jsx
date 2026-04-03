import React from 'react';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'SDE-2, Flipkart',
    avatar: 'PS',
    gradient: 'from-indigo-500 to-purple-600',
    text: 'Upgradon gave me a laser-focused roadmap. Within 3 months of following it, I cracked my Flipkart interview. The skill gap tool was eye-opening.',
    stars: 5,
  },
  {
    name: 'Arjun Mehra',
    role: 'Backend Engineer, Razorpay',
    avatar: 'AM',
    gradient: 'from-emerald-500 to-teal-600',
    text: 'I used the resume optimizer before every application cycle. Got 3x more call-backs after fixing ATS issues I didn\'t even know existed. 10/10.',
    stars: 5,
  },
  {
    name: 'Sneha Agarwal',
    role: 'Product Manager, Swiggy',
    avatar: 'SA',
    gradient: 'from-amber-500 to-orange-600',
    text: 'The opportunity board connected me directly to a referral that got me my current role. The credit system is completely transparent — no hidden costs.',
    stars: 5,
  },
  {
    name: 'Rahul Kapoor',
    role: 'CS Final Year, IIT Delhi',
    avatar: 'RK',
    gradient: 'from-pink-500 to-rose-600',
    text: 'As a student, the free daily credits are more than enough to keep improving. The AI roadmap adapted to my profile perfectly. Highly recommend!',
    stars: 5,
  },
  {
    name: 'Divya Nair',
    role: 'ML Engineer, Google',
    avatar: 'DN',
    gradient: 'from-blue-500 to-cyan-600',
    text: 'The chatbot helped me prep for technical interviews on the go. It knows exactly what skills are relevant for ML roles at top companies.',
    stars: 5,
  },
  {
    name: 'Varun Tiwari',
    role: 'DevOps Lead, Microsoft',
    avatar: 'VT',
    gradient: 'from-violet-500 to-indigo-600',
    text: 'The AI-generated connection message feature is genius. It helped me craft compelling outreach messages for each job post. Got 80% response rate.',
    stars: 5,
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-40 px-6 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-sm font-black text-primary-600 dark:text-primary-400 uppercase tracking-[0.3em] mb-4">
            Social Proof
          </p>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-gray-900 dark:text-white">
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-primary-600">builders & dreamers.</span>
          </h2>
          <p className="mt-6 text-xl text-gray-500 dark:text-gray-400 font-medium max-w-xl mx-auto">
            Join thousands of professionals who've accelerated their career with Upgradon.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[32px] p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group"
            >
              {/* Quote Icon */}
              <div className="mb-6">
                <Quote className="w-8 h-8 text-primary-200 dark:text-primary-900/60 group-hover:text-primary-400 transition-colors" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, si) => (
                  <Star key={si} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed mb-8 text-[15px]">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-black text-sm flex-shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-black text-gray-900 dark:text-white text-sm">{t.name}</p>
                  <p className="text-xs font-bold text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
