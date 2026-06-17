'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card } from '@/components/common/Card';
import { milkApi } from '@/services/milk.service';
import { useTranslation } from '@/lib/i18n';

export default function SecretaryDashboardPage() {
  const { t } = useTranslation();
  const [totals, setTotals] = useState({ totalMilk: 0, totalAmount: 0, totalProtsahan: 0 });
  const [entryCount, setEntryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    milkApi
      .getDailyRegister(today)
      .then((res) => {
        setTotals(res.totals);
        setEntryCount(res.entries.length);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <DashboardHeader title={t('dashboard.secretary')} subtitle="Today's collection at a glance" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Entries today" value={isLoading ? '—' : String(entryCount)} />
        <StatCard label={t('milkRegister.totalMilk')} value={isLoading ? '—' : `${totals.totalMilk.toFixed(1)} L`} />
        <StatCard label={t('milkRegister.totalAmount')} value={isLoading ? '—' : `₹${totals.totalAmount.toFixed(2)}`} tone="brand" />
        <StatCard label={t('milkRegister.totalProtsahan')} value={isLoading ? '—' : `₹${totals.totalProtsahan.toFixed(2)}`} tone="brand" />
      </div>

      <Card className="mt-5">
        <h3 className="mb-2 text-sm font-semibold text-slate-700">Quick actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/secretary/milk-register" className="btn-primary">
            {t('milkRegister.addEntry')}
          </Link>
          <Link href="/dashboard/secretary/farmers" className="btn-secondary">
            Register a farmer
          </Link>
        </div>
      </Card>
    </div>
  );
}
