import React, { useState, useEffect } from 'react';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { db, Lead } from '../services/db';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Mail,
  Phone,
  Target,
  ArrowRight,
  X,
} from 'lucide-react';

const STAGES: Lead['status'][] = [
  'New Lead',
  'Contacted',
  'Interested',
  'Proposal',
  'Negotiation',
  'Won',
  'Lost',
];

import { useAuth } from '../context/AuthContext';

export const LeadsPage: React.FC = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>(db.getLeads());
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('All');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [source, setSource] = useState('Website Inbound');
  const [interest, setInterest] = useState('Enterprise CRM');
  const [assignedTo, setAssignedTo] = useState(user?.name || 'Sales Lead');
  const [status, setStatus] = useState<Lead['status']>('New Lead');
  const [notes, setNotes] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const loadData = () => {
    setLeads(db.getLeads());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingLead(null);
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setSource('Website Demo');
    setInterest('Standard Plan');
    setAssignedTo(user?.name || 'Sales Lead');
    setStatus('New Lead');
    setNotes('');
    setModalOpen(true);
  };

  const handleOpenEdit = (l: Lead) => {
    setEditingLead(l);
    setName(l.name);
    setEmail(l.email);
    setPhone(l.phone);
    setCompany(l.company);
    setSource(l.source);
    setInterest(l.interest);
    setAssignedTo(l.assignedTo);
    setStatus(l.status);
    setNotes(l.notes);
    setModalOpen(true);
  };

  const handleDelete = (id: string, leadName: string) => {
    if (confirm(`Delete lead "${leadName}"?`)) {
      db.deleteLead(id);
      loadData();
      showToast(`Lead "${leadName}" deleted.`);
    }
  };

  const handleStageChange = (lead: Lead, newStage: Lead['status']) => {
    db.saveLead({ ...lead, status: newStage });
    loadData();
    showToast(`Lead stage updated to ${newStage}.`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    db.saveLead({
      id: editingLead?.id,
      name,
      email,
      phone,
      company: company || name,
      source,
      interest,
      assignedTo,
      status,
      notes,
    });

    loadData();
    setModalOpen(false);
    showToast(editingLead ? 'Lead updated.' : 'Lead created.');
  };

  const filtered = leads.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === 'All' || l.status === stageFilter;
    return matchSearch && matchStage;
  });

  return (
    <WorkspaceLayout
      title="Leads"
      subtitle="Capture, qualify and convert inbound leads across sales stages"
      actions={
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#FAF6F0] bg-[#0D2218] hover:bg-[#163827] rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Capture Lead</span>
        </button>
      }
    >
      {toast && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <span>{toast}</span>
          <X className="w-4 h-4 cursor-pointer" onClick={() => setToast(null)} />
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#0D2218]/10 mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#5C6862] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search leads by name, email, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF6F0] border border-[#0D2218]/10 rounded-xl text-[#0D2218] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#5C6862]">
          <Filter className="w-3.5 h-3.5" />
          <span>Stage:</span>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="bg-[#FAF6F0] border border-[#0D2218]/10 rounded-lg px-2 py-1 text-xs text-[#0D2218]"
          >
            <option value="All">All Stages</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-[#0D2218]/10 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Target className="w-10 h-10 text-[#5C6862] mx-auto mb-2 opacity-50" />
            <h4 className="text-sm font-bold text-[#0D2218]">No leads found</h4>
            <p className="text-xs text-[#5C6862] mt-1 max-w-sm mx-auto">
              Capture your first inbound lead to begin conversion tracking.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF6F0] border-b border-[#0D2218]/10 text-[#5C6862] font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Lead / Company</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Current Stage</th>
                  <th className="py-3 px-4">Interest Plan</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0D2218]/6">
                {filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-[#FAF6F0]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#0D2218]">{l.name}</div>
                      <div className="text-[11px] text-[#5C6862]">{l.company}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#2D3632]">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-[#5C6862]" />
                        <span>{l.email}</span>
                      </div>
                      {l.phone && (
                        <div className="flex items-center gap-1 text-[11px] text-[#5C6862] mt-0.5">
                          <Phone className="w-3 h-3 text-[#5C6862]" />
                          <span>{l.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={l.status}
                        onChange={(e) => handleStageChange(l, e.target.value as any)}
                        className="text-[11px] font-semibold bg-[#FAF6F0] border border-[#0D2218]/12 rounded-lg px-2 py-1 text-[#0D2218]"
                      >
                        {STAGES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-[#2D3632] font-medium">
                      {l.interest}
                    </td>
                    <td className="py-3.5 px-4 text-[#5C6862]">
                      {l.assignedTo}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(l)}
                          className="p-1.5 text-[#5C6862] hover:text-[#0D2218] rounded-lg"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(l.id, l.name)}
                          className="p-1.5 text-[#5C6862] hover:text-red-700 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FAF6F0] rounded-2xl border border-[#0D2218]/15 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in">
            <div className="p-4 bg-white border-b border-[#0D2218]/10 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#0D2218]">
                {editingLead ? 'Edit Lead' : 'Capture New Lead'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-[#5C6862]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Lead Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Company</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Stage</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Interest</label>
                  <input
                    type="text"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Assign Rep</label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-[#0D2218]/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0D2218] text-[#FAF6F0] rounded-xl font-semibold"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </WorkspaceLayout>
  );
};
