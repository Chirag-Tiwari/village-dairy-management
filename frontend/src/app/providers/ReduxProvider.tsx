'use client';

import React, { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/redux/store';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  // Created once per browser tab via useRef, not useState, so it survives
  // re-renders without recreating the saga middleware.
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
