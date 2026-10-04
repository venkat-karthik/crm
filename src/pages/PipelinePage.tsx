import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { db, Deal } from '../services/db';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  ArrowRight,
  TrendingUp,
  X,
  Building,
  Calendar,
  Tag,
  DollarSign,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

const STAGES: Deal['stage'][] = [
  'New Lead',
  'Contacted',
  'Interested',
  'Proposal',
  'Negotiation',
  'Won',
  'Lost',
];

const STAGE_COLORS: Record<Deal['stage'], { border: string; bg: string; text: string }> = {
  'New Lead': { border: 'border-l-[#73927E]', bg: 'bg-[#73927E]/10', text: 'text-[#73927E]' },
  'Contacted': { border: 'border-l-[#9E744F]', bg: 'bg-[#9E744F]/10', text: 'text-[#9E744F]' },
  'Interested': { border: 'border-l-[#BA5D38]', bg: 'bg-[#BA5D38]/10', text: 'text-[#BA5D38]' },
  'Proposal': { border: 'border-l-[#C5A059]', bg: 'bg-[#C5A059]/10', text: 'text-[#8F6C26]' },
  'Negotiation': { border: 'border-l-[#5F58B0]', bg: 'bg-[#5F58B0]/10', text: 'text-[#5F58B0]' },
  'Won': { border: 'border-l-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-800' },
  'Lost': { border: 'border-l-gray-400', bg: 'bg-gray-100', text: 'text-gray-600' },
};

import { useAuth } from '../context/AuthContext';

