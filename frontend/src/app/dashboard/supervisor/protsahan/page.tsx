'use client';

import React, { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MonthSelector } from '@/components/common/MonthSelector';
import { DairySelector } from '@/components/common/DairySelector';
import { RegisterMatrixTable } from '@/components/tables/RegisterMatrixTable';
import { Button } from '@/components/common/Button';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchRegisterRequested, approveRequested, markPaidRequested } from '@/redux/slices/protsahanSlice';

export default function SupervisorProtsahanPage() {
  const dispatch = useAppDispatch();
  const { register, status, actionStatus, error } = useAppSelector((state) => state.protsahan);
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [dairyId, setDairyId] = useState('');

  useEffect(() => {
    if (dairyId) dispatch(fetchRegisterRequested({ year, month, dairyId }));
  }, [year, month, dairyId, dispatch]);

  const pendingCount = register?.statusCounts.PENDING ?? 0;
  const approvedCount = register?.statusCounts.APPROVED ?? 0;

  return (
    <div>
      <DashboardHeader title="Protsahan Register" subtitle="Released separately from the monthly milk payment" />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <DairySelector value={dairyId} onChange={setDairyId} />
          <MonthSelector year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m); }} />
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            isLoading={actionStatus === 'loading'}
            disabled={pendingCount === 0}
            onClick={() => dispatch(approveRequested({ year, month, dairyId }))}
          >
            Approve pending ({pendingCount})
          </Button>
          <Button
            isLoading={actionStatus === 'loading'}
            disabled={approvedCount === 0}
            onClick={() => dispatch(markPaidRequested({ year, month, dairyId }))}
          >
            Mark approved as paid ({approvedCount})
          </Button>
        </div>
      </div>

      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}

      <RegisterMatrixTable matrix={register} isLoading={status === 'loading'} amountLabel="Daily protsahan amounts" />
    </div>
  );
}
