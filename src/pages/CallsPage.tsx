import React, { useState, useEffect } from 'react';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { db, Call } from '../services/db';
import {
  Plus,
  Search,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Clock,
  Trash2,
  Edit2,
  CheckCircle,
  X,
  User,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

export const CallsPage: React.FC = () => {
  const { user } = useAuth();
  const [calls, setCalls] = useState<Call[]>(db.getCalls());
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toast, setToast] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCall, setEditingCall] = useState<Call | null>(null);
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState<Call['type']>('Outbound');
  const [status, setStatus] = useState<Call['status']>('Completed');
  const [durationMinutes, setDurationMinutes] = useState<number | string>(12);
  const [assignedEmployee, setAssignedEmployee] = useState(user?.name || 'Account Lead');
  const [notes, setNotes] = useState('');
  const [relatedCustomer, setRelatedCustomer] = useState('');

  const loadData = () => {
    setCalls(db.getCalls());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingCall(null);
    setContactName('');
    setPhone('');
    setType('Outbound');
    setStatus('Completed');
    setDurationMinutes(8);
    setAssignedEmployee(user?.name || 'Account Lead');
    setNotes('');
    setRelatedCustomer('');
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Call) => {
    setEditingCall(c);
    setContactName(c.contactName);
    setPhone(c.phone);
    setType(c.type);
    setStatus(c.status);
    setDurationMinutes(c.durationMinutes || 0);
    setAssignedEmployee(c.assignedEmployee);
    setNotes(c.notes);
    setRelatedCustomer(c.relatedCustomer || '');
    setModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete call record with ${name}?`)) {
      db.deleteCall(id);
      loadData();
      showToast('Call record removed.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !phone) return;

    db.saveCall({
      id: editingCall?.id,
      contactName,
      phone,
      type,
      status,
      durationMinutes: Number(durationMinutes),
      assignedEmployee,
      notes,
      relatedCustomer,
    });

    loadData();
    setModalOpen(false);
    showToast(editingCall ? 'Call updated.' : 'New call logged.');
  };

  const filtered = calls.filter((c) => {
    const matchSearch =
      c.contactName.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase()) ||
      c.notes.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || c.type === typeFilter;
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const totalDuration = calls.reduce((sum, c) => sum + (c.durationMinutes || 0), 0);
  const completedCalls = calls.filter((c) => c.status === 'Completed').length;
  const scheduledCalls = calls.filter((c) => c.status === 'Scheduled').length;

  return (
    <WorkspaceLayout
      title="Calls & Telephony"
      subtitle="Track customer call logs, scheduled follow-ups and discussion outcomes"
      actions={
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#FAF6F0] bg-[#0D2218] hover:bg-[#163827] rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Log Call</span>
        </button>
      }
    >
      {toast && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <span>{toast}</span>
          <X className="w-4 h-4 cursor-pointer" onClick={() => setToast(null)} />
        </div>
      )}

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-[#0D2218]/10 shadow-xs">
          <span className="text-[11px] font-semibold text-[#5C6862] block">Total Calls</span>
          <span className="font-serif text-2xl font-bold text-[#0D2218]">{calls.length}</span>
          <span className="text-[10px] text-[#5C6862] block mt-0.5">Inbound & outbound</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#0D2218]/10 shadow-xs">
          <span className="text-[11px] font-semibold text-[#5C6862] block">Completed</span>
          <span className="font-serif text-2xl font-bold text-emerald-800">{completedCalls}</span>
          <span className="text-[10px] text-emerald-700 block mt-0.5">Logged conversations</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#0D2218]/10 shadow-xs">
          <span className="text-[11px] font-semibold text-[#5C6862] block">Scheduled</span>
          <span className="font-serif text-2xl font-bold text-[#BA5D38]">{scheduledCalls}</span>
          <span className="text-[10px] text-[#5C6862] block mt-0.5">Upcoming today</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#0D2218]/10 shadow-xs">
          <span className="text-[11px] font-semibold text-[#5C6862] block">Total Duration</span>
          <span className="font-serif text-2xl font-bold text-[#0D2218]">{totalDuration}m</span>
          <span className="text-[10px] text-[#5C6862] block mt-0.5">Voice airtime</span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#0D2218]/10 mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#5C6862] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search calls by contact name, phone, notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF6F0] border border-[#0D2218]/10 rounded-xl text-[#0D2218] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#5C6862]">
            <span>Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[#FAF6F0] border border-[#0D2218]/10 rounded-lg px-2 py-1 text-xs text-[#0D2218]"
            >
              <option value="All">All Types</option>
              <option value="Inbound">Inbound</option>
              <option value="Outbound">Outbound</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#5C6862]">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#FAF6F0] border border-[#0D2218]/10 rounded-lg px-2 py-1 text-xs text-[#0D2218]"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Missed">Missed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Calls Table */}
      <div className="bg-white rounded-2xl border border-[#0D2218]/10 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#5C6862]">
            No call records found. Click "Log Call" to track a conversation.
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0] border-b border-[#0D2218]/10 text-[#5C6862] font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Representative</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0D2218]/6">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-[#FAF6F0]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#0D2218]">{c.contactName}</div>
                    <div className="text-[11px] text-[#5C6862] font-mono">{c.phone}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="flex items-center gap-1.5 font-medium">
                      {c.type === 'Inbound' ? (
                        <PhoneIncoming className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <PhoneOutgoing className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      <span>{c.type}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : c.status === 'Scheduled'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[#2D3632]">
                    {c.durationMinutes ? `${c.durationMinutes} min` : '—'}
                  </td>

                  <td className="py-3.5 px-4 text-[#2D3632] font-medium">
                    {c.assignedEmployee}
                  </td>

                  <td className="py-3.5 px-4 text-[#5C6862] max-w-xs truncate">
                    {c.notes || '—'}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 text-[#5C6862] hover:text-[#0D2218] rounded-lg"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.contactName)}
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
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FAF6F0] rounded-2xl border border-[#0D2218]/15 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in">
            <div className="p-4 bg-white border-b border-[#0D2218]/10 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#0D2218]">
                {editingCall ? 'Edit Call Record' : 'Log Phone Call'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-[#5C6862]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Anand Patel"
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98111 22233"
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Call Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  >
                    <option value="Outbound">Outbound</option>
                    <option value="Inbound">Inbound</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Missed">Missed</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Duration (min)</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Representative</label>
                  <input
                    type="text"
                    value={assignedEmployee}
                    onChange={(e) => setAssignedEmployee(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Related Customer</label>
                  <input
                    type="text"
                    value={relatedCustomer}
                    onChange={(e) => setRelatedCustomer(e.target.value)}
                    placeholder="e.g. TechNova"
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Call Notes / Discussion Summary</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Key questions asked, objections, agreed next steps..."
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
                  Save Call
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </WorkspaceLayout>
  );
};
export default CallsPage;
