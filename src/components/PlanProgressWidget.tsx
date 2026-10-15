import React from 'react';
import { Zap, Users, Target, Database, Sparkles, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePlanAccess } from '../hooks/usePlanAccess';
import { SAAS_PLANS, PlanTier } from '../services/razorpay';
import { db } from '../services/db';

interface PlanProgressWidgetProps {
  variant?: 'sidebar' | 'card' | 'detailed';
  onOpenUpgrade?: () => void;
}

export const PlanProgressWidget: React.FC<PlanProgressWidgetProps> = ({
  variant = 'card',
  onOpenUpgrade,
}) => {
  const { user } = useAuth();
  const { currentPlan, planInfo } = usePlanAccess();

  // Calculate live organization usage
  const customers = db.getCustomers();
  const leads = db.getLeads();
  const users = db.getUsers();
  const cloudinaryAssets = (() => {
    try {
      const raw = localStorage.getItem('kairoo_cloudinary_assets');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  })();

  const contactsUsed = customers.length + leads.length;
  const maxContacts = planInfo.maxContacts;

  const seatsUsed = Math.max(1, users.length);
  const maxSeats = planInfo.maxSeats;

  // Approximate storage calculation
  const storageUsedMB = Math.round(15 + cloudinaryAssets.length * 2.5);
  const maxStorageMB =
    currentPlan === 'free'
      ? 100
      : currentPlan === 'basic' || currentPlan === 'starter'
      ? 1000
      : currentPlan === 'standard' || currentPlan === 'growth'
      ? 15000
      : Infinity;

  // Percentage calculations
  const contactsPct =
    maxContacts === 'Unlimited' ? 0 : Math.min(100, Math.round((contactsUsed / Number(maxContacts)) * 100));
  const seatsPct =
    maxSeats === 'Unlimited' ? 0 : Math.min(100, Math.round((seatsUsed / Number(maxSeats)) * 100));
  const storagePct =
    maxStorageMB === Infinity ? 0 : Math.min(100, Math.round((storageUsedMB / maxStorageMB) * 100));

  const getProgressColor = (pct: number) => {
    if (pct >= 90) return 'bg-red-500';
    if (pct >= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  if (variant === 'sidebar') {
    return (
      <div className="bg-white/90 rounded-2xl p-3 border border-[#0D2218]/10 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#C5A059] fill-current" />
            <span className="text-xs font-extrabold text-[#0D2218] capitalize">{planInfo.name}</span>
          </div>
          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-[#BA5D38]/10 text-[#BA5D38] uppercase">
            Plan Quota
          </span>
        </div>

        {/* Contacts Usage Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-semibold text-[#5C6862]">
            <span>Contacts & Leads</span>
            <span>
              {contactsUsed} / {maxContacts === 'Unlimited' ? '∞' : maxContacts}
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#0D2218]/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                maxContacts === 'Unlimited' ? 'bg-[#0D2218] w-full' : getProgressColor(contactsPct)
              }`}
              style={{ width: maxContacts === 'Unlimited' ? '100%' : `${Math.max(5, contactsPct)}%` }}
            />
          </div>
        </div>

        {/* Team Seats Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-semibold text-[#5C6862]">
            <span>Team Seats</span>
            <span>
              {seatsUsed} / {maxSeats === 'Unlimited' ? '∞' : maxSeats}
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#0D2218]/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                maxSeats === 'Unlimited' ? 'bg-[#0D2218] w-full' : getProgressColor(seatsPct)
              }`}
              style={{ width: maxSeats === 'Unlimited' ? '100%' : `${Math.max(5, seatsPct)}%` }}
            />
          </div>
        </div>

        {onOpenUpgrade && (
          <button
            type="button"
            onClick={onOpenUpgrade}
            className="w-full mt-1 py-1.5 px-2.5 bg-[#0D2218] hover:bg-[#163827] text-white text-[11px] font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-[#C5A059]" />
            <span>{currentPlan === 'enterprise' || currentPlan === 'premium' ? 'Billing Details' : 'Upgrade Limits'}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#0D2218]/10 shadow-sm relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#0D2218]/8">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[#0D2218] text-[#C5A059]">
              <Zap className="w-4 h-4 fill-current" />
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0D2218]">
              Plan Quota & Usage Progress
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#BA5D38]/10 text-[#BA5D38] border border-[#BA5D38]/20 capitalize">
              {planInfo.name}
            </span>
          </div>
          <p className="text-xs text-[#5C6862] mt-1">
            Real-time tracking of contacts, team seats, and storage quotas allocated to your workspace.
          </p>
        </div>

        {onOpenUpgrade && (
          <button
            type="button"
            onClick={onOpenUpgrade}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0D2218] hover:bg-[#163827] text-[#FAF6F0] text-xs font-extrabold rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{currentPlan === 'enterprise' || currentPlan === 'premium' ? 'Manage Plan' : 'Upgrade Plan'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
        {/* Metric 1: Contacts */}
        <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#0D2218]/8 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#BA5D38]" />
              <span className="text-xs font-extrabold text-[#0D2218]">Contacts & Leads</span>
            </div>
            <span className="text-xs font-mono font-bold text-[#0D2218]">
              {contactsUsed} / {maxContacts === 'Unlimited' ? 'Unlimited' : maxContacts.toLocaleString()}
            </span>
          </div>

          <div className="h-2 w-full bg-[#0D2218]/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                maxContacts === 'Unlimited' ? 'bg-[#0D2218]' : getProgressColor(contactsPct)
              }`}
              style={{ width: maxContacts === 'Unlimited' ? '100%' : `${Math.max(4, contactsPct)}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-[#5C6862]">
            <span>
              {maxContacts === 'Unlimited' ? 'Unlimited capacity' : `${contactsPct}% capacity used`}
            </span>
            {maxContacts !== 'Unlimited' && (
              <span className="font-semibold text-[#0D2218]">
                {Math.max(0, Number(maxContacts) - contactsUsed)} remaining
              </span>
            )}
          </div>
        </div>

        {/* Metric 2: Team Seats */}
        <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#0D2218]/8 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#3448C5]" />
              <span className="text-xs font-extrabold text-[#0D2218]">Team User Seats</span>
            </div>
            <span className="text-xs font-mono font-bold text-[#0D2218]">
              {seatsUsed} / {maxSeats === 'Unlimited' ? 'Unlimited' : maxSeats}
            </span>
          </div>

          <div className="h-2 w-full bg-[#0D2218]/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                maxSeats === 'Unlimited' ? 'bg-[#0D2218]' : getProgressColor(seatsPct)
              }`}
              style={{ width: maxSeats === 'Unlimited' ? '100%' : `${Math.max(8, seatsPct)}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-[#5C6862]">
            <span>
              {maxSeats === 'Unlimited' ? 'Unlimited team seats' : `${seatsPct}% seats active`}
            </span>
            {maxSeats !== 'Unlimited' && (
              <span className="font-semibold text-[#0D2218]">
                {Math.max(0, Number(maxSeats) - seatsUsed)} available
              </span>
            )}
          </div>
        </div>

        {/* Metric 3: Media & Storage */}
        <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#0D2218]/8 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-extrabold text-[#0D2218]">Cloud Media Vault</span>
            </div>
            <span className="text-xs font-mono font-bold text-[#0D2218]">
              {storageUsedMB} MB /{' '}
              {maxStorageMB === Infinity
                ? 'Unlimited'
                : maxStorageMB >= 1000
                ? `${Math.round(maxStorageMB / 1000)} GB`
                : `${maxStorageMB} MB`}
            </span>
          </div>

          <div className="h-2 w-full bg-[#0D2218]/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                maxStorageMB === Infinity ? 'bg-[#0D2218]' : getProgressColor(storagePct)
              }`}
              style={{ width: maxStorageMB === Infinity ? '100%' : `${Math.max(5, storagePct)}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-[#5C6862]">
            <span>
              {maxStorageMB === Infinity ? 'Enterprise CDN storage' : `${storagePct}% storage utilized`}
            </span>
            <span className="font-semibold text-emerald-800">Fast Cloud CDN</span>
          </div>
        </div>
      </div>
    </div>
  );
};
