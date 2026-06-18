import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { loginSchema, LoginFormValues } from './loginSchema';
import { Input } from '@/components/forms/Input';
import { Button } from '@/components/common/Button';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { loginRequested } from '@/redux/slices/authSlice';
import { useTranslation } from '@/lib/i18n';
import { ROLE_HOME_ROUTE } from '@/constants/roles';

export function LoginForm() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, error, user } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (user) {
      router.replace(ROLE_HOME_ROUTE[user.role]);
    }
  }, [user, router]);

  const onSubmit = (values: LoginFormValues) => {
    dispatch(loginRequested(values));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label={t('common.mobileNumber')}
        type="tel"
        inputMode="numeric"
        placeholder="9876543210"
        error={errors.mobileNumber?.message}
        {...register('mobileNumber')}
      />
      
      <Input
        label={t('common.password')}
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      {error ? (
        <p className="rounded-lg bg-red-50 border border-red-200 px-3.5 py-2 text-sm text-red-700">
          {error === 'Invalid mobile number or password' ? t('auth.invalidCredentials') : error}
        </p>
      ) : null}

      <Button type="submit" isLoading={status === 'loading'} className="w-full">
        {t('common.login')}
      </Button>
    </form>
  );
}
