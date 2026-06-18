'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface DairyLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  onComplete?: () => void;
}

const SIZE_MAP = { sm: 32, md: 52, lg: 76 };

export function DairyLoader({ size = 'md', label, onComplete }: DairyLoaderProps) {
  const px = SIZE_MAP[size];
  const [progress, setProgress] = useState(0);

  // Synchronized loader progress logic for the 'lg' intro loader
  useEffect(() => {
    if (size !== 'lg') return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 25); // 25ms * 100 = 2500ms total duration

    return () => clearInterval(interval);
  }, [size]);

  // Call onComplete once progress hits 100% with a small delay for settling
  useEffect(() => {
    if (size === 'lg' && progress === 100 && onComplete) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [progress, size, onComplete]);

  // If lg size, render the synchronized cow and milk can loader
  if (size === 'lg') {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200/60 shadow-sm max-w-md w-full mx-auto" role="status" aria-live="polite">
        <div className="relative w-full h-24 mb-4 select-none">
          {/* Walking Cow Silhouette */}
          <motion.div
            className="absolute bottom-2 text-slate-800"
            style={{ left: `${progress * 0.72}%` }}
            animate={progress < 100 ? { y: [0, -3, 0], rotate: [0, -2, 2, 0] } : { y: 0, rotate: 0 }}
            transition={progress < 100 ? { repeat: Infinity, duration: 0.6, ease: 'easeInOut' } : { duration: 0.3 }}
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
              <path
                d="M 12,24 C 12,24 9,20 6,20 C 4,20 2,22 2,24 C 2,26 3,27 4,27 L 4,37 L 7,37 L 7,45 L 11,45 L 11,37 L 15,37 L 15,45 L 19,45 L 19,37 C 22,37 24,35 25,32 C 26,35 28,37 31,37 L 35,37 L 35,45 L 39,45 L 39,37 L 42,37 C 44,37 45,36 45,34 C 45,32 43,27 40,27 L 38,20 C 37,17 35,15 32,15 L 25,15 C 22,15 20,17 19,19 C 17,19 14,20 12,24 Z"
                fill="#1e293b"
              />
            </svg>
          </motion.div>

          {/* Metallic Milk Can */}
          <div className="absolute right-0 bottom-2">
            <svg width="48" height="64" viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-16">
              <defs>
                <linearGradient id="metalGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="30%" stopColor="#cbd5e1" />
                  <stop offset="70%" stopColor="#475569" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
                <clipPath id="canClip">
                  <path d="M12 16 L36 16 L34 58 Q24 62 14 58 Z" />
                </clipPath>
              </defs>
              
              {/* Milk fill inside */}
              <g clipPath="url(#canClip)">
                <rect x="0" y="0" width="48" height="64" fill="#334155" opacity="0.1" />
                {/* Wave path */}
                <motion.path
                  d={progress < 100 ? "M0 10 Q12 6, 24 10 T48 10 L48 64 L0 64 Z" : "M0 10 L48 10 L48 64 L0 64 Z"}
                  fill="#ffffff"
                  animate={progress < 100 ? { x: [0, -24, -48] } : { x: 0 }}
                  transition={progress < 100 ? { repeat: Infinity, duration: 1, ease: 'linear' } : { duration: 0.4 }}
                  style={{
                    y: `${50 - (progress * 50) / 100}px`
                  }}
                  className="origin-bottom"
                />
              </g>

              {/* Can body outline */}
              <path
                d="M12 16 L36 16 L34 58 Q24 62 14 58 Z"
                stroke="url(#metalGrad)"
                strokeWidth="2.5"
                fill="none"
              />
              
              {/* Can details */}
              <rect x="18" y="8" width="12" height="8" rx="1" fill="url(#metalGrad)" stroke="#475569" strokeWidth="1" />
              <rect x="21" y="4" width="6" height="4" rx="1" fill="url(#metalGrad)" stroke="#475569" strokeWidth="1" />
            </svg>
          </div>

          {/* Green Ground Pasture */}
          <div className="absolute bottom-0 left-0 right-0 h-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-green-500 w-full shadow-inner" />
        </div>

        {/* Progress label & text */}
        <div className="w-full flex justify-between items-center text-xs font-semibold text-slate-500 mb-1">
          <span>{label || 'लोड हो रहा है...'}</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div className="bg-brand-600 h-full transition-all duration-150" style={{ width: `${progress}%` }} />
        </div>
      </div>
    );
  }

  // Standard Spinner mode (for size = 'sm' | 'md')
  return (
    <div className="flex flex-col items-center justify-center gap-3" role="status" aria-live="polite">
      <div className="relative" style={{ width: px, height: px }}>
        <svg width={px} height={px} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Static track */}
          <circle cx="32" cy="32" r="26" stroke="#f1f5f9" strokeWidth="3" fill="none" />
          
          {/* Spinning sage green loader ring */}
          <circle
            cx="32"
            cy="32"
            r="26"
            stroke="#15803d"
            strokeWidth="3"
            strokeDasharray="40 120"
            strokeLinecap="round"
            className="animate-spin origin-center"
            style={{ transformOrigin: 'center' }}
          />

          {/* Minimal Milk Bottle Outline */}
          <path
            d="M28 16h8v5l4 4v17a2 2 0 01-2 2H26a2 2 0 01-2-2V25l4-4v-5z"
            stroke="#1e293b"
            strokeWidth="2.5"
            strokeLinejoin="round"
            fill="#ffffff"
          />
          
          {/* Muted green milk drop symbol */}
          <path
            d="M32 29c1.5 2 2.5 3.5 2.5 5a2.5 2.5 0 01-5 0c0-1.5 1-3 2.5-5z"
            fill="#16a34a"
          />
        </svg>
      </div>
      {label ? <p className="text-sm font-medium text-slate-500">{label}</p> : null}
    </div>
  );
}
