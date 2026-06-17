import { Card } from '@/components/common/Card';

export function StatCard({ label, value, tone = 'neutral' }: { label: string; value: string; tone?: 'neutral' | 'brand' }) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${tone === 'brand' ? 'text-brand-700' : 'text-slate-900'}`}>{value}</p>
    </Card>
  );
}
