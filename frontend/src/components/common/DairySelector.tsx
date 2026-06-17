'use client';

import React, { useEffect, useState } from 'react';
import { dairyApi } from '@/services/dairy.service';
import { Dairy } from '@/types';

interface DairySelectorProps {
  value: string;
  onChange: (dairyId: string) => void;
}

// Used only on supervisor pages: a supervisor oversees several dairies
// and has to pick one before viewing its monthly payment or protsahan
// register. Secretaries never see this -- their dairy is implicit.
export function DairySelector({ value, onChange }: DairySelectorProps) {
  const [dairies, setDairies] = useState<Dairy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dairyApi
      .listForRegion()
      .then((list) => {
        setDairies(list);
        if (!value && list.length > 0) onChange(list[0].id);
      })
      .finally(() => setIsLoading(false));
  }, [value, onChange]);

  if (isLoading) {
    return <div className="skeleton h-9 w-48" />;
  }

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="input-base max-w-[220px]">
      {dairies.map((dairy) => (
        <option key={dairy.id} value={dairy.id}>
          {dairy.name} — {dairy.village}
        </option>
      ))}
    </select>
  );
}
