import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Copy,
  Check,
  RotateCcw,
  Users,
  ShieldCheck,
  Building,
  UserCheck,
  ExternalLink,
  Sparkles,
  Briefcase,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db, Organization, User } from '../services/db';

interface InviteManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteManagerModal: React.FC<InviteManagerModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  // Find or create current user's organization
  let org: Organization | null = null;
  if (user?.organizationId) {
    org = db.getOrganization(user.organizationId);
  }
  if (!org && user?.tenantId) {
    org = db.getOrganization(user.tenantId);
  }
  if (!org && user) {
    // Generate an organization if not explicitly initialized
    org = db.createOrganizationWithCodes({
      name: user.company || `${user.name}'s Agency`,
      founderId: user.id,
      founderName: user.name,
      founderEmail: user.email,
      crmType: user.crmCustomization?.crmType || 'hybrid',
      collaborationMode: user.crmCustomization?.collaborationMode || 'both',
      plan: user.plan || 'growth',
    });
  }

  const employeeCode = org?.employeeInviteCode || `EMP-${user?.company?.slice(0, 3).toUpperCase() || 'KAI'}-4921`;
  const clientCode = org?.clientInviteCode || `CLT-${user?.company?.slice(0, 3).toUpperCase() || 'KAI'}-8172`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleRegenerate = (type: 'employee' | 'client') => {
    if (org && confirm(`Are you sure you want to regenerate the ${type} invite code? Previous codes will no longer work.`)) {
      db.regenerateInviteCode(org.id, type);
      // force update by triggering local refresh
      setCopiedType(`regen_${type}`);
      setTimeout(() => setCopiedType(null), 2000);
    }
  };

  // Get joined members
  const allUsers = db.getUsers();
  const joinedMembers = allUsers.filter(
    (u) => u.tenantId === user?.tenantId && u.id !== user?.id
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl shadow-2xl border border-[#0D2218]/15 max-w-2xl w-full overflow-hidden relative"
      >
        {/* Header */}
        <div className="bg-[#0D2218] text-[#FAF6F0] p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#FAF6F0]/70 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#BA5D38] text-white">
              <ShieldCheck className="w-3.5 h-3.5" />
              Founder & Manager Access Hub
            </span>
            <span className="text-xs text-[#FAF6F0]/70 font-mono">Confidential Security Codes</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Invite Team Employees & Clients
          </h2>
          <p className="text-xs sm:text-sm text-[#FAF6F0]/80 mt-1 max-w-lg">
            Share secure organization codes to invite employees into their progress dashboard, or clients into their project milestone portal.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* 1. Employee Invite Code */}
          <div className="p-5 rounded-2xl bg-[#FAF6F0] border border-[#0D2218]/12 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#0D2218] text-white flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#0D2218]">
                    Internal Team & Employee Invite Code
                  </h4>
                  <p className="text-[11px] text-[#5C6862]">
                    Grants access to tasks, assigned leads, calls, and individual performance tracker.
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleRegenerate('employee')}
                title="Regenerate Code"
                className="p-1.5 text-[#5C6862] hover:text-[#0D2218] hover:bg-white rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <div className="w-full sm:flex-1 bg-white border border-[#0D2218]/15 px-3.5 py-2.5 rounded-xl font-mono text-base font-extrabold text-[#0D2218] tracking-widest text-center sm:text-left select-all">
                {employeeCode}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => copyToClipboard(employeeCode, 'emp_code')}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-[#0D2218] hover:bg-[#163827] text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                >
                  {copiedType === 'emp_code' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const url = `${window.location.origin}/signup?code=${employeeCode}`;
                    copyToClipboard(url, 'emp_link');
                  }}
                  className="flex-1 sm:flex-none px-3.5 py-2.5 bg-white border border-[#0D2218]/15 hover:bg-gray-50 text-xs font-bold text-[#0D2218] rounded-xl flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                  title="Copy direct registration link"
                >
                  {copiedType === 'emp_link' ? (
                    <span className="text-emerald-700">Link Copied!</span>
                  ) : (
                    <>
                      <ExternalLink className="w-3.5 h-3.5 text-[#BA5D38]" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 2. Client / Customer Invite Code */}
          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#BA5D38] text-white flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#0D2218]">
                    Client / Customer Portal Invite Code
                  </h4>
                  <p className="text-[11px] text-[#5C6862]">
                    Grants clients access to their live project milestones, ticket support, and progress updates.
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleRegenerate('client')}
                title="Regenerate Code"
                className="p-1.5 text-[#5C6862] hover:text-[#0D2218] hover:bg-white rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <div className="w-full sm:flex-1 bg-white border border-amber-300/80 px-3.5 py-2.5 rounded-xl font-mono text-base font-extrabold text-[#0D2218] tracking-widest text-center sm:text-left select-all">
                {clientCode}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => copyToClipboard(clientCode, 'clt_code')}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-[#BA5D38] hover:bg-[#a34f2d] text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                >
                  {copiedType === 'clt_code' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const url = `${window.location.origin}/signup?code=${clientCode}`;
                    copyToClipboard(url, 'clt_link');
                  }}
                  className="flex-1 sm:flex-none px-3.5 py-2.5 bg-white border border-amber-300 hover:bg-amber-100/50 text-xs font-bold text-[#0D2218] rounded-xl flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                  title="Copy direct registration link for client"
                >
                  {copiedType === 'clt_link' ? (
                    <span className="text-emerald-700">Link Copied!</span>
                  ) : (
                    <>
                      <ExternalLink className="w-3.5 h-3.5 text-[#BA5D38]" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Joined Members List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase tracking-wider text-[#5C6862]">
                Active Joined Members & Clients ({joinedMembers.length})
              </span>
              <span className="text-[11px] text-[#5C6862]">
                Organization: <strong className="text-[#0D2218]">{org?.name || user?.company}</strong>
              </span>
            </div>

            {joinedMembers.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#FAF6F0] border border-dashed border-[#0D2218]/15 text-center text-xs text-[#5C6862]">
                No employees or clients have registered with your invite codes yet. Share the code or registration link above to start onboarding!
              </div>
            ) : (
              <div className="max-h-40 overflow-y-auto divide-y divide-[#0D2218]/10 rounded-2xl border border-[#0D2218]/10 bg-white">
                {joinedMembers.map((m) => (
                  <div key={m.id} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-extrabold text-[#0D2218] block">{m.name}</span>
                      <span className="text-[11px] text-[#5C6862]">{m.email}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      m.role === 'Client' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
                    }`}>
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Close */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-[#0D2218] hover:bg-[#163827] text-white text-xs font-extrabold rounded-xl shadow-xs cursor-pointer"
            >
              Done & Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
