'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/redux/hooks';
import { loggedOut } from '@/redux/slices/authSlice';
import { setAccessToken } from '@/services/apiClient';
import { authApi } from '@/services/auth.service';
import { useTranslation } from '@/lib/i18n';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (!user) {
    return null; // Route guard at the layout level handles the redirect.
  }

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      setAccessToken(null);
      window.localStorage.removeItem('refreshToken');
      dispatch(loggedOut());
      router.replace('/login');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <div className="hidden w-64 shrink-0 md:block">
        <Sidebar role={user.role} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="w-64">
            <Sidebar role={user.role} />
          </div>
          <button
            aria-label="Close menu"
            className="flex-1 bg-slate-900/40"
            onClick={() => setMobileNavOpen(false)}
          />
        </div>
      ) : null}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
          <button
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <div className="hidden text-sm text-slate-500 md:block">
            {user.name} · <span className="text-slate-400">{t(`common.${user.role === 'USER' ? 'farmer' : user.role.toLowerCase()}`)}</span>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button variant="secondary" onClick={handleLogout} className="px-3 py-1.5 text-xs">
              {t('common.logout')}
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
