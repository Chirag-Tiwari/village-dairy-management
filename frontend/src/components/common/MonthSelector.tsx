'use client';

import React from 'react';

interface MonthSelectorProps {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function MonthSelector({ year, month, onChange }: MonthSelectorProps) {
  const goPrev = () => {
    if (month === 1) onChange(year - 1, 12);
    else onChange(year, month - 1);
  };

  const goNext = () => {
    if (month === 12) onChange(year + 1, 1);
    else onChange(year, month + 1);
  };

  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1.5">
      <button onClick={goPrev} className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="Previous month">
        ‹
      </button>
      <span className="min-w-[120px] text-center text-sm font-medium text-slate-700">
        {MONTH_NAMES[month - 1]} {year}
      </span>
      <button onClick={goNext} className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="Next month">
        ›
      </button>
    </div>
  );
}
