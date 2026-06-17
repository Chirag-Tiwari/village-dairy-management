'use client';

import React, { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MonthSelector } from '@/components/common/MonthSelector';
import { RegisterMatrixTable } from '@/components/tables/RegisterMatrixTable';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchRegisterRequested } from '@/redux/slices/protsahanSlice';

export default function SecretaryProtsahanRegisterPage() {
  const dispatch = useAppDispatch();
  const { register, status } = useAppSelector((state) => state.protsahan);
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  useEffect(() => {
    dispatch(fetchRegisterRequested({ year, month }));
  }, [year, month, dispatch]);

  return (
    <div>
      <DashboardHeader title="Protsahan Register" subtitle="Read-only — supervisors approve and mark as paid" />

      <div className="mb-4 flex items-center justify-between gap-3">
        <MonthSelector year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m); }} />
        {register ? (
          <div className="flex gap-4 text-sm">
            <StatusPill label="Pending" count={register.statusCounts.PENDING ?? 0} />
            <StatusPill label="Approved" count={register.statusCounts.APPROVED ?? 0} />
            <StatusPill label="Paid" count={register.statusCounts.PAID ?? 0} />
          </div>
        ) : null}
      </div>

      <RegisterMatrixTable matrix={register} isLoading={status === 'loading'} amountLabel="Daily protsahan amounts" />
    </div>
  );
}

function StatusPill({ label, count }: { label: string; count: number }) {
  return (
    <span className="text-slate-500">
      {label}: <span className="font-semibold text-slate-800">{count}</span>
    </span>
  );
}
