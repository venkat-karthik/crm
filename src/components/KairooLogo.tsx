import React from 'react';

interface KairooLogoProps {
  className?: string;
  variant?: 'dark' | 'light' | 'monochrome';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const KairooLogo: React.FC<KairooLogoProps> = ({
  className = '',
  variant = 'dark',
  size = 'md',
  showTagline = false,
}) => {
  const isLight = variant === 'light';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Abstract geometric star / connection / growth symbol */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm transition-transform duration-300 hover:rotate-45"
        >
          {/* Outer subtle glow/orbit ring */}
          <circle
            cx="18"
            cy="18"
            r="16"
            stroke={isLight ? 'rgba(253, 251, 247, 0.2)' : 'rgba(13, 34, 24, 0.15)'}
            strokeWidth="1.2"
            strokeDasharray="2 3"
          />
          {/* Four petal connection star */}
          <path
            d="M18 3C18 11.2843 11.2843 18 3 18C11.2843 18 18 24.7157 18 33C18 24.7157 24.7157 18 33 18C24.7157 18 18 11.2843 18 3Z"
            fill={isLight ? '#FDFBF7' : '#0D2218'}
          />
          {/* Inner core diamond accent */}
          <path
            d="M18 11.5L22.5 18L18 24.5L13.5 18L18 11.5Z"
            fill={isLight ? '#C5A059' : '#BA5D38'}
          />
          {/* Center luminous point */}
          <circle
            cx="18"
            cy="18"
            r="2.2"
            fill={isLight ? '#0D2218' : '#FAF6F0'}
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <span
          className={`font-serif tracking-[0.16em] uppercase font-semibold leading-none ${textSizes[size]} ${
            isLight ? 'text-[#FDFBF7]' : 'text-[#0D2218]'
          }`}
        >
          KAIROO
        </span>
        {showTagline && (
          <span
            className={`text-[10px] tracking-widest uppercase mt-1 ${
              isLight ? 'text-[#FAF6F0]/70' : 'text-[#5C6862]'
            }`}
          >
            Smarter Customers. Stronger Business.
          </span>
        )}
      </div>
    </div>
  );
};
