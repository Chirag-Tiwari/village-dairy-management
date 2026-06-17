'use client';

import React, { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { milkEntrySchema, MilkEntryFormValues, previewProtsahan } from './milkSchema';
import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';
import { Button } from '@/components/common/Button';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { submitEntryRequested } from '@/redux/slices/milkSlice';
import { useTranslation } from '@/lib/i18n';
import { Farmer } from '@/types';

interface AddMilkEntryFormProps {
  farmers: Farmer[];
  collectionDate: string; // ISO date string, e.g. 2026-06-17
  onSuccess?: () => void;
}

export function AddMilkEntryForm({ farmers, collectionDate, onSuccess }: AddMilkEntryFormProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { submitStatus, error } = useAppSelector((state) => state.milk);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<MilkEntryFormValues>({
    resolver: zodResolver(milkEntrySchema),
    defaultValues: { farmerId: '', milkQuantityL: undefined, fat: undefined, snf: undefined, ratePerLitre: undefined },
  });

  // Watch quantity/snf/rate live to drive the calculation preview below
  // the form, without waiting for a server round trip.
  const milkQuantityLRaw = useWatch({ control, name: 'milkQuantityL' });
  const snfRaw = useWatch({ control, name: 'snf' });
  const ratePerLitreRaw = useWatch({ control, name: 'ratePerLitre' });

  const milkQuantityL = toNumberOrNull(milkQuantityLRaw);
  const snf = toNumberOrNull(snfRaw);
  const ratePerLitre = toNumberOrNull(ratePerLitreRaw);

  const preview = useMemo(() => {
    const totalAmount = milkQuantityL && ratePerLitre ? Math.round(milkQuantityL * ratePerLitre * 100) / 100 : 0;
    const { rate, amount } = snf !== null && milkQuantityL ? previewProtsahan(milkQuantityL, snf) : { rate: 0, amount: 0 };
    return { totalAmount, protsahanRate: rate, protsahanAmount: amount };
  }, [milkQuantityL, snf, ratePerLitre]);

  const farmerOptions = farmers.map((f) => ({ value: f.id, label: `${f.name} (${f.category})` }));

  const onSubmit = (values: MilkEntryFormValues) => {
    dispatch(
      submitEntryRequested({
        ...values,
        collectionDate,
      }),
    );
    reset();
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        label={t('milkRegister.selectFarmer')}
        placeholder={t('milkRegister.selectFarmer')}
        options={farmerOptions}
        error={errors.farmerId?.message}
        {...register('farmerId')}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Input
          label={`${t('common.milk')} (${t('common.litres')})`}
          type="number"
          step="0.1"
          error={errors.milkQuantityL?.message}
          {...register('milkQuantityL')}
        />
        <Input label={t('common.fat')} type="number" step="0.1" error={errors.fat?.message} {...register('fat')} />
        <Input label={t('common.snf')} type="number" step="0.1" error={errors.snf?.message} {...register('snf')} />
        <Input
          label={t('common.ratePerLitre')}
          type="number"
          step="0.5"
          error={errors.ratePerLitre?.message}
          {...register('ratePerLitre')}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-md bg-slate-50 p-3 text-sm sm:grid-cols-4">
        <PreviewStat label={t('common.amount')} value={`₹${preview.totalAmount.toFixed(2)}`} />
        <PreviewStat label={t('common.protsahanRate')} value={`₹${preview.protsahanRate}/L`} />
        <PreviewStat label={t('common.protsahan')} value={`₹${preview.protsahanAmount.toFixed(2)}`} />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button type="submit" isLoading={submitStatus === 'loading'} className="w-full sm:w-auto">
        {t('milkRegister.addEntry')}
      </Button>
    </form>
  );
}

function PreviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-semibold text-brand-700">{value}</p>
    </div>
  );
}

function toNumberOrNull(value: unknown): number | null {
  if (value === undefined || value === null || value === '') return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
}
