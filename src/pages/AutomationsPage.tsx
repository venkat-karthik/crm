import React, { useState, useEffect } from 'react';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import {
  Webhook,
  Code2,
  Copy,
  Check,
  Send,
  Mail,
  PhoneCall,
  Globe,
  Sparkles,
  Zap,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Key,
  ShieldCheck,
  ArrowRight,
  Database,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { AutomationsFlowDiagram } from '../components/AutomationsFlowDiagram';
import { motion } from 'framer-motion';

interface WebhookLog {
  id: string;
  source: 'Website Form' | 'Inbound Email' | 'Telephony VoIP' | 'Zapier / Custom';
  eventType: string;
  summary: string;
  status: 'Success' | 'Warning' | 'Error';
  timestamp: string;
  payload: any;
}

export const AutomationsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'website' | 'email' | 'telephony' | 'logs'>('website');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Webhook Logs
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Simulation Form States
  const [leadSim, setLeadSim] = useState({
    name: 'Ananya Deshmukh',
    email: 'ananya@zenithgrowth.io',
    phone: '+91 98450 11928',
    company: 'Zenith Growth Labs',
    message: 'Interested in the Enterprise CRM package with team onboarding for 15 sales executives.',
  });
  const [emailSim, setEmailSim] = useState({
    from: 'vikram.mehta@apexenterprises.in',
    to: 'sales@kairoocrm.com',
    subject: 'Request for Master Service Agreement & Vendor Onboarding Form',
    body: 'Hi Kairoo Team,\n\nWe have reviewed your product proposal and would like to proceed with the annual Standard Growth agreement. Please share your countersigned MSA.\n\nBest regards,\nVikram Mehta',
  });
  const [callSim, setCallSim] = useState({
    callerNumber: '+91 98201 99281',
    contactName: 'Rohit Singhania',
    callType: 'Inbound',
    durationMinutes: 6,
    status: 'Completed',
    notes: 'Client called regarding pipeline velocity reporting and multi-tenant sub-teams.',
  });

  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://kairoocrm.com';
  const apiKey = `kai_live_${(user?.tenantId || 'org_9921').slice(0, 8)}_${user?.id ? user.id.slice(0, 4) : '316a'}`;
  const smartForwardEmail = `inbound+${(user?.tenantId || 'enterprise').slice(0, 8)}@kairoocrm.com`;

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch('/api/webhooks/logs');
      if (res.ok) {
        const data = await res.json();
        if (data.logs) {
          setLogs(data.logs);
        }
      }
    } catch {
      // Offline fallback
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSimulateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setSimulating(true);
    setSimResult(null);

    try {
      const res = await fetch('/api/webhooks/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...leadSim,
          source: 'External Website Contact Form',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        db.saveLead({
          id: data.leadId || `lead_${Date.now()}`,
          name: leadSim.name,
          email: leadSim.email,
          phone: leadSim.phone,
          company: leadSim.company,
          source: 'Website Contact Form',
          interest: 'Inbound Website Inquiry',
          assignedTo: 'Sales Lead',
          status: 'New Lead',
          notes: leadSim.message,
        });

        setSimResult({
          type: 'success',
          message: `Success! Automated Lead "${leadSim.name}" was captured and filed into your Leads directory with an alert.`,
        });
        fetchLogs();
      } else {
        setSimResult({
          type: 'error',
          message: 'Webhook returned an error response.',
        });
      }
    } catch (err: any) {
      setSimResult({
        type: 'error',
        message: err.message || 'Failed to dispatch webhook test.',
      });
    } finally {
      setSimulating(false);
    }
  };

  const handleSimulateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSimulating(true);
    setSimResult(null);

    try {
      const res = await fetch('/api/webhooks/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailSim),
      });

      if (res.ok) {
        db.saveCommunication({
          type: 'Email',
          subject: emailSim.subject,
          content: emailSim.body,
          recipient: emailSim.to,
          author: emailSim.from,
          relatedCustomer: 'Apex Enterprises',
        });

        setSimResult({
          type: 'success',
          message: `Success! Inbound email from "${emailSim.from}" was ingested and linked directly to your Communication timeline.`,
        });
        fetchLogs();
      } else {
        setSimResult({
          type: 'error',
          message: 'Email webhook returned an error.',
        });
      }
    } catch (err: any) {
      setSimResult({
        type: 'error',
        message: err.message || 'Failed to simulate email webhook.',
      });
    } finally {
      setSimulating(false);
    }
  };

  const handleSimulateCall = async (e: React.FormEvent) => {
    e.preventDefault();
    setSimulating(true);
    setSimResult(null);

    try {
      const res = await fetch('/api/webhooks/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(callSim),
      });

      if (res.ok) {
        db.saveCall({
          contactName: callSim.contactName || callSim.callerNumber,
          phone: callSim.callerNumber,
          type: 'Inbound',
          status: 'Completed',
          durationMinutes: Number(callSim.durationMinutes) || 8,
          assignedEmployee: 'Telephony Gateway',
          notes: callSim.notes || 'VoIP Inbound automated call log.',
        });

        setSimResult({
          type: 'success',
          message: `Success! Telephony event from "${callSim.callerNumber}" (${callSim.durationMinutes} mins) was logged into your Calls Log.`,
        });
        fetchLogs();
      } else {
        setSimResult({
          type: 'error',
          message: 'Call webhook returned an error.',
        });
      }
    } catch (err: any) {
      setSimResult({
        type: 'error',
        message: err.message || 'Failed to simulate call webhook.',
      });
    } finally {
      setSimulating(false);
    }
  };

  const htmlEmbedCode = `<!-- Kairoo CRM Instant Website Lead Ingestion -->
<form action="${baseUrl}/api/webhooks/lead" method="POST">
  <input type="hidden" name="apiKey" value="${apiKey}" />
  <input type="hidden" name="source" value="Website Landing Page" />
  
  <input type="text" name="name" placeholder="Full Name" required />
  <input type="email" name="email" placeholder="Work Email" required />
  <input type="tel" name="phone" placeholder="Phone Number" />
  <input type="text" name="company" placeholder="Company Name" />
  <textarea name="message" placeholder="How can we help?"></textarea>
  
  <button type="submit">Submit Inquiry</button>
</form>`;

  const jsFetchCode = `// Kairoo CRM Fetch Integration (React / Next.js / Vue / WordPress)
async function submitLeadToCRM(formData) {
  const response = await fetch('${baseUrl}/api/webhooks/lead', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': '${apiKey}',
    },
    body: JSON.stringify({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      message: formData.message,
      source: window.location.hostname || 'Customer Website',
    }),
  });

  const data = await response.json();
  console.log('Ingested into Kairoo CRM:', data.leadId);
}`;

  return (
    <WorkspaceLayout
      title="Automations & API Hub"
      subtitle="Zero-manual data entry: Connect external websites, auto-sync incoming emails, and log VoIP calls automatically"
      actions={
        <button
          type="button"
          onClick={fetchLogs}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold text-[#0D2218] bg-white border border-[#0D2218]/15 hover:border-[#0D2218]/30 rounded-xl shadow-xs cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingLogs ? 'animate-spin' : ''}`} />
          <span>Refresh Activity</span>
        </button>
      }
    >
      {/* API Key & Webhook Gateway Banner */}
      <div className="p-6 rounded-3xl bg-white border border-[#0D2218]/10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-[#0D2218] text-[#C5A059]">
              <Webhook className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-extrabold text-[#0D2218]">
              Automated Ingestion Gateway
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Live & Active
            </span>
          </div>
          <p className="text-xs text-[#5C6862] max-w-xl">
            Incoming website inquiries, email replies, and telephony events are authenticated using your company's secure API Key.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#FAF6F0] p-2 rounded-2xl border border-[#0D2218]/12 w-full md:w-auto">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#5C6862] uppercase tracking-wider">Your Organization API Key</span>
            <code className="text-xs font-mono font-extrabold text-[#0D2218] tracking-tight">{apiKey}</code>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(apiKey, 'apiKey')}
            className="p-2 bg-white hover:bg-[#0D2218] hover:text-white rounded-xl text-[#0D2218] border border-[#0D2218]/10 transition-colors cursor-pointer"
            title="Copy API Key"
          >
            {copiedKey === 'apiKey' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Result Toast Notification */}
      {simResult && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
            simResult.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {simResult.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{simResult.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setSimResult(null)}
            className="text-xs underline font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Visual Ingestion Flow Architecture Diagram */}
      <AutomationsFlowDiagram />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-[#0D2218]/10 shadow-xs overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('website')}
          className={`flex-1 min-w-[160px] py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'website'
              ? 'bg-[#0D2218] text-[#FAF6F0] shadow-sm'
              : 'text-[#5C6862] hover:text-[#0D2218] hover:bg-[#FAF6F0]'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>1. Website Forms</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('email')}
          className={`flex-1 min-w-[160px] py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'email'
              ? 'bg-[#0D2218] text-[#FAF6F0] shadow-sm'
              : 'text-[#5C6862] hover:text-[#0D2218] hover:bg-[#FAF6F0]'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>2. Inbound Email Sync</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('telephony')}
          className={`flex-1 min-w-[160px] py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'telephony'
              ? 'bg-[#0D2218] text-[#FAF6F0] shadow-sm'
              : 'text-[#5C6862] hover:text-[#0D2218] hover:bg-[#FAF6F0]'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>3. Telephony & Calls</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logs')}
          className={`flex-1 min-w-[160px] py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'logs'
              ? 'bg-[#0D2218] text-[#FAF6F0] shadow-sm'
              : 'text-[#5C6862] hover:text-[#0D2218] hover:bg-[#FAF6F0]'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Live Ingestion Stream ({logs.length})</span>
        </button>
      </div>

      {/* TAB 1: WEBSITE FORM INGESTION */}
      {activeTab === 'website' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Instructions & Code Snippet */}
          <div className="bg-white p-6 rounded-3xl border border-[#0D2218]/10 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                Web-to-Lead Webhook
              </span>
              <h3 className="font-serif text-lg font-bold text-[#0D2218] mt-1">
                Website Contact Form Ingestion
              </h3>
              <p className="text-xs text-[#5C6862] mt-1">
                Drop this snippet into any website (WordPress, Webflow, Shopify, Squarespace, or custom code). When a visitor submits their inquiry, it creates a Lead in your CRM instantly.
              </p>
            </div>

            <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#0D2218]/10">
              <span className="text-[10px] font-bold text-[#5C6862] uppercase block mb-1">Live Webhook Endpoint</span>
              <div className="flex items-center justify-between">
                <code className="text-xs font-mono font-bold text-[#0D2218] truncate">
                  {baseUrl}/api/webhooks/lead
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(`${baseUrl}/api/webhooks/lead`, 'leadUrl')}
                  className="text-xs font-bold text-[#BA5D38] hover:underline flex items-center gap-1"
                >
                  {copiedKey === 'leadUrl' ? 'Copied!' : 'Copy URL'}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#0D2218] flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-[#3448C5]" />
                  <span>Embeddable HTML Form Snippet</span>
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(htmlEmbedCode, 'htmlEmbed')}
                  className="text-[11px] font-bold text-[#BA5D38] hover:underline"
                >
                  {copiedKey === 'htmlEmbed' ? 'Copied HTML!' : 'Copy Snippet'}
                </button>
              </div>
              <pre className="p-3 bg-[#0D2218] text-[#FAF6F0] rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto max-h-48">
                {htmlEmbedCode}
              </pre>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#0D2218] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>JavaScript / React Fetch Handler</span>
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(jsFetchCode, 'jsCode')}
                  className="text-[11px] font-bold text-[#BA5D38] hover:underline"
                >
                  {copiedKey === 'jsCode' ? 'Copied JS!' : 'Copy Code'}
                </button>
              </div>
              <pre className="p-3 bg-[#0D2218] text-[#FAF6F0] rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto max-h-48">
                {jsFetchCode}
              </pre>
            </div>
          </div>

          {/* Interactive Live Simulator */}
          <div className="bg-white p-6 rounded-3xl border border-[#0D2218]/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#0D2218]/8">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0D2218]">
                  Test Website Form Simulator
                </h3>
                <p className="text-xs text-[#5C6862]">
                  Simulate a real submission from your external website to test live CRM ingestion.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#BA5D38]/10 text-[#BA5D38]">
                Interactive Sandbox
              </span>
            </div>

            <form onSubmit={handleSimulateLead} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-[#0D2218]">Lead Full Name *</label>
                <input
                  type="text"
                  required
                  value={leadSim.name}
                  onChange={(e) => setLeadSim({ ...leadSim, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#0D2218]">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={leadSim.email}
                    onChange={(e) => setLeadSim({ ...leadSim, email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#0D2218]">Phone Number</label>
                  <input
                    type="tel"
                    value={leadSim.phone}
                    onChange={(e) => setLeadSim({ ...leadSim, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#0D2218]">Company Name</label>
                <input
                  type="text"
                  value={leadSim.company}
                  onChange={(e) => setLeadSim({ ...leadSim, company: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#0D2218]">Website Inquiry Message</label>
                <textarea
                  rows={3}
                  value={leadSim.message}
                  onChange={(e) => setLeadSim({ ...leadSim, message: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218]"
                />
              </div>

              <button
                type="submit"
                disabled={simulating}
                className="w-full py-2.5 px-4 bg-[#0D2218] hover:bg-[#163827] text-[#FAF6F0] font-extrabold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {simulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-[#C5A059]" />}
                <span>Simulate Website Lead Ingestion</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: INBOUND EMAIL SYNC */}
      {activeTab === 'email' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#0D2218]/10 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                Email-to-CRM Auto Sync
              </span>
              <h3 className="font-serif text-lg font-bold text-[#0D2218] mt-1">
                Inbound Email Forwarding & Webhook
              </h3>
              <p className="text-xs text-[#5C6862] mt-1">
                Automatically matches incoming customer emails to existing contact records or generates a new inquiry thread without opening the CRM.
              </p>
            </div>

            <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-[#0D2218]/10 space-y-2">
              <span className="text-[10px] font-bold text-[#5C6862] uppercase block">Method A: Smart Forwarding / BCC Inbox</span>
              <div className="flex items-center justify-between">
                <code className="text-xs font-mono font-bold text-[#0D2218]">{smartForwardEmail}</code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(smartForwardEmail, 'fwdEmail')}
                  className="text-xs font-bold text-[#BA5D38] hover:underline"
                >
                  {copiedKey === 'fwdEmail' ? 'Copied!' : 'Copy Email'}
                </button>
              </div>
              <p className="text-[11px] text-[#5C6862]">
                Forward emails from Gmail or add this to your BCC list. It parses the thread and attaches to your client's Communication timeline.
              </p>
            </div>

            <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-[#0D2218]/10 space-y-2">
              <span className="text-[10px] font-bold text-[#5C6862] uppercase block">Method B: SendGrid / Postmark Inbound Parse Webhook</span>
              <div className="flex items-center justify-between">
                <code className="text-xs font-mono font-bold text-[#0D2218]">{baseUrl}/api/webhooks/email</code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(`${baseUrl}/api/webhooks/email`, 'emailWebhook')}
                  className="text-xs font-bold text-[#BA5D38] hover:underline"
                >
                  {copiedKey === 'emailWebhook' ? 'Copied!' : 'Copy Webhook'}
                </button>
              </div>
              <p className="text-[11px] text-[#5C6862]">
                Configure this URL in SendGrid Inbound Parse or Postmark to process emails received on your domain.
              </p>
            </div>
          </div>

          {/* Interactive Email Simulator */}
          <div className="bg-white p-6 rounded-3xl border border-[#0D2218]/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#0D2218]/8">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0D2218]">
                  Simulate Inbound Customer Email
                </h3>
                <p className="text-xs text-[#5C6862]">
                  Test receiving an incoming email from a client to verify auto-linking to their timeline.
                </p>
              </div>
            </div>

            <form onSubmit={handleSimulateEmail} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-[#0D2218]">Sender Email (Client From) *</label>
                <input
                  type="email"
                  required
                  value={emailSim.from}
                  onChange={(e) => setEmailSim({ ...emailSim, from: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#0D2218]">Subject Line *</label>
                <input
                  type="text"
                  required
                  value={emailSim.subject}
                  onChange={(e) => setEmailSim({ ...emailSim, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#0D2218]">Email Body Content *</label>
                <textarea
                  rows={4}
                  required
                  value={emailSim.body}
                  onChange={(e) => setEmailSim({ ...emailSim, body: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218]"
                />
              </div>

              <button
                type="submit"
                disabled={simulating}
                className="w-full py-2.5 px-4 bg-[#0D2218] hover:bg-[#163827] text-[#FAF6F0] font-extrabold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {simulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4 text-[#C5A059]" />}
                <span>Simulate Inbound Email Processing</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: TELEPHONY & CALLS */}
      {activeTab === 'telephony' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#0D2218]/10 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Cloud Telephony Webhook
              </span>
              <h3 className="font-serif text-lg font-bold text-[#0D2218] mt-1">
                Automated VoIP & Call Tracking
              </h3>
              <p className="text-xs text-[#5C6862] mt-1">
                Connect your business virtual phone number (Twilio, Exotel, Plivo, Knowlarity, or Asterisk PBX). Inbound customer calls are captured with durations, rep assignment, and recording links automatically.
              </p>
            </div>

            <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-[#0D2218]/10 space-y-2">
              <span className="text-[10px] font-bold text-[#5C6862] uppercase block">Telephony Webhook URL (Status Callback)</span>
              <div className="flex items-center justify-between">
                <code className="text-xs font-mono font-bold text-[#0D2218]">{baseUrl}/api/webhooks/calls</code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(`${baseUrl}/api/webhooks/calls`, 'callWebhook')}
                  className="text-xs font-bold text-[#BA5D38] hover:underline"
                >
                  {copiedKey === 'callWebhook' ? 'Copied!' : 'Copy Webhook'}
                </button>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-extrabold text-[#0D2218]">Supported Cloud PBX Providers:</span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl border border-[#0D2218]/10 bg-[#FAF6F0] font-semibold text-[#0D2218]">
                  • Twilio Voice StatusCallback
                </div>
                <div className="p-2.5 rounded-xl border border-[#0D2218]/10 bg-[#FAF6F0] font-semibold text-[#0D2218]">
                  • Exotel Passthrough URL
                </div>
                <div className="p-2.5 rounded-xl border border-[#0D2218]/10 bg-[#FAF6F0] font-semibold text-[#0D2218]">
                  • Plivo Call Ingestion
                </div>
                <div className="p-2.5 rounded-xl border border-[#0D2218]/10 bg-[#FAF6F0] font-semibold text-[#0D2218]">
                  • Zapier Telephony Triggers
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Call Simulator */}
          <div className="bg-white p-6 rounded-3xl border border-[#0D2218]/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#0D2218]/8">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0D2218]">
                  Simulate Inbound Telephony Call
                </h3>
                <p className="text-xs text-[#5C6862]">
                  Simulate a completed telephone call to verify it updates your Calls Log.
                </p>
              </div>
            </div>

            <form onSubmit={handleSimulateCall} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#0D2218]">Caller Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={callSim.callerNumber}
                    onChange={(e) => setCallSim({ ...callSim, callerNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#0D2218]">Contact Name (if known)</label>
                  <input
                    type="text"
                    value={callSim.contactName}
                    onChange={(e) => setCallSim({ ...callSim, contactName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#0D2218]">Call Duration (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    value={callSim.durationMinutes}
                    onChange={(e) => setCallSim({ ...callSim, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#0D2218]">Call Outcome</label>
                  <select
                    value={callSim.status}
                    onChange={(e) => setCallSim({ ...callSim, status: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218]"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Missed">Missed</option>
                    <option value="Voicemail">Voicemail</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#0D2218]">Telephony Summary / Notes</label>
                <textarea
                  rows={3}
                  value={callSim.notes}
                  onChange={(e) => setCallSim({ ...callSim, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#0D2218]/12 rounded-xl text-[#0D2218]"
                />
              </div>

              <button
                type="submit"
                disabled={simulating}
                className="w-full py-2.5 px-4 bg-[#0D2218] hover:bg-[#163827] text-[#FAF6F0] font-extrabold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {simulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PhoneCall className="w-4 h-4 text-[#C5A059]" />}
                <span>Simulate Telephony Call Event</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE INGESTION STREAM */}
      {activeTab === 'logs' && (
        <div className="bg-white p-6 rounded-3xl border border-[#0D2218]/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#0D2218]/8">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0D2218]">
                Real-Time Webhook Activity Stream
              </h3>
              <p className="text-xs text-[#5C6862]">
                Live feed of automated inbound events received from your website, email parsers, and cloud telephony.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#5C6862]">
              {logs.length} Total Events
            </span>
          </div>

          {logs.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#5C6862]">
              No automated webhook events recorded yet. Run a simulation above to test!
            </div>
          ) : (
            <div className="divide-y divide-[#0D2218]/8">
              {logs.map((log) => (
                <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-3">
                    <span
                      className={`p-2 rounded-xl shrink-0 ${
                        log.source === 'Website Form'
                          ? 'bg-blue-100 text-blue-800'
                          : log.source === 'Inbound Email'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {log.source === 'Website Form' ? (
                        <Globe className="w-4 h-4" />
                      ) : log.source === 'Inbound Email' ? (
                        <Mail className="w-4 h-4" />
                      ) : (
                        <PhoneCall className="w-4 h-4" />
                      )}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#0D2218]">{log.source}</span>
                        <span className="text-[10px] font-mono font-bold bg-[#0D2218]/6 px-1.5 py-0.2 rounded text-[#0D2218]">
                          {log.eventType}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                          201 OK
                        </span>
                      </div>
                      <p className="text-[11px] text-[#2D3632] mt-0.5">{log.summary}</p>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-[#5C6862] self-end sm:self-center">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </WorkspaceLayout>
  );
};
export default AutomationsPage;
