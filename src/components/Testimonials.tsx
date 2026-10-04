import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

interface TestimonialsProps {
  onOpenStories?: () => void;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ onOpenStories }) => {
  const testimonials = [
    {
      id: 1,
      quote: 'Kairoo completely transformed the way we manage our customers.',
      author: 'Anita Desai',
      role: 'Head of Growth',
      company: 'Arka Global Enterprise',
      avatar: 'AD',
      metric: '+140% pipeline velocity',
      badge: 'B2B Services',
    },
    {
      id: 2,
      quote: "Kairoo's insight system helped our team follow up faster.",
      author: 'Vikram Mehra',
      role: 'VP Sales & Partnerships',
      company: 'Zenith Logistics Hub',
      avatar: 'VM',
      metric: '3.4x faster response SLA',
      badge: 'Logistics',
    },
    {
      id: 3,
      quote: 'Simple, powerful and beautiful. Kairoo is exactly what our business needed.',
      author: 'Devika Sen',
      role: 'Founder & CEO',
      company: 'Studio Lumina Architecture',
      avatar: 'DS',
      metric: '₹2.4 Cr revenue managed',
      badge: 'Design Agency',
    },
  ];

  return (
    <section
      id="stories"
      className="py-24 sm:py-32 bg-[#FAF6F0] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-xl text-left">
            <div className="inline-flex items-center gap-2.5 mb-4">
              <span className="w-5 h-[1.5px] bg-[#BA5D38]" />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-[#5C6862]">
                REAL-TIME INSIGHTS
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.85rem] font-normal text-[#0D2218] tracking-tight leading-[1.12] mb-4">
              Real Businesses. <br />
              <span className="italic font-light text-[#BA5D38]">Real Results.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#2D3632]/85 leading-relaxed">
              Join teams that trust Kairoo to build stronger customer relationships and grow faster.
            </p>
          </div>

          <button
            onClick={onOpenStories}
            className="self-start md:self-auto group inline-flex items-center gap-2.5 px-6 py-3 text-xs sm:text-sm font-semibold text-[#0D2218] bg-white border border-[#0D2218]/15 hover:border-[#0D2218]/30 rounded-full transition-all duration-200 shadow-xs hover:shadow active:scale-[0.98] cursor-pointer"
          >
            <span>Read Customer Stories</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1 text-[#BA5D38]" />
          </button>
        </div>

        {/* Cinematic Backdrop Image Container */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#0D2218]/12">
          {/* Business Environment Image */}
          <div className="relative aspect-[16/8] sm:aspect-[16/7] lg:aspect-[16/6] w-full min-h-[300px]">
            <img
              src="/src/assets/images/results_business_environment_1790601375598.jpg"
              alt="Premium executive modern corporate environment"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter saturate-[0.92] contrast-[1.05]"
            />
            {/* Cinematic Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D2218]/90 via-[#0D2218]/40 to-transparent" />

            {/* Overlaid headline on the image */}
            <div className="absolute top-8 left-8 sm:top-12 sm:left-12 max-w-md hidden sm:block text-white">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                Proven Scale
              </span>
              <p className="font-serif text-2xl lg:text-3xl text-white font-normal mt-1 leading-snug">
                From high-growth scaleups to established industry leaders.
              </p>
            </div>
          </div>

          {/* 3 Overlay Testimonial Cards overlapping the image bottom */}
          <div className="relative -mt-20 sm:-mt-24 lg:-mt-28 px-4 sm:px-6 pb-6 sm:pb-8 z-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {testimonials.map((t, idx) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-[#0D2218]/12 shadow-[0_16px_36px_-8px_rgba(13,34,24,0.18)] flex flex-col justify-between hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    {/* Top star rating & badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#5C6862] bg-[#FAF6F0] px-2.5 py-0.5 rounded-full border border-[#0D2218]/8 font-medium">
                        {t.badge}
                      </span>
                    </div>

                    {/* Quote */}
                    <p className="font-serif text-base sm:text-[17px] text-[#0D2218] leading-snug mb-5 italic">
                      "{t.quote}"
                    </p>
                  </div>

                  {/* Author Lockup */}
                  <div className="pt-4 border-t border-[#0D2218]/8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#0D2218] text-[#FAF6F0] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        {t.avatar}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#0D2218] truncate">
                          {t.author}
                        </h4>
                        <p className="text-[11px] text-[#5C6862] truncate">
                          {t.role}, {t.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
