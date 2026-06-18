'use client';

import { LoginForm } from '@/features/auth/LoginForm';
import { motion } from 'framer-motion';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-amber-50/10 to-slate-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-700 text-xl font-bold text-white shadow-sm">
            ग्रा
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">अपने खाते में लॉगिन करें</h1>
          <p className="mt-2 text-sm text-slate-500">अपना मोबाइल नंबर और पासवर्ड दर्ज करें</p>
        </div>
        
        <div className="card p-6 shadow-md border border-slate-200/80 bg-white">
          <LoginForm />
        </div>
      </motion.div>
    </div>
  );
}
