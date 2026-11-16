import React from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import StatsSection from '../components/landing/StatsSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import WhyChooseUsSection from '../components/landing/WhyChooseUsSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. Responsive Navbar */}
      <Navbar />

      {/* 2. Hero Section with Floating Student Cards */}
      <HeroSection />

      {/* 3. Illustrative Demo Stats Section */}
      <StatsSection />

      {/* 4. Core Features Grid */}
      <FeaturesSection />

      {/* 5. 3-Step How It Works Section */}
      <HowItWorksSection />

      {/* 6. Why Choose Us Section */}
      <WhyChooseUsSection />

      {/* 7. Call To Action Section */}
      <CTASection />

      {/* 8. Footer */}
      <Footer />
    </div>
  );
}
