import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, MapPin, Shield } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id) => {
    const elem = document.querySelector(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          {/* Column 1: Brand & Description (span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                LabPartner<span className="text-indigo-400">.Finder</span>
              </span>
            </Link>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              The premier study and laboratory partner matching network for university students. Discover compatible classmates by course, schedule, and academic goals.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>Verified academic network for university coursework</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-white transition"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('#features')}
                  className="hover:text-white transition"
                >
                  Platform Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('#how-it-works')}
                  className="hover:text-white transition"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('#about')}
                  className="hover:text-white transition"
                >
                  About Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Features</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-slate-400 hover:text-white cursor-pointer transition">
                  Smart Matching
                </span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-white cursor-pointer transition">
                  Schedule Overlap Matrix
                </span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-white cursor-pointer transition">
                  Course & Lab Alignment
                </span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-white cursor-pointer transition">
                  Partner Request Inbox
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Placeholder */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Support & Contact</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>support@labpartnerfinder.edu</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-violet-400 flex-shrink-0" />
                <span>University Campus Commons</span>
              </li>
              <li className="pt-2">
                <Link
                  to="/login"
                  className="inline-block px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
                >
                  Student Portal Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            &copy; {currentYear} LabPartner Finder. Built for college student collaboration. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 transition cursor-pointer">Privacy Guidelines</span>
            <span className="hover:text-slate-300 transition cursor-pointer">Terms of Collaboration</span>
            <span className="hover:text-slate-300 transition cursor-pointer">Academic Integrity</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

