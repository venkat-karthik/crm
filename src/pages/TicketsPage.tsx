import React, { useState, useEffect } from 'react';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { db, Ticket, TicketMessage } from '../services/db';
import {
  Plus,
  Search,
  Filter,
  LifeBuoy,
  MessageSquare,
  Clock,
  Trash2,
  Edit2,
  CheckCircle,
  X,
  Send,
  AlertTriangle,
  User,
  Building,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

export const TicketsPage: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>(db.getTickets());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [toast, setToast] = useState<string | null>(null);

  const isClient = user?.role === 'Client';

  // New Ticket Modal
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [customerName, setCustomerName] = useState(user?.company || user?.name || 'Client Account');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Ticket['category']>('General');
  const [priority, setPriority] = useState<Ticket['priority']>('Medium');
  const [assignedTo, setAssignedTo] = useState('Support Desk');

  // Thread Drawer
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [replyText, setReplyText] = useState('');

  const loadData = () => {
    setTickets(db.getTickets());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenTicketThread = (ticket: Ticket) => {
    setActiveTicket(ticket);
    setMessages(db.getTicketMessages(ticket.id));
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    db.addTicketMessage(
      activeTicket.id,
      replyText,
      'Support Team (Kairoo)',
      'Tier-2 Specialist'
    );
    setMessages(db.getTicketMessages(activeTicket.id));
    setReplyText('');
    showToast('Reply dispatched to customer.');
  };

  const handleStatusChange = (ticket: Ticket, newStatus: Ticket['status']) => {
    db.saveTicket({ ...ticket, status: newStatus });
    loadData();
    if (activeTicket?.id === ticket.id) {
      setActiveTicket({ ...ticket, status: newStatus });
    }
    showToast(`Ticket status updated to ${newStatus}.`);
  };

  const handleDelete = (id: string) => {
    if (confirm(`Delete support ticket ${id}?`)) {
      db.deleteTicket(id);
      loadData();
      if (activeTicket?.id === id) setActiveTicket(null);
      showToast('Ticket deleted.');
    }
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject) return;

    const newTkt = db.saveTicket({
      subject,
      customerId: user?.id || 'cust_direct',
      customerName,
      description,
      category,
      priority,
      assignedTo,
    });

    if (description) {
      db.addTicketMessage(newTkt.id, description, customerName, 'Customer Request');
    }

    loadData();
    setNewModalOpen(false);
    showToast(`Ticket ${newTkt.id} created.`);
  };

  const roleScopedTickets = isClient
    ? tickets.filter((t) => t.customerId === user?.id || t.customerName === user?.name || t.customerName === user?.company)
    : tickets;

  const openCount = roleScopedTickets.filter((t) => t.status === 'Open').length;
  const inProgressCount = roleScopedTickets.filter((t) => t.status === 'In Progress').length;
  const resolvedCount = roleScopedTickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length;
  const criticalCount = roleScopedTickets.filter((t) => t.priority === 'Critical' || t.priority === 'High').length;

  const filtered = roleScopedTickets.filter((t) => {
    const matchSearch =
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      (t.customerName && t.customerName.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <WorkspaceLayout
      title="Support Tickets"
      subtitle="Helpdesk resolution queue, SLA tracking and customer response threads"
      actions={
        <button
          onClick={() => setNewModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#FAF6F0] bg-[#0D2218] hover:bg-[#163827] rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Ticket</span>
        </button>
      }
    >
      {toast && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <span>{toast}</span>
          <X className="w-4 h-4 cursor-pointer" onClick={() => setToast(null)} />
        </div>
      )}

      {/* Top Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-[#0D2218]/10 shadow-xs">
          <span className="text-[11px] font-semibold text-[#5C6862] block">Open Tickets</span>
          <span className="font-serif text-2xl font-bold text-amber-800">{openCount}</span>
          <span className="text-[10px] text-[#5C6862] block mt-0.5">Awaiting triage</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#0D2218]/10 shadow-xs">
          <span className="text-[11px] font-semibold text-[#5C6862] block">In Progress</span>
          <span className="font-serif text-2xl font-bold text-[#BA5D38]">{inProgressCount}</span>
          <span className="text-[10px] text-[#5C6862] block mt-0.5">Active engineering investigation</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#0D2218]/10 shadow-xs">
          <span className="text-[11px] font-semibold text-[#5C6862] block">Resolved / Closed</span>
          <span className="font-serif text-2xl font-bold text-emerald-800">{resolvedCount}</span>
          <span className="text-[10px] text-emerald-700 block mt-0.5">99.2% satisfaction rate</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#0D2218]/10 shadow-xs">
          <span className="text-[11px] font-semibold text-[#5C6862] block">High / Critical Priority</span>
          <span className="font-serif text-2xl font-bold text-red-700">{criticalCount}</span>
          <span className="text-[10px] text-red-600 block mt-0.5">SLA escalation target: &lt;2h</span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#0D2218]/10 mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#5C6862] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tickets by ID, subject, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF6F0] border border-[#0D2218]/10 rounded-xl text-[#0D2218] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#5C6862]">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#FAF6F0] border border-[#0D2218]/10 rounded-lg px-2 py-1 text-xs text-[#0D2218]"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Waiting for Customer">Waiting</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#5C6862]">
            <span>Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-[#FAF6F0] border border-[#0D2218]/10 rounded-lg px-2 py-1 text-xs text-[#0D2218]"
            >
              <option value="All">All</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-2xl border border-[#0D2218]/10 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#5C6862]">
            No support tickets match the current criteria.
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0] border-b border-[#0D2218]/10 text-[#5C6862] font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Subject & Description</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Specialist</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0D2218]/6">
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => handleOpenTicketThread(t)}
                  className="hover:bg-[#FAF6F0]/70 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0D2218]">
                    {t.id}
                  </td>

                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-bold text-[#0D2218]">{t.subject}</div>
                    <div className="text-[11px] text-[#5C6862] line-clamp-1 mt-0.5">
                      {t.description || 'No initial message'}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-[#2D3632]">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Building className="w-3 h-3 text-[#5C6862]" />
                      <span>{t.customerName || 'General Account'}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.priority === 'Critical'
                          ? 'bg-red-100 text-red-800'
                          : t.priority === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-50 text-blue-800'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === 'Resolved' || t.status === 'Closed'
                          ? 'bg-emerald-50 text-emerald-800'
                          : t.status === 'In Progress'
                          ? 'bg-blue-50 text-blue-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-[#2D3632]">
                    {t.assignedTo}
                  </td>

                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenTicketThread(t)}
                        className="p-1.5 text-[#5C6862] hover:text-[#0D2218] rounded-lg"
                        title="View conversation"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-1.5 text-[#5C6862] hover:text-red-700 rounded-lg"
                        title="Delete ticket"
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

      {/* Ticket Conversation Thread Modal / Drawer */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 bg-[#FAF6F0] border-b border-[#0D2218]/10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#0D2218] bg-white px-2 py-0.5 rounded border border-[#0D2218]/10">
                    {activeTicket.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      activeTicket.priority === 'Critical'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {activeTicket.priority} Priority
                  </span>
                </div>
                <h3 className="font-serif text-base font-bold text-[#0D2218] mt-1">
                  {activeTicket.subject}
                </h3>
                <p className="text-xs text-[#5C6862]">Customer: {activeTicket.customerName}</p>
              </div>

              <button
                onClick={() => setActiveTicket(null)}
                className="p-1 text-[#5C6862] hover:text-[#0D2218]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="px-4 py-2 bg-[#F4EFE6] border-b border-[#0D2218]/8 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[#5C6862]">Change Status:</span>
                <select
                  value={activeTicket.status}
                  onChange={(e) => handleStatusChange(activeTicket, e.target.value as any)}
                  className="bg-white border border-[#0D2218]/10 rounded-lg px-2 py-0.5 text-xs text-[#0D2218]"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Waiting for Customer">Waiting for Customer</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <span className="text-[#5C6862]">Assigned to: {activeTicket.assignedTo}</span>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FCFBF8]">
              {messages.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#5C6862]">
                  No message history recorded on this ticket yet.
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-3.5 rounded-2xl max-w-[85%] text-xs ${
                      m.authorRole.includes('Specialist') || m.authorRole.includes('Support')
                        ? 'ml-auto bg-[#0D2218] text-[#FAF6F0]'
                        : 'mr-auto bg-white border border-[#0D2218]/10 text-[#0D2218] shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-1 text-[10px] opacity-75">
                      <span className="font-bold">{m.authorName} ({m.authorRole})</span>
                      <span className="font-mono">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap">{m.message}</p>
                  </div>
                ))
              )}
            </div>

            {/* Reply Input Bar */}
            <form onSubmit={handleSendReply} className="p-3 bg-white border-t border-[#0D2218]/10 flex gap-2">
              <input
                type="text"
                placeholder="Type response to customer..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs bg-[#FAF6F0] border border-[#0D2218]/10 rounded-xl text-[#0D2218] focus:outline-none focus:ring-2 focus:ring-[#0D2218]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#0D2218] text-[#FAF6F0] rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-[#163827]"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FAF6F0] rounded-2xl border border-[#0D2218]/15 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in">
            <div className="p-4 bg-white border-b border-[#0D2218]/10 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#0D2218]">
                Create Support Ticket
              </h3>
              <button onClick={() => setNewModalOpen(false)} className="p-1 text-[#5C6862]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Inbound API Webhook latency escalation"
                  className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Customer / Organization *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Billing">Billing</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Assign Specialist</label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Initial Issue Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Paste error logs, repro steps, impact description..."
                  className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                />
              </div>

              <div className="pt-3 border-t border-[#0D2218]/10 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0D2218] text-[#FAF6F0] rounded-xl font-semibold hover:bg-[#163827]"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </WorkspaceLayout>
  );
};
export default TicketsPage;
