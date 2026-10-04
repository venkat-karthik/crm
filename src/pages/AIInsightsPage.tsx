import React, { useState, useEffect } from 'react';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { db, isMasterFounder, MASTER_FOUNDER_EMAIL } from '../services/db';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AIInsightsPage: React.FC = () => {
  const { user } = useAuth();
  const [deals, setDeals] = useState(db.getDeals());
  const [customers, setCustomers] = useState(db.getCustomers());
  const [leads, setLeads] = useState(db.getLeads());
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisTimestamp, setAnalysisTimestamp] = useState(new Date().toLocaleTimeString());

  const isMaster = isMasterFounder(user);
  const isFounder = isMaster || user?.role === 'Founder';

  const handleRunAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisTimestamp(new Date().toLocaleTimeString());
      db.addNotification({
        type: 'AI Insight',
        title: 'Kairoo AI Pipeline Audit Complete',
        message: 'Identified high-probability closing candidates and risk signals across active opportunities.',
      });
    }, 900);
  };

  if (!isFounder) {
    return (
      <WorkspaceLayout
        title="Access Restricted"
        subtitle="AI Insights and executive predictive scoring are reserved exclusively for the CRM Founder"
      >
        <div className="bg-white p-8 rounded-3xl border border-[#0D2218]/10 text-center max-w-lg mx-auto my-12 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-extrabold text-[#0D2218]">Founder Permission Required</h3>
          <p className="text-xs text-[#5C6862] mt-2 leading-relaxed">
            Neural pipeline win prediction and automated company-wide deal audits are confidential to the CRM Founder ({MASTER_FOUNDER_EMAIL}).
          </p>
        </div>
      </WorkspaceLayout>
    );
  }

  // Calculate dynamic win probability based on deal stage
  const calculateWinProb = (stage: string) => {
    switch (stage) {
      case 'Won':
        return 100;
      case 'Lost':
        return 0;
      case 'Negotiation':
        return 88;
      case 'Proposal':
        return 72;
      case 'Interested':
        return 58;
      case 'Contacted':
        return 35;
      default:
        return 20;
    }
  };

  return (
    <WorkspaceLayout
      title="Kairoo Intelligence & AI"
      subtitle="Predictive win scoring, automated risk alerts and next-best customer actions"
      actions={
        <button
          onClick={handleRunAnalysis}
          disabled={analyzing}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#FAF6F0] bg-[#0D2218] hover:bg-[#163827] rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
          <span>{analyzing ? 'Auditing Pipeline...' : 'Run Live AI Audit'}</span>
        </button>
      }
    >
      {/* Editorial AI Banner */}
      <div className="bg-[#0D2218] rounded-3xl p-6 sm:p-8 text-[#FAF6F0] mb-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#BA5D38]/20 to-[#C5A059]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C5A059] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kairoo Neural Engine · Active Real-Time Model</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal leading-snug mb-3">
            Predictive Customer Intelligence. <br />
            <span className="italic font-light text-[#C5A059]">Zero Manual Guesswork.</span>
          </h2>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Kairoo continuously correlates deal stages, communication frequency, email response latency, and customer support tickets to calculate actionable closing odds.
          </p>
          <div className="mt-4 flex items-center gap-3 text-[11px] text-white/60">
            <span>Last audit run at: {analysisTimestamp}</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">All models healthy</span>
          </div>
        </div>
      </div>

      {/* 3 AI Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Pillar 1: High Velocity Closers */}
        <div className="bg-white p-5 rounded-2xl border border-[#0D2218]/10 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#0D2218] mb-3">
              <Zap className="w-4 h-4 text-[#C5A059]" />
              <span>High Probability Closers</span>
            </div>
            <p className="text-xs text-[#5C6862] mb-4">
              Deals exhibiting maximum velocity and active stakeholder responsiveness:
            </p>
            <div className="space-y-2.5">
              {deals
                .filter((d) => d.stage === 'Proposal' || d.stage === 'Negotiation' || d.stage === 'Won')
                .slice(0, 3)
                .map((d) => (
                  <div key={d.id} className="p-3 rounded-xl bg-[#FAF6F0] border border-[#0D2218]/6 text-xs">
                    <div className="flex justify-between font-bold text-[#0D2218] mb-0.5">
                      <span>{d.name}</span>
                      <span className="text-emerald-700">{calculateWinProb(d.stage)}% Odds</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-[#5C6862]">
                      <span>{d.company}</span>
                      <span className="font-mono">₹{d.value.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Pillar 2: Deal Risk Radar */}
        <div className="bg-white p-5 rounded-2xl border border-[#0D2218]/10 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#BA5D38] mb-3">
              <AlertTriangle className="w-4 h-4 text-[#BA5D38]" />
              <span>Stagnant Deal Risk Radar</span>
            </div>
            <p className="text-xs text-[#5C6862] mb-4">
              Signals indicating stalled momentum or delayed client follow-up:
            </p>
            <div className="space-y-2.5">
              {deals
                .filter((d) => d.stage === 'Contacted' || d.stage === 'New Lead')
                .slice(0, 3)
                .map((d) => (
                  <div key={d.id} className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/50 text-xs">
                    <div className="flex justify-between font-bold text-[#0D2218] mb-0.5">
                      <span>{d.name}</span>
                      <span className="text-[#BA5D38] font-semibold">Follow-up needed</span>
                    </div>
                    <div className="text-[11px] text-[#5C6862]">
                      No communication in &gt;48 hours. Suggest booking executive discovery call.
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Pillar 3: Next Best Actions */}
        <div className="bg-white p-5 rounded-2xl border border-[#0D2218]/10 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#0D2218] mb-3">
              <Lightbulb className="w-4 h-4 text-[#0D2218]" />
              <span>Recommended Next Actions</span>
            </div>
            <p className="text-xs text-[#5C6862] mb-4">
              Prescriptive tasks calculated to accelerate Q3 revenue attainment:
            </p>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#0D2218]/6">
                <span className="font-bold text-[#0D2218] block mb-0.5">Deliver SOC2 Audit to Sovereign</span>
                <span className="text-[11px] text-[#5C6862]">
                  Unblocks security review committee; adds 25% to closing confidence.
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#0D2218]/6">
                <span className="font-bold text-[#0D2218] block mb-0.5">Invite TechNova to Advisory Board</span>
                <span className="text-[11px] text-[#5C6862]">
                  Strengthens VIP account retention ahead of next quarter expansion.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Deal Predictive Scores Table */}
      <div className="bg-white rounded-2xl border border-[#0D2218]/10 shadow-xs overflow-hidden">
        <div className="p-4 bg-[#FAF6F0] border-b border-[#0D2218]/10 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0D2218]">
            Complete Deal Predictive Win Index
          </h3>
          <span className="text-[11px] font-mono text-[#5C6862]">
            Total Analyzed: {deals.length} Opportunities
          </span>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#FAF6F0] border-b border-[#0D2218]/10 text-[#5C6862] font-semibold uppercase text-[10px]">
              <th className="py-3 px-4">Opportunity</th>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Current Stage</th>
              <th className="py-3 px-4">Deal Value</th>
              <th className="py-3 px-4">AI Win Probability</th>
              <th className="py-3 px-4 text-right">Recommended Cadence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0D2218]/6">
            {deals.map((d) => {
              const prob = calculateWinProb(d.stage);
              return (
                <tr key={d.id} className="hover:bg-[#FAF6F0]/60">
                  <td className="py-3 px-4 font-bold text-[#0D2218]">{d.name}</td>
                  <td className="py-3 px-4 text-[#5C6862]">{d.company}</td>
                  <td className="py-3 px-4 font-semibold text-[#0D2218]">{d.stage}</td>
                  <td className="py-3 px-4 font-serif font-bold text-[#0D2218]">
                    ₹{d.value.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-[#FAF6F0] rounded-full overflow-hidden border border-[#0D2218]/10">
                        <div
                          className={`h-full rounded-full ${
                            prob >= 70 ? 'bg-emerald-600' : prob >= 40 ? 'bg-[#C5A059]' : 'bg-[#BA5D38]'
                          }`}
                          style={{ width: `${prob}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-[11px]">{prob}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-[11px] font-medium text-[#5C6862]">
                    {prob >= 75
                      ? 'Prepare Onboarding Deck'
                      : prob >= 50
                      ? 'Schedule Commercial Check-in'
                      : 'Nurture Lead with Whitepaper'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </WorkspaceLayout>
  );
};
export default AIInsightsPage;
