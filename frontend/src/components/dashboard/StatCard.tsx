import { Card } from '@/components/common/Card';

export function StatCard({ label, value, tone = 'neutral' }: { label: string; value: string; tone?: 'neutral' | 'brand' }) {
  const isBrand = tone === 'brand';
  return (
    <Card className={`relative overflow-hidden ${isBrand ? 'border-l-4 border-brand-600' : 'border-l-4 border-slate-300'}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold tracking-tight ${isBrand ? 'text-brand-800' : 'text-slate-900'}`}>{value}</p>
    </Card>
  );
}
