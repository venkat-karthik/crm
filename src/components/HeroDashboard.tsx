import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
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
  Settings,
  Search,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  MoreVertical,
  ChevronRight,
} from 'lucide-react';

export const HeroDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [chartPeriod, setChartPeriod] = useState<'30D' | '90D' | '1Y'>('30D');

  const navRouteMap: Record<string, string> = {
    'Dashboard': '/dashboard',
    'Customers': '/customers',
    'Leads': '/leads',
    'Sales Pipeline': '/pipeline',
    'Tasks': '/tasks',
    'Communication': '/communication',
    'Calls': '/calls',
    'Calendar': '/calendar',
    'Support Tickets': '/tickets',
    'Reports & Analytics': '/reports',
    'AI Insights': '/ai-insights',
    'Notifications': '/notifications',
    'Users & Roles': '/users',
    'Settings': '/settings',
  };

  const handleNavClick = (itemName: string) => {
    setActiveNav(itemName);
    const targetRoute = navRouteMap[itemName];
    if (targetRoute) {
      navigate(targetRoute);
    }
  };

  const sidebarItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Customers', icon: Users },
    { name: 'Leads', icon: Target },
    { name: 'Sales Pipeline', icon: GitBranch },
    { name: 'Tasks', icon: CheckSquare },
    { name: 'Communication', icon: MessageSquare },
    { name: 'Calls', icon: PhoneCall },
    { name: 'Calendar', icon: Calendar },
    { name: 'Support Tickets', icon: LifeBuoy },
    { name: 'Reports & Analytics', icon: BarChart3 },
    { name: 'AI Insights', icon: Sparkles, badge: 'AI' },
    { name: 'Notifications', icon: Bell },
    { name: 'Users & Roles', icon: UserCheck },
    { name: 'Settings', icon: Settings },
  ];

  const kpis = [
    {
      title: 'Total Customers',
      value: '2,847',
      change: '+14.2%',
      positive: true,
      timeframe: 'vs last month',
    },
    {
      title: 'Active Leads',
      value: '428',
      change: '+28.5%',
      positive: true,
      timeframe: 'this quarter',
    },
    {
      title: 'Open Deals',
      value: '86',
      change: '₹48.6L in pipe',
      positive: true,
      timeframe: 'high probability',
    },
    {
      title: 'Revenue',
      value: '₹12.8L',
      change: '+24.0%',
      positive: true,
      timeframe: 'vs target',
    },
  ];

  const revenuePoints = [
    { month: 'Apr', value: 42 },
    { month: 'May', value: 55 },
    { month: 'Jun', value: 51 },
    { month: 'Jul', value: 68 },
    { month: 'Aug', value: 84 },
    { month: 'Sep', value: 110 },
    { month: 'Oct', value: 128 },
  ];

  const pipelineStages = [
    { stage: 'New Lead', count: 34, value: '₹14.2L', color: '#73927E' },
    { stage: 'Contacted', count: 22, value: '₹11.8L', color: '#9E744F' },
    { stage: 'Interested', count: 18, value: '₹9.4L', color: '#BA5D38' },
    { stage: 'Proposal', count: 8, value: '₹8.6L', color: '#C5A059' },
    { stage: 'Won', count: 4, value: '₹4.6L', color: '#0D2218' },
  ];

  const recentActivities = [
    {
      user: 'Rahul Sharma',
      company: 'TechNova',
      action: 'Qualified inbound demo request',
      time: '2m ago',
      initials: 'RS',
    },
    {
      user: 'Priya Reddy',
      company: 'Aura Logistics',
      action: 'Proposal reviewed with leadership',
      time: '18m ago',
      initials: 'PR',
    },
    {
      user: 'Arjun Kumar',
      company: 'Zenith Labs',
      action: 'Signed annual subscription agreement',
      time: '1h ago',
      initials: 'AK',
    },
  ];

  return (
    <div className="w-full bg-[#FCFBF8] text-[#151A18] rounded-2xl border border-[#0D2218]/15 shadow-[0_24px_60px_-15px_rgba(13,34,24,0.22)] overflow-hidden flex flex-col font-sans select-none text-[13px]">
      {/* Window Title Bar / Top Browser Chrome */}
      <div className="bg-[#FAF6F0] px-4 py-2.5 border-b border-[#0D2218]/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#E05A47]/70" />
          <div className="w-3 h-3 rounded-full bg-[#E5A844]/70" />
          <div className="w-3 h-3 rounded-full bg-[#52A36B]/70" />
          <span className="text-[11px] font-medium text-[#5C6862] ml-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#73927E]" />
            kairoo.app/workspace/overview
          </span>
        </div>

        {/* Global Search & Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-[#0D2218]/10 text-xs text-[#5C6862]">
            <Search className="w-3.5 h-3.5 text-[#5C6862]" />
            <span>Search deals, leads, contacts...</span>
            <kbd className="text-[10px] bg-[#FAF6F0] px-1 py-0.5 rounded border border-[#0D2218]/10 ml-2">⌘K</kbd>
          </div>
          <div className="flex items-center gap-2 pl-2 border-l border-[#0D2218]/10">
            <div className="w-6 h-6 rounded-full bg-[#0D2218] text-[#FAF6F0] flex items-center justify-center text-[10px] font-bold">
              K
            </div>
            <span className="text-xs font-semibold hidden md:inline">Acme Corp</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="flex flex-1 min-h-[460px] lg:min-h-[520px]">
        {/* Sidebar */}
        <aside className="w-48 lg:w-52 bg-[#F6F2EA] border-r border-[#0D2218]/10 p-2.5 hidden md:flex flex-col justify-between shrink-0">
          <div>
            <div className="px-2.5 py-2 mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C6862]">Workspace</span>
              <span className="text-[9px] bg-[#0D2218]/8 px-1.5 py-0.5 rounded font-medium text-[#0D2218]">PRO</span>
            </div>

            <nav className="space-y-0.5 max-h-[400px] overflow-y-auto pr-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.name)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#0D2218] text-[#FAF6F0] shadow-xs'
                        : 'text-[#2D3632] hover:bg-[#0D2218]/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#C5A059]' : 'text-[#5C6862]'}`} />
                      <span className="truncate">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[9px] px-1 py-0.2 rounded font-semibold ${
                        isActive ? 'bg-[#FAF6F0]/20 text-[#FAF6F0]' : 'bg-[#BA5D38]/15 text-[#BA5D38]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="pt-3 border-t border-[#0D2218]/10 px-2 flex items-center justify-between text-[11px] text-[#5C6862]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Live Sync
            </span>
            <span className="font-mono text-[10px]">v2.6</span>
          </div>
        </aside>

        {/* Workspace Content Canvas */}
        <main className="flex-1 p-3.5 sm:p-5 flex flex-col gap-4 overflow-hidden bg-[#FCFBF8]">
          {/* Header Row */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#0D2218] tracking-tight">
                Executive Overview
              </h3>
              <p className="text-xs text-[#5C6862]">
                Real-time metrics & team performance updates
              </p>
            </div>
            <div className="flex items-center gap-1 bg-[#F2ECE0] p-1 rounded-lg text-xs">
              {(['30D', '90D', '1Y'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setChartPeriod(period)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    chartPeriod === period
                      ? 'bg-white text-[#0D2218] shadow-xs'
                      : 'text-[#5C6862] hover:text-[#0D2218]'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* 4 KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {kpis.map((kpi) => {
              const route =
                kpi.title === 'Total Customers'
                  ? '/customers'
                  : kpi.title === 'Active Leads'
                  ? '/leads'
                  : kpi.title === 'Open Deals'
                  ? '/pipeline'
                  : '/reports';
              return (
                <div
                  key={kpi.title}
                  onClick={() => navigate(route)}
                  className="bg-white p-3 rounded-xl border border-[#0D2218]/10 shadow-[0_2px_8px_rgba(13,34,24,0.03)] hover:border-[#BA5D38]/50 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="text-[11px] font-medium text-[#5C6862] group-hover:text-[#BA5D38] truncate mb-1 flex items-center justify-between">
                    <span>{kpi.title}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="font-serif text-xl sm:text-2xl font-bold text-[#0D2218] tracking-tight tabular-nums">
                    {kpi.value}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold mt-1">
                    <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                    <span>{kpi.change}</span>
                    <span className="text-[#5C6862] font-normal truncate hidden sm:inline">{kpi.timeframe}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chart & Pipeline Middle Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
            {/* Revenue Overview Chart */}
            <div className="lg:col-span-7 bg-white p-3.5 rounded-xl border border-[#0D2218]/10 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-xs font-semibold text-[#0D2218]">Revenue Overview</span>
                  <p className="text-[11px] text-[#5C6862]">Target tracking: ₹15.0L quota</p>
                </div>
                <div className="text-right">
                  <span className="font-serif text-base font-bold text-[#0D2218] tabular-nums">₹12.8L</span>
                  <span className="text-[10px] text-emerald-700 block font-semibold">+24.0%</span>
                </div>
              </div>

              {/* Custom SVG Line Chart */}
              <div className="w-full h-28 relative pt-2">
                <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#BA5D38" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#BA5D38" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Subtle Grid Lines */}
                  <line x1="0" y1="20" x2="400" y2="20" stroke="#0D2218" strokeOpacity="0.06" strokeDasharray="3 3" />
                  <line x1="0" y1="50" x2="400" y2="50" stroke="#0D2218" strokeOpacity="0.06" strokeDasharray="3 3" />
                  <line x1="0" y1="80" x2="400" y2="80" stroke="#0D2218" strokeOpacity="0.06" strokeDasharray="3 3" />
                  
                  {/* Area fill */}
                  <path
                    d="M 10,85 Q 70,68 130,72 T 250,45 T 330,25 T 390,12 L 390,95 L 10,95 Z"
                    fill="url(#chartGradient)"
                  />
                  {/* Stroke curve */}
                  <path
                    d="M 10,85 Q 70,68 130,72 T 250,45 T 330,25 T 390,12"
                    fill="none"
                    stroke="#BA5D38"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Data Points */}
                  <circle cx="10" cy="85" r="3" fill="#BA5D38" />
                  <circle cx="130" cy="72" r="3" fill="#BA5D38" />
                  <circle cx="250" cy="45" r="3" fill="#BA5D38" />
                  <circle cx="330" cy="25" r="3.5" fill="#BA5D38" />
                  <circle cx="390" cy="12" r="4.5" fill="#0D2218" stroke="#FAF6F0" strokeWidth="2" />
                </svg>

                {/* X Axis labels */}
                <div className="flex justify-between text-[10px] text-[#5C6862] font-mono mt-1 px-1">
                  {revenuePoints.map((p) => (
                    <span key={p.month}>{p.month}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sales Pipeline Funnel Mini-Preview */}
            <div className="lg:col-span-5 bg-white p-3.5 rounded-xl border border-[#0D2218]/10 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#0D2218]">Sales Pipeline</span>
                <span className="text-[11px] text-[#5C6862] font-mono">86 Deals</span>
              </div>

              <div className="space-y-1.5">
                {pipelineStages.map((stage) => (
                  <div key={stage.stage} className="flex items-center justify-between text-[11px] gap-2">
                    <span className="w-20 truncate text-[#2D3632]">{stage.stage}</span>
                    <div className="flex-1 h-2 bg-[#F2ECE0] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(stage.count / 34) * 100}%`,
                          backgroundColor: stage.color,
                        }}
                      />
                    </div>
                    <span className="w-12 text-right font-mono text-[10px] font-semibold text-[#0D2218]">
                      {stage.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-2 pt-2 border-t border-[#0D2218]/8 flex items-center justify-between text-[11px] text-[#5C6862]">
                <span>Conversion rate</span>
                <span className="font-semibold text-[#0D2218]">38.2%</span>
              </div>
            </div>
          </div>

          {/* Bottom Row: Recent Activity & Customer Stream */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            {/* Recent Activity */}
            <div className="bg-white p-3.5 rounded-xl border border-[#0D2218]/10">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold text-[#0D2218] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#5C6862]" />
                  Recent Team Activity
                </span>
                <span className="text-[10px] text-[#BA5D38] font-medium hover:underline cursor-pointer">
                  View all
                </span>
              </div>

              <div className="space-y-2">
                {recentActivities.map((act, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-[#FAF6F0] transition-colors">
                    <div className="w-6 h-6 rounded-full bg-[#0D2218]/8 text-[#0D2218] text-[10px] font-bold flex items-center justify-center shrink-0">
                      {act.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-[#0D2218] truncate">
                          {act.user} <span className="text-[#5C6862] font-normal">({act.company})</span>
                        </span>
                        <span className="text-[10px] text-[#5C6862] shrink-0 font-mono">{act.time}</span>
                      </div>
                      <p className="text-[11px] text-[#5C6862] truncate">{act.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Activity Feed */}
            <div className="bg-white p-3.5 rounded-xl border border-[#0D2218]/10">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold text-[#0D2218] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Customer Activity
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                  Live Stream
                </span>
              </div>

              <div className="space-y-2">
                <div className="p-2 rounded-lg bg-[#FAF6F0] border border-[#0D2218]/8 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <div>
                      <span className="text-xs font-semibold text-[#0D2218]">Arjun Kumar</span>
                      <p className="text-[11px] text-[#5C6862]">Completed annual plan checkout</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#0D2218]">₹72,000</span>
                </div>

                <div className="p-2 rounded-lg bg-[#FAF6F0] border border-[#0D2218]/8 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#BA5D38]" />
                    <div>
                      <span className="text-xs font-semibold text-[#0D2218]">TechNova Solutions</span>
                      <p className="text-[11px] text-[#5C6862]">Added 15 new sales seats</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#0D2218]">₹45,000</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
