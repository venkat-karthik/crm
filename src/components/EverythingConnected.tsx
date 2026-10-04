import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Target,
  GitBranch,
  CheckSquare,
  MessageSquare,
  PhoneCall,
  Calendar,
  LifeBuoy,
  BarChart3,
  Sparkles,
  Bell,
  UserCheck,
  ArrowUpRight,
  ArrowRight,
} from 'lucide-react';

interface EverythingConnectedProps {
  onSelectFeature?: (featureName: string) => void;
  onExploreFeatures?: () => void;
}

export const EverythingConnected: React.FC<EverythingConnectedProps> = ({
  onSelectFeature,
  onExploreFeatures,
}) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const features = [
    {
      id: 'customers',
      title: 'Customers',
      desc: 'Manage your customer relationships',
      icon: Users,
      metric: '360° Profiles',
    },
    {
      id: 'leads',
      title: 'Leads',
      desc: 'Capture & qualify leads automatically',
      icon: Target,
      metric: 'Instant Scoring',
    },
    {
      id: 'pipeline',
      title: 'Sales Pipeline',
      desc: 'Track deals from start to finish',
      icon: GitBranch,
      metric: 'Stage Velocity',
    },
    {
      id: 'tasks',
      title: 'Tasks',
      desc: 'Stay on top of every task',
      icon: CheckSquare,
      metric: 'Smart Queues',
    },
    {
      id: 'comm',
      title: 'Communication',
      desc: 'Emails, messages & notes',
      icon: MessageSquare,
      metric: 'Unified Inbox',
    },
    {
      id: 'calls',
      title: 'Calls',
      desc: 'Log & track calls',
      icon: PhoneCall,
      metric: 'VoIP & Recording',
    },
    {
      id: 'calendar',
      title: 'Calendar',
      desc: 'Meetings & appointments',
      icon: Calendar,
      metric: 'Auto Schedule',
    },
    {
      id: 'tickets',
      title: 'Support Tickets',
      desc: 'Resolve issues faster',
      icon: LifeBuoy,
      metric: 'SLA Tracking',
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      desc: 'Make data-driven decisions',
      icon: BarChart3,
      metric: 'Custom BI',
    },
    {
      id: 'ai',
      title: 'AI Insights',
      desc: 'Get intelligent suggestions',
      icon: Sparkles,
      metric: 'Predictive Win',
    },
    {
      id: 'notifs',
      title: 'Notifications',
      desc: 'Never miss an update',
      icon: Bell,
      metric: 'Multi-Channel',
    },
    {
      id: 'roles',
      title: 'Users & Roles',
      desc: 'Manage your team',
      icon: UserCheck,
      metric: 'RBAC Security',
    },
  ];

  return (
    <section
      id="features"
      className="py-24 sm:py-28 lg:py-32 bg-[#FAF6F0] relative overflow-hidden border-t border-[#0D2218]/8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          {/* LEFT: Editorial Heading & Office / Lifestyle Image */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full">
            <div>
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2.5 mb-4">
                <span className="w-5 h-[1.5px] bg-[#BA5D38]" />
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-[#5C6862]">
                  ALL YOUR CUSTOMER INTERACTIONS, IN ONE PLACE
                </span>
              </div>

              {/* Heading */}
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.85rem] font-normal text-[#0D2218] tracking-tight leading-[1.12] mb-5">
                Everything <br />
                <span className="italic font-light text-[#BA5D38]">Connected.</span>
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-base text-[#2D3632]/85 leading-relaxed mb-8">
                From website enquiries to store visits, Kairoo brings every customer touchpoint into a single, intelligent system.
              </p>

              {/* Button */}
              <button
                onClick={() => {
                  if (onExploreFeatures) onExploreFeatures();
                  const target = document.querySelector('#journey');
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group inline-flex items-center gap-2.5 px-6 py-3 text-xs sm:text-sm font-semibold text-[#FAF6F0] bg-[#0D2218] hover:bg-[#163827] rounded-full transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer mb-10"
              >
                <span>Explore All Features</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Lifestyle Image in left/bottom area */}
            <div className="relative rounded-2xl overflow-hidden border border-[#0D2218]/12 shadow-lg group">
              <img
                src="/src/assets/images/connected_office_lifestyle_1790601362384.jpg"
                alt="Collaborative architectural studio office"
                referrerPolicy="no-referrer"
                className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105 filter saturate-[0.95]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D2218]/85 via-[#0D2218]/25 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 text-[#FAF6F0]">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-semibold mb-1">
                  Synchronized Workspace
                </p>
                <p className="text-sm font-serif font-normal leading-snug text-white/95">
                  Zero silos between sales, operations, and leadership.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: 4-Column x 3-Row Feature Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4">
              {features.map((item) => {
                const Icon = item.icon;
                const isHovered = hoveredCard === item.id;
                return (
                  <motion.div
                    key={item.id}
                    onMouseEnter={() => setHoveredCard(item.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => onSelectFeature && onSelectFeature(item.title)}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white/95 rounded-2xl p-4 sm:p-4.5 border border-[#0D2218]/10 hover:border-[#BA5D38]/40 hover:bg-white shadow-[0_2px_12px_rgba(13,34,24,0.03)] hover:shadow-[0_12px_24px_-8px_rgba(13,34,24,0.12)] transition-all cursor-pointer flex flex-col justify-between min-h-[165px] group"
                  >
                    <div>
                      {/* Icon & Tiny Arrow */}
                      <div className="flex items-center justify-between mb-3.5">
                        <div className="w-9 h-9 rounded-xl bg-[#FAF6F0] group-hover:bg-[#0D2218] border border-[#0D2218]/8 flex items-center justify-center transition-colors duration-200">
                          <Icon className="w-4 h-4 text-[#0D2218] group-hover:text-[#C5A059] transition-colors duration-200" />
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-[#5C6862]/40 group-hover:text-[#BA5D38] transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>

                      {/* Title */}
                      <h4 className="text-sm font-semibold text-[#0D2218] mb-1.5 group-hover:text-[#BA5D38] transition-colors">
                        {item.title}
                      </h4>

                      {/* Description */}
                      <p className="text-xs text-[#5C6862] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    {/* Subtle micro-label indicator */}
                    <div className="pt-3 mt-2 border-t border-[#0D2218]/5 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider font-mono text-[#5C6862]">
                        {item.metric}
                      </span>
                      <span className="text-[10px] text-[#BA5D38] opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                        Specs →
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
