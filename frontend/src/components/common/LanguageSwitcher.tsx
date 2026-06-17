'use client';

import { useTranslation } from '@/lib/i18n';

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="inline-flex rounded-md border border-slate-200 bg-white p-0.5 text-sm">
      <button
        onClick={() => setLocale('hi')}
        className={`rounded px-2.5 py-1 transition-colors ${
          locale === 'hi' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        हिं
      </button>
      <button
        onClick={() => setLocale('en')}
        className={`rounded px-2.5 py-1 transition-colors ${
          locale === 'en' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        EN
      </button>
    </div>
  );
}
