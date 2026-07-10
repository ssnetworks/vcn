'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface CounterProps {
  value: number;
  suffix?: string;
}

function Counter({ value, suffix = '' }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px 0px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000; // 2 seconds
    const end = value;
    const startTime = performance.now();

    const updateCount = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function: easeOutQuad
      const easedProgress = progress * (2 - progress);
      const currentCount = Math.floor(easedProgress * end);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isInView, value]);

  return (
    <span ref={ref} className="font-mono text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-blue cyber-text-glow">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function Stats() {
  const stats = [
    { label: 'Ethical Hackers', value: 1500, suffix: '+' },
    { label: 'Women Harassment Cases Assisted', value: 6000, suffix: '+' },
    { label: 'Drug-Related Networks Reported', value: 3000, suffix: '+' },
    { label: 'Human Trafficking Sites Reported', value: 2500, suffix: '+' },
    { label: 'Child Exploitation Sites Reported', value: 3000, suffix: '+' },
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-slate-950/60 border-y border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Stat Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-panel p-6 rounded-sm text-center flex flex-col justify-between items-center min-h-[160px] relative"
            >
              {/* Decorative top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-cyan/40 to-transparent" />
              
              <div className="flex-grow flex items-center justify-center mb-4">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              
              <p className="text-slate-400 text-xs sm:text-sm font-medium tracking-wide uppercase font-mono h-10 flex items-center justify-center">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Audit / Achievements Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-[10px] sm:text-xs text-slate-500 max-w-2xl mx-auto italic">
            Disclaimer: These figures represent VCN's documented achievements, submitted reports, and cybersecurity assistance activities registered by our volunteer network since community inception.
          </p>
        </div>

      </div>
    </section>
  );
}
