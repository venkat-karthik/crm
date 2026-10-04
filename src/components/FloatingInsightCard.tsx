import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export interface FloatingCardData {
  id: string;
  type: 'lead' | 'reminder' | 'ticket' | 'revenue' | 'activity';
  title: string;
  subtitle: string;
  meta: string;
  icon?: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  avatar?: string;
  floatingOffset?: { y: number[]; duration: number; delay: number };
  className?: string;
}

interface FloatingInsightCardProps {
  card: FloatingCardData;
}

export const FloatingInsightCard: React.FC<FloatingInsightCardProps> = ({ card }) => {
  const navigate = useNavigate();
  const { title, subtitle, meta, icon, badge, badgeColor, avatar, floatingOffset } = card;

  const handleCardClick = () => {
    switch (card.type) {
      case 'lead':
        navigate('/leads');
        break;
      case 'reminder':
        navigate('/calendar');
        break;
      case 'ticket':
        navigate('/tickets');
        break;
      case 'revenue':
        navigate('/reports');
        break;
      case 'activity':
        navigate('/customers');
        break;
      default:
        navigate('/dashboard');
    }
  };

  return (
    <motion.div
      onClick={handleCardClick}
      animate={{
        y: floatingOffset ? floatingOffset.y : [0, -7, 0],
      }}
      transition={{
        duration: floatingOffset?.duration || 5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: floatingOffset?.delay || 0,
      }}
      className={`bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-[#0D2218]/10 shadow-[0_14px_36px_-6px_rgba(13,34,24,0.16)] hover:shadow-[0_20px_44px_-6px_rgba(13,34,24,0.22)] hover:border-[#BA5D38]/50 transition-all duration-300 pointer-events-auto select-none cursor-pointer ${card.className || ''}`}
    >
      <div className="flex items-start gap-2.5">
        {/* Avatar or Icon */}
        {avatar ? (
          <div className="w-8 h-8 rounded-full bg-[#FAF6F0] border border-[#0D2218]/12 overflow-hidden flex items-center justify-center shrink-0 text-xs font-bold text-[#0D2218] shadow-xs">
            {avatar}
          </div>
        ) : icon ? (
          <div className="w-8 h-8 rounded-xl bg-[#FAF6F0] border border-[#0D2218]/12 flex items-center justify-center shrink-0 text-[#0D2218] shadow-xs">
            {icon}
          </div>
        ) : null}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1.5 mb-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C6862]">
              {title}
            </span>
            {badge && (
              <span
                className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${
                  badgeColor || 'bg-[#BA5D38]/10 text-[#BA5D38] border-[#BA5D38]/20'
                }`}
              >
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-[13px] font-bold text-[#151A18] truncate leading-tight">
            {subtitle}
          </p>
          <p className="text-[11px] text-[#5C6862] flex items-center gap-1 mt-0.5 font-medium truncate">
            <span>{meta}</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};
