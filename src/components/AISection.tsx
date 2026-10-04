import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  UserCheck,
  Zap,
  Clock,
  HelpCircle,
  TrendingUp,
  Brain,
  Check,
} from 'lucide-react';

interface AISectionProps {
  onOpenAIDemo?: () => void;
}

export const AISection: React.FC<AISectionProps> = ({ onOpenAIDemo }) => {
  const [activeInsight, setActiveInsight] = useState<string | null>(null);

  const aiCards = [
    {
      id: 'customer-summary',
      category: 'Customer Summary',
      text: 'Rahul is a high-value customer with 2 purchases and 2 support interactions.',
      icon: UserCheck,
      confidence: '98% confidence',
      badgeColor: 'text-[#C5A059] border-[#C5A059]/30 bg-[#C5A059]/10',
      position: 'top-0 -left-2 sm:-left-6 lg:-left-10',
      delay: 0,
      yFloat: [0, -8, 0],
    },
    {
      id: 'lead-insight',
      category: 'Lead Insight',
      text: 'This lead shows strong buying interest based on recent activity.',
      icon: Zap,
      confidence: 'High propensity',
      badgeColor: 'text-[#E07A5F] border-[#E07A5F]/30 bg-[#E07A5F]/10',
      position: 'top-8 -right-2 sm:-right-8 lg:-right-10',
      delay: 0.6,
      yFloat: [0, 8, 0],
    },
    {
      id: 'follow-up',
      category: 'Follow-up Suggestion',
      text: 'Contact within 24 hours after the proposal was opened.',
      icon: Clock,
      confidence: 'Recommended action',
      badgeColor: 'text-[#73927E] border-[#73927E]/30 bg-[#73927E]/10',
      position: 'top-1/2 -left-4 sm:-left-12',
      delay: 1.2,
      yFloat: [0, -7, 0],
    },
    {
      id: 'ticket-summary',
      category: 'Ticket Summary',
      text: 'Customer is unable to access their account.',
      icon: HelpCircle,
      confidence: 'Auto-triage',
      badgeColor: 'text-[#C5A059] border-[#C5A059]/30 bg-[#C5A059]/10',
      position: 'bottom-16 -right-2 sm:-right-6',
      delay: 1.8,
      yFloat: [0, 9, 0],
    },
    {
      id: 'sales-insight',
      category: 'Sales Insight',
      text: 'Most new leads are coming from website enquiries.',
      icon: TrendingUp,
      confidence: '+34% attribution',
      badgeColor: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
      position: '-bottom-6 left-4 sm:left-12',
      delay: 2.2,
      yFloat: [0, -6, 0],
    },
  ];

  return (
    <section
      id="ai"
      className="py-24 sm:py-32 bg-[#07150E] text-[#FAF6F0] relative overflow-hidden"
    >
      {/* Abstract background luminous glows and atmospheric particles */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-b from-[#173829]/40 via-[#204B37]/20 to-transparent rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-gradient-to-tr from-[#BA5D38]/15 via-[#173829]/30 to-transparent rounded-full blur-[110px] pointer-events-none" />

      {/* Subtle background neural grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#C5A059 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* LEFT: Text & AI Proposition */}
          <div className="lg:col-span-5 text-left">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#112B1F] border border-[#204B37] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C5A059] mb-5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>POWERED BY AI</span>
            </div>

            {/* Heading & Subheading */}
            <h2 className="text-[11px] uppercase tracking-[0.22em] text-[#73927E] font-semibold mb-2">
              Kairoo Intelligence
            </h2>
            <h3 className="font-serif text-3xl sm:text-4xl lg:text-[2.85rem] font-normal text-[#FAF6F0] tracking-tight leading-[1.12] mb-6">
              Your Intelligent <br />
              <span className="italic font-light text-[#C5A059]">
                Business Assistant.
              </span>
            </h3>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#FAF6F0]/80 leading-relaxed mb-8 max-w-lg">
              Kairoo AI analyzes your customer data, identifies patterns and provides actionable recommendations to help your team work smarter.
            </p>

            {/* Key AI Capabilities list */}
            <div className="space-y-3 mb-9 pt-3 border-t border-[#FAF6F0]/10 max-w-md">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-[#FAF6F0]/85">
                <div className="w-5 h-5 rounded-full bg-[#173829] text-[#C5A059] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>Predictive churn alerts & customer health scores</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-[#FAF6F0]/85">
                <div className="w-5 h-5 rounded-full bg-[#173829] text-[#C5A059] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>Automated meeting summaries & follow-up cadences</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-[#FAF6F0]/85">
                <div className="w-5 h-5 rounded-full bg-[#173829] text-[#C5A059] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>Autonomous ticket triage with suggested resolutions</span>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={() => {
                if (onOpenAIDemo) onOpenAIDemo();
                const target = document.querySelector('#succeed');
                if (target) target.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-semibold text-[#07150E] bg-[#FAF6F0] hover:bg-[#C5A059] rounded-full transition-all duration-200 shadow-lg active:scale-[0.98] cursor-pointer"
            >
              <span>Explore AI Features</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>

          {/* RIGHT: Sophisticated Abstract Glowing Neural Intelligence Visual & Floating Cards */}
          <div className="lg:col-span-7 relative min-h-[460px] sm:min-h-[520px] flex items-center justify-center py-8">
            {/* Glowing Core Visual (Connected neural & customer relationship network) */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
              {/* Outer Pulsing Concentric Rings */}
              <div className="absolute inset-0 rounded-full border border-[#204B37]/60 animate-ping opacity-25" style={{ animationDuration: '4.5s' }} />
              <div className="absolute -inset-8 rounded-full border border-[#C5A059]/15 animate-spin" style={{ animationDuration: '32s' }} />
              <div className="absolute -inset-14 rounded-full border border-[#73927E]/15 border-dashed animate-spin" style={{ animationDuration: '48s', animationDirection: 'reverse' }} />

              {/* Central Glowing Orb & Abstract Prism */}
              <div className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-[#0D2218] via-[#173829] to-[#204B37] border border-[#C5A059]/40 shadow-[0_0_60px_rgba(197,160,89,0.25)] flex items-center justify-center">
                {/* SVG Neural Connections */}
                <svg viewBox="0 0 100 100" className="w-full h-full p-4 overflow-visible">
                  <defs>
                    <linearGradient id="neuralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#C5A059" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#73927E" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                  {/* Neural connecting paths */}
                  <line x1="20" y1="30" x2="50" y2="50" stroke="url(#neuralGrad)" strokeWidth="1.5" />
                  <line x1="80" y1="25" x2="50" y2="50" stroke="url(#neuralGrad)" strokeWidth="1.5" />
                  <line x1="75" y1="75" x2="50" y2="50" stroke="url(#neuralGrad)" strokeWidth="1.5" />
                  <line x1="25" y1="70" x2="50" y2="50" stroke="url(#neuralGrad)" strokeWidth="1.5" />
                  <line x1="50" y1="15" x2="50" y2="50" stroke="url(#neuralGrad)" strokeWidth="1.5" />

                  {/* Pulsing Nodes */}
                  <circle cx="50" cy="50" r="7" fill="#C5A059" className="animate-pulse" />
                  <circle cx="20" cy="30" r="4" fill="#FAF6F0" />
                  <circle cx="80" cy="25" r="4.5" fill="#FAF6F0" />
                  <circle cx="75" cy="75" r="4" fill="#FAF6F0" />
                  <circle cx="25" cy="70" r="3.5" fill="#FAF6F0" />
                  <circle cx="50" cy="15" r="3.5" fill="#FAF6F0" />
                </svg>

                {/* Central Brain/Intelligence Glyph */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Brain className="w-8 h-8 text-[#FAF6F0]/90 animate-pulse" />
                </div>
              </div>

              {/* Dynamic Connection lines extending out to floating cards */}
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full overflow-visible opacity-30">
                  <line x1="50%" y1="50%" x2="-10%" y2="10%" stroke="#C5A059" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="50%" y1="50%" x2="110%" y2="20%" stroke="#C5A059" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="50%" y1="50%" x2="-15%" y2="60%" stroke="#73927E" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="50%" y1="50%" x2="105%" y2="80%" stroke="#73927E" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="50%" y1="50%" x2="40%" y2="110%" stroke="#BA5D38" strokeWidth="1" strokeDasharray="3 3" />
                </svg>
              </div>
            </div>

            {/* 5 Floating AI Insight Cards */}
            {aiCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.id}
                  animate={{ y: card.yFloat }}
                  transition={{
                    duration: 5 + idx * 0.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: card.delay,
                  }}
                  className={`absolute ${card.position} w-[220px] sm:w-[250px] bg-[#0E2419]/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-[#204B37] shadow-[0_16px_36px_rgba(0,0,0,0.45)] hover:border-[#C5A059]/60 hover:bg-[#112B1F] transition-all cursor-pointer z-20 group`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#173829] border border-[#204B37] flex items-center justify-center text-[#C5A059] shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#73927E] truncate">
                          {card.category}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${card.badgeColor}`}>
                          {card.confidence}
                        </span>
                      </div>
                      <p className="text-xs text-[#FAF6F0] leading-snug group-hover:text-white transition-colors">
                        "{card.text}"
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
