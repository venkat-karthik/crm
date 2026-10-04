import React, { useState, useEffect } from 'react';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { db, User } from '../services/db';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  Search,
  UserCheck,
  Shield,
  Trash2,
  Edit2,
  Mail,
  Building,
  CheckCircle,
  XCircle,
  X,
  KeyRound,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Briefcase,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { Organization } from '../services/db';

const ROLES: User['role'][] = [
  'Founder',
  'Manager',
  'Employee',
  'Sales Employee',
  'Support Employee',
  'Client',
  'Admin',
];

export const UsersPage: React.FC = () => {
  const { user: currentUser, updateUserRole } = useAuth();
  const [users, setUsers] = useState<User[]>(db.getUsers());
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [toast, setToast] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const isFounderOrManager = currentUser?.role === 'Founder' || currentUser?.role === 'Manager' || currentUser?.role === 'Admin' || currentUser?.role === 'Owner';

  let org: Organization | null = null;
  if (currentUser?.organizationId) {
    org = db.getOrganization(currentUser.organizationId);
  }
  if (!org && currentUser?.tenantId) {
    org = db.getOrganization(currentUser.tenantId);
  }
  if (!org && currentUser && isFounderOrManager) {
    org = db.createOrganizationWithCodes({
      name: currentUser.company || `${currentUser.name}'s Organization`,
      founderId: currentUser.id,
      founderName: currentUser.name,
      founderEmail: currentUser.email,
      crmType: currentUser.crmCustomization?.crmType || 'hybrid',
      collaborationMode: currentUser.crmCustomization?.collaborationMode || 'both',
      plan: currentUser.plan || 'growth',
    });
  }

  const employeeCode = org?.employeeInviteCode || `EMP-${currentUser?.company?.slice(0, 3).toUpperCase() || 'KAI'}-4921`;
  const clientCode = org?.clientInviteCode || `CLT-${currentUser?.company?.slice(0, 3).toUpperCase() || 'KAI'}-8172`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleRegenerate = (type: 'employee' | 'client') => {
    if (org && confirm(`Regenerate ${type} invite code? Previous codes will no longer function.`)) {
      db.regenerateInviteCode(org.id, type);
      setToast(`${type.toUpperCase()} invite code regenerated.`);
      setCopiedType(`regen_${type}`);
      setTimeout(() => setCopiedType(null), 2000);
    }
  };

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<User['role']>('Sales Employee');
  const [department, setDepartment] = useState('Sales & Inbound');
  const [company, setCompany] = useState('Kairoo Enterprise');

  const loadData = () => {
    setUsers(db.getUsers());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setRole('Sales Employee');
    setDepartment('Sales & Inbound');
    setCompany('Kairoo Enterprise');
    setModalOpen(true);
  };

  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setRole(u.role);
    setDepartment(u.department || 'General');
    setCompany(u.company || 'Kairoo Enterprise');
    setModalOpen(true);
  };

  const handleDelete = (id: string, userName: string) => {
    if (id === currentUser?.id) {
      alert('You cannot delete your own currently active account.');
      return;
    }
    if (confirm(`Remove user "${userName}" from organization?`)) {
      db.deleteUser(id);
      loadData();
      showToast(`User ${userName} removed.`);
    }
  };

  const handleToggleStatus = (u: User) => {
    const nextStatus: User['status'] = u.status === 'Active' ? 'Disabled' : 'Active';
    db.saveUser({ ...u, status: nextStatus });
    loadData();
    showToast(`User account status set to ${nextStatus}.`);
  };

  const handleRoleChange = (u: User, newRole: User['role']) => {
    updateUserRole(u.id, newRole);
    loadData();
    showToast(`Role for ${u.name} updated to ${newRole}.`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    db.saveUser({
      id: editingUser?.id,
      name,
      email,
      role,
      department,
      company,
    });

    loadData();
    setModalOpen(false);
    showToast(editingUser ? 'User details updated.' : 'New team member provisioned.');
  };

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.department && u.department.toLowerCase().includes(search.toLowerCase()));
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  if (!isFounderOrManager) {
    return (
      <WorkspaceLayout
        title="Access Restricted"
        subtitle="Team and member management is reserved for Founders and Managers"
      >
        <div className="bg-white p-8 rounded-3xl border border-[#0D2218]/10 text-center max-w-lg mx-auto my-12 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-extrabold text-[#0D2218]">Executive Permission Required</h3>
          <p className="text-xs text-[#5C6862] mt-2 leading-relaxed">
            Team user management and invitation codes are strictly confidential and visible only to the organization Founder or Manager.
          </p>
        </div>
      </WorkspaceLayout>
    );
  }

  return (
    <WorkspaceLayout
      title="Team Members & Organization Invites"
      subtitle={`Manage executive leaders, team employees, and clients for ${currentUser?.company || 'your organization'}`}
      actions={
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#FAF6F0] bg-[#0D2218] hover:bg-[#163827] rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      }
    >
      {toast && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <span>{toast}</span>
          <X className="w-4 h-4 cursor-pointer" onClick={() => setToast(null)} />
        </div>
      )}

      {/* FOUNDER & MANAGER INVITE CENTER BANNER */}
      <div className="bg-gradient-to-r from-[#0D2218] to-[#173829] text-[#FAF6F0] p-6 sm:p-7 rounded-3xl shadow-md mb-6 border border-[#0D2218]/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#BA5D38] text-white mb-2">
              <KeyRound className="w-3.5 h-3.5" />
              Confidential Invite Codes Hub
            </div>
            <h2 className="text-2xl font-extrabold text-[#FAF6F0]">
              Invite Team Employees & Agency Clients
            </h2>
            <p className="text-xs text-[#FAF6F0]/80 mt-1 max-w-xl">
              These codes are only visible to your Founder/Manager profile. Employees access only their assigned tasks and progress; clients access only their project deliverables and milestone portal.
            </p>
          </div>

          <div className="text-xs text-right hidden lg:block text-[#C5A059] font-mono">
            {org?.name || currentUser?.company} · {org?.plan?.toUpperCase() || 'GROWTH'}
          </div>
        </div>

        {/* 2 Code Cards: Employee Code & Client Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {/* Card 1: Employee Code */}
          <div className="bg-white/10 p-4 rounded-2xl border border-white/15 backdrop-blur-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#FAF6F0]">
                    Employee Invite Code
                  </span>
                </div>
                <button
                  onClick={() => handleRegenerate('employee')}
                  title="Regenerate Employee Code"
                  className="p-1 text-[#FAF6F0]/70 hover:text-white rounded hover:bg-white/10"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-[#FAF6F0]/70 leading-relaxed mb-3">
                Share with team employees. They will only see their assigned tasks, deals, and productivity metrics — no executive financials.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 bg-black/40 border border-white/20 px-3 py-2 rounded-xl font-mono text-sm font-extrabold text-[#C5A059] tracking-widest text-center select-all">
                {employeeCode}
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(employeeCode, 'emp')}
                className="px-3.5 py-2 bg-[#FAF6F0] hover:bg-white text-[#0D2218] text-xs font-extrabold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              >
                {copiedType === 'emp' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'emp' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Card 2: Client Code */}
          <div className="bg-white/10 p-4 rounded-2xl border border-white/15 backdrop-blur-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#BA5D38]/30 text-[#BA5D38] flex items-center justify-center">
                    <UserCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#FAF6F0]">
                    Client Portal Code
                  </span>
                </div>
                <button
                  onClick={() => handleRegenerate('client')}
                  title="Regenerate Client Code"
                  className="p-1 text-[#FAF6F0]/70 hover:text-white rounded hover:bg-white/10"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-[#FAF6F0]/70 leading-relaxed mb-3">
                Share with agency clients. They will only see their live project deliverables, milestone status, and support ticket desk.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 bg-black/40 border border-white/20 px-3 py-2 rounded-xl font-mono text-sm font-extrabold text-[#C5A059] tracking-widest text-center select-all">
                {clientCode}
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(clientCode, 'clt')}
                className="px-3.5 py-2 bg-[#FAF6F0] hover:bg-white text-[#0D2218] text-xs font-extrabold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              >
                {copiedType === 'clt' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'clt' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#0D2218]/10 mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#5C6862] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF6F0] border border-[#0D2218]/10 rounded-xl text-[#0D2218] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#5C6862]">Role Tier:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#FAF6F0] border border-[#0D2218]/10 rounded-lg px-2.5 py-1 text-xs text-[#0D2218]"
          >
            <option value="All">All Roles ({users.length})</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#0D2218]/10 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#FAF6F0] border-b border-[#0D2218]/10 text-[#5C6862] font-semibold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Member Name</th>
              <th className="py-3 px-4">Work Email</th>
              <th className="py-3 px-4">Assigned Role</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0D2218]/6">
            {filtered.map((u) => {
              const isCurrent = u.id === currentUser?.id;
              return (
                <tr key={u.id} className="hover:bg-[#FAF6F0]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#0D2218] text-[#FAF6F0] flex items-center justify-center font-bold text-xs">
                        {u.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-[#0D2218] flex items-center gap-1.5">
                          <span>{u.name}</span>
                          {isCurrent && (
                            <span className="text-[9px] bg-[#C5A059]/20 text-[#8F6C26] px-1.5 py-0.2 rounded font-mono font-bold">
                              YOU
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#5C6862]">{u.company}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-[#2D3632]">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-[#5C6862]" />
                      <span>{u.email}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u, e.target.value as any)}
                      className={`text-xs font-semibold px-2 py-1 rounded-lg border ${
                        u.role === 'Admin'
                          ? 'bg-[#0D2218] text-[#FAF6F0] border-[#0D2218]'
                          : u.role === 'Manager'
                          ? 'bg-[#C5A059]/20 text-[#8F6C26] border-[#C5A059]/40'
                          : 'bg-[#FAF6F0] text-[#0D2218] border-[#0D2218]/15'
                      }`}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-[#2D3632] font-medium">
                    {u.department || 'Operations'}
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleStatus(u)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                        u.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-red-50 text-red-800 border border-red-200 hover:bg-red-100'
                      }`}
                    >
                      {u.status === 'Active' ? (
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-600" />
                      )}
                      <span>{u.status}</span>
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="p-1.5 text-[#5C6862] hover:text-[#0D2218] rounded-lg"
                        title="Edit member"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {!isCurrent && (
                        <button
                          onClick={() => handleDelete(u.id, u.name)}
                          className="p-1.5 text-[#5C6862] hover:text-red-700 rounded-lg"
                          title="Remove member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FAF6F0] rounded-2xl border border-[#0D2218]/15 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in">
            <div className="p-4 bg-white border-b border-[#0D2218]/10 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#0D2218]">
                {editingUser ? 'Edit Member Information' : 'Add Team Member'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-[#5C6862]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vikram@company.com"
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Security Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Inbound Sales"
                    className="w-full px-3 py-2 bg-white border border-[#0D2218]/15 rounded-xl text-[#0D2218]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Company / Branch</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
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
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </WorkspaceLayout>
  );
};
export default UsersPage;
