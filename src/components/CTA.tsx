import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Check } from 'lucide-react';

interface CTAProps {
  onOpenSignup: () => void;
  onOpenDemo: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onOpenSignup, onOpenDemo }) => {
  return (
    <section
      id="cta"
      className="relative py-28 sm:py-36 lg:py-40 bg-[#07150E] text-[#FAF6F0] overflow-hidden"
    >
      {/* Background Image with Cinematic Depth & dark forest green layered vignette */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/src/assets/images/cta_cinematic_city_1790601393997.jpg"
          alt="Atmospheric architectural dusk cityscape"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // fallback if timestamp suffix varies
            (e.target as HTMLImageElement).src = '/src/assets/images/cta_cinematic_city_1790601393970.jpg';
          }}
          className="w-full h-full object-cover object-center filter saturate-[0.8] brightness-[0.4] scale-105"
        />
        {/* Layered vignette overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07150E] via-[#0D2218]/85 to-[#07150E]/90" />
      </div>

      {/* Subtle glowing radial gradient in center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[520px] bg-gradient-to-r from-[#204B37]/35 to-[#BA5D38]/15 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 mb-6"
        >
          <span className="w-6 h-[1.5px] bg-[#C5A059]" />
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A059]">
            START YOUR INTELLIGENT JOURNEY
          </span>
          <span className="w-6 h-[1.5px] bg-[#C5A059]" />
        </motion.div>

        {/* Large Editorial Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#FAF6F0] leading-[1.12] mb-6 max-w-4xl mx-auto"
        >
          Every Customer Has a Story. <br />
          <span className="italic font-light text-[#C5A059]">
            Kairoo Helps You Act on It.
          </span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-lg text-[#FAF6F0]/80 leading-relaxed mb-10 max-w-2xl mx-auto"
        >
          Start your customer journey today and experience a smarter way to grow your business.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
        >
          <button
            onClick={onOpenSignup}
            className="w-full sm:w-auto group inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-semibold text-[#07150E] bg-[#FAF6F0] hover:bg-[#C5A059] rounded-full transition-all duration-200 shadow-xl active:scale-[0.98] cursor-pointer"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          <button
            onClick={onOpenDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-medium text-[#FAF6F0] bg-white/10 hover:bg-white/15 border border-[#FAF6F0]/20 rounded-full transition-all duration-200 backdrop-blur-sm cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[#C5A059]">
              <Play className="w-3 h-3 fill-current ml-0.5" />
            </div>
            <span>Watch Demo</span>
          </button>
        </motion.div>

        {/* Quiet assurance notes */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#FAF6F0]/65">
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#C5A059]" />
            14-Day Free Enterprise Trial
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#C5A059]" />
            No Credit Card Required
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#C5A059]" />
            Setup in under 5 minutes
          </span>
        </div>
      </div>
    </section>
  );
};
