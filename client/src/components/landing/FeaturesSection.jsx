import React from 'react';
import {
  Sparkles,
  Clock,
  BookOpen,
  FlaskConical,
  User,
  Send,
  ArrowUpRight
} from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      title: 'Smart Partner Matching',
      description: 'Find students with similar academic interests, coursework, and compatible schedules using our 4-factor synergy algorithm.',
      icon: Sparkles,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50 border-indigo-100',
      badge: '35% Course Weight'
    },
    {
      title: 'Availability Matching',
      description: 'Discover partners who are free when you are. Sync your weekly schedule slots across morning, afternoon, evening, and weekends.',
      icon: Clock,
      iconColor: 'text-violet-600',
      iconBg: 'bg-violet-50 border-violet-100',
      badge: '30% Schedule Weight'
    },
    {
      title: 'Subject-Based Search',
      description: 'Find students studying your exact subjects. Filter by enrolled classes, midterm dates, and specific laboratory assignments.',
      icon: BookOpen,
      iconColor: 'text-pink-600',
      iconBg: 'bg-pink-50 border-pink-100',
      badge: 'Course Indexed'
    },
    {
      title: 'Academic Collaboration',
      description: 'Work together on labs, assignments, and projects. Share code repos, meeting locations, and study goals in one unified space.',
      icon: FlaskConical,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 border-emerald-100',
      badge: 'Lab Ready'
    },
    {
      title: 'Student Profiles',
      description: 'Explore comprehensive profiles showcasing technical skills, academic interests, study goals, preferred formats, and contact methods.',
      icon: User,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50 border-amber-100',
      badge: 'Verified Peers'
    },
    {
      title: 'Easy Partner Requests',
      description: 'Connect with classmates through simple, personalized collaboration requests. Accept, decline, or manage invitations with a click.',
      icon: Send,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50 border-blue-100',
      badge: 'One-Click Action'
    }
  ];

  return (
    <section id="features" className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Core Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for Modern Academic Synergy
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Everything college students need to find reliable classmates, coordinate lab schedules, and excel in difficult university courses.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative bg-white p-7 rounded-3xl border border-slate-200/80 shadow-soft hover:shadow-card hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${feature.iconBg} ${feature.iconColor} group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                    {feature.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors">
                  <span>Explore Feature</span>
                  <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

