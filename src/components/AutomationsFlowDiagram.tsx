import React from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  Mail,
  PhoneCall,
  Webhook,
  Target,
  GitBranch,
  MessageSquare,
  Bell,
  ArrowRight,
  Zap,
} from 'lucide-react';

export const AutomationsFlowDiagram: React.FC = () => {
  return (
    <div className="bg-[#0D2218] text-[#FAF6F0] p-6 sm:p-8 rounded-3xl border border-[#C5A059]/20 shadow-xl relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#BA5D38]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-[#C5A059] text-[#0D2218]">
                <Zap className="w-4 h-4 fill-current" />
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#FAF6F0]">
                Automated Ingestion Flow Architecture
              </h3>
            </div>
            <p className="text-xs text-[#FAF6F0]/70 mt-1">
              Zero-latency pipeline routing inbound external events directly into persistent CRM databases.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-emerald-400">Stream Online</span>
          </div>
        </div>

        {/* 3-Column Diagram Grid */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* Column 1: Sources (4 cols) */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C5A059] block">
              1. Inbound Sources
            </span>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 backdrop-blur-xs"
            >
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-xs block text-white">Website Forms</span>
                <span className="text-[10px] text-white/60">WordPress, Webflow, React</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 backdrop-blur-xs"
            >
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-xs block text-white">Inbound Emails</span>
                <span className="text-[10px] text-white/60">BCC / Smart Forwarding</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 backdrop-blur-xs"
            >
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-xs block text-white">Telephony VoIP</span>
                <span className="text-[10px] text-white/60">Twilio, Exotel, Plivo</span>
              </div>
            </motion.div>
          </div>

          {/* Connective Column 1: Pulses */}
          <div className="md:col-span-1 hidden md:flex flex-col items-center justify-center space-y-8">
            <motion.div
              animate={{ x: [0, 8, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
              <ArrowRight className="w-5 h-5 text-[#C5A059]" />
            </motion.div>
          </div>

          {/* Column 2: Center Gateway Hub (3 cols) */}
          <div className="md:col-span-3">
            <div className="p-5 rounded-3xl bg-gradient-to-b from-[#183928] to-[#0A1A12] border border-[#C5A059]/40 text-center shadow-lg relative">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C5A059] block mb-2">
                2. Real-Time Engine
              </span>
              <div className="w-12 h-12 rounded-2xl bg-[#C5A059] text-[#0D2218] flex items-center justify-center mx-auto mb-3 shadow-md">
                <Webhook className="w-6 h-6 animate-spin" style={{ animationDuration: '10s' }} />
              </div>
              <h4 className="font-serif text-sm font-bold text-white">
                Kairoo Ingestion Gateway
              </h4>
              <p className="text-[11px] text-[#FAF6F0]/70 mt-1">
                API Key Auth · Payload Validation · Multi-Tenant Routing
              </p>
              <div className="mt-3 py-1 px-2.5 rounded-full bg-white/10 text-[10px] font-mono text-[#C5A059] inline-block">
                /api/webhooks/*
              </div>
            </div>
          </div>

          {/* Connective Column 2: Pulses */}
          <div className="md:col-span-1 hidden md:flex flex-col items-center justify-center space-y-8">
            <motion.div
              animate={{ x: [0, 8, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.75, ease: 'easeInOut' }}
            >
              <ArrowRight className="w-5 h-5 text-emerald-400" />
            </motion.div>
          </div>

          {/* Column 3: Automated CRM Destinations (3 cols) */}
          <div className="md:col-span-3 space-y-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 block">
              3. Auto-Routed Records
            </span>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/8 flex items-center gap-2.5 text-xs">
              <Target className="w-4 h-4 text-[#BA5D38] shrink-0" />
              <div>
                <span className="font-bold block text-white text-[11px]">Leads & Accounts</span>
                <span className="text-[10px] text-white/50">Auto-created with company details</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/8 flex items-center gap-2.5 text-xs">
              <MessageSquare className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <span className="font-bold block text-white text-[11px]">Customer Timeline</span>
                <span className="text-[10px] text-white/50">Attached full message thread</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/8 flex items-center gap-2.5 text-xs">
              <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold block text-white text-[11px]">Calls & VoIP Logs</span>
                <span className="text-[10px] text-white/50">Duration & audio transcript</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/8 flex items-center gap-2.5 text-xs">
              <Bell className="w-4 h-4 text-[#C5A059] shrink-0" />
              <div>
                <span className="font-bold block text-white text-[11px]">Instant Rep Alerts</span>
                <span className="text-[10px] text-white/50">Zero-latency team notifications</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
