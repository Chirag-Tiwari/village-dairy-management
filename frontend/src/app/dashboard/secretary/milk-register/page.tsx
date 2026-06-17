'use client';

import React, { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card } from '@/components/common/Card';
import { AddMilkEntryForm } from '@/features/milk/AddMilkEntryForm';
import { MilkRegisterTable } from '@/components/tables/MilkRegisterTable';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchRegisterRequested } from '@/redux/slices/milkSlice';
import { useTranslation } from '@/lib/i18n';
import { farmerApi } from '@/services/farmer.service';
import { Farmer } from '@/types';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function MilkRegisterPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { register, status } = useAppSelector((state) => state.milk);
  const [date, setDate] = useState(todayIso());
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [farmersLoading, setFarmersLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchRegisterRequested({ date }));
  }, [date, dispatch]);

  useEffect(() => {
    farmerApi
      .listForDairy()
      .then(setFarmers)
      .finally(() => setFarmersLoading(false));
  }, []);

  return (
    <div>
      <DashboardHeader title={t('milkRegister.title')} subtitle={date} />

      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <Card>
          <h3 className="mb-3 text-sm font-semibold text-slate-700">{t('milkRegister.addEntry')}</h3>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-slate-700">{t('common.date')}</label>
            <input
              type="date"
              value={date}
              max={todayIso()}
              onChange={(e) => setDate(e.target.value)}
              className="input-base"
            />
          </div>
          {farmersLoading ? (
            <p className="text-sm text-slate-400">{t('common.loading')}</p>
          ) : (
            <AddMilkEntryForm farmers={farmers} collectionDate={date} />
          )}
        </Card>

        <MilkRegisterTable data={register} isLoading={status === 'loading'} />
      </div>
    </div>
  );
}
