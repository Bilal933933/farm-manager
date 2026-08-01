import { TrendingUp, DollarSign, CircleDollarSign, Sprout } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { SeasonStats } from '@/types';

interface KpiCardsProps {
  stats?: SeasonStats | null;
}

interface KpiCard {
  label: string;
  value: number;
  icon: typeof TrendingUp;
  iconClass: string;
  valueClass: string;
}

const formatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

export default function KpiCards({ stats }: KpiCardsProps) {
  const cards: KpiCard[] = [
    { label: 'إجمالي الحصاد', value: stats?.total_harvest ?? 0, icon: TrendingUp, iconClass: 'text-emerald-600', valueClass: 'text-stone-900' },
    { label: 'إجمالي المبيعات', value: stats?.total_sales ?? 0, icon: DollarSign, iconClass: 'text-blue-600', valueClass: 'text-stone-900' },
    { label: 'إجمالي التكاليف', value: stats?.total_cost ?? 0, icon: CircleDollarSign, iconClass: 'text-amber-600', valueClass: 'text-stone-900' },
    {
      label: 'صافي الربح',
      value: stats?.profit ?? 0,
      icon: Sprout,
      iconClass: (stats?.profit ?? 0) >= 0 ? 'text-emerald-600' : 'text-rose-600',
      valueClass: (stats?.profit ?? 0) >= 0 ? 'text-emerald-700' : 'text-rose-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="min-w-0 border-stone-200">
          <CardContent className="flex items-center gap-3 p-5">
            <card.icon className={`h-8 w-8 shrink-0 ${card.iconClass}`} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-stone-500">{card.label}</p>
              <p className={`mt-0.5 truncate text-base font-bold sm:text-lg lg:text-xl ${card.valueClass}`}>
                <span dir="ltr" className="inline-block">{formatter.format(card.value)}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
