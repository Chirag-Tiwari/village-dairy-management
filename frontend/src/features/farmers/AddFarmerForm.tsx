'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';
import { Button } from '@/components/common/Button';
import { farmerApi } from '@/services/farmer.service';
import { useTranslation } from '@/lib/i18n';

const addFarmerSchema = z.object({
  name: z.string().trim().min(2, 'Name is too short'),
  mobileNumber: z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  village: z.string().trim().min(2, 'Village is required'),
  category: z.enum(['GEN', 'SC', 'ST']),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AddFarmerFormValues = z.infer<typeof addFarmerSchema>;

export function AddFarmerForm({ onRegistered }: { onRegistered: () => void }) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AddFarmerFormValues>({ resolver: zodResolver(addFarmerSchema) });

  const onSubmit = async (values: AddFarmerFormValues) => {
    try {
      await farmerApi.register(values);
      reset();
      onRegistered();
    } catch (error: unknown) {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError('mobileNumber', { message: message || 'Could not register farmer' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label={t('common.name')} error={errors.name?.message} {...register('name')} />
      <Input
        label={t('common.mobileNumber')}
        type="tel"
        inputMode="numeric"
        error={errors.mobileNumber?.message}
        {...register('mobileNumber')}
      />
      <Input label={t('common.village')} error={errors.village?.message} {...register('village')} />
      <Select
        label={t('common.category')}
        options={[
          { value: 'GEN', label: 'GEN' },
          { value: 'SC', label: 'SC' },
          { value: 'ST', label: 'ST' },
        ]}
        error={errors.category?.message}
        {...register('category')}
      />
      <Input
        label={t('common.password')}
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />
      <Button type="submit" isLoading={isSubmitting} className="w-full">
        {t('common.save')}
      </Button>
    </form>
  );
}
