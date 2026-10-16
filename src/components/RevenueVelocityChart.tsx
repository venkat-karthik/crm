import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, Sparkles, Calendar, DollarSign, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface RevenueVelocityChartProps {
  totalRevenue?: number;
  pipelineValue?: number;
}

export const RevenueVelocityChart: React.FC<RevenueVelocityChartProps> = ({
  totalRevenue = 2850000,
  pipelineValue = 1840000,
}) => {
  const [timeframe, setTimeframe] = useState<'6m' | '12m'>('6m');

  const data6m = [
    { month: 'May', closedRevenue: 180000, pipeline: 320000, forecast: 200000 },
    { month: 'Jun', closedRevenue: 340000, pipeline: 490000, forecast: 360000 },
    { month: 'Jul', closedRevenue: 520000, pipeline: 650000, forecast: 500000 },
    { month: 'Aug', closedRevenue: 780000, pipeline: 920000, forecast: 750000 },
    { month: 'Sep', closedRevenue: 1240000, pipeline: 1350000, forecast: 1150000 },
    { month: 'Oct (Current)', closedRevenue: totalRevenue || 1850000, pipeline: pipelineValue || 1840000, forecast: 1950000 },
  ];

  const data12m = [
    { month: 'Nov', closedRevenue: 95000, pipeline: 180000, forecast: 100000 },
    { month: 'Dec', closedRevenue: 140000, pipeline: 220000, forecast: 150000 },
    { month: 'Jan', closedRevenue: 210000, pipeline: 280000, forecast: 200000 },
    { month: 'Feb', closedRevenue: 260000, pipeline: 310000, forecast: 250000 },
    { month: 'Mar', closedRevenue: 310000, pipeline: 420000, forecast: 300000 },
    { month: 'Apr', closedRevenue: 450000, pipeline: 510000, forecast: 420000 },
    ...data6m,
  ];

  const activeData = timeframe === '6m' ? data6m : data12m;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0D2218] text-[#FAF6F0] p-3.5 rounded-2xl shadow-xl border border-[#C5A059]/30 text-xs space-y-1.5 backdrop-blur-md">
          <p className="font-extrabold text-[13px] text-[#C5A059] border-b border-white/10 pb-1 mb-1">
            {label}
          </p>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[#FAF6F0]/80">Closed Revenue:</span>
            <span className="font-mono font-extrabold text-emerald-400">
              ₹{(payload[0]?.value || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[#FAF6F0]/80">Active In-Pipe:</span>
            <span className="font-mono font-extrabold text-[#C5A059]">
              ₹{(payload[1]?.value || 0).toLocaleString()}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-6 rounded-3xl border border-[#0D2218]/10 shadow-sm relative overflow-hidden"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#0D2218]/8">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[#0D2218] text-[#C5A059]">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="font-serif text-lg font-bold text-[#0D2218]">
              Revenue Velocity & Pipeline Forecast
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
              +38.4% MoM
            </span>
          </div>
          <p className="text-xs text-[#5C6862] mt-1">
            Monthly closed business vs. cumulative weighted deals in active negotiation.
          </p>
        </div>

        {/* Timeframe Pill Switcher */}
        <div className="flex items-center gap-1 bg-[#FAF6F0] p-1 rounded-xl self-start sm:self-auto border border-[#0D2218]/8">
          <button
            type="button"
            onClick={() => setTimeframe('6m')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              timeframe === '6m'
                ? 'bg-[#0D2218] text-[#FAF6F0] shadow-xs'
                : 'text-[#5C6862] hover:text-[#0D2218]'
            }`}
          >
            6 Months
          </button>
          <button
            type="button"
            onClick={() => setTimeframe('12m')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              timeframe === '12m'
                ? 'bg-[#0D2218] text-[#FAF6F0] shadow-xs'
                : 'text-[#5C6862] hover:text-[#0D2218]'
            }`}
          >
            12 Months (Annual)
          </button>
        </div>
      </div>

      {/* Quick Visual Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <div className="p-3 bg-[#FAF6F0] rounded-2xl border border-[#0D2218]/6">
          <span className="text-[10px] font-bold text-[#5C6862] uppercase tracking-wider block">
            Closed Business
          </span>
          <span className="text-xl font-extrabold text-[#0D2218] font-mono mt-0.5 block">
            ₹{(totalRevenue / 100000).toFixed(1)}L
          </span>
        </div>
        <div className="p-3 bg-[#FAF6F0] rounded-2xl border border-[#0D2218]/6">
          <span className="text-[10px] font-bold text-[#5C6862] uppercase tracking-wider block">
            Weighted Pipeline
          </span>
          <span className="text-xl font-extrabold text-[#8F6C26] font-mono mt-0.5 block">
            ₹{(pipelineValue / 100000).toFixed(1)}L
          </span>
        </div>
        <div className="p-3 bg-[#FAF6F0] rounded-2xl border border-[#0D2218]/6">
          <span className="text-[10px] font-bold text-[#5C6862] uppercase tracking-wider block">
            Sales Cycle Time
          </span>
          <span className="text-xl font-extrabold text-emerald-700 font-mono mt-0.5 block">
            18.2 Days
          </span>
        </div>
        <div className="p-3 bg-[#FAF6F0] rounded-2xl border border-[#0D2218]/6">
          <span className="text-[10px] font-bold text-[#5C6862] uppercase tracking-wider block">
            Pipeline Win Rate
          </span>
          <span className="text-xl font-extrabold text-[#BA5D38] font-mono mt-0.5 block">
            44.8%
          </span>
        </div>
      </div>

      {/* Responsive Recharts Area Chart */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={activeData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0D2218" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#0D2218" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="pipelineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C5A059" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#C5A059" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#0D2218" strokeOpacity={0.08} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#5C6862', fontSize: 11, fontWeight: 600 }}
              dy={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#5C6862', fontSize: 11, fontWeight: 600 }}
              tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="pipeline"
              name="Active In-Pipe"
              stroke="#C5A059"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#pipelineGrad)"
            />
            <Area
              type="monotone"
              dataKey="closedRevenue"
              name="Closed Revenue"
              stroke="#0D2218"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#revenueGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Indicator */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-[#0D2218]/6 text-xs text-[#5C6862] font-semibold">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#0D2218]" />
          <span>Closed Won Revenue</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#C5A059]" />
          <span>Active Pipeline Value</span>
        </span>
      </div>
    </motion.div>
  );
};
