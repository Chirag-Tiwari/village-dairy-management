'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import hi from '@/locales/hi.json';
import en from '@/locales/en.json';

export type Locale = 'hi' | 'en';

const dictionaries: Record<Locale, Record<string, unknown>> = { hi, en };

const STORAGE_KEY = 'village-dairy-locale';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

// Resolves a dotted key like "milkRegister.title" against the active dictionary.
function resolve(dict: Record<string, unknown>, key: string): string {
  const value = key.split('.').reduce<unknown>((acc, segment) => {
    if (acc && typeof acc === 'object' && segment in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[segment];
    }
    return undefined;
  }, dict);

  return typeof value === 'string' ? value : key;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Hindi is the mandated default for rural users; only switch if the
  // person has explicitly chosen English before on this device.
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === 'undefined') return 'hi';
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'en' ? 'en' : 'hi';
  });

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  }, []);

  const t = useCallback((key: string) => resolve(dictionaries[locale], key), [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return (
    <I18nContext.Provider value={value}>
      <div lang={locale} className={locale === 'hi' ? 'font-devanagari' : 'font-sans'}>
        {children}
      </div>
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within I18nProvider');
  }
  return ctx;
}
