'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { AddFarmerForm } from '@/features/farmers/AddFarmerForm';
import { farmerApi } from '@/services/farmer.service';
import { Farmer } from '@/types';
import { useTranslation } from '@/lib/i18n';

export default function SecretaryFarmersPage() {
  const { t } = useTranslation();
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFarmers = useCallback(() => {
    setIsLoading(true);
    farmerApi
      .listForDairy()
      .then(setFarmers)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    loadFarmers();
  }, [loadFarmers]);

  return (
    <div>
      <DashboardHeader title={t('common.farmer')} />

      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <Card>
          <h3 className="mb-3 text-sm font-semibold text-slate-700">Register new farmer</h3>
          <AddFarmerForm onRegistered={loadFarmers} />
        </Card>

        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">{t('common.name')}</th>
                  <th className="px-4 py-3">{t('common.mobileNumber')}</th>
                  <th className="px-4 py-3">{t('common.village')}</th>
                  <th className="px-4 py-3">{t('common.category')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                      {t('common.loading')}
                    </td>
                  </tr>
                ) : farmers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                      No farmers registered yet.
                    </td>
                  </tr>
                ) : (
                  farmers.map((farmer) => (
                    <tr key={farmer.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{farmer.name}</td>
                      <td className="px-4 py-3">{farmer.mobileNumber}</td>
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
      </div>
    </div>
  );
}
