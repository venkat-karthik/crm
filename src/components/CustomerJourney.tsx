import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  UserPlus,
  Share2,
  PhoneForwarded,
  Layers,
  HeartHandshake,
  Headphones,
  LineChart,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const CustomerJourney: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      id: 'sources',
      label: 'Sources',
      desc: 'Web, ads, store & referrals',
      icon: Globe,
      detail: 'Multi-channel attribution tracking organic search, Google ads, WhatsApp, and physical QR codes.',
      kpi: '100% Source Attribution',
    },
    {
      id: 'capture',
      label: 'Lead Capture',
      desc: 'Instant capture & AI enrichment',
      icon: UserPlus,
      detail: 'Enriches lead profiles with firmographics, company size, and verification in milliseconds.',
      kpi: '3-Sec Qualification',
    },
    {
      id: 'assignment',
      label: 'Assignment',
      desc: 'Smart round-robin routing',
      icon: Share2,
      detail: 'Routes to the best account executive based on geography, deal size, and rep availability.',
      kpi: 'Zero Rep Idleness',
    },
    {
      id: 'followup',
      label: 'Follow-up',
      desc: 'Automated cadences & call tasks',
      icon: PhoneForwarded,
      detail: 'Smart sequences with personalized templates, meeting links, and WhatsApp reminders.',
      kpi: '< 15m Response Time',
    },
    {
      id: 'pipeline',
      label: 'Sales Pipeline',
      desc: 'Deal tracking & proposal quotes',
      icon: Layers,
      detail: 'Visual Kanban stages with automated probability forecasting and digital signature triggers.',
      kpi: '14-Day Cycle Average',
    },
    {
      id: 'customer',
      label: 'Customer',
      desc: 'Seamless onboarding & contracts',
      icon: HeartHandshake,
      detail: 'Automated invoice generation, welcome kit delivery, and customer success handoff.',
      kpi: 'Instant Provisioning',
    },
    {
      id: 'support',
      label: 'Support',
      desc: 'SLA tickets & omni-channel help',
      icon: Headphones,
      detail: 'Shared team inbox across email, phone, and live chat with AI-assisted response drafts.',
      kpi: '99.4% SLA Adherence',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      desc: 'LTV, retention & revenue insights',
      icon: LineChart,
      detail: 'Cohort retention analysis, churn early-warning signals, and lifetime value modeling.',
      kpi: 'Predictive Forecasting',
    },
  ];

  return (
    <section
      id="journey"
      className="py-24 sm:py-28 lg:py-32 bg-[#F2ECE0] relative overflow-hidden border-t border-[#0D2218]/8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <span className="w-5 h-[1.5px] bg-[#BA5D38]" />
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-[#5C6862]">
              END-TO-END WORKFLOW
            </span>
            <span className="w-5 h-[1.5px] bg-[#BA5D38]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.85rem] font-normal text-[#0D2218] tracking-tight leading-[1.12] mb-4">
            The Complete Customer Journey
          </h2>

          <p className="text-sm sm:text-base text-[#2D3632]/80 leading-relaxed max-w-xl mx-auto">
            From first touch to lasting relationships — Kairoo makes it simple.
          </p>
        </div>

        {/* Horizontal Process on Desktop / Responsive Flow */}
        <div className="relative">
          {/* Animated Connecting Line on Desktop */}
          <div className="hidden xl:block absolute top-7 left-12 right-12 h-[2px] bg-[#0D2218]/12 -z-0">
            <motion.div
              className="h-full bg-gradient-to-r from-[#BA5D38] via-[#0D2218] to-[#C5A059]"
              initial={{ width: '0%' }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          {/* 8-Stage Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-4 sm:gap-3.5 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeStep === idx;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.07 }}
                  onClick={() => setActiveStep(idx)}
                  className={`flex flex-col items-center text-center cursor-pointer p-3 sm:p-3.5 rounded-2xl transition-all duration-300 group ${
                    isSelected
                      ? 'bg-white shadow-[0_12px_28px_-6px_rgba(13,34,24,0.12)] border border-[#0D2218]/15 scale-[1.02]'
                      : 'hover:bg-white/70 border border-transparent'
                  }`}
                >
                  {/* Circular Icon with Step Badge */}
                  <div className="relative mb-3">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isSelected
                          ? 'bg-[#0D2218] text-[#FAF6F0] shadow-md ring-4 ring-[#BA5D38]/20'
                          : 'bg-white text-[#0D2218] border border-[#0D2218]/12 group-hover:border-[#BA5D38] group-hover:shadow-sm'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {/* Sequential order badge */}
                    <span
                      className={`absolute -top-1 -right-1 w-5 h-5 rounded-full font-mono text-[10px] font-bold flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#BA5D38] text-white'
                          : 'bg-[#FAF6F0] text-[#5C6862] border border-[#0D2218]/10'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </div>

                  {/* Label */}
                  <h4 className="text-xs sm:text-sm font-semibold text-[#0D2218] mb-1 group-hover:text-[#BA5D38] transition-colors leading-tight">
                    {step.label}
                  </h4>

                  {/* Short Description */}
                  <p className="text-[11px] text-[#5C6862] leading-tight max-w-[120px]">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Selected Stage Detail Drawer Card */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-12 bg-white rounded-3xl p-6 sm:p-7 border border-[#0D2218]/12 shadow-[0_8px_30px_rgba(13,34,24,0.04)] max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0D2218] text-[#C5A059] flex items-center justify-center shrink-0 shadow-sm">
              {React.createElement(steps[activeStep].icon, { className: 'w-6 h-6' })}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-mono font-semibold uppercase text-[#BA5D38] tracking-wider">
                  Stage {activeStep + 1} of 8
                </span>
                <span className="text-[#5C6862]">·</span>
                <span className="text-sm font-semibold text-[#0D2218]">
                  {steps[activeStep].label} Automation
                </span>
                <span className="text-[10px] font-mono bg-[#FAF6F0] border border-[#0D2218]/10 px-2 py-0.5 rounded-full text-emerald-800 font-semibold ml-1">
                  {steps[activeStep].kpi}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#2D3632]/85 leading-relaxed max-w-xl">
                {steps[activeStep].detail}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={() => {
                const targetRoutes = ['/leads', '/leads', '/users', '/tasks', '/pipeline', '/customers', '/tickets', '/reports'];
                window.location.href = targetRoutes[activeStep];
              }}
              className="px-4 py-1.5 text-xs font-semibold text-[#FAF6F0] bg-[#0D2218] rounded-full hover:bg-[#163827] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>Open in Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : 7))}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#0D2218] border border-[#0D2218]/15 rounded-full hover:bg-[#FAF6F0] transition-colors cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => setActiveStep((prev) => (prev < 7 ? prev + 1 : 0))}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#0D2218] border border-[#0D2218]/15 rounded-full hover:bg-[#FAF6F0] transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
