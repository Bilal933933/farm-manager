import { TrendingUp, DollarSign, CircleDollarSign, Sprout } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { SeasonStats } from '@/types';

interface KpiCardsProps {
  stats?: SeasonStats | null;
}

export default function KpiCards({ stats }: KpiCardsProps) {
  const cards = [
    { label: 'إجمالي الحصاد', value: stats?.total_harvest ?? 0, icon: TrendingUp, iconClass: 'text-emerald-600' },
    { label: 'إجمالي المبيعات', value: stats?.total_sales ?? 0, icon: DollarSign, iconClass: 'text-blue-600' },
    { label: 'إجمالي التكاليف', value: stats?.total_cost ?? 0, icon: CircleDollarSign, iconClass: 'text-amber-600' },
    {
      label: 'صافي الربح', value: stats?.profit ?? 0, icon: Sprout,
      iconClass: (stats?.profit ?? 0) >= 0 ? 'text-emerald-600' : 'text-rose-600',
      valueClass: (stats?.profit ?? 0) >= 0 ? 'text-emerald-700' : 'text-rose-700',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="border-stone-200">
          <CardContent className="flex items-center gap-4 p-5">
            <card.icon className={`h-8 w-8 shrink-0 ${card.iconClass}`} />
            <div className="min-w-0">
              <p className="truncate text-xs text-stone-500">{card.label}</p>
              <p className={`mt-0.5 text-xl font-bold ${(card as any).valueClass ?? 'text-stone-900'}`}>
                {card.value.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
