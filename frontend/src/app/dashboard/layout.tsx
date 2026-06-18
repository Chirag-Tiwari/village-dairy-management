'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/hooks/useAuth';
import { DairyLoader } from '@/components/common/DairyLoader';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    // Redirect if there is no user and no refresh token exists.
    if (!user && !window.localStorage.getItem('refreshToken')) {
      router.replace('/login');
    }
  }, [user, router]);

  // Keep loader visible until both user is loaded and the cow animation is completed.
  const shouldShowLoader = !user || !introComplete;

  return (
    <>
      <AnimatePresence mode="wait">
        {shouldShowLoader ? (
          <motion.div
            key="loader-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50"
          >
            <div className="w-full max-w-sm px-4">
              <DairyLoader
                size="lg"
                label={user ? 'डेशबोर्ड तैयार किया जा रहा है...' : 'लोड हो रहा है...'}
                onComplete={() => {
                  if (user) {
                    setIntroComplete(true);
                  }
                }}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!shouldShowLoader && (
        <motion.div
          key="dashboard-app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="min-h-screen"
        >
          <AppShell>{children}</AppShell>
        </motion.div>
      )}
    </>
  );
}
