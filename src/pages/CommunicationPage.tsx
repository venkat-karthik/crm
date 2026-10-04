import React, { useState, useEffect } from 'react';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { db, Communication } from '../services/db';
import {
  Plus,
  Search,
  Mail,
  PhoneCall,
  Users,
  FileText,
  Clock,
  Send,
  X,
  Building,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

export const CommunicationPage: React.FC = () => {
  const { user } = useAuth();
  const [comms, setComms] = useState<Communication[]>(db.getCommunications());
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | Communication['type']>('All');
  const [toast, setToast] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [type, setType] = useState<Communication['type']>('Email');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [relatedCustomer, setRelatedCustomer] = useState('');
  const [relatedLead, setRelatedLead] = useState('');
  const [author, setAuthor] = useState(user?.name || 'Account Lead');

  const loadData = () => {
    setComms(db.getCommunications());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAdd = (defaultType: Communication['type'] = 'Email') => {
    setType(defaultType);
    setSubject('');
    setContent('');
    setRelatedCustomer('');
    setRelatedLead('');
    setAuthor(user?.name || 'Account Lead');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject) return;

    db.saveCommunication({
      type,
      subject,
      content,
      relatedCustomer,
      relatedLead,
      author,
    });

    loadData();
    setModalOpen(false);
    showToast(`${type} logged to customer timeline.`);
  };

  const filtered = comms.filter((c) => {
    const matchSearch =
      c.subject.toLowerCase().includes(search.toLowerCase()) ||
      c.content.toLowerCase().includes(search.toLowerCase()) ||
      (c.relatedCustomer && c.relatedCustomer.toLowerCase().includes(search.toLowerCase())) ||
      (c.relatedLead && c.relatedLead.toLowerCase().includes(search.toLowerCase()));
    const matchType = typeFilter === 'All' || c.type === typeFilter;
    return matchSearch && matchType;
  });

  const getIcon = (t: Communication['type']) => {
    switch (t) {
      case 'Email':
        return <Mail className="w-4 h-4 text-blue-700" />;
      case 'Call':
        return <PhoneCall className="w-4 h-4 text-emerald-700" />;
      case 'Meeting':
        return <Users className="w-4 h-4 text-[#BA5D38]" />;
      case 'Note':
        return <FileText className="w-4 h-4 text-[#C5A059]" />;
    }
  };

  return (
    <WorkspaceLayout
      title="Communication Hub"
      subtitle="Unified customer touchpoints, email dispatches, meeting transcripts and shared notes"
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenAdd('Email')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#0D2218] bg-white border border-[#0D2218]/15 hover:border-[#0D2218]/30 rounded-xl shadow-xs"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Send Email</span>
          </button>
          <button
            onClick={() => handleOpenAdd('Note')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#FAF6F0] bg-[#0D2218] hover:bg-[#163827] rounded-xl shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Communication</span>
          </button>
        </div>
      }
    >
      {toast && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <span>{toast}</span>
          <X className="w-4 h-4 cursor-pointer" onClick={() => setToast(null)} />
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#0D2218]/10 mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#5C6862] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search communications by subject or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF6F0] border border-[#0D2218]/10 rounded-xl text-[#0D2218] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 bg-[#FAF6F0] p-1 rounded-xl">
          {(['All', 'Email', 'Call', 'Meeting', 'Note'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                typeFilter === t
                  ? 'bg-[#0D2218] text-[#FAF6F0] shadow-xs'
                  : 'text-[#5C6862] hover:text-[#0D2218]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Communications Stream */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-[#0D2218]/10 text-center text-xs text-[#5C6862]">
            No communication records found. Click "Log Communication" to add notes, calls, or emails.
          </div>
        ) : (
          filtered.map((c) => (
            <div
              key={c.id}
              className="bg-white p-5 rounded-2xl border border-[#0D2218]/10 shadow-xs hover:border-[#BA5D38]/30 transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF6F0] border border-[#0D2218]/8 flex items-center justify-center">
                    {getIcon(c.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-[#FAF6F0] text-[#0D2218]">
                        {c.type}
                      </span>
                      <h3 className="text-sm font-bold text-[#0D2218]">{c.subject}</h3>
                    </div>
                    <span className="text-[11px] text-[#5C6862]">Recorded by {c.author}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-[#5C6862]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {c.content && (
                <p className="text-xs text-[#2D3632] leading-relaxed pl-10.5 pr-4 py-1">
                  {c.content}
                </p>
              )}

              <div className="pl-10.5 pt-3 mt-2 border-t border-[#0D2218]/6 flex items-center gap-3 text-[11px] text-[#5C6862]">
                {c.relatedCustomer && (
                  <span className="flex items-center gap-1">
                    <Building className="w-3 h-3 text-[#5C6862]" />
                    <span className="font-semibold text-[#0D2218]">{c.relatedCustomer}</span>
                  </span>
                )}
                {c.relatedLead && (
                  <span className="text-[#BA5D38] font-medium">Lead: {c.relatedLead}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FAF6F0] rounded-2xl border border-[#0D2218]/15 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in">
            <div className="p-4 bg-white border-b border-[#0D2218]/10 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#0D2218]">
                Log Communication
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-[#5C6862]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Channel Type *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  >
                    <option value="Email">Email Dispatch</option>
                    <option value="Call">Phone Call</option>
                    <option value="Meeting">Executive Meeting</option>
                    <option value="Note">Internal Strategy Note</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Author</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  >
                  </input>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Subject / Header *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Q4 Master Service Agreement terms discussed"
                  className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Communication Summary / Body</label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste email text, meeting minutes, or key decisions..."
                  className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Related Customer</label>
                  <input
                    type="text"
                    value={relatedCustomer}
                    onChange={(e) => setRelatedCustomer(e.target.value)}
                    placeholder="e.g. TechNova Solutions"
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Related Lead</label>
                  <input
                    type="text"
                    value={relatedLead}
                    onChange={(e) => setRelatedLead(e.target.value)}
                    placeholder="e.g. Sovereign Capital"
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  />
                </div>
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
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </WorkspaceLayout>
  );
};
export default CommunicationPage;
