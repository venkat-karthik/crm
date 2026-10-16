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
  Sparkles,
  Upload,
  FileSpreadsheet,
  Zap,
  CheckCircle2,
  Building,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Automation: Magic Paste State
  const [magicModalOpen, setMagicModalOpen] = useState(false);
  const [magicText, setMagicText] = useState('');
  const [parsedPreview, setParsedPreview] = useState<{ name: string; email: string; phone: string; company: string } | null>(null);

  // Automation: CSV Import State
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [csvRawText, setCsvRawText] = useState('');

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
    setTimeout(() => setToast(null), 3500);
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

  // Smart Automation: Extract details from unformatted text
  const parseRawLeadText = (text: string) => {
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/);
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    let extractedName = '';
    let extractedCompany = '';

    for (const line of lines) {
      if (/name[:\s]/i.test(line)) {
        extractedName = line.replace(/name[:\s]+/i, '').trim();
        break;
      }
    }
    if (!extractedName && lines.length > 0 && lines[0].length < 40 && !lines[0].includes('@')) {
      extractedName = lines[0].replace(/^(hi|hello|dear|i'm|i am)\s+/i, '').replace(/[,-]$/, '').trim();
    }

    for (const line of lines) {
      if (/company[:\s]|organization[:\s]|at\s+/i.test(line)) {
        extractedCompany = line.replace(/.*(?:company|organization|at)[:\s]+/i, '').trim();
        break;
      }
    }
    if (!extractedCompany && emailMatch) {
      const domain = emailMatch[0].split('@')[1];
      if (domain && !domain.includes('gmail') && !domain.includes('yahoo') && !domain.includes('outlook')) {
        extractedCompany = domain.split('.')[0].toUpperCase();
      }
    }

    return {
      name: extractedName || 'Inbound Prospect',
      email: emailMatch ? emailMatch[0] : '',
      phone: phoneMatch ? phoneMatch[0] : '',
      company: extractedCompany || 'Enterprise Prospect',
    };
  };

  const handleMagicPasteChange = (val: string) => {
    setMagicText(val);
    if (val.trim()) {
      setParsedPreview(parseRawLeadText(val));
    } else {
      setParsedPreview(null);
    }
  };

  const handleSaveMagicLead = () => {
    if (!parsedPreview) return;
    db.saveLead({
      name: parsedPreview.name,
      email: parsedPreview.email || `lead_${Date.now()}@inbound.co`,
      phone: parsedPreview.phone,
      company: parsedPreview.company,
      source: 'Auto-Extracted Signature',
      interest: 'Inbound Inquiry',
      assignedTo: user?.name || 'Sales Lead',
      status: 'New Lead',
      notes: `Auto-extracted from raw text:\n${magicText.slice(0, 200)}...`,
    });
    loadData();
    setMagicModalOpen(false);
    setMagicText('');
    setParsedPreview(null);
    showToast(`Smart Captured Lead: ${parsedPreview.name} (${parsedPreview.company})`);
  };

  const sampleBatch: Partial<Lead>[] = [
    { name: 'Aarav Singhania', email: 'aarav@singhaniaholdings.in', phone: '+91 98201 54321', company: 'Singhania Holdings', source: 'Website Inbound', interest: 'Enterprise Suite', status: 'New Lead' },
    { name: 'Meera Nambiar', email: 'meera.nambiar@apexlogistics.com', phone: '+91 99400 88219', company: 'Apex Logistics Global', source: 'Cold Outreach', interest: 'Agency Retainer', status: 'Contacted' },
    { name: 'Devendra Joshi', email: 'd.joshi@kavitapharmaceuticals.com', phone: '+91 97230 44102', company: 'Kavita Pharma Labs', source: 'Referral', interest: 'Standard Growth', status: 'Interested' },
    { name: 'Tanvi Pillai', email: 'tanvi@zenithcreative.agency', phone: '+91 98110 99341', company: 'Zenith Creative Studio', source: 'LinkedIn Inbound', interest: 'Multi-User CRM', status: 'Proposal' },
    { name: 'Rohan Deshmukh', email: 'rohan.d@indussystems.org', phone: '+91 94220 18392', company: 'Indus System Architectures', source: 'Partner Network', interest: 'Custom SLA', status: 'Negotiation' },
  ];

  const handleImportSampleBatch = () => {
    sampleBatch.forEach((item) => {
      db.saveLead({
        name: item.name!,
        email: item.email!,
        phone: item.phone!,
        company: item.company!,
        source: item.source || 'Batch Import',
        interest: item.interest || 'Inbound Prospect',
        assignedTo: user?.name || 'Sales Lead',
        status: item.status || 'New Lead',
        notes: 'Imported via automated lead batch.',
      });
    });
    loadData();
    setCsvModalOpen(false);
    showToast('Imported batch of 5 verified enterprise leads automatically!');
  };

  const handleParseCustomCSV = () => {
    if (!csvRawText.trim()) return;
    const lines = csvRawText.split('\n').map((l) => l.trim()).filter(Boolean);
    let count = 0;

    lines.forEach((line, idx) => {
      if (idx === 0 && line.toLowerCase().includes('name') && line.toLowerCase().includes('email')) {
        return; // skip header
      }
      const parts = line.split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
      if (parts.length >= 2) {
        db.saveLead({
          name: parts[0] || 'Imported Lead',
          email: parts[1] || `lead_${Date.now()}@batch.com`,
          phone: parts[2] || '',
          company: parts[3] || 'Commercial Account',
          source: 'CSV Ingestion',
          interest: 'Bulk Inbound',
          assignedTo: user?.name || 'Sales Lead',
          status: 'New Lead',
          notes: 'Ingested via CSV Batch Processor',
        });
        count++;
      }
    });

    loadData();
    setCsvModalOpen(false);
    setCsvRawText('');
    showToast(`Successfully processed and ingested ${count} leads from CSV!`);
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
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setMagicModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-extrabold text-[#0D2218] bg-white border border-[#0D2218]/15 hover:border-[#BA5D38] rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
            title="Auto-Extract contact details from email signatures, messages or LinkedIn text"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#BA5D38]" />
            <span>Magic Auto-Capture</span>
          </button>

          <button
            onClick={() => setCsvModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-extrabold text-[#0D2218] bg-white border border-[#0D2218]/15 hover:border-[#0D2218]/30 rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
            title="Bulk CSV / Spreadsheet Import"
          >
            <Upload className="w-3.5 h-3.5 text-[#5C6862]" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#FAF6F0] bg-[#0D2218] hover:bg-[#163827] rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Capture Lead</span>
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
                  className="px-5 py-2 bg-[#0D2218] text-[#FAF6F0] rounded-xl font-semibold cursor-pointer"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Automation: Magic Auto-Capture Modal */}
      {magicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FAF6F0] rounded-3xl border border-[#0D2218]/15 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in">
            <div className="p-4 bg-[#0D2218] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-[#C5A059] text-[#0D2218]">
                  <Sparkles className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#FAF6F0]">
                    Magic Lead Auto-Capture
                  </h3>
                  <p className="text-[11px] text-white/70">
                    Paste an email signature, WhatsApp message, or inquiry note to auto-extract.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMagicModalOpen(false)}
                className="p-1 rounded-lg text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#0D2218] mb-1">
                  Paste Raw Unformatted Text
                </label>
                <textarea
                  rows={4}
                  value={magicText}
                  onChange={(e) => handleMagicPasteChange(e.target.value)}
                  placeholder="Example:&#10;Hi, I am Vikram Malhotra from Zenith Global Holdings. Reach me at vikram@zenithholdings.com or +91 98450 11928 regarding the enterprise agreement."
                  className="w-full px-3 py-2.5 bg-white border border-[#0D2218]/15 rounded-xl font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-[#0D2218]"
                />
              </div>

              {parsedPreview && (
                <div className="p-3.5 bg-white rounded-2xl border border-emerald-300 shadow-xs space-y-2">
                  <div className="flex items-center justify-between border-b border-[#0D2218]/8 pb-1.5">
                    <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Auto-Detected Lead Information</span>
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      Ready to Save
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-[#5C6862] block">Name:</span>
                      <strong className="text-[#0D2218] font-bold">{parsedPreview.name}</strong>
                    </div>
                    <div>
                      <span className="text-[#5C6862] block">Company:</span>
                      <strong className="text-[#0D2218] font-bold">{parsedPreview.company}</strong>
                    </div>
                    <div>
                      <span className="text-[#5C6862] block">Email:</span>
                      <strong className="text-[#0D2218] font-mono">{parsedPreview.email || 'None detected'}</strong>
                    </div>
                    <div>
                      <span className="text-[#5C6862] block">Phone:</span>
                      <strong className="text-[#0D2218] font-mono">{parsedPreview.phone || 'None detected'}</strong>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-[#0D2218]/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() =>
                    handleMagicPasteChange(
                      "Pooja Deshmukh\nDirector of Operations\nApex Logistics India\nEmail: pooja@apexlogistics.in\nDirect: +91 98200 44192\nInquiring about 25-user CRM license"
                    )
                  }
                  className="text-[11px] font-bold text-[#BA5D38] hover:underline cursor-pointer"
                >
                  Fill Sample Signature
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMagicModalOpen(false)}
                    className="px-4 py-2 border border-[#0D2218]/15 rounded-xl font-semibold text-[#5C6862]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!parsedPreview}
                    onClick={handleSaveMagicLead}
                    className="px-5 py-2 bg-[#0D2218] hover:bg-[#163827] disabled:opacity-50 text-[#FAF6F0] rounded-xl font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer transition-transform active:scale-95"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Auto-Save Lead</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Automation: Bulk CSV Ingestion Modal */}
      {csvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FAF6F0] rounded-3xl border border-[#0D2218]/15 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in">
            <div className="p-4 bg-white border-b border-[#0D2218]/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-blue-50 text-blue-700">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#0D2218]">
                    Bulk Lead Ingestion (CSV / Spreadsheet)
                  </h3>
                  <p className="text-[11px] text-[#5C6862]">
                    Import dozens of customer records without manual typing.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCsvModalOpen(false)}
                className="p-1 rounded-lg text-[#5C6862]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#0D2218] text-[#FAF6F0] flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-xs block text-[#C5A059]">
                    ⚡ Instant 1-Click Verification
                  </span>
                  <span className="text-[11px] text-white/80">
                    Load a pre-configured batch of 5 verified enterprise leads
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleImportSampleBatch}
                  className="px-3.5 py-2 bg-[#FAF6F0] hover:bg-white text-[#0D2218] font-extrabold rounded-xl shadow-xs shrink-0 cursor-pointer transition-transform active:scale-95"
                >
                  Load 5 Leads Now
                </button>
              </div>

              <div>
                <label className="block font-bold text-[#0D2218] mb-1">
                  Or Paste CSV Data (Name, Email, Phone, Company)
                </label>
                <textarea
                  rows={4}
                  value={csvRawText}
                  onChange={(e) => setCsvRawText(e.target.value)}
                  placeholder={`Full Name, Email, Phone, Company&#10;Sunil Kulkarni, sunil@kulkarnilabs.com, +91 98450 11928, Kulkarni Labs&#10;Deepa Mehta, deepa@mehtaglobal.in, +91 99201 33481, Mehta Global`}
                  className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl font-mono text-[11px] focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-[#0D2218]/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCsvModalOpen(false)}
                  className="px-4 py-2 border border-[#0D2218]/15 rounded-xl font-semibold text-[#5C6862]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!csvRawText.trim()}
                  onClick={handleParseCustomCSV}
                  className="px-5 py-2 bg-[#0D2218] hover:bg-[#163827] disabled:opacity-50 text-[#FAF6F0] rounded-xl font-extrabold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Parse & Ingest CSV</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </WorkspaceLayout>
  );
};
