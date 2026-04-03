import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    q: 'How does the credit system work?',
    a: 'You get 20 free credits when you sign up, plus 10 free credits every day automatically. Credits are consumed when using AI features — like generating a roadmap (5 cr), skill gap analysis (3 cr), or resume scoring (4 cr). Credits never expire.',
  },
  {
    q: 'What file formats are supported for resume upload?',
    a: 'Upgradon supports PDF, DOCX, and plain text (TXT) files up to 10MB. Our AI extracts your skills, experience, and education automatically to provide a comprehensive ATS analysis.',
  },
  {
    q: 'Is my data safe and private?',
    a: 'Absolutely. We use industry standard JWT authentication, bcrypt password hashing, and all connections are encrypted over HTTPS. We never share your personal data or resumes with third parties.',
  },
  {
    q: 'Can I get a refund on purchased credits?',
    a: 'Purchased credits are non-refundable but they never expire. If you experience technical issues that consume credits without results, contact support and we\'ll credit your account.',
  },
  {
    q: 'What is the Opportunity Board?',
    a: 'The Opportunity Board is a referral-based job connection system. Mentors and professionals post opportunities; seekers can use credits or free weekly connections to request a referral. It\'s built for authentic, warm connections — not cold applications.',
  },
  {
    q: 'Can I use Upgradon for free forever?',
    a: 'Yes! With 10 free credits daily you can use all core AI features regularly. You only need to purchase if you want to use multiple features rapidly or need additional connections.',
  },
];

const FAQ = () => {
  const [open, setOpen] = useState(null);

  return (
    <section id="faq" className="py-40 px-6 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-sm font-black text-primary-600 dark:text-primary-400 uppercase tracking-[0.3em] mb-4">
            Questions
          </p>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-gray-900 dark:text-white">
            Got questions? <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">We have answers.</span>
          </h2>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`rounded-[24px] border transition-all duration-300 overflow-hidden ${
                open === i
                  ? 'border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/10'
                  : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700'
              }`}
            >
              <button
                className="w-full flex items-center justify-between p-8 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-black text-gray-900 dark:text-white text-lg pr-4">{faq.q}</span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  open === i ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                }`}>
                  {open === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {open === i && (
                <div className="px-8 pb-8">
                  <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
