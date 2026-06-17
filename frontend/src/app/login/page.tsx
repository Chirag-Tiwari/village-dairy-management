import { LoginForm } from '@/features/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600 text-lg font-bold text-white">
            ग्रा
          </div>
          <h1 className="text-lg font-semibold text-slate-900">अपने खाते में लॉगिन करें</h1>
          <p className="mt-1 text-sm text-slate-500">अपना मोबाइल नंबर और पासवर्ड दर्ज करें</p>
        </div>
        <div className="card p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
