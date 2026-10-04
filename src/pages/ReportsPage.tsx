import React, { useState, useEffect } from 'react';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { db } from '../services/db';
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
} from 'lucide-react';

import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(db.getReportSummary());
  const [deals, setDeals] = useState(db.getDeals());
  const [customers, setCustomers] = useState(db.getCustomers());
  const [leads, setLeads] = useState(db.getLeads());
  const [period, setPeriod] = useState('All Time');

  const isFounderOrManager = user?.role === 'Founder' || user?.role === 'Manager' || user?.role === 'Admin' || user?.role === 'Owner';

  useEffect(() => {
    setMetrics(db.getReportSummary());
    setDeals(db.getDeals());
    setCustomers(db.getCustomers());
    setLeads(db.getLeads());
  }, []);

  if (!isFounderOrManager) {
    return (
      <WorkspaceLayout
        title="Access Restricted"
        subtitle="Executive analytics and revenue reports are reserved for Founders and Managers"
      >
        <div className="bg-white p-8 rounded-3xl border border-[#0D2218]/10 text-center max-w-lg mx-auto my-12 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-extrabold text-[#0D2218]">Executive Permission Required</h3>
          <p className="text-xs text-[#5C6862] mt-2 leading-relaxed">
            Revenue forecasts, pipeline totals, and executive analytics are confidential to organization leadership. Please check your assigned employee tasks or client portal.
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

  // Stage Distribution
  const stageDistribution: Record<string, number> = {};
  deals.forEach((d) => {
    stageDistribution[d.stage] = (stageDistribution[d.stage] || 0) + 1;
  });

  // Lead Source Breakdown
  const sourceBreakdown: Record<string, number> = {};
  leads.forEach((l) => {
    sourceBreakdown[l.source] = (sourceBreakdown[l.source] || 0) + 1;
  });

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

  return (
    <WorkspaceLayout
      title="Reports & Analytics"
      subtitle="Executive revenue metrics, representative velocity, and pipeline forecasting"
      actions={
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-white border border-[#0D2218]/15 rounded-xl px-3 py-2 text-xs text-[#0D2218] font-semibold"
          >
            <option value="All Time">All Time Records</option>
            <option value="This Quarter">Current Quarter (Q3)</option>
            <option value="YTD">Year to Date (2026)</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#FAF6F0] bg-[#0D2218] hover:bg-[#163827] rounded-xl shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Report</span>
          </button>
        </div>
      }
    >
      {/* 4 Big KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-[#0D2218]/10 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#5C6862]">Closed Won Revenue</span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ARR
            </span>
          </div>
          <div className="font-serif text-3xl font-bold text-[#0D2218] tabular-nums">
            ₹{(metrics.totalRevenue / 100000).toFixed(1)}L
          </div>
          <span className="text-[11px] text-[#5C6862] block mt-1">
            {metrics.wonDealsCount} deals marked Won
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#0D2218]/10 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#5C6862]">Weighted Active Pipeline</span>
            <span className="text-[10px] font-bold text-[#8F6C26] bg-[#C5A059]/15 px-2 py-0.5 rounded-full border border-[#C5A059]/30">
              In Pipe
            </span>
          </div>
          <div className="font-serif text-3xl font-bold text-[#0D2218] tabular-nums">
            ₹{(metrics.pipelineValue / 100000).toFixed(1)}L
          </div>
          <span className="text-[11px] text-[#5C6862] block mt-1">
            {metrics.openDeals} open negotiations
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#0D2218]/10 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#5C6862]">Lead to Deal Conversion</span>
            <span className="text-[10px] font-bold text-[#BA5D38] bg-[#BA5D38]/10 px-2 py-0.5 rounded-full border border-[#BA5D38]/20">
              Win Rate
            </span>
          </div>
          <div className="font-serif text-3xl font-bold text-[#0D2218] tabular-nums">
            {metrics.conversionRate}%
          </div>
          <span className="text-[11px] text-[#5C6862] block mt-1">
            {metrics.totalLeads} total leads captured
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#0D2218]/10 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#5C6862]">Customer Accounts</span>
            <span className="text-[10px] font-bold text-[#0D2218] bg-[#0D2218]/8 px-2 py-0.5 rounded-full">
              Accounts
            </span>
          </div>
          <div className="font-serif text-3xl font-bold text-[#0D2218] tabular-nums">
            {metrics.totalCustomers}
          </div>
          <span className="text-[11px] text-[#5C6862] block mt-1">
            {customers.filter((c) => c.status === 'VIP').length} VIP Enterprise accounts
          </span>
        </div>
      </div>

      {/* Grid: Representative Breakdown & Deal Stage distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Rep Performance Table */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-[#0D2218]/10 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#0D2218]">Representative Performance</h3>
              <p className="text-xs text-[#5C6862]">Won revenue vs active opportunities by rep</p>
            </div>
            <span className="text-xs font-mono text-[#5C6862]">Live Data</span>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0] border-b border-[#0D2218]/10 text-[#5C6862] font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Sales Executive</th>
                <th className="py-2.5 px-3 text-right">Deals Count</th>
                <th className="py-2.5 px-3 text-right">Closed Won (₹)</th>
                <th className="py-2.5 px-3 text-right">In Pipeline (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0D2218]/6">
              {Object.entries(repRevenue).map(([rep, data]) => (
                <tr key={rep} className="hover:bg-[#FAF6F0]/60">
                  <td className="py-3 px-3 font-bold text-[#0D2218]">{rep}</td>
                  <td className="py-3 px-3 text-right font-mono text-[#5C6862]">{data.dealsCount}</td>
                  <td className="py-3 px-3 text-right font-serif font-bold text-emerald-800">
                    ₹{data.won.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-serif font-bold text-[#0D2218]">
                    ₹{data.pipeline.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Stage distribution bar */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-[#0D2218]/10 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0D2218] mb-1">Deal Stages Breakdown</h3>
            <p className="text-xs text-[#5C6862] mb-4">Opportunities currently in flight</p>

            <div className="space-y-3">
              {Object.entries(stageDistribution).map(([stage, count]) => {
                const pct = deals.length ? Math.round((count / deals.length) * 100) : 0;
                return (
                  <div key={stage} className="text-xs">
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-[#0D2218]">{stage}</span>
                      <span className="font-mono text-[#5C6862]">{count} deals ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-[#FAF6F0] rounded-full overflow-hidden border border-[#0D2218]/8">
                      <div
                        className="h-full bg-[#0D2218] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#0D2218]/10 text-[11px] text-[#5C6862]">
            Total deals tracked across all stages: <span className="font-bold text-[#0D2218]">{deals.length}</span>
          </div>
        </div>
      </div>

      {/* Inbound Lead Sources Breakdown */}
      <div className="bg-white p-5 rounded-2xl border border-[#0D2218]/10 shadow-xs">
        <h3 className="text-sm font-bold text-[#0D2218] mb-1">Inbound Channel Acquisition</h3>
        <p className="text-xs text-[#5C6862] mb-4">Where your best prospects are originating from</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(sourceBreakdown).map(([source, count]) => (
            <div key={source} className="p-3.5 rounded-xl bg-[#FAF6F0] border border-[#0D2218]/8">
              <span className="text-[11px] text-[#5C6862] block truncate">{source}</span>
              <span className="font-serif text-2xl font-bold text-[#0D2218] block mt-1">{count}</span>
              <span className="text-[10px] text-[#BA5D38] font-semibold mt-0.5 block">
                {leads.length ? Math.round((count / leads.length) * 100) : 0}% of leads
              </span>
            </div>
          ))}
        </div>
      </div>
    </WorkspaceLayout>
  );
};
export default ReportsPage;
