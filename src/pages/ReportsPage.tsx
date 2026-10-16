import React, { useState, useEffect } from 'react';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { db, isMasterFounder, MASTER_FOUNDER_EMAIL, Deal } from '../services/db';
import {
  BarChart3,
  TrendingUp,
  Download,
  Users,
  Target,
  LifeBuoy,
  CheckCircle2,
  Calendar,
  Layers,
  PieChart as PieIcon,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Award,
  Zap,
  Briefcase,
  Compass,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useAuth } from '../context/AuthContext';

export const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(db.getReportSummary());
  const [deals, setDeals] = useState<Deal[]>(db.getDeals());
  const [customers, setCustomers] = useState(db.getCustomers());
  const [leads, setLeads] = useState(db.getLeads());
  const [period, setPeriod] = useState('All Time');
  const [activeTab, setActiveTab] = useState<'all' | 'revenue' | 'pipeline' | 'team'>('all');
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);

  const isMaster = isMasterFounder(user);
  const isFounder = isMaster || user?.role === 'Founder';

  useEffect(() => {
    setMetrics(db.getReportSummary());
    setDeals(db.getDeals());
    setCustomers(db.getCustomers());
    setLeads(db.getLeads());
  }, []);

  if (!isFounder) {
    return (
      <WorkspaceLayout
        title="Access Restricted"
        subtitle="Executive analytics and revenue reports are reserved exclusively for the CRM Founder"
      >
        <div className="bg-white p-8 rounded-3xl border border-[#0D2218]/10 text-center max-w-lg mx-auto my-12 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-extrabold text-[#0D2218]">Founder Permission Required</h3>
          <p className="text-xs text-[#5C6862] mt-2 leading-relaxed">
            Revenue forecasts, pipeline totals, and executive analytics are confidential to the CRM Founder ({MASTER_FOUNDER_EMAIL}).
          </p>
        </div>
      </WorkspaceLayout>
    );
  }

  // Rep Revenue Breakdown
  const repRevenue: Record<string, { won: number; pipeline: number; dealsCount: number }> = {};
  deals.forEach((d) => {
    const rep = d.assignedTo || 'Unassigned';
    if (!repRevenue[rep]) {
      repRevenue[rep] = { won: 0, pipeline: 0, dealsCount: 0 };
    }
    repRevenue[rep].dealsCount++;
    if (d.stage === 'Won') {
      repRevenue[rep].won += Number(d.value) || 0;
    } else if (d.stage !== 'Lost') {
      repRevenue[rep].pipeline += Number(d.value) || 0;
    }
  });

  const repChartData = Object.entries(repRevenue).map(([name, data]) => ({
    name: name.split(' ')[0],
    fullName: name,
    'Won Revenue': data.won,
    'In Pipeline': data.pipeline,
    deals: data.dealsCount,
  }));

  // Stage Distribution for Donut Chart
  const STAGE_COLOR_MAP: Record<string, string> = {
    'New Lead': '#73927E',
    Contacted: '#9E744F',
    Interested: '#BA5D38',
    Proposal: '#C5A059',
    Negotiation: '#5F58B0',
    Won: '#10B981',
    Lost: '#9CA3AF',
  };

  const stageValues: Record<string, { count: number; totalVal: number }> = {};
  deals.forEach((d) => {
    if (!stageValues[d.stage]) {
      stageValues[d.stage] = { count: 0, totalVal: 0 };
    }
    stageValues[d.stage].count += 1;
    stageValues[d.stage].totalVal += Number(d.value) || 0;
  });

  const stagePieData = Object.entries(stageValues).map(([stage, val]) => ({
    name: stage,
    value: val.count,
    totalVal: val.totalVal,
    color: STAGE_COLOR_MAP[stage] || '#0D2218',
  }));

  // Lead Source Breakdown with Conversion
  const sourceBreakdown: Record<string, { total: number; converted: number }> = {};
  leads.forEach((l) => {
    const src = l.source || 'Website';
    if (!sourceBreakdown[src]) {
      sourceBreakdown[src] = { total: 0, converted: 0 };
    }
    sourceBreakdown[src].total += 1;
    if (l.status === 'Won') {
      sourceBreakdown[src].converted += 1;
    }
  });

  const sourceChartData = Object.entries(sourceBreakdown).map(([source, stats]) => ({
    source,
    TotalLeads: stats.total,
    Converted: stats.converted,
    rate: stats.total ? Math.round((stats.converted / stats.total) * 100) : 0,
  }));

  // Revenue Trajectory Data
  const revenueTrendData = [
    { month: 'May', closed: 180000, pipeline: 320000, target: 250000 },
    { month: 'Jun', closed: 340000, pipeline: 490000, target: 400000 },
    { month: 'Jul', closed: 520000, pipeline: 650000, target: 600000 },
    { month: 'Aug', closed: 780000, pipeline: 920000, target: 850000 },
    { month: 'Sep', closed: 1240000, pipeline: 1350000, target: 1200000 },
    { month: 'Oct (Current)', closed: metrics.totalRevenue || 1850000, pipeline: metrics.pipelineValue || 1840000, target: 1600000 },
  ];

  // Custom Chart Tooltips
  const CustomCurrencyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0D2218] text-[#FAF6F0] p-3 rounded-2xl shadow-xl border border-[#C5A059]/40 text-xs space-y-1 backdrop-blur-md">
          <p className="font-extrabold text-[12px] text-[#C5A059] border-b border-white/10 pb-1 mb-1">
            {label}
          </p>
          {payload.map((entry: any, i: number) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-white/80">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-mono font-extrabold text-white">
                ₹{Number(entry.value).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const pct = deals.length ? Math.round((data.value / deals.length) * 100) : 0;
      return (
        <div className="bg-[#0D2218] text-[#FAF6F0] p-3 rounded-2xl shadow-xl border border-[#C5A059]/40 text-xs space-y-1">
          <p className="font-extrabold text-[#C5A059]">{data.name}</p>
          <div className="text-white/90">
            Deals: <strong className="font-mono">{data.value}</strong> ({pct}%)
          </div>
          <div className="text-white/90">
            Value: <strong className="font-mono text-emerald-400">₹{data.totalVal.toLocaleString()}</strong>
          </div>
        </div>
      );
    }
    return null;
  };

  // Export CSV
  const handleExportCSV = () => {
    const rows = [
      ['Deal ID', 'Deal Name', 'Company', 'Contact', 'Value (INR)', 'Stage', 'Assigned To', 'Close Date'],
      ...deals.map((d) => [
        d.id,
        `"${d.name.replace(/"/g, '""')}"`,
        `"${d.company.replace(/"/g, '""')}"`,
        `"${d.contact.replace(/"/g, '""')}"`,
        d.value,
        d.stage,
        d.assignedTo,
        d.expectedCloseDate,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kairoo_crm_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalWonRevenue = metrics.totalRevenue;
  const totalPipelineVal = metrics.pipelineValue;
  const totalBookingsGoal = 2500000;
  const quotaAttainment = Math.min(100, Math.round((totalWonRevenue / totalBookingsGoal) * 100));

  return (
    <WorkspaceLayout
      title="Reports & Visual Analytics"
      subtitle="Interactive revenue velocity, pipeline distributions, and representative benchmarks"
      actions={
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-white border border-[#0D2218]/15 rounded-xl px-3 py-2 text-xs text-[#0D2218] font-semibold cursor-pointer"
          >
            <option value="All Time">All Time Records</option>
            <option value="This Quarter">Current Quarter (Q3)</option>
            <option value="YTD">Year to Date (2026)</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#FAF6F0] bg-[#0D2218] hover:bg-[#163827] rounded-xl shadow-xs cursor-pointer transition-transform active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      }
    >
      {/* Visual Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-[#0D2218]/10 pb-2">
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-[#0D2218]/10 shadow-xs">
          {[
            { id: 'all', label: 'All Visuals', icon: Layers },
            { id: 'revenue', label: 'Revenue Velocity', icon: TrendingUp },
            { id: 'pipeline', label: 'Stage Distribution', icon: PieIcon },
            { id: 'team', label: 'Team Benchmarks', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'text-white bg-[#0D2218] shadow-xs'
                    : 'text-[#5C6862] hover:text-[#0D2218] hover:bg-[#FAF6F0]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-[#5C6862]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Visual Telemetry</span>
        </div>
      </div>

      {/* 4 Executive KPI Visual Cards with Progress Rings */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Closed Won Card with Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-white p-5 rounded-2xl border border-[#0D2218]/10 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#5C6862]">Closed Won Revenue</span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                ARR
              </span>
            </div>
            <div className="font-serif text-3xl font-bold text-[#0D2218] tabular-nums">
              ₹{(metrics.totalRevenue / 100000).toFixed(1)}L
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#0D2218]/8">
            <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
              <span className="text-[#5C6862]">Quota Attainment</span>
              <span className="text-emerald-700 font-bold">{quotaAttainment}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#FAF6F0] rounded-full overflow-hidden border border-[#0D2218]/8">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${quotaAttainment}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-emerald-600 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Pipeline Value Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white p-5 rounded-2xl border border-[#0D2218]/10 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#5C6862]">Weighted Active Pipeline</span>
              <span className="text-[10px] font-bold text-[#8F6C26] bg-[#C5A059]/15 px-2 py-0.5 rounded-full border border-[#C5A059]/30">
                In Flight
              </span>
            </div>
            <div className="font-serif text-3xl font-bold text-[#0D2218] tabular-nums">
              ₹{(metrics.pipelineValue / 100000).toFixed(1)}L
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#0D2218]/8">
            <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
              <span className="text-[#5C6862]">Open Deals Count</span>
              <span className="text-[#8F6C26] font-bold">{metrics.openDeals} deals</span>
            </div>
            <div className="w-full h-1.5 bg-[#FAF6F0] rounded-full overflow-hidden border border-[#0D2218]/8">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, metrics.openDeals * 15)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                className="h-full bg-[#C5A059] rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Conversion Rate Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-white p-5 rounded-2xl border border-[#0D2218]/10 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#5C6862]">Conversion Efficiency</span>
              <span className="text-[10px] font-bold text-[#BA5D38] bg-[#BA5D38]/10 px-2 py-0.5 rounded-full border border-[#BA5D38]/20">
                Win Ratio
              </span>
            </div>
            <div className="font-serif text-3xl font-bold text-[#0D2218] tabular-nums">
              {metrics.conversionRate}%
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#0D2218]/8">
            <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
              <span className="text-[#5C6862]">Lead Volume</span>
              <span className="text-[#BA5D38] font-bold">{metrics.totalLeads} captured</span>
            </div>
            <div className="w-full h-1.5 bg-[#FAF6F0] rounded-full overflow-hidden border border-[#0D2218]/8">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, metrics.conversionRate)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
                className="h-full bg-[#BA5D38] rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Client Accounts Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white p-5 rounded-2xl border border-[#0D2218]/10 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#5C6862]">Portfolio Accounts</span>
              <span className="text-[10px] font-bold text-[#0D2218] bg-[#0D2218]/8 px-2 py-0.5 rounded-full">
                Live Base
              </span>
            </div>
            <div className="font-serif text-3xl font-bold text-[#0D2218] tabular-nums">
              {metrics.totalCustomers}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#0D2218]/8">
            <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
              <span className="text-[#5C6862]">VIP Accounts</span>
              <span className="text-[#0D2218] font-bold">
                {customers.filter((c) => c.status === 'VIP').length} VIP
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#FAF6F0] rounded-full overflow-hidden border border-[#0D2218]/8">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, customers.length * 12)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                className="h-full bg-[#0D2218] rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Dynamic Visual Representations according to activeTab */}
      <AnimatePresence mode="wait">
        {(activeTab === 'all' || activeTab === 'revenue') && (
          <motion.div
            key="revenue-section"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="bg-white p-6 rounded-3xl border border-[#0D2218]/10 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#0D2218]/8">
              <div>
                <h3 className="text-sm font-extrabold text-[#0D2218] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  <span>Revenue Velocity & Target Run-Rate Trajectory</span>
                </h3>
                <p className="text-xs text-[#5C6862]">
                  Monthly closed revenue vs. active pipeline vs. executive quota target
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-[#0D2218]">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  Closed Won
                </span>
                <span className="flex items-center gap-1.5 text-[#0D2218]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059]" />
                  Active In-Pipe
                </span>
                <span className="flex items-center gap-1.5 text-[#5C6862]">
                  <span className="w-2.5 h-1 border-t-2 border-dashed border-[#5C6862]" />
                  Target
                </span>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorClosed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorPipeline" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C5A059" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#C5A059" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0D2218" strokeOpacity={0.07} />
                  <XAxis dataKey="month" stroke="#5C6862" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#5C6862"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                  />
                  <Tooltip content={<CustomCurrencyTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="closed"
                    name="Closed Won"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorClosed)"
                  />
                  <Area
                    type="monotone"
                    dataKey="pipeline"
                    name="Pipeline Value"
                    stroke="#C5A059"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorPipeline)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {(activeTab === 'all' || activeTab === 'pipeline') && (
          <motion.div
            key="pipeline-section"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Donut Chart: Stage Value Distribution */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#0D2218]/10 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#0D2218]/8">
                  <div>
                    <h3 className="text-sm font-extrabold text-[#0D2218] flex items-center gap-2">
                      <PieIcon className="w-4 h-4 text-[#C5A059]" />
                      <span>Pipeline Stage Distribution</span>
                    </h3>
                    <p className="text-xs text-[#5C6862]">Opportunities and weighted value by phase</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#0D2218]">{deals.length} deals</span>
                </div>

                <div className="h-64 w-full relative flex items-center justify-center my-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stagePieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={3}
                        onMouseEnter={(_, index) => setHoveredStage(stagePieData[index]?.name || null)}
                        onMouseLeave={() => setHoveredStage(null)}
                      >
                        {stagePieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="#FFFFFF"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Donut Center Display */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5C6862]">
                      {hoveredStage || 'Total Active'}
                    </span>
                    <span className="font-serif text-xl font-bold text-[#0D2218]">
                      {hoveredStage
                        ? `${stageValues[hoveredStage]?.count || 0} deals`
                        : `₹${(totalPipelineVal / 100000).toFixed(1)}L`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stage Color Legend */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#0D2218]/8">
                {stagePieData.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-[#FAF6F0]">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="truncate font-semibold text-[#0D2218]">{s.name}</span>
                    </div>
                    <span className="font-mono text-[#5C6862] shrink-0">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inbound Lead Channels & Conversion Bar Chart */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#0D2218]/10 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#0D2218]/8">
                  <div>
                    <h3 className="text-sm font-extrabold text-[#0D2218] flex items-center gap-2">
                      <Target className="w-4 h-4 text-[#BA5D38]" />
                      <span>Acquisition Channels & Conversion Rates</span>
                    </h3>
                    <p className="text-xs text-[#5C6862]">Volume vs. win conversion across prospect sources</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    High Conversion
                  </span>
                </div>

                <div className="h-64 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sourceChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#0D2218" strokeOpacity={0.07} />
                      <XAxis dataKey="source" stroke="#5C6862" fontSize={11} tickLine={false} />
                      <YAxis stroke="#5C6862" fontSize={11} tickLine={false} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-[#0D2218] text-[#FAF6F0] p-3 rounded-2xl shadow-xl border border-[#C5A059]/40 text-xs space-y-1">
                                <p className="font-extrabold text-[#C5A059]">{label}</p>
                                <p className="text-white/90">Total Inquiries: <strong className="font-mono">{payload[0]?.value}</strong></p>
                                <p className="text-emerald-400 font-bold">Converted Deals: <strong className="font-mono">{payload[1]?.value}</strong></p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="TotalLeads" name="Total Inquiries" fill="#0D2218" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="Converted" name="Converted Deals" fill="#BA5D38" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex items-center justify-around pt-3 border-t border-[#0D2218]/8 text-xs text-[#5C6862]">
                <span className="flex items-center gap-1.5 font-semibold text-[#0D2218]">
                  <span className="w-2.5 h-2.5 rounded bg-[#0D2218]" />
                  Total Lead Inquiries
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-[#BA5D38]">
                  <span className="w-2.5 h-2.5 rounded bg-[#BA5D38]" />
                  Won Customer Conversions
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {(activeTab === 'all' || activeTab === 'team') && (
          <motion.div
            key="team-section"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Sales Rep Comparison Bar Chart */}
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#0D2218]/10 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#0D2218]/8 mb-4">
                <div>
                  <h3 className="text-sm font-extrabold text-[#0D2218] flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#C5A059]" />
                    <span>Executive Representative Benchmarks</span>
                  </h3>
                  <p className="text-xs text-[#5C6862]">Closed revenue vs. active opportunity pipeline</p>
                </div>
                <span className="text-xs font-mono text-[#5C6862]">Live Account Data</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={repChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#0D2218" strokeOpacity={0.07} />
                    <XAxis dataKey="name" stroke="#5C6862" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#5C6862"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                    />
                    <Tooltip content={<CustomCurrencyTooltip />} />
                    <Bar dataKey="Won Revenue" fill="#10B981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="In Pipeline" fill="#C5A059" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Leaderboard Table */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#0D2218]/10 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-[#0D2218] mb-1">Deal Velocity Leaders</h3>
                <p className="text-xs text-[#5C6862] mb-3">Top producing account executives</p>

                <div className="space-y-2.5">
                  {Object.entries(repRevenue).map(([rep, data], i) => (
                    <div
                      key={rep}
                      className="p-3 rounded-2xl bg-[#FAF6F0] border border-[#0D2218]/8 flex items-center justify-between hover:bg-[#F2ECE0] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-[#0D2218] text-[#FAF6F0] flex items-center justify-center font-bold text-xs">
                          {i + 1}
                        </div>
                        <div>
                          <span className="font-extrabold text-xs text-[#0D2218] block">{rep}</span>
                          <span className="text-[10px] text-[#5C6862]">{data.dealsCount} deals assigned</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-serif font-extrabold text-xs text-emerald-800 block">
                          ₹{data.won.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-[#5C6862] font-mono">
                          Pipe: ₹{(data.pipeline / 100000).toFixed(1)}L
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#0D2218]/8 text-[11px] text-[#5C6862] flex items-center justify-between">
                <span>Active Producers:</span>
                <strong className="text-[#0D2218] font-bold">{Object.keys(repRevenue).length} Executives</strong>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </WorkspaceLayout>
  );
};

export default ReportsPage;

