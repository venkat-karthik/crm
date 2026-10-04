import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Play,
  Pause,
  CheckCircle2,
  Sparkles,
  Target,
  GitBranch,
  LifeBuoy,
  ArrowRight,
  TrendingUp,
  Volume2,
} from 'lucide-react';
import { KairooLogo } from './KairooLogo';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignup: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({
  isOpen,
  onClose,
  onOpenSignup,
}) => {
  const [activeFeature, setActiveFeature] = useState<'leads' | 'pipeline' | 'ai' | 'tickets'>('leads');
  const [isPlaying, setIsPlaying] = useState(true);

  if (!isOpen) return null;

  const demoTracks = [
    {
      id: 'leads',
      title: 'AI Lead Capture & Enrichment',
      icon: Target,
      headline: 'From website visit to qualified score in 3 seconds',
      description:
        'Kairoo automatically scans inbound inquiries, checks company revenue, locates decision-makers on LinkedIn, and calculates buying propensity.',
      metrics: '88% accuracy · 3x faster qualification',
    },
    {
      id: 'pipeline',
      title: 'Dynamic Sales Pipeline',
      icon: GitBranch,
      headline: 'Visual deal velocity without manual data entry',
      description:
        'Drag deals across stages with automatic contract generation, proposal open tracking, and AI-predicted close dates.',
      metrics: '₹48.6L tracked · 14-day average cycle',
    },
    {
      id: 'ai',
      title: 'Kairoo AI Intelligence',
      icon: Sparkles,
      headline: 'Autonomous account summaries & deal alerts',
      description:
        'Our custom fine-tuned business model drafts personalized meeting agendas, flags risk indicators, and suggests next best steps.',
      metrics: '4 hours saved/rep/week · 98% confidence',
    },
    {
      id: 'tickets',
      title: 'Unified Customer Support',
      icon: LifeBuoy,
      headline: 'SLA-backed ticket triage across WhatsApp & Email',
      description:
        'Support tickets automatically link to customer lifetime revenue, allowing priority routing for high-value accounts.',
      metrics: '< 15 min first response · 99.4% SLA adherence',
    },
  ];

  const currentTrack = demoTracks.find((t) => t.id === activeFeature) || demoTracks[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#07150E]/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-[#FCFBF8] rounded-2xl border border-[#0D2218]/15 shadow-2xl overflow-hidden z-10"
        >
          {/* Top Bar */}
          <div className="bg-[#0D2218] text-[#FAF6F0] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <KairooLogo variant="light" size="sm" />
              <span className="text-xs uppercase tracking-widest text-[#C5A059] border-l border-[#FAF6F0]/20 pl-3 hidden sm:inline">
                Interactive Product Walkthrough
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[#FAF6F0]/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Screen & Content */}
          <div className="p-6 sm:p-8">
            {/* Feature Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              {demoTracks.map((track) => {
                const Icon = track.icon;
                const isSelected = activeFeature === track.id;
                return (
                  <button
                    key={track.id}
                    onClick={() => setActiveFeature(track.id as any)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#0D2218] text-[#FAF6F0] border-[#0D2218] shadow-sm'
                        : 'bg-[#FAF6F0] text-[#2D3632] border-[#0D2218]/10 hover:bg-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#C5A059]' : 'text-[#BA5D38]'}`} />
                    <span className="text-xs font-semibold truncate">{track.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Simulation Frame */}
            <div className="relative rounded-xl overflow-hidden border border-[#0D2218]/15 bg-[#07150E] text-white p-6 sm:p-8 shadow-inner min-h-[300px] flex flex-col justify-between">
              {/* Simulation Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059] block mb-1">
                    Live Feature Demonstration
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl font-medium text-[#FAF6F0]">
                    {currentTrack.headline}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    SIMULATING
                  </span>
                </div>
              </div>

              {/* Simulation Center Visual Simulation */}
              <div className="py-6 space-y-3">
                <p className="text-sm text-[#FAF6F0]/80 leading-relaxed max-w-xl">
                  {currentTrack.description}
                </p>

                <div className="p-3.5 rounded-lg bg-[#112B1F]/80 border border-[#204B37] flex items-center justify-between text-xs max-w-lg">
                  <span className="text-[#C5A059] font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Key Verified Metric:
                  </span>
                  <span className="font-mono text-[#FAF6F0]">{currentTrack.metrics}</span>
                </div>
              </div>

              {/* Player Progress Bar */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-8 h-8 rounded-full bg-[#FAF6F0] text-[#07150E] flex items-center justify-center hover:bg-[#C5A059] transition-colors"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                  </button>
                  <span className="text-xs text-[#FAF6F0]/60 font-mono">01:42 / 03:00</span>
                </div>

                <div className="flex-1 max-w-xs h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#C5A059]"
                    initial={{ width: '20%' }}
                    animate={{ width: isPlaying ? '75%' : '75%' }}
                    transition={{ duration: 10, repeat: Infinity }}
                  />
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#FAF6F0]/70">
                  <Volume2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Audio Guide Active</span>
                </div>
              </div>
            </div>

            {/* Bottom Footer CTA */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#0D2218]/10">
              <span className="text-xs text-[#5C6862]">
                Want to test Kairoo with your live customer data?
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-[#0D2218] border border-[#0D2218]/15 rounded-full hover:bg-[#FAF6F0]"
                >
                  Close Tour
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onOpenSignup();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-[#FAF6F0] bg-[#0D2218] hover:bg-[#163827] rounded-full shadow-sm"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
