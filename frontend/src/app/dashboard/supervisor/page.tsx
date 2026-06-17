'use client';

import React, { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { farmerApi } from '@/services/farmer.service';
import { Farmer } from '@/types';
import { useTranslation } from '@/lib/i18n';

export default function SupervisorDashboardPage() {
  const { t } = useTranslation();
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    farmerApi
      .listForRegion()
      .then(setFarmers)
      .finally(() => setIsLoading(false));
  }, []);

  const dairyCount = new Set(farmers.map((f) => f.dairyId)).size;

  return (
    <div>
      <DashboardHeader title={t('dashboard.supervisor')} subtitle="Region overview" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Dairies in region" value={isLoading ? '—' : String(dairyCount)} />
        <StatCard label="Farmers in region" value={isLoading ? '—' : String(farmers.length)} tone="brand" />
      </div>

      <Card className="mt-5 p-0">
        <h3 className="border-b border-slate-200 p-4 text-sm font-semibold text-slate-700">All farmers in region</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">{t('common.name')}</th>
                <th className="px-4 py-3">{t('common.village')}</th>
                <th className="px-4 py-3">{t('common.category')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-slate-400">
                    {t('common.loading')}
                  </td>
                </tr>
              ) : (
                farmers.map((farmer) => (
                  <tr key={farmer.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{farmer.name}</td>
                    <td className="px-4 py-3">{farmer.village}</td>
                    <td className="px-4 py-3">
                      <Badge tone="neutral">{farmer.category}</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="mt-4 text-sm text-slate-400">
        Monthly payment approval and protsahan release controls land here in the next build phase.
      </p>
    </div>
  );
}
