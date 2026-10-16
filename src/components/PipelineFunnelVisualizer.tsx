import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, DollarSign, Users, ArrowRight } from 'lucide-react';
import { Deal } from '../services/db';

interface PipelineFunnelVisualizerProps {
  deals: Deal[];
  dealsLabel?: string;
  onSelectStage?: (stage: string) => void;
}

export const PipelineFunnelVisualizer: React.FC<PipelineFunnelVisualizerProps> = ({
  deals,
  dealsLabel = 'Deals',
  onSelectStage,
}) => {
  const STAGES: Array<{ key: Deal['stage']; label: string; color: string; barColor: string }> = [
    { key: 'New Lead', label: 'New Inquiries', color: 'text-stone-700', barColor: 'bg-stone-500' },
    { key: 'Contacted', label: 'Contacted', color: 'text-amber-800', barColor: 'bg-amber-600' },
    { key: 'Interested', label: 'Qualified Interest', color: 'text-[#BA5D38]', barColor: 'bg-[#BA5D38]' },
    { key: 'Proposal', label: 'Proposal Sent', color: 'text-[#8F6C26]', barColor: 'bg-[#C5A059]' },
    { key: 'Negotiation', label: 'Negotiation / Contract', color: 'text-indigo-800', barColor: 'bg-indigo-600' },
    { key: 'Won', label: 'Closed Won', color: 'text-emerald-800', barColor: 'bg-emerald-600' },
  ];

  const totalDeals = Math.max(1, deals.length);
  const totalPipelineValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);

  const stageData = STAGES.map((s) => {
    const stageDeals = deals.filter((d) => d.stage === s.key);
    const count = stageDeals.length;
    const value = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0);
    const percentage = Math.round((count / totalDeals) * 100);

    return {
      ...s,
      count,
      value,
      percentage,
    };
  });

  return (
    <div className="bg-white p-6 rounded-3xl border border-[#0D2218]/10 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#0D2218]/8">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-[#0D2218] text-[#C5A059]">
            <GitBranch className="w-4 h-4" />
          </span>
          <h3 className="font-serif text-lg font-bold text-[#0D2218]">
            {dealsLabel} Conversion Funnel
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#5C6862]">
          <span>
            Total Volume: <strong className="text-[#0D2218]">{deals.length} Opportunities</strong>
          </span>
          <span>·</span>
          <span>
            Gross Value: <strong className="text-emerald-800 font-mono font-bold">₹{totalPipelineValue.toLocaleString()}</strong>
          </span>
        </div>
      </div>

      {/* Funnel Stage Bars */}
      <div className="space-y-3 pt-1">
        {stageData.map((item, idx) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            onClick={() => onSelectStage && onSelectStage(item.key)}
            className={`p-3 rounded-2xl bg-[#FAF6F0] hover:bg-[#F3ECE1] border border-[#0D2218]/6 transition-all ${
              onSelectStage ? 'cursor-pointer hover:shadow-xs' : ''
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${item.barColor}`} />
                <span className="font-extrabold text-[#0D2218]">{item.label}</span>
                <span className="text-[11px] text-[#5C6862]">({item.count} deals)</span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-xs font-extrabold text-[#0D2218]">
                  ₹{item.value.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-[#5C6862] w-9 text-right">
                  {item.percentage}%
                </span>
              </div>
            </div>

            {/* Visual Segment Bar */}
            <div className="h-2 w-full bg-[#0D2218]/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(4, item.percentage)}%` }}
                transition={{ duration: 0.6, delay: 0.1 + idx * 0.05 }}
                className={`h-full rounded-full ${item.barColor}`}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
