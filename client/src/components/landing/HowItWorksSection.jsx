import React from 'react';
import { UserPlus, Search, MessageSquare, ArrowRight, Check } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      title: 'Create Your Profile',
      description: 'Add your subjects, interests, goals, and availability. Tell classmates what you are studying and when you are free to meet.',
      icon: UserPlus,
      color: 'from-indigo-600 to-indigo-700',
      badge: 'Step 1',
      highlights: ['Enrolled subjects & labs', 'Weekly schedule grid', 'Target goals (Exams / Projects)']
    },
    {
      step: '02',
      title: 'Discover Partners',
      description: 'Explore students ranked by compatibility. Our mathematical algorithm matches shared courses, availability, and interests in real time.',
      icon: Search,
      color: 'from-violet-600 to-violet-700',
      badge: 'Step 2',
      highlights: ['Deterministic 0-100% score', 'Granular factor breakdown', 'Multi-attribute filtering']
    },
    {
      step: '03',
      title: 'Connect and Collaborate',
      description: 'Send requests and find your ideal study partner. Accept invitations with one click and access direct contacts, GitHub, and notes.',
      icon: MessageSquare,
      color: 'from-purple-600 to-pink-600',
      badge: 'Step 3',
      highlights: ['Personalized invitation notes', 'One-click accept/reject', 'Unified active partner hub']
    }
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Streamlined Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            How LabPartner Finder Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            Finding compatible classmates should not be a chore. Get paired with dedicated peers in three simple steps.
          </p>
        </div>

        {/* 3 Steps Cards */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-white p-8 rounded-3xl border border-slate-200/90 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-md shadow-indigo-500/20`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-slate-200 group-hover:text-indigo-200 transition-colors">
                      {item.step}
                    </span>
                  </div>

                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1 block">
                    {item.badge}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Sub-highlights */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  {item.highlights.map((hl, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

