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
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

export const CommunicationPage: React.FC = () => {
  const { user } = useAuth();
  const [comms, setComms] = useState<Communication[]>(db.getCommunications());
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | Communication['type']>('All');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'error' } | null>(null);

  // Email Preview and Inspection
  const [composeTab, setComposeTab] = useState<'compose' | 'preview'>('compose');
  const [inspectingEmail, setInspectingEmail] = useState<Communication | null>(null);

  // Google SMTP Status
  const [smtpStatus, setSmtpStatus] = useState<{
    configured: boolean;
    verified?: boolean;
    user?: string;
    provider?: string;
    error?: string;
  } | null>(null);
  const [checkingSmtp, setCheckingSmtp] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [type, setType] = useState<Communication['type']>('Email');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [relatedCustomer, setRelatedCustomer] = useState('');
  const [relatedLead, setRelatedLead] = useState('');
  const [author, setAuthor] = useState(user?.name || 'Account Lead');
  const [sending, setSending] = useState(false);

  const checkSmtpHealth = async () => {
    setCheckingSmtp(true);
    try {
      const res = await fetch('/api/email/status');
      if (res.ok) {
        const data = await res.json();
        setSmtpStatus(data);
      }
    } catch (e) {
      // Backend not running on this origin or offline
      setSmtpStatus({ configured: false });
    } finally {
      setCheckingSmtp(false);
    }
  };

  const loadData = () => {
    setComms(db.getCommunications());
  };

  useEffect(() => {
    loadData();
    checkSmtpHealth();
  }, []);

  const showToast = (message: string, toastType: 'success' | 'warning' | 'error' = 'success') => {
    setToast({ message, type: toastType });
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenAdd = (defaultType: Communication['type'] = 'Email') => {
    setType(defaultType);
    setComposeTab('compose');
    setRecipientEmail('');
    setSubject('');
    setContent('');
    setRelatedCustomer('');
    setRelatedLead('');
    setAuthor(user?.name || 'Account Lead');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject) return;

    if (type === 'Email' && recipientEmail) {
      setSending(true);
      try {
        const response = await fetch('/api/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: recipientEmail,
            subject,
            content,
            customerName: relatedCustomer,
            senderName: author,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.sentViaSmtp) {
            showToast(`Email dispatched successfully via Google SMTP to ${recipientEmail}!`, 'success');
          } else {
            showToast(result.warning || 'Logged email to CRM. Configure GOOGLE_SMTP_USER & GOOGLE_SMTP_APP_PASSWORD to send live.', 'warning');
          }
        } else {
          // Fallback to local CRM record
          db.saveCommunication({
            type,
            subject,
            content: `[To: ${recipientEmail}] ${content}`,
            relatedCustomer,
            relatedLead,
            author,
          });
          showToast(`Logged communication. (Google SMTP service endpoint responded with status ${response.status})`, 'warning');
        }
      } catch (err) {
        // Fallback local save
        db.saveCommunication({
          type,
          subject,
          content: `[To: ${recipientEmail}] ${content}`,
          relatedCustomer,
          relatedLead,
          author,
        });
        showToast(`Email recorded on timeline. Set Google SMTP credentials in .env to deliver real emails.`, 'warning');
      } finally {
        setSending(false);
      }
    } else {
      // Non-email or note/meeting/call logging
      db.saveCommunication({
        type,
        subject,
        content,
        relatedCustomer,
        relatedLead,
        author,
      });
      showToast(`${type} logged to customer timeline.`, 'success');
    }

    loadData();
    setModalOpen(false);
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
      {/* Toast Notification */}
      {toast && (
        <div
          className={`mb-4 p-3 rounded-xl border text-xs font-semibold flex items-center justify-between ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : toast.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
          <X className="w-4 h-4 cursor-pointer" onClick={() => setToast(null)} />
        </div>
      )}

      {/* Google Gmail SMTP Status Pill / Banner */}
      <div className="mb-4 bg-white px-4 py-2.5 rounded-2xl border border-[#0D2218]/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className={`w-2.5 h-2.5 rounded-full ${smtpStatus?.configured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          <span className="text-xs font-extrabold text-[#0D2218]">
            Google Gmail SMTP:
          </span>
          <span className="text-xs text-[#5C6862]">
            {smtpStatus?.configured
              ? `Connected (${smtpStatus.user || 'smtp.gmail.com:465'})`
              : 'Log Mode (Set GOOGLE_SMTP_USER & GOOGLE_SMTP_APP_PASSWORD in .env for live email delivery)'}
          </span>
        </div>
        <button
          type="button"
          onClick={checkSmtpHealth}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#BA5D38] hover:underline cursor-pointer"
        >
          <RefreshCw className={`w-3 h-3 ${checkingSmtp ? 'animate-spin' : ''}`} />
          <span>Check Connection</span>
        </button>
      </div>

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

              <div className="pl-10.5 pt-3 mt-2 border-t border-[#0D2218]/6 flex items-center justify-between gap-3 text-[11px] text-[#5C6862]">
                <div className="flex items-center gap-3 flex-wrap">
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

                {c.type === 'Email' && (
                  <button
                    type="button"
                    onClick={() => setInspectingEmail(c)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-extrabold rounded-lg transition-colors cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Preview Email</span>
                  </button>
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
              {type === 'Email' && (
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#0D2218]/10">
                  <button
                    type="button"
                    onClick={() => setComposeTab('compose')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      composeTab === 'compose' ? 'bg-[#0D2218] text-[#FAF6F0] shadow-xs' : 'text-[#5C6862]'
                    }`}
                  >
                    Compose Message
                  </button>
                  <button
                    type="button"
                    onClick={() => setComposeTab('preview')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      composeTab === 'preview' ? 'bg-[#0D2218] text-[#FAF6F0] shadow-xs' : 'text-[#5C6862]'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Email Preview</span>
                  </button>
                </div>
              )}

              {composeTab === 'preview' && type === 'Email' ? (
                /* LIVE EMAIL PREVIEW MOCKUP */
                <div className="bg-white rounded-2xl border border-[#0D2218]/15 shadow-sm overflow-hidden text-xs">
                  {/* Email Client Top Bar */}
                  <div className="bg-[#0D2218] p-3 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#C5A059]" />
                      <span className="font-extrabold text-[11px] tracking-wide">
                        Kairoo Enterprise Email Dispatch
                      </span>
                    </div>
                    <span className="text-[10px] bg-white/10 text-white/90 px-2 py-0.5 rounded-full font-mono">
                      smtp.gmail.com:465
                    </span>
                  </div>

                  {/* Header Meta */}
                  <div className="p-4 bg-[#FAF6F0] border-b border-[#0D2218]/8 space-y-1.5 text-[11px]">
                    <div className="flex">
                      <span className="w-16 font-extrabold text-[#5C6862]">From:</span>
                      <span className="font-bold text-[#0D2218]">
                        {author} &lt;{user?.email || 'sales@company.com'}&gt;
                      </span>
                    </div>
                    <div className="flex">
                      <span className="w-16 font-extrabold text-[#5C6862]">To:</span>
                      <span className="font-bold text-blue-700">
                        {recipientEmail || '(Enter recipient email in Compose tab)'}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="w-16 font-extrabold text-[#5C6862]">Subject:</span>
                      <span className="font-extrabold text-[#0D2218]">
                        {subject || '(No subject provided)'}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="w-16 font-extrabold text-[#5C6862]">Date:</span>
                      <span className="text-[#5C6862]">{new Date().toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 min-h-[160px] bg-white text-[#1F2623] leading-relaxed text-xs">
                    {content ? (
                      <div className="space-y-2 whitespace-pre-wrap">{content}</div>
                    ) : (
                      <p className="text-gray-400 italic">No email body entered yet...</p>
                    )}

                    <div className="mt-8 pt-4 border-t border-gray-100 text-[10px] text-gray-500">
                      <p className="font-bold text-[#0D2218]">{author}</p>
                      <p>{user?.company || 'Organization Lead'} · Kairoo CRM</p>
                      <p className="mt-1 text-gray-400">Delivered securely via Google Gmail SMTP</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* EDIT FORM INPUTS */
                <>
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
                      />
                    </div>
                  </div>

                  {type === 'Email' && (
                    <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block font-semibold text-[#0D2218]">Recipient Email Address *</label>
                        <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-full">
                          Google Gmail SMTP
                        </span>
                      </div>
                      <input
                        type="email"
                        required={type === 'Email'}
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        placeholder="customer.recipient@company.com"
                        className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/15 rounded-xl text-[#0D2218] focus:outline-none focus:ring-1 focus:ring-[#0D2218]"
                      />
                      <p className="text-[10px] text-[#5C6862]">
                        Dispatches real email via Google SMTP (smtp.gmail.com:465) and logs interaction to timeline.
                      </p>
                    </div>
                  )}

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
                </>
              )}

              <div className="pt-3 border-t border-[#0D2218]/10 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-xl hover:bg-gray-100"
                >
                  Cancel
                </button>
                {composeTab === 'preview' && (
                  <button
                    type="button"
                    onClick={() => setComposeTab('compose')}
                    className="px-4 py-2 bg-white border border-[#0D2218]/15 text-[#0D2218] rounded-xl font-semibold hover:bg-gray-50"
                  >
                    Edit Message
                  </button>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="px-5 py-2 bg-[#0D2218] hover:bg-[#163827] text-[#FAF6F0] rounded-xl font-semibold flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {sending && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>
                    {sending
                      ? 'Sending via Google SMTP...'
                      : type === 'Email'
                      ? 'Send via Google SMTP'
                      : 'Save Log'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Standalone Inspection Modal for Timeline Emails */}
      {inspectingEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#0D2218]/15 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in">
            <div className="p-4 bg-[#0D2218] text-[#FAF6F0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C5A059]" />
                <h3 className="font-extrabold text-sm">
                  Email Dispatch Preview
                </h3>
              </div>
              <button
                onClick={() => setInspectingEmail(null)}
                className="p-1 rounded-lg text-white/80 hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 bg-[#FAF6F0] border-b border-[#0D2218]/10 space-y-1.5 text-xs">
              <div className="flex">
                <span className="w-20 font-extrabold text-[#5C6862]">Sender:</span>
                <span className="font-bold text-[#0D2218]">{inspectingEmail.author}</span>
              </div>
              {inspectingEmail.recipient && (
                <div className="flex">
                  <span className="w-20 font-extrabold text-[#5C6862]">Recipient:</span>
                  <span className="font-bold text-blue-700">{inspectingEmail.recipient}</span>
                </div>
              )}
              <div className="flex">
                <span className="w-20 font-extrabold text-[#5C6862]">Subject:</span>
                <span className="font-extrabold text-[#0D2218]">{inspectingEmail.subject}</span>
              </div>
              <div className="flex">
                <span className="w-20 font-extrabold text-[#5C6862]">Timestamp:</span>
                <span className="text-[#5C6862]">
                  {new Date(inspectingEmail.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-6 bg-white text-xs leading-relaxed text-[#1F2623] min-h-[180px] max-h-[360px] overflow-y-auto">
              <p className="whitespace-pre-wrap">{inspectingEmail.content}</p>

              <div className="mt-8 pt-4 border-t border-gray-100 text-[10px] text-gray-500">
                <p className="font-bold text-[#0D2218]">{inspectingEmail.author}</p>
                <p>Kairoo CRM Communication Records</p>
                <p className="mt-1 text-gray-400">Authenticated Google SMTP Transcript</p>
              </div>
            </div>

            <div className="p-4 bg-[#FAF6F0] border-t border-[#0D2218]/10 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectingEmail(null)}
                className="px-5 py-2 bg-[#0D2218] text-white rounded-xl text-xs font-extrabold hover:bg-[#163827] cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </WorkspaceLayout>
  );
};
export default CommunicationPage;
