import { Sprout, DollarSign, TrendingUp, CircleDollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SeasonStats {
  total_harvest: number;
  total_sales: number;
  total_sold_qty: number;
  total_cost: number;
  profit: number;
}

interface KpiCardsProps {
  seasonStats: Record<number, SeasonStats> | undefined;
  overallSales: number;
  overallCosts: number;
}

export default function KpiCards({ seasonStats, overallSales, overallCosts }: KpiCardsProps) {
  const totalHarvest = seasonStats
    ? Object.values(seasonStats).reduce((s, st) => s + st.total_harvest, 0)
    : 0;
  const overallProfit = overallSales - overallCosts;

  const cards = [
    {
      label: 'إجمالي الحصاد',
      value: totalHarvest.toLocaleString(),
      icon: TrendingUp,
      iconClass: 'text-emerald-600',
    },
    {
      label: 'إجمالي المبيعات',
      value: overallSales.toLocaleString(),
      icon: DollarSign,
      iconClass: 'text-blue-600',
    },
    {
      label: 'إجمالي التكاليف',
      value: overallCosts.toLocaleString(),
      icon: CircleDollarSign,
      iconClass: 'text-amber-600',
    },
    {
      label: 'صافي الربح',
      value: overallProfit.toLocaleString(),
      icon: Sprout,
      iconClass: overallProfit >= 0 ? 'text-emerald-600' : 'text-rose-600',
      valueClass: overallProfit >= 0 ? 'text-emerald-700' : 'text-rose-700',
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
              <p className={`mt-0.5 text-xl font-bold ${card.valueClass ?? 'text-stone-900'}`}>
                {card.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}