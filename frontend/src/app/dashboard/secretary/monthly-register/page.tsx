'use client';

import React, { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MonthSelector } from '@/components/common/MonthSelector';
import { RegisterMatrixTable } from '@/components/tables/RegisterMatrixTable';
import { Badge } from '@/components/common/Badge';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchRegisterRequested } from '@/redux/slices/monthlyPaymentSlice';

const STATUS_TONE = { PENDING: 'neutral', VERIFIED: 'info', APPROVED: 'success' } as const;

export default function SecretaryMonthlyRegisterPage() {
  const dispatch = useAppDispatch();
  const { register, status } = useAppSelector((state) => state.monthlyPayment);
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  useEffect(() => {
    dispatch(fetchRegisterRequested({ year, month }));
  }, [year, month, dispatch]);

  return (
    <div>
      <DashboardHeader title="Monthly Payment Register" subtitle="Read-only — supervisors verify and approve" />

      <div className="mb-4">
        <MonthSelector year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m); }} />
      </div>

      <RegisterMatrixTable
        matrix={register}
        isLoading={status === 'loading'}
        amountLabel="Monthly milk payments"
        renderRowBadge={(row) => (
          <Badge tone={STATUS_TONE[row.status as keyof typeof STATUS_TONE] ?? 'neutral'}>{row.status}</Badge>
        )}
      />
    </div>
  );
}
