import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Play,
  Check,
  Calendar,
  AlertCircle,
  TrendingUp,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { HeroDashboard } from './HeroDashboard';
import { FloatingInsightCard, FloatingCardData } from './FloatingInsightCard';

interface HeroProps {
  onOpenSignup: () => void;
  onOpenDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenSignup, onOpenDemo }) => {
  const floatingCards: FloatingCardData[] = [
    {
      id: 'lead',
      type: 'lead',
      title: 'New Lead',
      subtitle: 'Rahul Sharma',
      meta: 'TechNova Solutions · 2 min ago',
      badge: 'Inbound',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      avatar: 'RS',
      floatingOffset: { y: [0, -8, 0], duration: 4.8, delay: 0 },
      className: 'absolute -top-6 -left-3 sm:-left-7 z-30 w-[220px] sm:w-[235px]',
    },
    {
      id: 'reminder',
      type: 'reminder',
      title: 'Follow-up Reminder',
      subtitle: 'Call with Priya Reddy',
      meta: 'Today, 11:00 AM',
      badge: 'Urgent',
      badgeColor: 'bg-[#BA5D38]/10 text-[#BA5D38] border-[#BA5D38]/20',
      icon: <Calendar className="w-4 h-4 text-[#BA5D38]" />,
      floatingOffset: { y: [0, 8, 0], duration: 5.2, delay: 0.8 },
      className: 'absolute top-16 -right-2 sm:-right-8 z-30 w-[225px] sm:w-[240px]',
    },
    {
      id: 'ticket',
      type: 'ticket',
      title: 'Support Ticket',
      subtitle: 'TKT-1025',
      meta: 'Account access escalation',
      badge: 'High Priority',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <AlertCircle className="w-4 h-4 text-amber-700" />,
      floatingOffset: { y: [0, -7, 0], duration: 4.5, delay: 1.4 },
      className: 'absolute bottom-20 -left-3 sm:-left-8 z-30 w-[215px] sm:w-[230px]',
    },
    {
      id: 'revenue',
      type: 'revenue',
      title: 'Revenue Update',
      subtitle: '+24% this month',
      meta: 'Business Growth Milestone',
      badge: 'Q3 Record',
      badgeColor: 'bg-[#C5A059]/15 text-[#8F6C26] border-[#C5A059]/30',
      icon: <TrendingUp className="w-4 h-4 text-[#8F6C26]" />,
      floatingOffset: { y: [0, 9, 0], duration: 5.5, delay: 1.9 },
      className: 'absolute -bottom-6 right-6 sm:right-12 z-30 w-[220px] sm:w-[235px]',
    },
    {
      id: 'activity',
      type: 'activity',
      title: 'Customer Activity',
      subtitle: 'New purchase',
      meta: 'Arjun Kumar · ₹72,000 Annual',
      badge: 'Success',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <ShoppingBag className="w-4 h-4 text-emerald-600" />,
      floatingOffset: { y: [0, -6, 0], duration: 5.0, delay: 2.3 },
      className: 'absolute -top-7 right-6 sm:right-28 z-30 w-[225px] sm:w-[240px] hidden md:block',
    },
  ];

  const trustChecklist = [
    'All-in-One CRM',
    'AI Assistance',
    'Secure & Reliable',
    'Built for Growing Businesses',
  ];

  return (
    <section
      id="hero"
      className="relative pt-32 pb-20 sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-32 overflow-hidden bg-gradient-to-b from-[#FAF6F0] via-[#FAF6F0] to-[#F4EFE6]"
    >
      {/* Subtle architectural geometric grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0D2218 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Atmospheric ambient warm glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[720px] h-[480px] bg-gradient-to-tr from-[#EAE1D3]/50 to-[#BA5D38]/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* LEFT: Editorial Heading & Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-center text-left z-20"
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 mb-5">
              <span className="w-5 h-[1.5px] bg-[#BA5D38]" />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-[#5C6862]">
                THE NEXT-GEN CRM FOR GROWING BUSINESSES
              </span>
            </div>

            {/* Main Editorial Headline with strict line breaks matching brief */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[3.85rem] font-normal tracking-tight text-[#0D2218] leading-[1.08] mb-6">
              Turn Every Customer <br />
              Interaction Into <br />
              <span className="italic font-light text-[#BA5D38]">
                One Intelligent Journey.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#2D3632]/85 leading-relaxed mb-8 max-w-xl">
              Kairoo brings leads, customers, sales, support and business insights into one powerful platform.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-9">
              <button
                onClick={onOpenSignup}
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm sm:text-base font-semibold text-[#FAF6F0] bg-[#0D2218] hover:bg-[#163827] rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <button
                onClick={onOpenDemo}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-medium text-[#0D2218] bg-white/90 hover:bg-white border border-[#0D2218]/15 hover:border-[#0D2218]/30 rounded-full transition-all duration-200 shadow-xs hover:shadow cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#0D2218]/5 flex items-center justify-center text-[#BA5D38]">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Trust Checklist */}
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 pt-6 border-t border-[#0D2218]/10">
              {trustChecklist.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#0D2218]/8 text-[#0D2218] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                  </div>
                  <span className="text-xs font-medium text-[#2D3632]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: Realistic Modern Workspace Scene & Laptop Dashboard Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="lg:col-span-7 relative"
          >
            {/* Staged Workspace Environment Container */}
            <div className="relative rounded-3xl p-3 sm:p-4 bg-gradient-to-b from-[#EAE1D3]/90 via-[#F5ECE0] to-[#FAF6F0] border border-[#0D2218]/12 shadow-[0_32px_80px_-20px_rgba(13,34,24,0.18)]">
              {/* Modern Warm Workspace Backdrop Photo */}
              <div className="relative rounded-2xl overflow-hidden mb-3 aspect-[16/6] w-full max-h-36 object-cover shadow-xs">
                <img
                  src="/src/assets/images/hero_workspace_office_1790601348067.jpg"
                  alt="Modern warm sunlit executive workspace with desk and plants"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center filter saturate-[0.95] contrast-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FCFBF8] via-black/10 to-black/25" />
                <div className="absolute bottom-2.5 left-4 flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-[#0D2218] bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Kairoo Enterprise Cloud · Mumbai Cluster
                  </span>
                </div>
              </div>

              {/* Realistic Laptop Chassis Frame around Dashboard */}
              <div className="relative rounded-2xl bg-[#0D2218] p-1.5 sm:p-2 shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-[#0D2218]/30">
                {/* Camera dot */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/20 flex items-center justify-center">
                  <div className="w-0.5 h-0.5 rounded-full bg-white/40" />
                </div>

                {/* Laptop Display Bezel and Dashboard */}
                <div className="relative rounded-xl overflow-hidden bg-white">
                  <HeroDashboard />
                </div>
              </div>

              {/* Floating Hero Cards orbiting the laptop scene */}
              <div className="relative">
                {floatingCards.map((card) => (
                  <FloatingInsightCard key={card.id} card={card} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
