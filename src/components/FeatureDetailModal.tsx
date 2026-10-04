import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight, Sparkles } from 'lucide-react';
import { KairooLogo } from './KairooLogo';

interface FeatureDetailModalProps {
  featureName: string | null;
  onClose: () => void;
  onOpenSignup: () => void;
}

export const FeatureDetailModal: React.FC<FeatureDetailModalProps> = ({
  featureName,
  onClose,
  onOpenSignup,
}) => {
  if (!featureName) return null;

  const featureDetailsMap: Record<
    string,
    {
      title: string;
      category: string;
      description: string;
      capabilities: string[];
      sync: string;
    }
  > = {
    Customers: {
      title: '360° Customer Profiles',
      category: 'Relationship Management',
      description:
        'Unify every purchase, support conversation, email exchange, and meeting history under a single consolidated customer record with automated timeline synthesis.',
      capabilities: [
        'Automatic deduplication and identity resolution',
        'Customer lifetime value (LTV) and health scoring',
        'Custom entity fields and relationship tagging',
        'Direct synchronization with billing and ERP engines',
      ],
      sync: 'Syncs with Stripe, Razorpay, QuickBooks, Tally',
    },
    Leads: {
      title: 'Automated Lead Qualification & Capture',
      category: 'Inbound Growth Engine',
      description:
        'Capture leads from web forms, WhatsApp, Facebook ads, webinars, and partner portals in real-time, then enrich with business firmographics.',
      capabilities: [
        'Instant AI qualification and score weighting',
        'Lead decay alerts if not contacted within 15 minutes',
        'Smart geographic and skill-based round robin distribution',
        'Full attribution tracking by campaign and UTM source',
      ],
      sync: 'Syncs with Webhooks, Meta Ads, Google Ads, Zapier',
    },
    'Sales Pipeline': {
      title: 'Visual Pipeline & Deal Forecasting',
      category: 'Sales Execution',
      description:
        'Manage deal velocity across multiple customized pipelines. Track win probabilities, proposal opens, and milestone achievements with drag-and-drop ease.',
      capabilities: [
        'Customizable Kanban and spreadsheet table views',
        'Weighted revenue forecasting based on historical close rates',
        'Automated document proposal & contract generation',
        'Stagnant deal alerts and rep coaching prompts',
      ],
      sync: 'Integrated with DocuSign, PandaDoc, Google Workspace',
    },
    Tasks: {
      title: 'Intelligent Task Prioritization',
      category: 'Productivity & Focus',
      description:
        'Eliminate forgotten follow-ups with automated task generation based on deal lifecycle events, customer inquiries, and calendar commitments.',
      capabilities: [
        'Automatic follow-up task generation after meetings',
        'Daily focus queue grouped by deal urgency',
        'Shared task delegation with team accountability logs',
        'Sub-task checklists with milestone completion triggers',
      ],
      sync: 'Syncs with Google Tasks, Apple Reminders, Slack',
    },
    Communication: {
      title: 'Omni-Channel Customer Inbox',
      category: 'Unified Messaging',
      description:
        'Read and respond to emails, WhatsApp messages, SMS, and internal notes in one collaborative inbox. Never switch apps to follow up.',
      capabilities: [
        'Shared team inboxes with collision detection',
        'AI email drafting matching brand tone of voice',
        'WhatsApp Business Cloud API integration',
        'Two-way email sync with open and click tracking',
      ],
      sync: 'Syncs with Gmail, Outlook 365, WhatsApp Business',
    },
    Calls: {
      title: 'VoIP Telephony & Call Intelligence',
      category: 'Telephony & Logging',
      description:
        'Make and receive calls directly from browser or mobile app. Automated call recordings, live transcripts, and sentiment summaries attached to the contact.',
      capabilities: [
        'Single-click browser dialing with global caller ID',
        'Automatic speech-to-text transcription and action item extraction',
        'Call outcome tags and instant follow-up triggers',
        'Call recording archive with GDPR/compliance controls',
      ],
      sync: 'Syncs with Twilio, Exotel, Air有意, Aircall',
    },
    Calendar: {
      title: 'Smart Meeting Scheduling',
      category: 'Calendar & Bookings',
      description:
        'Share personalized booking links that automatically match rep availability, buffer time zones, and log scheduled demos directly in the CRM.',
      capabilities: [
        'Personal and round-robin team scheduling links',
        'Automated Google Meet and Zoom link generation',
        'Pre-meeting reminder SMS and WhatsApp alerts to cut no-shows',
        'Custom intake questionnaires embedded into the invite flow',
      ],
      sync: 'Syncs with Google Calendar, Outlook Calendar, Zoom',
    },
    'Support Tickets': {
      title: 'SLA-Driven Customer Support',
      category: 'Service & Retention',
      description:
        'Resolve customer issues fast with ticket prioritization tied to customer enterprise value and strict response SLAs.',
      capabilities: [
        'Multi-channel ticket creation (email, portal, WhatsApp)',
        'SLA breach escalation rules with manager alerts',
        'Canned responses and AI-powered reply suggestions',
        'Customer satisfaction (CSAT) survey automation',
      ],
      sync: 'Syncs with Zendesk, Intercom, Freshdesk, Email',
    },
    'Reports & Analytics': {
      title: 'Executive Business Intelligence',
      category: 'Analytics & Reporting',
      description:
        'Build custom dashboards, slice data by team or region, and forecast quarterly numbers with crystal clarity.',
      capabilities: [
        'Drag-and-drop report builder with 40+ pre-built chart types',
        'Rep leaderboard and activity tracking',
        'Cohort retention and lifetime value reporting',
        'Automated scheduled PDF reports sent directly to leadership',
      ],
      sync: 'Exports to CSV, Excel, Google Sheets, PowerBI',
    },
    'AI Insights': {
      title: 'Kairoo AI Neural Assistant',
      category: 'Artificial Intelligence',
      description:
        'Continuous background machine learning that monitors sales funnels, detects churn risks before they happen, and recommends winning playbook tactics.',
      capabilities: [
        'Autonomous customer health score calculation',
        'Deal win/loss prediction with explainable factor weights',
        'Automated executive summaries of weekly customer interactions',
        'Smart next-step suggestions based on top reps behaviors',
      ],
      sync: 'Powered by Gemini Enterprise Reasoning Engine',
    },
    Notifications: {
      title: 'Multi-Channel Alert Center',
      category: 'Alerts & Webhooks',
      description:
        'Stay ahead of high-stakes moments. Receive real-time alerts when high-value leads submit forms, proposals are viewed, or contracts are signed.',
      capabilities: [
        'Instant push notifications to mobile and desktop',
        'Configurable Slack and WhatsApp team notification channels',
        'High-value deal alerts triggered upon proposal opening',
        'Quiet hours and notification digest preferences',
      ],
      sync: 'Syncs with Slack, Microsoft Teams, Webhooks, Push',
    },
    'Users & Roles': {
      title: 'Granular Role-Based Access Control (RBAC)',
      category: 'Security & Governance',
      description:
        'Protect sensitive customer records and financial data with enterprise-grade permission models, team hierarchies, and audit logging.',
      capabilities: [
        'Custom role creation (Admin, Sales Manager, Rep, Support Agent)',
        'Territory and pipeline visibility boundaries',
        'Complete chronological audit logs of all record changes',
        'SAML 2.0 Single Sign-On (SSO) and mandatory MFA',
      ],
      sync: 'Syncs with Okta, Azure AD, Google Workspace SSO',
    },
  };

  const feature = featureDetailsMap[featureName] || {
    title: featureName,
    category: 'Core CRM Module',
    description:
      'Seamlessly integrated with the entire Kairoo platform to ensure high velocity and team alignment.',
    capabilities: [
      'Real-time data synchronization across all devices',
      'Built-in search, filtering, and export tools',
      'Bank-grade encryption and secure access rules',
      'Custom webhook triggers and automation events',
    ],
    sync: 'Universal API & Webhooks support',
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#07150E]/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-xl bg-[#FAF6F0] rounded-2xl border border-[#0D2218]/15 shadow-2xl p-6 sm:p-8 z-10"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-[#5C6862] hover:text-[#0D2218] hover:bg-[#0D2218]/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#BA5D38] font-semibold">
              {feature.category}
            </span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D2218] mb-3">
            {feature.title}
          </h3>

          <p className="text-sm text-[#2D3632]/85 leading-relaxed mb-6">
            {feature.description}
          </p>

          <div className="bg-white rounded-xl p-4 border border-[#0D2218]/10 mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D2218] mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              Core Capabilities
            </h4>
            <div className="space-y-2">
              {feature.capabilities.map((cap, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-[#2D3632]">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{cap}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] font-mono text-[#5C6862] bg-[#FAF6F0] p-2.5 rounded-lg border border-[#0D2218]/10 mb-6 flex items-center justify-between">
            <span>Integration Ecosystem:</span>
            <span className="font-semibold text-[#0D2218]">{feature.sync}</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#0D2218] border border-[#0D2218]/15 rounded-full hover:bg-white"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenSignup();
              }}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-[#FAF6F0] bg-[#0D2218] hover:bg-[#163827] rounded-full shadow-sm"
            >
              <span>Try {featureName} Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
