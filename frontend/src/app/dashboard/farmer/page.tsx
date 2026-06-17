'use client';

import React, { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { milkApi } from '@/services/milk.service';
import { MilkEntry } from '@/types';
import { useTranslation } from '@/lib/i18n';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchMyLedgerRequested } from '@/redux/slices/protsahanSlice';

const STATUS_TONE = { PENDING: 'neutral', APPROVED: 'info', PAID: 'success' } as const;

export default function FarmerDashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { myLedger } = useAppSelector((state) => state.protsahan);
  const [history, setHistory] = useState<MilkEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    milkApi
      .getMyHistory()
      .then(setHistory)
      .finally(() => setIsLoading(false));
    dispatch(fetchMyLedgerRequested());
  }, [dispatch]);

  const totalAmount = history.reduce((sum, e) => sum + Number(e.totalAmount), 0);

  // Split by status rather than one lump sum, since the spec treats
  // pending and approved protsahan as distinct things a farmer checks --
  // pending hasn't even been reviewed yet, approved is waiting for the
  // eventual payout round.
  const protsahanByStatus = myLedger.reduce(
    (acc, entry) => {
      acc[entry.status] = (acc[entry.status] ?? 0) + Number(entry.protsahanAmount);
      return acc;
    },
    { PENDING: 0, APPROVED: 0, PAID: 0 } as Record<string, number>,
  );

  return (
    <div>
      <DashboardHeader title={t('dashboard.farmer')} subtitle={user?.name} />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Recorded entries" value={isLoading ? '—' : String(history.length)} />
        <StatCard label={t('dashboard.myPayments')} value={isLoading ? '—' : `₹${totalAmount.toFixed(2)}`} tone="brand" />
        <StatCard label="Pending protsahan" value={`₹${protsahanByStatus.PENDING.toFixed(2)}`} />
        <StatCard label="Approved protsahan" value={`₹${protsahanByStatus.APPROVED.toFixed(2)}`} tone="brand" />
      </div>

      <Card className="mt-5 p-0">
        <h3 className="border-b border-slate-200 p-4 text-sm font-semibold text-slate-700">{t('dashboard.myProtsahan')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">{t('common.date')}</th>
                <th className="px-4 py-3">{t('common.amount')}</th>
                <th className="px-4 py-3">{t('common.status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myLedger.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-slate-400">
                    No protsahan recorded yet.
                  </td>
                </tr>
              ) : (
                myLedger.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">{new Date(entry.collectionDate).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3 font-medium text-brand-700">₹{Number(entry.protsahanAmount).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <Badge tone={STATUS_TONE[entry.status]}>{entry.status}</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="mt-5 p-0">
        <h3 className="border-b border-slate-200 p-4 text-sm font-semibold text-slate-700">{t('dashboard.myMilkHistory')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">{t('common.date')}</th>
                <th className="px-4 py-3">{t('common.milk')} (L)</th>
                <th className="px-4 py-3">{t('common.amount')}</th>
                <th className="px-4 py-3">{t('common.protsahan')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                    {t('common.loading')}
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                    No records yet.
                  </td>
                </tr>
              ) : (
                history.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">{new Date(entry.collectionDate).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">{Number(entry.milkQuantityL).toFixed(1)}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">₹{Number(entry.totalAmount).toFixed(2)}</td>
                    <td className="px-4 py-3 text-brand-700">₹{Number(entry.protsahanAmount).toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
