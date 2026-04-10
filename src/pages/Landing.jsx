import React from 'react';
import LandingNavbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import Testimonials from '../components/landing/Testimonials';
import Pricing from '../components/landing/Pricing';
import FAQ from '../components/landing/FAQ';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030712] text-gray-900 dark:text-white transition-all duration-500 overflow-x-hidden selection:bg-cyan-500/30 font-sans">
      
      {/* ── Premium Background Architecture ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[800px] h-[800px] bg-violet-500/10 rounded-full blur-[150px] animate-pulse duration-[8000ms]"></div>
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px]"></div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <LandingNavbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

export default Landing;
