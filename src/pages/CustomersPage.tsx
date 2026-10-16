import React, { useState, useEffect } from 'react';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { db, Customer } from '../services/db';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Mail,
  Phone,
  Building,
  Check,
  X,
  UserCheck,
  Award,
  Users,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export const CustomersPage: React.FC = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>(db.getCustomers());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt'>('name');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formSource, setFormSource] = useState('Website');
  const [formStatus, setFormStatus] = useState<Customer['status']>('Active');
  const [formAssigned, setFormAssigned] = useState(user?.name || 'Account Lead');
  const [formNotes, setFormNotes] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = () => {
    setCustomers(db.getCustomers());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormCompany('');
    setFormSource('Website');
    setFormStatus('Active');
    setFormAssigned(user?.name || 'Account Lead');
    setFormNotes('');
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Customer) => {
    setEditingCustomer(c);
    setFormName(c.name);
    setFormEmail(c.email);
    setFormPhone(c.phone);
    setFormCompany(c.company);
    setFormSource(c.source);
    setFormStatus(c.status);
    setFormAssigned(c.assignedEmployee);
    setFormNotes(c.notes);
    setModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete customer "${name}"?`)) {
      db.deleteCustomer(id);
      loadData();
      showToast(`Customer "${name}" deleted.`);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;

    db.saveCustomer({
      id: editingCustomer?.id,
      name: formName,
      email: formEmail,
      phone: formPhone,
      company: formCompany || formName,
      source: formSource,
      status: formStatus,
      assignedEmployee: formAssigned,
      notes: formNotes,
    });

    loadData();
    setModalOpen(false);
    showToast(editingCustomer ? 'Customer updated successfully.' : 'New customer created successfully.');
  };

  const isClient = user?.role === 'Client';
  const roleScopedCustomers = isClient
    ? customers.filter((c) => c.email === user?.email || c.name === user?.name || c.company === user?.company)
    : customers;

  // Filter & Search Logic
  const filtered = roleScopedCustomers
    .filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.company.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const clientsLabel = user?.crmCustomization?.clientsLabel || 'Clients';
  const singularClient = clientsLabel.endsWith('s') ? clientsLabel.slice(0, -1) : clientsLabel;

  // Visual Portfolio Metrics
  const totalCount = customers.length;
  const vipCount = customers.filter((c) => c.status === 'VIP').length;
  const activeCount = customers.filter((c) => c.status === 'Active').length;
  const leadCount = customers.filter((c) => c.status === 'Lead').length;
  const churnedCount = customers.filter((c) => c.status === 'Churned').length;

  const vipPct = totalCount ? Math.round((vipCount / totalCount) * 100) : 0;
  const activePct = totalCount ? Math.round((activeCount / totalCount) * 100) : 0;
  const leadPct = totalCount ? Math.round((leadCount / totalCount) * 100) : 0;
  const churnedPct = totalCount ? Math.round((churnedCount / totalCount) * 100) : 0;

  return (
    <WorkspaceLayout
      title={`${clientsLabel} Directory`}
      subtitle={`Manage your persistent ${clientsLabel.toLowerCase()} relationships and company account records`}
      actions={
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#FAF6F0] bg-[#0D2218] hover:bg-[#163827] rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add {singularClient}</span>
        </button>
      }
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <span>{toastMessage}</span>
          <X className="w-4 h-4 cursor-pointer" onClick={() => setToastMessage(null)} />
        </div>
      )}

      {/* Visual Portfolio Health Cards with Interactive Status Filtering */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
        {[
          { label: 'All Accounts', count: totalCount, filter: 'All', color: 'text-[#0D2218]', bg: 'bg-[#0D2218]/5', icon: Users, sub: 'total records' },
          { label: 'Active Retainers', count: activeCount, filter: 'Active', color: 'text-emerald-800', bg: 'bg-emerald-50', icon: TrendingUp, sub: `${activePct}% portfolio` },
          { label: 'VIP Accounts', count: vipCount, filter: 'VIP', color: 'text-[#8F6C26]', bg: 'bg-[#C5A059]/15', icon: Award, sub: `${vipPct}% enterprise` },
          { label: 'Prospect Leads', count: leadCount, filter: 'Lead', color: 'text-[#BA5D38]', bg: 'bg-[#BA5D38]/10', icon: Sparkles, sub: `${leadPct}% in-funnel` },
        ].map((card, idx) => {
          const Icon = card.icon;
          const isSelected = statusFilter === card.filter;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.04 }}
              onClick={() => setStatusFilter(card.filter)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#0D2218] shadow-md ring-2 ring-[#0D2218]/10'
                  : 'bg-white border-[#0D2218]/10 hover:border-[#0D2218]/30 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold text-[#5C6862]">{card.label}</span>
                <div className={`w-6 h-6 rounded-lg ${card.bg} ${card.color} flex items-center justify-center`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className={`text-2xl font-bold font-serif tabular-nums ${card.color}`}>
                  {card.count}
                </span>
                <span className="text-[10px] text-[#5C6862] font-semibold">{card.sub}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Visual Proportional Segment Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#0D2218]/10 shadow-xs mb-6">
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="text-[#0D2218] flex items-center gap-1.5 font-bold">
            <span>Portfolio Health & Segmentation</span>
            <span className="text-[10px] text-[#5C6862] font-normal">({totalCount} relationships)</span>
          </span>
          <span className="text-[11px] text-[#5C6862] font-mono">
            {vipCount + activeCount} healthy accounts
          </span>
        </div>

        {/* Visual Segmented Stacked Progress Bar */}
        <div className="w-full h-3 bg-[#FAF6F0] rounded-full overflow-hidden flex border border-[#0D2218]/8">
          {activePct > 0 && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${activePct}%` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="h-full bg-emerald-600"
              title={`Active: ${activeCount} (${activePct}%)`}
            />
          )}
          {vipPct > 0 && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${vipPct}%` }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.05 }}
              className="h-full bg-[#C5A059]"
              title={`VIP: ${vipCount} (${vipPct}%)`}
            />
          )}
          {leadPct > 0 && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${leadPct}%` }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
              className="h-full bg-[#BA5D38]"
              title={`Lead: ${leadCount} (${leadPct}%)`}
            />
          )}
          {churnedPct > 0 && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${churnedPct}%` }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
              className="h-full bg-gray-400"
              title={`Churned: ${churnedCount} (${churnedPct}%)`}
            />
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-2.5 text-[11px] text-[#5C6862]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            Active ({activeCount})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
            VIP ({vipCount})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#BA5D38]" />
            Prospect Leads ({leadCount})
          </span>
          {churnedCount > 0 && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              Churned ({churnedCount})
            </span>
          )}
        </div>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#0D2218]/10 mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#5C6862] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, company, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF6F0] border border-[#0D2218]/10 rounded-xl text-[#0D2218] focus:outline-none focus:ring-2 focus:ring-[#0D2218]"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-[#5C6862]">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#FAF6F0] border border-[#0D2218]/10 rounded-lg px-2 py-1 text-xs text-[#0D2218]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="VIP">VIP</option>
              <option value="Lead">Lead</option>
              <option value="Churned">Churned</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#5C6862]">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#FAF6F0] border border-[#0D2218]/10 rounded-lg px-2 py-1 text-xs text-[#0D2218]"
            >
              <option value="name">Name (A-Z)</option>
              <option value="createdAt">Date Created</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl border border-[#0D2218]/10 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <UserCheck className="w-10 h-10 text-[#5C6862] mx-auto mb-2 opacity-50" />
            <h4 className="text-sm font-bold text-[#0D2218]">No customers found</h4>
            <p className="text-xs text-[#5C6862] mt-1 max-w-sm mx-auto">
              {search || statusFilter !== 'All'
                ? 'Try adjusting your search criteria or status filter.'
                : 'Get started by creating your first persistent customer profile.'}
            </p>
            <button
              onClick={handleOpenAdd}
              className="mt-4 px-4 py-2 bg-[#0D2218] text-[#FAF6F0] text-xs font-semibold rounded-xl"
            >
              Add Customer Now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF6F0] border-b border-[#0D2218]/10 text-[#5C6862] font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Customer / Company</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Rep</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0D2218]/6">
                {filtered.map((c, idx) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18, delay: Math.min(idx * 0.03, 0.3) }}
                    className="hover:bg-[#FAF6F0]/80 transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#0D2218] group-hover:text-[#BA5D38] transition-colors">{c.name}</div>
                      <div className="text-[11px] text-[#5C6862] flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3 text-[#5C6862]" />
                        <span>{c.company}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[#2D3632]">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-[#5C6862]" />
                        <span className="font-mono text-xs">{c.email}</span>
                      </div>
                      {c.phone && (
                        <div className="flex items-center gap-1.5 text-[11px] text-[#5C6862] mt-0.5">
                          <Phone className="w-3 h-3 text-[#5C6862]" />
                          <span>{c.phone}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          c.status === 'VIP'
                            ? 'bg-[#C5A059]/15 text-[#8F6C26] border border-[#C5A059]/30'
                            : c.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : c.status === 'Lead'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[#2D3632] font-medium">
                      {c.assignedEmployee}
                    </td>

                    <td className="py-3.5 px-4 text-[#5C6862]">
                      {c.source}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 text-[#5C6862] hover:text-[#0D2218] hover:bg-[#FAF6F0] rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.name)}
                          className="p-1.5 text-[#5C6862] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Customer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FAF6F0] rounded-2xl border border-[#0D2218]/15 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in">
            <div className="p-4 bg-white border-b border-[#0D2218]/10 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#0D2218]">
                {editingCustomer ? `Edit ${singularClient}` : `Add New ${singularClient}`}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-[#5C6862] hover:text-[#0D2218]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0D2218] mb-1">
                    {singularClient} Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218] focus:outline-none focus:ring-2 focus:ring-[#0D2218]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0D2218] mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="contact@acme.com"
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218] focus:outline-none focus:ring-2 focus:ring-[#0D2218]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0D2218] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218] focus:outline-none focus:ring-2 focus:ring-[#0D2218]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0D2218] mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    placeholder="Acme Global Inc"
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218] focus:outline-none focus:ring-2 focus:ring-[#0D2218]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#0D2218] mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218] focus:outline-none focus:ring-2 focus:ring-[#0D2218]"
                  >
                    <option value="Active">Active</option>
                    <option value="VIP">VIP</option>
                    <option value="Lead">Lead</option>
                    <option value="Churned">Churned</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#0D2218] mb-1">Source</label>
                  <input
                    type="text"
                    value={formSource}
                    onChange={(e) => setFormSource(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0D2218] mb-1">Assigned Rep</label>
                  <input
                    type="text"
                    value={formAssigned}
                    onChange={(e) => setFormAssigned(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0D2218] mb-1">Notes / Relationship Details</label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Key account details, commercial history, preferences..."
                  className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                />
              </div>

              <div className="pt-3 border-t border-[#0D2218]/10 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#0D2218]/15 text-[#0D2218] rounded-xl hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0D2218] text-[#FAF6F0] rounded-xl font-semibold hover:bg-[#163827]"
                >
                  {editingCustomer ? 'Update Customer' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </WorkspaceLayout>
  );
};
