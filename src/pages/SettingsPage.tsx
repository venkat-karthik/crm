import React, { useState } from 'react';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { useAuth } from '../context/AuthContext';
import { usePlanAccess } from '../hooks/usePlanAccess';
import { RazorpayModal } from '../components/RazorpayModal';
import { SAAS_PLANS, PlanTier } from '../services/razorpay';
import {
  Save,
  Download,
  RotateCcw,
  Shield,
  Building,
  DollarSign,
  Bell,
  CheckCircle,
  Database,
  CreditCard,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  FileText,
  Cloud,
  UploadCloud,
  RefreshCw,
} from 'lucide-react';
import { db, isMasterFounder, MASTER_FOUNDER_EMAIL } from '../services/db';
import { CloudinaryMediaManager } from '../components/CloudinaryMediaManager';
import { cloudinaryService } from '../services/cloudinary';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { currentPlan, planInfo } = usePlanAccess();

  const [companyName, setCompanyName] = useState(user?.company || 'Kairoo Technologies');
  const [currency, setCurrency] = useState('INR (₹)');
  const [timezone, setTimezone] = useState('Asia/Kolkata (IST)');
  const [leadSlaHours, setLeadSlaHours] = useState('2');
  const [ticketSlaHours, setTicketSlaHours] = useState('4');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [leadAlerts, setLeadAlerts] = useState(true);
  const [ticketAlerts, setTicketAlerts] = useState(true);
  const [savedToast, setSavedToast] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);

  // Dynamic Adaptive CRM Customization states from Registration
  const [clientsLabel, setClientsLabel] = useState(user?.crmCustomization?.clientsLabel || 'Clients');
  const [dealsLabel, setDealsLabel] = useState(user?.crmCustomization?.dealsLabel || 'Projects');
  const [crmType, setCrmType] = useState<any>(user?.crmCustomization?.crmType || 'agency');
  const [collaborationMode, setCollaborationMode] = useState<any>(user?.crmCustomization?.collaborationMode || 'both');

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const updatedUser = {
        ...user,
        company: companyName,
        crmCustomization: {
          crmType,
          collaborationMode,
          clientsLabel,
          dealsLabel,
        },
      };
      db.saveUser(updatedUser);
      db.setCurrentUser(updatedUser);
      if (user.organizationId) {
        const org = db.getOrganization(user.organizationId);
        if (org) {
          org.name = companyName;
          org.crmType = crmType;
          org.collaborationMode = collaborationMode;
          org.customTerminology = {
            clientsLabel,
            dealsLabel,
          };
          db.saveOrganization(org);
        }
      }
    }
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      window.location.reload();
    }, 1200);
  };

  const handleDownloadInvoice = () => {
    const invoiceText = `=========================================
KAIROO CRM TECHNOLOGIES INC.
TAX INVOICE / PAYMENT RECEIPT
=========================================
Invoice No: INV-${Date.now().toString().slice(-6)}
Date: ${new Date().toLocaleDateString()}
GSTIN: 29AABCK1234F1Z8
Customer Name: ${user?.name || 'Business Owner'}
Organization: ${companyName}
Billing Plan: ${planInfo.name} Tier (${user?.planBillingCycle || 'monthly'})
Amount Paid: ₹${(user?.planBillingCycle === 'annual' ? planInfo.priceAnnualINR : planInfo.priceMonthlyINR).toLocaleString()}
Payment Gateway: Razorpay Verified (Ref: ${user?.razorpayPaymentId || 'pay_demo_verified'})
Payment Mode: UPI / Cards / NetBanking
Status: SUCCESSFUL / PAID IN FULL
=========================================
Thank you for powering your business with Kairoo!`;

    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kairoo_invoice_${planInfo.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadBackup = () => {
    const backupData = {
      users: db.getUsers(),
      customers: db.getCustomers(),
      leads: db.getLeads(),
      deals: db.getDeals(),
      tasks: db.getTasks(),
      calls: db.getCalls(),
      communications: db.getCommunications(),
      appointments: db.getAppointments(),
      tickets: db.getTickets(),
      notifications: db.getNotifications(),
      exportedAt: new Date().toISOString(),
      systemVersion: 'Kairoo CRM 2.6 Multi-Tenant Cloud',
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `kairoo_crm_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  const isMaster = isMasterFounder(user);
  const [showCloudinaryModal, setShowCloudinaryModal] = useState(false);
  const [syncingCld, setSyncingCld] = useState(false);
  const [cldToast, setCldToast] = useState<string | null>(null);

  const handleSyncCrmPhotos = async () => {
    setSyncingCld(true);
    setCldToast(null);
    try {
      await cloudinaryService.syncLocalPhotosToCloudinary();
      setCldToast('All 4 CRM showcase photos successfully uploaded and synchronized with Cloudinary CDN!');
      setTimeout(() => setCldToast(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSyncingCld(false);
    }
  };

  const handleResetData = () => {
    if (!isMaster) {
      alert(`Database purge and clean slate reset is reserved exclusively for the CRM Founder (${MASTER_FOUNDER_EMAIL}).`);
      return;
    }
    if (confirm('Are you sure you want to purge all records? This will clear all data and prepare a 100% clean slate for your new Founder account.')) {
      localStorage.clear();
      window.location.href = '/signup';
    }
  };

  return (
    <WorkspaceLayout
      title="Settings & System Configuration"
      subtitle="SaaS plan billing, workspace localization, business SLA thresholds, and database maintenance"
    >
      {savedToast && (
        <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Configuration saved successfully.</span>
        </div>
      )}

      <div className="max-w-4xl space-y-6">
        {/* SaaS Subscription & Razorpay Plan Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0D2218]/12 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0D2218]/10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#0D2218]/5 text-[#0D2218] mb-2">
                <Zap className="w-3.5 h-3.5 text-[#BA5D38] fill-current" />
                SaaS Subscription & Plan Tier
              </div>
              <h3 className="text-xl font-extrabold text-[#0D2218]">
                {planInfo.name} Plan
              </h3>
              <p className="text-xs text-[#5C6862] font-medium mt-0.5">
                {planInfo.description}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0D2218]">
                ₹{planInfo.priceMonthlyINR.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-[#5C6862]"> / month</span>
              <div className="text-[11px] text-emerald-700 font-bold mt-0.5 flex items-center sm:justify-end gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>Subscription Active</span>
              </div>
            </div>
          </div>

          {/* Plan Limits & Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#0D2218]/8 space-y-2">
              <div className="font-extrabold text-[#0D2218] uppercase tracking-wider text-[11px]">
                Capacity & Access:
              </div>
              <div className="space-y-1.5 font-medium text-[#1F2623]">
                <div className="flex items-center justify-between">
                  <span className="text-[#5C6862]">Team User Seats:</span>
                  <span className="font-extrabold text-[#0D2218]">
                    {planInfo.maxSeats === 'Unlimited' ? 'Unlimited Seats' : `${planInfo.maxSeats} Active Seat`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#5C6862]">Customer Records:</span>
                  <span className="font-extrabold text-[#0D2218]">
                    {planInfo.maxContacts === 'Unlimited' ? 'Unlimited Contacts' : `${planInfo.maxContacts} Contacts`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#5C6862]">Database Engine:</span>
                  <span className="font-extrabold text-[#0D2218]">Google Cloud Firestore</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#0D2218]/8 space-y-2">
              <div className="font-extrabold text-[#0D2218] uppercase tracking-wider text-[11px]">
                Payment & Billing Gateway:
              </div>
              <div className="space-y-1.5 font-medium text-[#1F2623]">
                <div className="flex items-center justify-between">
                  <span className="text-[#5C6862]">Gateway Provider:</span>
                  <span className="font-extrabold text-[#0D2218] flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                    Razorpay
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#5C6862]">Accepted Rails:</span>
                  <span className="font-bold text-[#0D2218]">UPI, Cards, NetBanking</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#5C6862]">Next Renewal Date:</span>
                  <span className="font-bold text-[#0D2218]">
                    {user?.subscriptionExpiresAt
                      ? new Date(user.subscriptionExpiresAt).toLocaleDateString()
                      : new Date(Date.now() + 30 * 86400000).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleDownloadInvoice}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#0D2218]/15 hover:bg-gray-50 text-xs font-bold text-[#0D2218] rounded-xl shadow-xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#BA5D38]" />
              <span>Download Latest GST Invoice</span>
            </button>

            <div className="flex items-center gap-3">
              <a
                href="/pricing"
                className="text-xs font-bold text-[#5C6862] hover:text-[#0D2218] underline"
              >
                Compare All 3 Plans
              </a>

              <button
                type="button"
                onClick={() => setShowRazorpayModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0D2218] hover:bg-[#163827] text-white text-xs font-extrabold rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{currentPlan === 'enterprise' ? 'Extend Plan via Razorpay' : 'Upgrade Plan via Razorpay'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSavePreferences} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0D2218]/10 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-extrabold text-[#0D2218] flex items-center gap-2 mb-1">
              <Building className="w-4 h-4 text-[#0D2218]" />
              <span>Organization & Localization</span>
            </h3>
            <p className="text-xs font-medium text-[#5C6862]">Define your company identity and regional format defaults</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold mb-1 text-[#0D2218]">Organization Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218] font-medium"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-[#0D2218]">Default Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218] font-medium"
              >
                <option value="INR (₹)">Indian Rupee (INR ₹)</option>
                <option value="USD ($)">US Dollar (USD $)</option>
                <option value="EUR (€)">Euro (EUR €)</option>
                <option value="GBP (£)">British Pound (GBP £)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1 text-[#0D2218]">Workspace Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218] font-medium"
              >
                <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST +5:30)</option>
                <option value="America/New_York (EST)">America/New_York (EST)</option>
                <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                <option value="Asia/Dubai (GST)">Asia/Dubai (GST +4:00)</option>
              </select>
            </div>
          </div>

          <hr className="border-[#0D2218]/8" />

          {/* SLA Thresholds */}
          <div>
            <h3 className="text-sm font-extrabold text-[#0D2218] flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-[#0D2218]" />
              <span>SLA Response Targets</span>
            </h3>
            <p className="text-xs font-medium text-[#5C6862]">Automate escalation alerts when turnaround exceeds threshold</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold mb-1 text-[#0D2218]">
                Inbound Lead First Contact SLA (Hours)
              </label>
              <input
                type="number"
                value={leadSlaHours}
                onChange={(e) => setLeadSlaHours(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218] font-medium"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-[#0D2218]">
                Critical Support Ticket Resolution SLA (Hours)
              </label>
              <input
                type="number"
                value={ticketSlaHours}
                onChange={(e) => setTicketSlaHours(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218] font-medium"
              />
            </div>
          </div>

          <hr className="border-[#0D2218]/8" />

          {/* Adaptive CRM Customization & Terminology Calibration */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-extrabold text-[#0D2218] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#BA5D38]" />
                <span>Adaptive CRM Intelligence & Terminology</span>
              </h3>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#BA5D38]/10 text-[#BA5D38] border border-[#BA5D38]/20">
                Self-Adapting Engine
              </span>
            </div>
            <p className="text-xs font-medium text-[#5C6862]">
              Calibrated dynamically from your registration survey. Adjusting here will automatically transform directory labels, pipeline boards, and portals across your entire workspace in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold mb-1 text-[#0D2218]">Customer Entity Label</label>
              <select
                value={clientsLabel}
                onChange={(e) => setClientsLabel(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218] font-medium"
              >
                <option value="Clients">"Clients" (Agencies & Creative Studios)</option>
                <option value="Customers">"Customers" (B2B Sales & High-Ticket)</option>
                <option value="Accounts">"Accounts" (Enterprise SaaS & Tech)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1 text-[#0D2218]">Pipeline Deal Label</label>
              <select
                value={dealsLabel}
                onChange={(e) => setDealsLabel(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218] font-medium"
              >
                <option value="Projects">"Projects" (Milestones & Deliverables)</option>
                <option value="Deals">"Deals" (Monetary Sales Pipeline)</option>
                <option value="Contracts">"Contracts" (Retainers & Agreements)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1 text-[#0D2218]">Operational CRM Mode</label>
              <select
                value={crmType}
                onChange={(e) => setCrmType(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218] font-medium"
              >
                <option value="agency">Agency Delivery (Client milestone & retainer focus)</option>
                <option value="sales_b2b">B2B Sales (High-velocity deal progression)</option>
                <option value="services">Consulting Hub (Contract & advisory workflow)</option>
                <option value="hybrid">Enterprise Hybrid (Complete 360-degree suite)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1 text-[#0D2218]">Collaboration Model</label>
              <select
                value={collaborationMode}
                onChange={(e) => setCollaborationMode(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218] font-medium"
              >
                <option value="both">Both Team Employees & External Clients</option>
                <option value="employees_only">Internal Team Employees Only</option>
                <option value="clients_only">External Clients & Customers Only</option>
              </select>
            </div>
          </div>

          <hr className="border-[#0D2218]/8" />

          {/* Notifications Rules */}
          <div>
            <h3 className="text-sm font-extrabold text-[#0D2218] flex items-center gap-2 mb-1">
              <Bell className="w-4 h-4 text-[#0D2218]" />
              <span>Dispatch Rules & In-App Alerts</span>
            </h3>
            <p className="text-xs font-medium text-[#5C6862]">Control automated notifications sent to sales representatives</p>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={leadAlerts}
                onChange={(e) => setLeadAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-[#0D2218] focus:ring-0"
              />
              <span className="font-bold text-[#0D2218]">Notify assigned rep immediately on new website demo request</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={ticketAlerts}
                onChange={(e) => setTicketAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-[#0D2218] focus:ring-0"
              />
              <span className="font-bold text-[#0D2218]">Broadcast high-priority support tickets to the Customer Care queue</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-[#0D2218] focus:ring-0"
              />
              <span className="font-bold text-[#0D2218]">Send executive summary report digest every Friday evening</span>
            </label>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold text-[#FAF6F0] bg-[#0D2218] hover:bg-[#163827] rounded-xl shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>

        {/* Cloudinary CDN & Media Asset Storage Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0D2218]/10 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#3448C5]/10 text-[#3448C5] mb-2">
                <Cloud className="w-3.5 h-3.5 fill-current" />
                Cloudinary CDN & Image Storage
              </div>
              <h3 className="text-sm font-extrabold text-[#0D2218] flex items-center gap-2">
                <span>Media Delivery, Dynamic Transformations & Auto-WebP</span>
              </h3>
              <p className="text-xs font-medium text-[#5C6862] mt-0.5">
                Connected Cloudinary cloud: <span className="font-mono text-[#0D2218] font-bold">kairoo-crm</span> with real-time compression, format negotiation, and CDN edge delivery.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleSyncCrmPhotos}
                disabled={syncingCld}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FAF6F0] hover:bg-[#0D2218] hover:text-white text-[#0D2218] border border-[#0D2218]/15 text-xs font-extrabold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingCld ? 'animate-spin' : ''}`} />
                <span>{syncingCld ? 'Uploading...' : 'Sync CRM Photos'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCloudinaryModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0D2218] hover:bg-[#163827] text-white text-xs font-extrabold rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Open Media Gallery</span>
              </button>
            </div>
          </div>

          {cldToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{cldToast}</span>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-[#FAF6F0] rounded-2xl border border-[#0D2218]/10 text-center">
              <span className="text-[10px] font-extrabold uppercase text-[#5C6862] block">Cloud Account</span>
              <span className="text-xs font-mono font-extrabold text-[#0D2218]">kairoo-crm</span>
            </div>
            <div className="p-3 bg-[#FAF6F0] rounded-2xl border border-[#0D2218]/10 text-center">
              <span className="text-[10px] font-extrabold uppercase text-[#5C6862] block">Auto Format</span>
              <span className="text-xs font-mono font-extrabold text-emerald-600">f_auto (WebP/AVIF)</span>
            </div>
            <div className="p-3 bg-[#FAF6F0] rounded-2xl border border-[#0D2218]/10 text-center">
              <span className="text-[10px] font-extrabold uppercase text-[#5C6862] block">Compression</span>
              <span className="text-xs font-mono font-extrabold text-blue-600">q_auto (Lossless/Smart)</span>
            </div>
            <div className="p-3 bg-[#FAF6F0] rounded-2xl border border-[#0D2218]/10 text-center">
              <span className="text-[10px] font-extrabold uppercase text-[#5C6862] block">CDN Security</span>
              <span className="text-xs font-mono font-extrabold text-[#BA5D38]">HTTPS SSL Signed</span>
            </div>
          </div>
        </div>

        {/* Database Management & Backups */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0D2218]/10 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-extrabold text-[#0D2218] flex items-center gap-2 mb-1">
              <Database className="w-4 h-4 text-[#0D2218]" />
              <span>Database Persistence & Maintenance</span>
            </h3>
            <p className="text-xs font-medium text-[#5C6862]">
              Kairoo stores all CRM customer profiles, deals, calls, and tickets in Google Cloud Firestore with real-time updates.
            </p>
          </div>

          {/* Complete Project Archive for Desktop */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold text-emerald-950 block">Complete Codebase (Desktop Archive: kairoo.zip)</span>
              <span className="text-[11px] text-emerald-800 font-medium">
                All application source code, components, routes, backend server, and styling packaged into a zip file ready for your Desktop.
              </span>
            </div>
            <a
              href="/api/download/kairoo-zip"
              download="kairoo.zip"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0D2218] hover:bg-[#163827] text-xs font-extrabold text-[#FAF6F0] rounded-xl shadow-xs transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download kairoo.zip</span>
            </a>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#0D2218]/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold text-[#0D2218] block">Complete JSON Database Snapshot</span>
              <span className="text-[11px] text-[#5C6862] font-medium">
                Export all models including customer accounts, pipeline deals, tickets, and communications.
              </span>
            </div>
            <button
              onClick={handleDownloadBackup}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#0D2218]/15 hover:border-[#0D2218]/30 text-xs font-extrabold text-[#0D2218] rounded-xl shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Backup</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-red-50/50 border border-red-200/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold text-red-900 block">Purge & Reset to Clean Database Slate</span>
              <span className="text-[11px] text-red-700/80 font-medium">
                Purges all local caches and stored sessions for a 100% clean database slate. (Reserved for CRM Founder {MASTER_FOUNDER_EMAIL}).
              </span>
            </div>
            <button
              onClick={handleResetData}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-xs font-extrabold text-red-900 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Purge All Data</span>
            </button>
          </div>
        </div>
      </div>

      <RazorpayModal
        isOpen={showRazorpayModal}
        onClose={() => setShowRazorpayModal(false)}
        defaultPlan={currentPlan === 'starter' ? 'growth' : 'enterprise'}
      />

      <CloudinaryMediaManager
        isOpen={showCloudinaryModal}
        onClose={() => setShowCloudinaryModal(false)}
      />
    </WorkspaceLayout>
  );
};

export default SettingsPage;
