import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { KairooLogo } from '../components/KairooLogo';
import { useAuth } from '../context/AuthContext';
import { db, Organization, User as UserType } from '../services/db';
import { SAAS_PLANS, PlanTier } from '../services/razorpay';
import {
  ArrowRight,
  Lock,
  Mail,
  User,
  Building,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Check,
  KeyRound,
  Briefcase,
  Users,
  Compass,
  Layers,
  Sparkles,
  ChevronRight,
  Building2,
  CheckCircle2,
} from 'lucide-react';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlInviteCode = searchParams.get('code') || '';

  const { signup, signInWithGoogle } = useAuth();

  // Mode: founder (create new org) or join (with invite code)
  const [registrationTrack, setRegistrationTrack] = useState<'founder' | 'join'>(
    urlInviteCode ? 'join' : 'founder'
  );

  // Founder Onboarding Survey State
  const [founderStep, setFounderStep] = useState<1 | 2 | 3>(1);
  const [founderRole, setFounderRole] = useState<'Founder' | 'Manager'>('Founder');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState<string>('Creative & Digital Agency');
  const [collaborationMode, setCollaborationMode] = useState<'both' | 'employees_only' | 'clients_only'>('both');
  const [clientsLabel, setClientsLabel] = useState<string>('Clients');
  const [dealsLabel, setDealsLabel] = useState<string>('Projects');
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>('growth');

  // Founder Credentials
  const [founderName, setFounderName] = useState('');
  const [founderEmail, setFounderEmail] = useState('');
  const [founderPassword, setFounderPassword] = useState('');

  // Join (Employee/Client) State
  const [inviteCode, setInviteCode] = useState(urlInviteCode);
  const [verifiedOrg, setVerifiedOrg] = useState<{ org: Organization; role: 'Employee' | 'Client' } | null>(null);
  const [joinName, setJoinName] = useState('');
  const [joinEmail, setJoinEmail] = useState('');
  const [joinPassword, setJoinPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Auto-verify code when entered
  useEffect(() => {
    if (inviteCode.trim().length >= 6) {
      const match = db.findOrganizationByInviteCode(inviteCode.trim());
      if (match) {
        setVerifiedOrg(match);
        setError(null);
      } else {
        setVerifiedOrg(null);
      }
    } else {
      setVerifiedOrg(null);
    }
  }, [inviteCode]);

  // Handle Founder Registration
  const handleFounderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (founderPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create Organization with generated codes
      const org = db.createOrganizationWithCodes({
        name: companyName || 'My Business Organization',
        founderId: 'pending',
        founderName,
        founderEmail,
        crmType: industry.includes('Agency') ? 'agency' : 'hybrid',
        industry,
        collaborationMode,
        clientsLabel,
        dealsLabel,
        plan: selectedPlan,
      });

      // 2. Register user as Founder/Manager & bind to organization
      const user = await signup(
        founderName,
        founderEmail,
        founderPassword,
        companyName,
        founderRole,
        selectedPlan
      );

      // Update org founder ID
      org.founderId = user.id;
      db.saveOrganization(org);

      // Update user with organization details
      user.organizationId = org.id;
      user.tenantId = org.id;
      user.role = founderRole;
      user.crmCustomization = {
        crmType: org.crmType,
        collaborationMode: org.collaborationMode,
        clientsLabel,
        dealsLabel,
      };
      db.saveUser(user);
      db.setCurrentUser(user);

      setLoading(false);
      navigate('/dashboard');
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to create organization account.');
    }
  };

  // Handle Founder Google Sign-In
  const handleFounderGoogle = async () => {
    if (!companyName.trim()) {
      setError('Please provide your organization name first.');
      return;
    }

    setError(null);
    setGoogleLoading(true);

    try {
      const googleUser = await signInWithGoogle();
      if (googleUser) {
        // Create organization & bind
        const org = db.createOrganizationWithCodes({
          name: companyName,
          founderId: googleUser.id,
          founderName: googleUser.name,
          founderEmail: googleUser.email,
          crmType: industry.includes('Agency') ? 'agency' : 'hybrid',
          industry,
          collaborationMode,
          clientsLabel,
          dealsLabel,
          plan: selectedPlan,
        });

        googleUser.role = founderRole;
        googleUser.company = companyName;
        googleUser.organizationId = org.id;
        googleUser.tenantId = org.id;
        googleUser.crmCustomization = {
          crmType: org.crmType,
          collaborationMode: org.collaborationMode,
          clientsLabel,
          dealsLabel,
        };
        db.saveUser(googleUser);
        db.setCurrentUser(googleUser);

        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Google registration could not be completed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Handle Employee / Client Registration with Invite Code
  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const match = db.findOrganizationByInviteCode(inviteCode.trim());
    if (!match) {
      setError('Invalid Organization Invite Code. Please request a valid code from your Manager or Founder.');
      return;
    }

    if (joinPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const role = match.role === 'Client' ? 'Client' : 'Employee';
      const user = await signup(
        joinName,
        joinEmail,
        joinPassword,
        match.org.name,
        role as any,
        match.org.plan
      );

      // Bind directly to Founder's Organization Tenant!
      user.organizationId = match.org.id;
      user.tenantId = match.org.id;
      user.inviteCodeUsed = inviteCode.trim().toUpperCase();
      user.role = role as any;
      db.saveUser(user);
      db.setCurrentUser(user);

      setLoading(false);
      navigate('/dashboard');
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to join organization.');
    }
  };

  // Handle Employee / Client Google Sign-In with Code
  const handleJoinGoogle = async () => {
    const match = db.findOrganizationByInviteCode(inviteCode.trim());
    if (!match) {
      setError('Please enter a valid Organization Invite Code before connecting with Google.');
      return;
    }

    setError(null);
    setGoogleLoading(true);

    try {
      const googleUser = await signInWithGoogle();
      if (googleUser) {
        const role = match.role === 'Client' ? 'Client' : 'Employee';
        googleUser.organizationId = match.org.id;
        googleUser.tenantId = match.org.id;
        googleUser.company = match.org.name;
        googleUser.role = role as any;
        googleUser.inviteCodeUsed = inviteCode.trim().toUpperCase();

        db.saveUser(googleUser);
        db.setCurrentUser(googleUser);

        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Google connection error.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-between font-sans selection:bg-[#0D2218] selection:text-[#FAF6F0]">
      {/* Top Bar */}
      <header className="px-6 py-5 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <KairooLogo size="md" variant="dark" />
        </NavLink>
        <div className="flex items-center gap-4">
          <NavLink
            to="/pricing"
            className="text-xs font-extrabold text-[#0D2218] hover:text-[#BA5D38] transition-colors"
          >
            Pricing & Plans
          </NavLink>
          <NavLink
            to="/login"
            className="text-xs font-extrabold text-[#5C6862] hover:text-[#0D2218] transition-colors"
          >
            Sign In
          </NavLink>
        </div>
      </header>

      {/* Main Container */}
      <div className="w-full max-w-2xl mx-auto px-4 py-4 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-[#0D2218]/12 shadow-[0_20px_50px_-15px_rgba(13,34,24,0.12)]"
        >
          {/* Header Track Selector */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#0D2218]/5 text-[#0D2218] mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              SaaS Multi-Tenant Enterprise Architecture
            </span>

            <h1 className="text-3xl font-extrabold text-[#0D2218] tracking-tight mb-2">
              {registrationTrack === 'founder'
                ? 'Create New Business Organization'
                : 'Join Your Company Workspace'}
            </h1>
            <p className="text-xs text-[#5C6862] font-medium max-w-md mx-auto">
              {registrationTrack === 'founder'
                ? 'Register as Founder or Manager. Answer 3 quick questions to customize your CRM, generate team codes, and launch.'
                : 'Enter the invite code shared by your Founder or Manager to access your dedicated employee or client portal.'}
            </p>

            {/* Track Switcher */}
            <div className="mt-6 flex bg-[#FAF6F0] p-1.5 rounded-2xl border border-[#0D2218]/10 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => { setRegistrationTrack('founder'); setError(null); }}
                className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                  registrationTrack === 'founder'
                    ? 'bg-[#0D2218] text-white shadow-sm'
                    : 'text-[#5C6862] hover:text-[#0D2218]'
                }`}
              >
                Founder / Manager
              </button>
              <button
                type="button"
                onClick={() => { setRegistrationTrack('join'); setError(null); }}
                className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                  registrationTrack === 'join'
                    ? 'bg-[#0D2218] text-white shadow-sm'
                    : 'text-[#5C6862] hover:text-[#0D2218]'
                }`}
              >
                Employee or Client (With Code)
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* TRACK 1: FOUNDER / MANAGER SETUP */}
          {registrationTrack === 'founder' && (
            <div>
              {/* Stepper */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {[
                  { num: 1, label: 'Company Profile' },
                  { num: 2, label: 'CRM Needs' },
                  { num: 3, label: 'Account Sign In' },
                ].map((s) => (
                  <div key={s.num} className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold ${
                        founderStep === s.num
                          ? 'bg-[#0D2218] text-white shadow-xs'
                          : founderStep > s.num
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#FAF6F0] text-[#5C6862] border border-[#0D2218]/15'
                      }`}
                    >
                      {founderStep > s.num ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.num}
                    </div>
                    <span className={`text-xs font-bold hidden sm:inline ${founderStep === s.num ? 'text-[#0D2218]' : 'text-[#5C6862]'}`}>
                      {s.label}
                    </span>
                    {s.num < 3 && <ChevronRight className="w-3.5 h-3.5 text-[#5C6862]/40" />}
                  </div>
                ))}
              </div>

              {/* STEP 1: Company Profile & Industry */}
              {founderStep === 1 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold text-[#0D2218] mb-1.5">
                      Your Executive Role in this Organization *
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3.5">
                      <div
                        onClick={() => setFounderRole('Founder')}
                        className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                          founderRole === 'Founder'
                            ? 'border-[#0D2218] bg-[#FAF6F0] ring-2 ring-[#0D2218]/10'
                            : 'border-[#0D2218]/10 hover:border-[#0D2218]/30 bg-white'
                        }`}
                      >
                        <div className="font-extrabold text-[#0D2218] flex items-center justify-between">
                          <span>Founder / CEO</span>
                          {founderRole === 'Founder' && <CheckCircle2 className="w-4 h-4 text-[#0D2218]" />}
                        </div>
                        <p className="text-[11px] text-[#5C6862] mt-0.5">Primary owner & master account holder</p>
                      </div>

                      <div
                        onClick={() => setFounderRole('Manager')}
                        className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                          founderRole === 'Manager'
                            ? 'border-[#0D2218] bg-[#FAF6F0] ring-2 ring-[#0D2218]/10'
                            : 'border-[#0D2218]/10 hover:border-[#0D2218]/30 bg-white'
                        }`}
                      >
                        <div className="font-extrabold text-[#0D2218] flex items-center justify-between">
                          <span>Agency / General Manager</span>
                          {founderRole === 'Manager' && <CheckCircle2 className="w-4 h-4 text-[#0D2218]" />}
                        </div>
                        <p className="text-[11px] text-[#5C6862] mt-0.5">Operations leader & team administrator</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#0D2218] mb-1.5">
                      Organization or Agency Name *
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-[#5C6862] absolute left-3 top-2.5 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Apex Media Agency, Zenith Global"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-xs font-bold text-[#0D2218] focus:outline-none focus:ring-2 focus:ring-[#0D2218]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#0D2218] mb-1.5">
                      What type of business are you operating?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {[
                        { title: 'Creative & Digital Agency', desc: 'Marketing, design, development & client services' },
                        { title: 'B2B Sales & High-Ticket Enterprise', desc: 'Outbound sales, enterprise pipelines, lead conversion' },
                        { title: 'Consulting & Professional Services', desc: 'Retainer milestones, client deliverables, contracts' },
                        { title: 'Tech, SaaS & IT Support', desc: 'Product ticketing, engineering tasks, SLA desk' },
                      ].map((ind) => (
                        <div
                          key={ind.title}
                          onClick={() => setIndustry(ind.title)}
                          className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                            industry === ind.title
                              ? 'border-[#0D2218] bg-[#FAF6F0] ring-2 ring-[#0D2218]/10'
                              : 'border-[#0D2218]/10 hover:border-[#0D2218]/30 bg-white'
                          }`}
                        >
                          <div className="font-extrabold text-[#0D2218] flex items-center justify-between">
                            <span>{ind.title}</span>
                            {industry === ind.title && <CheckCircle2 className="w-4 h-4 text-[#0D2218]" />}
                          </div>
                          <p className="text-[11px] text-[#5C6862] mt-1">{ind.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="button"
                      disabled={!companyName.trim()}
                      onClick={() => setFounderStep(2)}
                      className="px-6 py-2.5 bg-[#0D2218] hover:bg-[#163827] text-white text-xs font-extrabold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-40"
                    >
                      <span>Next: Customize Collaboration</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Collaboration Model & Terminology */}
              {founderStep === 2 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                  <div>
                    <label className="block text-xs font-extrabold text-[#0D2218] mb-1.5">
                      Who will you be collaborating with in this CRM?
                    </label>
                    <div className="space-y-2 text-xs">
                      {[
                        {
                          id: 'both',
                          title: 'Both Team Employees & External Clients (Recommended for Agencies)',
                          desc: 'Generates separate invite codes. Employees track tasks & calls; clients view live project milestones & support tickets.',
                        },
                        {
                          id: 'employees_only',
                          title: 'Internal Team Employees Only',
                          desc: 'For internal sales, marketing, and support teams. Analyzes team productivity, pipeline closing, and lead dispatch.',
                        },
                        {
                          id: 'clients_only',
                          title: 'External Clients & Customers Only',
                          desc: 'Dedicated client portal where clients submit support requests, review deliverables, and approve contracts.',
                        },
                      ].map((mode) => (
                        <div
                          key={mode.id}
                          onClick={() => setCollaborationMode(mode.id as any)}
                          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                            collaborationMode === mode.id
                              ? 'border-[#0D2218] bg-[#FAF6F0] ring-2 ring-[#0D2218]/10'
                              : 'border-[#0D2218]/10 hover:border-[#0D2218]/30 bg-white'
                          }`}
                        >
                          <div className="font-extrabold text-[#0D2218] flex items-center justify-between">
                            <span>{mode.title}</span>
                            {collaborationMode === mode.id && <CheckCircle2 className="w-4 h-4 text-[#0D2218]" />}
                          </div>
                          <p className="text-[11px] text-[#5C6862] mt-1">{mode.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-[#0D2218] mb-1">Customer Terminology</label>
                      <select
                        value={clientsLabel}
                        onChange={(e) => setClientsLabel(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218] font-bold"
                      >
                        <option value="Clients">"Clients" (Agencies & Consultancies)</option>
                        <option value="Customers">"Customers" (B2B / E-Commerce)</option>
                        <option value="Accounts">"Accounts" (Enterprise)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#0D2218] mb-1">Pipeline Terminology</label>
                      <select
                        value={dealsLabel}
                        onChange={(e) => setDealsLabel(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218] font-bold"
                      >
                        <option value="Projects">"Projects" (Milestones & Deliverables)</option>
                        <option value="Deals">"Deals" (Monetary Sales Pipeline)</option>
                        <option value="Contracts">"Contracts" (Legal / Consulting)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setFounderStep(1)}
                      className="px-4 py-2 border border-[#0D2218]/15 rounded-xl text-xs font-bold text-[#5C6862]"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setFounderStep(3)}
                      className="px-6 py-2.5 bg-[#0D2218] hover:bg-[#163827] text-white text-xs font-extrabold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
                    >
                      <span>Next: Founder Sign-Up</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Founder Authentication & Account Binding */}
              {founderStep === 3 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#0D2218]/10 text-xs">
                    <div className="font-extrabold text-[#0D2218] mb-1">Workspace Summary:</div>
                    <div className="flex flex-wrap gap-2 text-[11px] font-bold text-[#5C6862]">
                      <span className="bg-white px-2 py-0.5 rounded border border-[#0D2218]/10 text-[#0D2218]">
                        Org: {companyName}
                      </span>
                      <span className="bg-white px-2 py-0.5 rounded border border-[#0D2218]/10">
                        {industry}
                      </span>
                      <span className="bg-white px-2 py-0.5 rounded border border-[#0D2218]/10">
                        Mode: {collaborationMode}
                      </span>
                    </div>
                  </div>

                  {/* Google Sign-in */}
                  <button
                    type="button"
                    onClick={handleFounderGoogle}
                    disabled={googleLoading}
                    className="w-full py-2.5 px-4 bg-white border border-[#0D2218]/15 hover:bg-gray-50 rounded-xl text-xs font-extrabold text-[#0D2218] flex items-center justify-center gap-2.5 shadow-xs transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>{googleLoading ? 'Connecting to Google...' : 'Sign Up as Founder with Google'}</span>
                  </button>

                  <div className="relative my-3">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#0D2218]/10" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider text-[#5C6862]">
                      <span className="bg-white px-3">or create email login</span>
                    </div>
                  </div>

                  <form onSubmit={handleFounderSubmit} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-[#0D2218] mb-1">Founder / Manager Name *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#5C6862] absolute left-3 top-2.5 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={founderName}
                          onChange={(e) => setFounderName(e.target.value)}
                          placeholder="e.g. Karthik Venkat"
                          className="w-full pl-9 pr-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218] font-bold focus:outline-none focus:ring-2 focus:ring-[#0D2218]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-[#0D2218] mb-1">Founder Work Email *</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#5C6862] absolute left-3 top-2.5 pointer-events-none" />
                        <input
                          type="email"
                          required
                          value={founderEmail}
                          onChange={(e) => setFounderEmail(e.target.value)}
                          placeholder="karthik@agency.com"
                          className="w-full pl-9 pr-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218] font-bold focus:outline-none focus:ring-2 focus:ring-[#0D2218]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-[#0D2218] mb-1">Password *</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#5C6862] absolute left-3 top-2.5 pointer-events-none" />
                        <input
                          type="password"
                          required
                          value={founderPassword}
                          onChange={(e) => setFounderPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-9 pr-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218] font-bold focus:outline-none focus:ring-2 focus:ring-[#0D2218]"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setFounderStep(2)}
                        className="px-4 py-2 border border-[#0D2218]/15 rounded-xl text-xs font-bold text-[#5C6862]"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 bg-[#0D2218] hover:bg-[#163827] text-white text-xs font-extrabold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        <span>{loading ? 'Creating Workspace...' : 'Launch Business & Generate Codes'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </div>
          )}

          {/* TRACK 2: EMPLOYEE OR CLIENT WITH INVITE CODE */}
          {registrationTrack === 'join' && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#0D2218]/12 space-y-2">
                <label className="block text-xs font-extrabold text-[#0D2218]">
                  Enter Organization Invite Code *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#BA5D38] absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="e.g. EMP-APEX-8921 or CLT-APEX-3814"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#0D2218]/15 rounded-xl font-mono text-sm font-extrabold text-[#0D2218] tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-[#0D2218]"
                  />
                </div>

                {verifiedOrg ? (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold flex items-center gap-2 mt-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      Verified: Joining <strong>{verifiedOrg.org.name}</strong> as a{' '}
                      <span className="uppercase text-[#BA5D38]">{verifiedOrg.role}</span>
                    </span>
                  </div>
                ) : (
                  <p className="text-[11px] text-[#5C6862]">
                    Invite codes start with <code>EMP-</code> for employees or <code>CLT-</code> for clients. Ask your Founder or Manager for your code.
                  </p>
                )}
              </div>

              {/* Google Sign In with Code */}
              <button
                type="button"
                onClick={handleJoinGoogle}
                disabled={googleLoading || !verifiedOrg}
                className="w-full py-2.5 px-4 bg-white border border-[#0D2218]/15 hover:bg-gray-50 rounded-xl text-xs font-extrabold text-[#0D2218] flex items-center justify-center gap-2.5 shadow-xs transition-all active:scale-[0.99] cursor-pointer disabled:opacity-40"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{googleLoading ? 'Connecting...' : 'Join with Google Account'}</span>
              </button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#0D2218]/10" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider text-[#5C6862]">
                  <span className="bg-white px-3">or create credentials</span>
                </div>
              </div>

              <form onSubmit={handleJoinSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-[#0D2218] mb-1">Your Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#5C6862] absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={joinName}
                      onChange={(e) => setJoinName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full pl-9 pr-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218] font-bold focus:outline-none focus:ring-2 focus:ring-[#0D2218]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#0D2218] mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#5C6862] absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={joinEmail}
                      onChange={(e) => setJoinEmail(e.target.value)}
                      placeholder="sarah@example.com"
                      className="w-full pl-9 pr-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218] font-bold focus:outline-none focus:ring-2 focus:ring-[#0D2218]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#0D2218] mb-1">Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#5C6862] absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="password"
                      required
                      value={joinPassword}
                      onChange={(e) => setJoinPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218] font-bold focus:outline-none focus:ring-2 focus:ring-[#0D2218]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || !verifiedOrg}
                    className="w-full py-3 bg-[#0D2218] hover:bg-[#163827] text-white text-xs font-extrabold rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                  >
                    <span>{loading ? 'Verifying & Joining...' : `Join ${verifiedOrg ? verifiedOrg.org.name : 'Organization'}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-[#0D2218]/8 text-center text-xs text-[#5C6862]">
            Already registered?{' '}
            <NavLink to="/login" className="font-extrabold text-[#0D2218] hover:text-[#BA5D38] underline">
              Sign in to your account
            </NavLink>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs font-semibold text-[#5C6862]">
        © 2026 Kairoo Technologies Inc. All rights reserved. Multi-Tenant Enterprise Security.
      </footer>
    </div>
  );
};

export default SignupPage;
