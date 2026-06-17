'use client';

import React from 'react';

interface DairyLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const SIZE_MAP = { sm: 32, md: 48, lg: 72 };

// The signature branded loader: a milk can with liquid that rises and
// falls, paired with a gentle wave line. Built in slate/emerald so it
// reads as "professional dairy system," not a generic spinner.
export function DairyLoader({ size = 'md', label }: DairyLoaderProps) {
  const px = SIZE_MAP[size];

  return (
    <div className="flex flex-col items-center justify-center gap-2" role="status" aria-live="polite">
      <svg width={px} height={px} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="canClip">
            <path d="M16 14 L48 14 L45 56 Q32 60 19 56 Z" />
          </clipPath>
        </defs>

        {/* Can body outline */}
        <path
          d="M16 14 L48 14 L45 56 Q32 60 19 56 Z"
          stroke="#334155"
          strokeWidth="2.5"
          fill="#f8fafc"
        />
        {/* Can lid */}
        <rect x="22" y="6" width="20" height="8" rx="2" fill="#334155" />
        <rect x="27" y="2" width="10" height="6" rx="2" fill="#334155" />

        {/* Rising/falling milk fill, clipped to the can's silhouette */}
        <g clipPath="url(#canClip)">
          <rect
            x="14"
            y="14"
            width="36"
            height="46"
            fill="#059669"
            className="origin-bottom animate-milk-fill"
            style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}
          />
        </g>

        {/* Can outline redrawn on top so the fill never overflows visually */}
        <path
          d="M16 14 L48 14 L45 56 Q32 60 19 56 Z"
          stroke="#334155"
          strokeWidth="2.5"
          fill="none"
        />
      </svg>
      {label ? <p className="text-sm text-slate-500">{label}</p> : null}
    </div>
  );
}
