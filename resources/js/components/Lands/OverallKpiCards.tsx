import { TrendingUp, DollarSign, CircleDollarSign, Layers } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface OverallKpiCardsProps {
  overallSales: number;
  overallCosts: number;
  totalHarvest: number;
}

export default function OverallKpiCards({ overallSales, overallCosts, totalHarvest }: OverallKpiCardsProps) {
  const overallProfit = overallSales - overallCosts;

  const cards = [
    { label: 'إجمالي الحصاد (الكل)', value: totalHarvest, icon: TrendingUp, iconClass: 'text-emerald-600' },
    { label: 'إجمالي المبيعات (الكل)', value: overallSales, icon: DollarSign, iconClass: 'text-blue-600' },
    { label: 'إجمالي التكاليف (الكل)', value: overallCosts, icon: CircleDollarSign, iconClass: 'text-amber-600' },
    {
      label: 'صافي الربح (الكل)', value: overallProfit, icon: Layers,
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
