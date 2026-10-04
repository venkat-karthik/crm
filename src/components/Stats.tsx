import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export const Stats: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const stats = [
    {
      numeric: 10000,
      suffix: '+',
      label: 'Happy Businesses',
      subtext: 'across 42 growing industries',
    },
    {
      numeric: 50000,
      suffix: '+',
      label: 'Customers Managed',
      subtext: 'active relationships nurtured',
    },
    {
      numeric: 99.9,
      suffix: '%',
      label: 'Platform Uptime',
      subtext: 'enterprise-grade reliability SLA',
      isDecimal: true,
    },
    {
      numeric: 4.8,
      suffix: '/5',
      label: 'Customer Satisfaction',
      subtext: 'verified G2 & Capterra ratings',
      isDecimal: true,
    },
  ];

  return (
    <section
      ref={ref}
      className="py-16 sm:py-22 bg-[#FAF6F0] border-y border-[#0D2218]/10 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-[#0D2218]/10">
          {stats.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`flex flex-col items-center text-center px-4 ${
                idx > 1 ? 'pt-6 lg:pt-0' : idx === 1 ? 'pt-0' : 'pt-0'
              }`}
            >
              <div className="font-serif text-3xl sm:text-4xl lg:text-[3.25rem] font-normal text-[#0D2218] tracking-tight leading-none tabular-nums mb-2.5">
                <Counter
                  target={item.numeric}
                  isDecimal={item.isDecimal}
                  suffix={item.suffix}
                  isInView={isInView}
                />
              </div>

              <h4 className="text-sm font-bold text-[#0D2218] mb-1">
                {item.label}
              </h4>

              <p className="text-xs text-[#5C6862] max-w-[180px]">
                {item.subtext}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface CounterProps {
  target: number;
  isDecimal?: boolean;
  suffix: string;
  isInView: boolean;
}

const Counter: React.FC<CounterProps> = ({ target, isDecimal, suffix, isInView }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 1800; // ms
    const steps = 40;
    const increment = target / steps;
    const intervalTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span>
      {isDecimal
        ? count.toFixed(1)
        : Math.floor(count).toLocaleString()}
      {suffix}
    </span>
  );
};
