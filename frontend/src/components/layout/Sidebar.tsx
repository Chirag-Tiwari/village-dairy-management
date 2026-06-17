'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Role } from '@/constants/roles';
import { useTranslation } from '@/lib/i18n';

interface NavItem {
  href: string;
  labelKey: string;
}

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  USER: [
    { href: '/dashboard/farmer', labelKey: 'dashboard.myMilkHistory' },
  ],
  SECRETARY: [
    { href: '/dashboard/secretary', labelKey: 'dashboard.secretary' },
    { href: '/dashboard/secretary/milk-register', labelKey: 'milkRegister.title' },
    { href: '/dashboard/secretary/farmers', labelKey: 'common.farmer' },
    { href: '/dashboard/secretary/monthly-register', labelKey: 'nav.monthlyRegister' },
    { href: '/dashboard/secretary/protsahan-register', labelKey: 'nav.protsahanRegister' },
  ],
  SUPERVISOR: [
    { href: '/dashboard/supervisor', labelKey: 'dashboard.supervisor' },
    { href: '/dashboard/supervisor/monthly-payments', labelKey: 'nav.monthlyPayments' },
    { href: '/dashboard/supervisor/protsahan', labelKey: 'nav.protsahan' },
  ],
};

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <nav className="flex h-full w-full flex-col gap-1 bg-slate-900 p-4 text-slate-200">
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 text-sm font-bold text-white">
          ग्रा
        </div>
        <span className="text-sm font-semibold text-white">{t('common.appName')}</span>
      </div>

      {NAV_BY_ROLE[role].map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-md px-3 py-2 text-sm transition-colors ${
              isActive ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {t(item.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