export const PipelinePage: React.FC = () => {
  const { user } = useAuth();
  const [deals, setDeals] = useState<Deal[]>(db.getDeals());
  const [search, setSearch] = useState('');
  const [repFilter, setRepFilter] = useState('All');
  const [toast, setToast] = useState<string | null>(null);

  const teamUsers = db.getUsers();

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [contact, setContact] = useState('');
  const [value, setValue] = useState<number | string>(100000);
  const [stage, setStage] = useState<Deal['stage']>('New Lead');
  const [assignedTo, setAssignedTo] = useState(user?.name || 'Account Lead');
  const [expectedCloseDate, setExpectedCloseDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [tag, setTag] = useState('Enterprise');
  const [notes, setNotes] = useState('');

  const loadData = () => {
    setDeals(db.getDeals());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAdd = (defaultStage: Deal['stage'] = 'New Lead') => {
    setEditingDeal(null);
    setName('');
    setCompany('');
    setContact('');
    setValue(250000);
    setStage(defaultStage);
    setAssignedTo(user?.name || 'Account Lead');
    setExpectedCloseDate(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
    setTag('Enterprise');
    setNotes('');
    setModalOpen(true);
  };

  const handleOpenEdit = (deal: Deal) => {
    setEditingDeal(deal);
    setName(deal.name);
    setCompany(deal.company);
    setContact(deal.contact);
    setValue(deal.value);
    setStage(deal.stage);
    setAssignedTo(deal.assignedTo);
    setExpectedCloseDate(deal.expectedCloseDate);
    setTag(deal.tag || 'Standard');
    setNotes(deal.notes || '');
    setModalOpen(true);
  };

  const handleDelete = (id: string, dealName: string) => {
    if (confirm(`Delete deal "${dealName}"?`)) {
      db.deleteDeal(id);
      loadData();
      showToast(`Deal "${dealName}" removed.`);
    }
  };

  const handleMoveStage = (deal: Deal, targetStage: Deal['stage']) => {
    db.saveDeal({ ...deal, stage: targetStage });
    loadData();
    showToast(`"${deal.name}" moved to ${targetStage}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !value) return;

    db.saveDeal({
      id: editingDeal?.id,
      name,
      company: company || name,
      contact: contact || 'Key Decision Maker',
      value: Number(value),
      stage,
      assignedTo,
      expectedCloseDate,
      tag,
      notes,
    });

    loadData();
    setModalOpen(false);
    showToast(editingDeal ? 'Deal updated successfully.' : 'New deal added to pipeline.');
  };

  // Metrics summary
  const totalPipelineVal = deals
    .filter((d) => d.stage !== 'Won' && d.stage !== 'Lost')
    .reduce((sum, d) => sum + (Number(d.value) || 0), 0);
  const totalWonVal = deals
    .filter((d) => d.stage === 'Won')
    .reduce((sum, d) => sum + (Number(d.value) || 0), 0);
  const activeCount = deals.filter((d) => d.stage !== 'Won' && d.stage !== 'Lost').length;
  const isEmployee = user?.role === 'Employee' || user?.role === 'Sales Employee' || user?.role === 'Support Employee';

  const filteredDeals = deals.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.company.toLowerCase().includes(search.toLowerCase()) ||
      d.contact.toLowerCase().includes(search.toLowerCase());
    
    if (isEmployee) {
      const isAssignedToMe = !d.assignedTo || d.assignedTo === user?.name || d.assignedTo === 'Me';
      return matchSearch && isAssignedToMe;
    }

    const matchRep = repFilter === 'All' || d.assignedTo === repFilter;
    return matchSearch && matchRep;
  });

  const dealsLabel = user?.crmCustomization?.dealsLabel || 'Projects';
  const singularDeal = dealsLabel.endsWith('s') ? dealsLabel.slice(0, -1) : dealsLabel;

  return (
    <WorkspaceLayout
      title={`${dealsLabel} Pipeline`}
      subtitle={`Interactive stage velocity, value forecasting and ${dealsLabel.toLowerCase()} progression`}
      actions={
        <button
          onClick={() => handleOpenAdd('New Lead')}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#FAF6F0] bg-[#0D2218] hover:bg-[#163827] rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add {singularDeal}</span>
        </button>
      }
    >
      {toast && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <span>{toast}</span>
          <X className="w-4 h-4 cursor-pointer" onClick={() => setToast(null)} />
        </div>
      )}

      {/* Top Value Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-[#0D2218]/10 shadow-xs">
          <span className="text-[11px] font-semibold text-[#5C6862] block">Open Pipeline Value</span>
          <span className="font-serif text-2xl font-bold text-[#0D2218] tabular-nums">
            ₹{(totalPipelineVal / 100000).toFixed(1)}L
          </span>
          <span className="text-[10px] text-[#5C6862] block mt-0.5">{activeCount} active opportunities</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#0D2218]/10 shadow-xs">
          <span className="text-[11px] font-semibold text-[#5C6862] block">Closed Won Revenue</span>
          <span className="font-serif text-2xl font-bold text-emerald-800 tabular-nums">
            ₹{(totalWonVal / 100000).toFixed(1)}L
          </span>
          <span className="text-[10px] text-emerald-700 block mt-0.5">
            {deals.filter((d) => d.stage === 'Won').length} deals closed
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#0D2218]/10 shadow-xs">
          <span className="text-[11px] font-semibold text-[#5C6862] block">Total In Pipeline</span>
          <span className="font-serif text-2xl font-bold text-[#0D2218] tabular-nums">
            {deals.length}
          </span>
          <span className="text-[10px] text-[#5C6862] block mt-0.5">Across all 7 velocity stages</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#0D2218]/10 shadow-xs">
          <span className="text-[11px] font-semibold text-[#5C6862] block">Average Deal Size</span>
          <span className="font-serif text-2xl font-bold text-[#0D2218] tabular-nums">
            ₹{deals.length ? ((totalPipelineVal + totalWonVal) / deals.length / 100000).toFixed(1) : 0}L
          </span>
          <span className="text-[10px] text-[#BA5D38] block mt-0.5 font-semibold">Healthy target range</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#0D2218]/10 mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#5C6862] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search deals, company, or contact..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF6F0] border border-[#0D2218]/10 rounded-xl text-[#0D2218] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#5C6862]" />
          <span className="text-xs text-[#5C6862]">Assignee:</span>
          <select
            value={repFilter}
            onChange={(e) => setRepFilter(e.target.value)}
            className="bg-[#FAF6F0] border border-[#0D2218]/10 rounded-lg px-2.5 py-1 text-xs text-[#0D2218]"
          >
            <option value="All">All Representatives</option>
            {teamUsers.map((u) => (
              <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
            ))}
            {teamUsers.length === 0 && user && (
              <option value={user.name}>{user.name} ({user.role})</option>
            )}
          </select>
        </div>
      </div>

      {/* 7-Stage Interactive Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-6 min-h-[550px]">
        {STAGES.map((stg) => {
          const stageDeals = filteredDeals.filter((d) => d.stage === stg);
          const stageTotal = stageDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
          const styling = STAGE_COLORS[stg];

          return (
            <div
              key={stg}
              className="w-80 shrink-0 bg-[#F6F1E8] rounded-2xl p-3.5 border border-[#0D2218]/10 flex flex-col justify-between"
            >
              <div>
                {/* Column Title Bar */}
                <div className={`pl-2.5 py-1 mb-3.5 border-l-4 ${styling.border} flex items-center justify-between`}>
                  <div>
                    <h3 className="text-xs font-bold text-[#0D2218] uppercase tracking-wide">
                      {stg}
                    </h3>
                    <span className="text-[11px] font-mono text-[#5C6862]">
                      {stageDeals.length} deals · ₹{(stageTotal / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <button
                    onClick={() => handleOpenAdd(stg)}
                    className="p-1 rounded-lg text-[#5C6862] hover:text-[#0D2218] hover:bg-white transition-colors"
                    title={`Add deal to ${stg}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Deal Cards Container */}
                <div className="space-y-3">
                  {stageDeals.length === 0 ? (
                    <div className="p-6 text-center border-2 border-dashed border-[#0D2218]/10 rounded-xl">
                      <p className="text-[11px] text-[#5C6862]">No deals in {stg}</p>
                    </div>
                  ) : (
                    stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        className="bg-white p-3.5 rounded-xl border border-[#0D2218]/10 shadow-xs hover:border-[#BA5D38]/50 hover:shadow-md transition-all group relative"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-semibold text-[#5C6862] truncate">
                            {deal.contact}
                          </span>
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#FAF6F0] border border-[#0D2218]/8 text-[#0D2218]">
                            {deal.tag || 'Deal'}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-[#0D2218] mb-1 leading-snug">
                          {deal.name}
                        </h4>

                        <div className="flex items-center gap-1.5 text-[11px] text-[#5C6862] mb-2.5">
                          <Building className="w-3 h-3 text-[#5C6862]" />
                          <span className="truncate">{deal.company}</span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[#0D2218]/8">
                          <span className="font-serif text-sm font-bold text-[#0D2218] tabular-nums">
                            ₹{deal.value.toLocaleString()}
                          </span>
                          <span className="text-[10px] font-mono text-[#5C6862]">
                            {deal.expectedCloseDate}
                          </span>
                        </div>

                        {/* Move / Quick Action Bar */}
                        <div className="mt-2.5 pt-2 border-t border-dashed border-[#0D2218]/8 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            {/* Prev stage button */}
                            {STAGES.indexOf(stg) > 0 && (
                              <button
                                onClick={() => handleMoveStage(deal, STAGES[STAGES.indexOf(stg) - 1])}
                                className="p-1 hover:bg-[#FAF6F0] text-[#5C6862] rounded"
                                title="Move to previous stage"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {/* Next stage button */}
                            {STAGES.indexOf(stg) < STAGES.length - 1 && (
                              <button
                                onClick={() => handleMoveStage(deal, STAGES[STAGES.indexOf(stg) + 1])}
                                className="p-1 hover:bg-[#FAF6F0] text-[#0D2218] rounded"
                                title="Move to next stage"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEdit(deal)}
                              className="p-1 text-[#5C6862] hover:text-[#0D2218] rounded"
                              title="Edit deal"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDelete(deal.id, deal.name)}
                              className="p-1 text-[#5C6862] hover:text-red-700 rounded"
                              title="Delete deal"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add deal footer button */}
              <button
                onClick={() => handleOpenAdd(stg)}
                className="w-full mt-3 py-2 rounded-xl text-xs font-semibold text-[#5C6862] hover:text-[#0D2218] hover:bg-white transition-colors flex items-center justify-center gap-1.5 border border-dashed border-[#0D2218]/15"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add {singularDeal} to {stg}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Deal Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FAF6F0] rounded-2xl border border-[#0D2218]/15 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in">
            <div className="p-4 bg-white border-b border-[#0D2218]/10 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#0D2218]">
                {editingDeal ? `Edit ${singularDeal}` : `Add New ${singularDeal}`}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-[#5C6862]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">{singularDeal} Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Enterprise Cloud License Q4"
                  className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Sovereign Capital"
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Primary Contact</label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="e.g. Anand Patel"
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Deal Value (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="e.g. 500000"
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Pipeline Stage *</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Assigned Rep</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  >
                    {teamUsers.map((u) => (
                      <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
                    ))}
                    {teamUsers.length === 0 && user && (
                      <option value={user.name}>{user.name} ({user.role})</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Expected Close</label>
                  <input
                    type="date"
                    value={expectedCloseDate}
                    onChange={(e) => setExpectedCloseDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Category Tag</label>
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="e.g. FinTech"
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Opportunity Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contract specifics, next meetings, decision criteria..."
                  className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                />
              </div>

              <div className="pt-3 border-t border-[#0D2218]/10 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0D2218] text-[#FAF6F0] rounded-xl font-semibold hover:bg-[#163827]"
                >
                  {editingDeal ? 'Update Opportunity' : 'Save Deal to Pipeline'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </WorkspaceLayout>
  );
};
export default PipelinePage;
