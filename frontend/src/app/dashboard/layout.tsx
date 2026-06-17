'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/hooks/useAuth';
import { DairyLoader } from '@/components/common/DairyLoader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // The access token lives in memory only, so a hard refresh clears
    // `user` from Redux even with a valid refresh token sitting in
    // localStorage. The apiClient's 401 interceptor will silently
    // refresh on the next request; here we just avoid redirecting away
    // before that has a chance to happen.
    if (!user && !window.localStorage.getItem('refreshToken')) {
      router.replace('/login');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <DairyLoader size="lg" label="लोड हो रहा है..." />
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
