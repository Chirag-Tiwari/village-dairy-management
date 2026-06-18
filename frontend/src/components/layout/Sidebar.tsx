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
    <nav className="flex h-full w-full flex-col gap-1.5 bg-slate-900 p-4 text-slate-200 border-r border-slate-800">
      <div className="mb-6 flex items-center gap-2.5 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700 text-sm font-bold text-white shadow-sm">
          ग्रा
        </div>
        <span className="text-sm font-bold tracking-tight text-white">{t('common.appName')}</span>
      </div>

      <div className="flex flex-col gap-1">
        {NAV_BY_ROLE[role].map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                isActive
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              {t(item.labelKey)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
