import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  ArrowRight,
  TrendingUp,
  Clock,
  Plus,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface DashboardShowcaseProps {
  onOpenDashboardPreview?: () => void;
}

export const DashboardShowcase: React.FC<DashboardShowcaseProps> = ({
  onOpenDashboardPreview,
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'revenue' | 'timeline'>('pipeline');

  const checklist = [
    'Interactive Sales Pipeline',
    'Customer Activity Timeline',
    'Advanced Reports & Analytics',
    'Unified Communication',
    'Role-Based Access',
  ];

  const pipelineColumns = [
    {
      title: 'New Lead',
      count: 4,
      total: '₹9.4L',
      deals: [
        { name: 'Sovereign Capital', contact: 'Anand Patel', value: '₹4.2L', time: '1h ago', tag: 'FinTech' },
        { name: 'Vanguard Retail', contact: 'Mira Joshi', value: '₹5.2L', time: '3h ago', tag: 'Omni' },
      ],
      headerColor: 'border-l-4 border-l-[#73927E]',
    },
    {
      title: 'Contacted',
      count: 3,
      total: '₹14.0L',
      deals: [
        { name: 'Nexus Logistics', contact: 'Karan Sen', value: '₹8.5L', time: 'Yesterday', tag: 'Supply' },
        { name: 'Elevate Health', contact: 'Sunita Rao', value: '₹5.5L', time: '2d ago', tag: 'Health' },
      ],
      headerColor: 'border-l-4 border-l-[#9E744F]',
    },
    {
      title: 'Interested',
      count: 3,
      total: '₹18.6L',
      deals: [
        { name: 'Apex Robotics', contact: 'Deepak Varma', value: '₹12.0L', time: 'Demo done', tag: 'Auto' },
        { name: 'Zenith Studio', contact: 'Tanya Shah', value: '₹6.6L', time: 'Proposal req', tag: 'SaaS' },
      ],
      headerColor: 'border-l-4 border-l-[#BA5D38]',
    },
    {
      title: 'Proposal',
      count: 2,
      total: '₹15.2L',
      deals: [
        { name: 'Aura Hospitality', contact: 'Rohan Nambiar', value: '₹10.2L', time: 'Sent 24h', tag: 'Hotel' },
        { name: 'Indus Motors', contact: 'Pooja Iyer', value: '₹5.0L', time: 'Final review', tag: 'Fleet' },
      ],
      headerColor: 'border-l-4 border-l-[#C5A059]',
    },
    {
      title: 'Won',
      count: 5,
      total: '₹28.4L',
      deals: [
        { name: 'TechNova Cloud', contact: 'Rahul Sharma', value: '₹16.4L', time: 'Signed today', tag: 'Enterprise' },
        { name: 'Studio Lumina', contact: 'Devika Sen', value: '₹12.0L', time: 'Paid', tag: 'Creative' },
      ],
      headerColor: 'border-l-4 border-l-[#0D2218]',
    },
  ];

  return (
    <section
      id="succeed"
      className="py-24 sm:py-32 bg-[#FAF6F0] relative overflow-hidden border-t border-[#0D2218]/8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* LEFT: Heading, Checklist, Action */}
          <div className="lg:col-span-4 text-left">
            {/* Small Label */}
            <div className="inline-flex items-center gap-2.5 mb-4">
              <span className="w-5 h-[1.5px] bg-[#BA5D38]" />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-[#5C6862]">
                REAL-TIME INSIGHTS
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.85rem] font-normal text-[#0D2218] tracking-tight leading-[1.12] mb-5">
              Everything You Need <br />
              <span className="italic font-light text-[#BA5D38]">to Succeed.</span>
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#2D3632]/85 leading-relaxed mb-8">
              Powerful tools for sales, support and customer success — all in one beautiful platform.
            </p>

            {/* Checklist */}
            <div className="space-y-3 mb-9">
              {checklist.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#0D2218] text-[#FAF6F0] flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span className="text-sm font-medium text-[#151A18]">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Button */}
            <button
              onClick={() => {
                if (onOpenDashboardPreview) onOpenDashboardPreview();
                const target = document.querySelector('#stories');
                if (target) target.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-semibold text-[#FAF6F0] bg-[#0D2218] hover:bg-[#163827] rounded-full transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>

          {/* RIGHT: Large Floating Kairoo CRM Dashboard with 3D Perspective */}
          <div className="lg:col-span-8 relative">
            <div className="transform lg:perspective-1000 lg:-rotate-x-1 lg:rotate-y-1 transition-transform duration-700 hover:rotate-0">
              <div className="bg-[#FCFBF8] rounded-3xl border border-[#0D2218]/15 shadow-[0_24px_64px_-16px_rgba(13,34,24,0.18)] overflow-hidden">
                {/* Dashboard Header Bar */}
                <div className="bg-[#FAF6F0] px-5 py-3.5 border-b border-[#0D2218]/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#E05A47]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#E5A844]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#52A36B]" />
                    </div>
                    <span className="text-xs font-semibold text-[#0D2218] tracking-tight">
                      Pipeline Velocity · Q3 Enterprise Funnel
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-[#EAE1D3] p-1 rounded-xl">
                    <button
                      onClick={() => setActiveTab('pipeline')}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                        activeTab === 'pipeline'
                          ? 'bg-[#0D2218] text-[#FAF6F0] shadow-xs'
                          : 'text-[#5C6862] hover:text-[#0D2218]'
                      }`}
                    >
                      Kanban Board
                    </button>
                    <button
                      onClick={() => setActiveTab('revenue')}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                        activeTab === 'revenue'
                          ? 'bg-[#0D2218] text-[#FAF6F0] shadow-xs'
                          : 'text-[#5C6862] hover:text-[#0D2218]'
                      }`}
                    >
                      Revenue Growth
                    </button>
                    <button
                      onClick={() => setActiveTab('timeline')}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                        activeTab === 'timeline'
                          ? 'bg-[#0D2218] text-[#FAF6F0] shadow-xs'
                          : 'text-[#5C6862] hover:text-[#0D2218]'
                      }`}
                    >
                      Timeline
                    </button>
                  </div>
                </div>

                {/* Dashboard Body */}
                <div className="p-4 sm:p-5">
                  {/* Top Metric Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    <div className="bg-white p-3 rounded-2xl border border-[#0D2218]/10 shadow-xs">
                      <span className="text-[11px] font-medium text-[#5C6862] block">Total Pipeline</span>
                      <span className="font-serif text-xl sm:text-2xl font-bold text-[#0D2218] tabular-nums">₹85.6L</span>
                      <span className="text-[10px] text-emerald-700 block mt-0.5 font-semibold">+18.4% this month</span>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-[#0D2218]/10 shadow-xs">
                      <span className="text-[11px] font-medium text-[#5C6862] block">Weighted Forecast</span>
                      <span className="font-serif text-xl sm:text-2xl font-bold text-[#0D2218] tabular-nums">₹54.2L</span>
                      <span className="text-[10px] text-[#BA5D38] block mt-0.5 font-semibold">63% win prob.</span>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-[#0D2218]/10 shadow-xs">
                      <span className="text-[11px] font-medium text-[#5C6862] block">Avg Deal Cycle</span>
                      <span className="font-serif text-xl sm:text-2xl font-bold text-[#0D2218] tabular-nums">14 Days</span>
                      <span className="text-[10px] text-emerald-700 block mt-0.5 font-semibold">-4 days faster</span>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-[#0D2218]/10 shadow-xs">
                      <span className="text-[11px] font-medium text-[#5C6862] block">Active Deals</span>
                      <span className="font-serif text-xl sm:text-2xl font-bold text-[#0D2218] tabular-nums">17 Deals</span>
                      <span className="text-[10px] text-[#5C6862] block mt-0.5 font-medium">8 reps active</span>
                    </div>
                  </div>

                  {/* View 1: 5-Column Pipeline (Kanban) */}
                  {activeTab === 'pipeline' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 overflow-x-auto pb-2">
                      {pipelineColumns.map((col) => (
                        <div
                          key={col.title}
                          className="bg-[#F8F5EE] rounded-2xl p-3 border border-[#0D2218]/8 flex flex-col justify-between min-h-[270px]"
                        >
                          <div>
                            {/* Column Header */}
                            <div className={`pl-2 py-0.5 mb-3 flex items-center justify-between ${col.headerColor}`}>
                              <div>
                                <h4 className="text-xs font-bold text-[#0D2218]">{col.title}</h4>
                                <span className="text-[10px] font-mono text-[#5C6862]">{col.count} deals · {col.total}</span>
                              </div>
                            </div>

                            {/* Deals Stack */}
                            <div className="space-y-2">
                              {col.deals.map((deal, dIdx) => (
                                <div
                                  key={dIdx}
                                  className="bg-white p-2.5 rounded-xl border border-[#0D2218]/10 shadow-xs hover:border-[#BA5D38]/50 hover:shadow-sm transition-all cursor-pointer"
                                >
                                  <div className="flex items-center justify-between text-[10px] mb-1">
                                    <span className="font-semibold text-[#5C6862]">{deal.contact}</span>
                                    <span className="bg-[#FAF6F0] px-1.5 py-0.2 rounded border border-[#0D2218]/8 text-[#0D2218] font-mono text-[9px] font-medium">
                                      {deal.tag}
                                    </span>
                                  </div>
                                  <p className="text-xs font-bold text-[#0D2218] truncate mb-1">
                                    {deal.name}
                                  </p>
                                  <div className="flex items-center justify-between pt-1 border-t border-[#0D2218]/5 text-[11px]">
                                    <span className="font-mono font-bold text-[#0D2218]">{deal.value}</span>
                                    <span className="text-[10px] text-[#5C6862]">{deal.time}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <button className="w-full mt-2.5 py-1.5 rounded-xl text-[11px] font-medium text-[#5C6862] hover:text-[#0D2218] hover:bg-white/80 transition-colors flex items-center justify-center gap-1 border border-dashed border-[#0D2218]/15">
                            <Plus className="w-3 h-3" />
                            <span>Add Deal</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* View 2: Revenue Growth Chart */}
                  {activeTab === 'revenue' && (
                    <div className="bg-white p-5 rounded-2xl border border-[#0D2218]/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-[#0D2218]">Annual Revenue Run Rate</h4>
                          <p className="text-xs text-[#5C6862]">Consolidated ARR progression 2025–2026</p>
                        </div>
                        <div className="text-right">
                          <span className="font-serif text-2xl font-bold text-[#0D2218]">₹1.54 Cr</span>
                          <span className="text-xs text-emerald-700 block font-semibold">+42% YoY</span>
                        </div>
                      </div>

                      {/* Line & Area Visualization */}
                      <div className="h-44 w-full pt-4">
                        <svg viewBox="0 0 500 130" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#0D2218" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#0D2218" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          <line x1="0" y1="30" x2="500" y2="30" stroke="#0D2218" strokeOpacity="0.08" strokeDasharray="4 4" />
                          <line x1="0" y1="70" x2="500" y2="70" stroke="#0D2218" strokeOpacity="0.08" strokeDasharray="4 4" />
                          <line x1="0" y1="110" x2="500" y2="110" stroke="#0D2218" strokeOpacity="0.08" strokeDasharray="4 4" />
                          
                          <path
                            d="M 10,110 C 100,98 160,82 240,65 C 320,48 400,28 490,14 L 490,125 L 10,125 Z"
                            fill="url(#growthGrad)"
                          />
                          <path
                            d="M 10,110 C 100,98 160,82 240,65 C 320,48 400,28 490,14"
                            fill="none"
                            stroke="#0D2218"
                            strokeWidth="3"
                          />
                          <circle cx="10" cy="110" r="3.5" fill="#0D2218" />
                          <circle cx="160" cy="82" r="3.5" fill="#0D2218" />
                          <circle cx="320" cy="48" r="4" fill="#0D2218" />
                          <circle cx="490" cy="14" r="5" fill="#BA5D38" stroke="#FAF6F0" strokeWidth="2" />
                        </svg>
                        <div className="flex justify-between text-[11px] text-[#5C6862] font-mono mt-2">
                          <span>Q1 2025</span>
                          <span>Q2 2025</span>
                          <span>Q3 2025</span>
                          <span>Q4 2025</span>
                          <span>Q1 2026</span>
                          <span>Q2 2026</span>
                          <span>Q3 2026 (Target: ₹1.6 Cr)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* View 3: Customer Timeline */}
                  {activeTab === 'timeline' && (
                    <div className="bg-white p-5 rounded-2xl border border-[#0D2218]/10 space-y-3">
                      <h4 className="text-sm font-bold text-[#0D2218] mb-2">Live Customer Audit Trail</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF6F0] border border-[#0D2218]/6">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1" />
                          <div className="flex-1 text-xs">
                            <span className="font-bold text-[#0D2218]">TechNova Solutions</span> renewed multi-seat contract (₹16.4L)
                            <p className="text-[11px] text-[#5C6862]">Signed by VP of Infrastructure · 35 min ago</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF6F0] border border-[#0D2218]/6">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#BA5D38] mt-1" />
                          <div className="flex-1 text-xs">
                            <span className="font-bold text-[#0D2218]">Aura Logistics</span> reached Proposal Stage
                            <p className="text-[11px] text-[#5C6862]">Assigned to Senior Account Exec Rahul M. · 2h ago</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF6F0] border border-[#0D2218]/6">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#C5A059] mt-1" />
                          <div className="flex-1 text-xs">
                            <span className="font-bold text-[#0D2218]">Studio Lumina</span> scheduled onboarding kickoff
                            <p className="text-[11px] text-[#5C6862]">Customer Success team invited 4 attendees · 4h ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
