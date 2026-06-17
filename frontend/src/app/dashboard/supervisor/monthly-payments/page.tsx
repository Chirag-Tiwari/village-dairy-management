'use client';

import React, { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MonthSelector } from '@/components/common/MonthSelector';
import { DairySelector } from '@/components/common/DairySelector';
import { RegisterMatrixTable } from '@/components/tables/RegisterMatrixTable';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchRegisterRequested, verifyRequested, approveRequested } from '@/redux/slices/monthlyPaymentSlice';

const STATUS_TONE = { PENDING: 'neutral', VERIFIED: 'info', APPROVED: 'success' } as const;

export default function SupervisorMonthlyPaymentsPage() {
  const dispatch = useAppDispatch();
  const { register, status, actionStatus, error } = useAppSelector((state) => state.monthlyPayment);
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [dairyId, setDairyId] = useState('');

  useEffect(() => {
    if (dairyId) dispatch(fetchRegisterRequested({ year, month, dairyId }));
  }, [year, month, dairyId, dispatch]);

  const allApproved = register ? register.rows.every((r) => r.status === 'APPROVED') : false;
  const allVerifiedOrApproved = register
    ? register.rows.every((r) => r.status === 'VERIFIED' || r.status === 'APPROVED')
    : false;

  return (
    <div>
      <DashboardHeader title="Monthly Payments" subtitle="Verify row/column totals, then approve for release" />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <DairySelector value={dairyId} onChange={setDairyId} />
          <MonthSelector year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m); }} />
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            isLoading={actionStatus === 'loading'}
            disabled={!register || register.rows.length === 0 || !register.isBalanced}
            onClick={() => dispatch(verifyRequested({ year, month, dairyId }))}
          >
            Verify month
          </Button>
          <Button
            isLoading={actionStatus === 'loading'}
            disabled={!allVerifiedOrApproved || allApproved}
            onClick={() => dispatch(approveRequested({ year, month, dairyId }))}
          >
            Approve month
          </Button>
        </div>
      </div>

      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
      {allApproved ? (
        <div className="mb-3">
          <Badge tone="success">This month is fully approved</Badge>
        </div>
      ) : null}

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
