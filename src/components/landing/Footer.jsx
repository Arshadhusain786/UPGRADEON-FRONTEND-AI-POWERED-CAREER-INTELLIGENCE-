import React from 'react';
import { BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-20 border-t border-gray-100 dark:border-gray-800 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          <div className="space-y-6 max-w-xs">
            <div className="flex items-center space-x-3">
              <BrainCircuit className="text-primary-600" size={24} />
              <span className="text-xl font-black tracking-tight">Upgradon</span>
            </div>
            <p className="text-sm font-medium text-gray-500 leading-relaxed">
              Empowering the next generation of global talent through autonomous career intelligence and community-driven rewards.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-24">
            <FooterLinks 
              title="Product" 
              links={[
                { label: 'AI Roadmap', to: '/roadmap' },
                { label: 'Skill Gap', to: '/skill-gap' },
                { label: 'Opportunities', to: '/opportunities' },
                { label: 'Login', to: '/login' }
              ]} 
            />
            <FooterLinks 
              title="Ecosystem" 
              links={[
                { label: 'Pricing (Credits)', to: '/billing' },
                { label: 'Referrals', to: '/referrals' },
                { label: 'Register', to: '/register' }
              ]} 
            />
            <FooterLinks 
              title="Connect" 
              links={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Privacy Policy', to: '#' },
                { label: 'Terms of Service', to: '#' }
              ]} 
            />
          </div>
        </div>
        
        <div className="pt-12 border-t border-gray-50 dark:border-gray-900 flex flex-col sm:flex-row justify-between items-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
          <p>© 2026 Upgradon Labs. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary-600 transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary-600 transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-primary-600 transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLinks = ({ title, links }) => (
  <div className="space-y-6">
    <h4 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">{title}</h4>
    <ul className="space-y-4">
      {links.map((link, idx) => (
        <li key={idx}>
          <Link to={link.to} className="text-sm font-bold text-gray-500 hover:text-primary-600 transition-colors">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;
