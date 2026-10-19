import { CircleDollarSign, DollarSign, Layers, Sprout, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { DashboardStats } from '@/types/dashboard';

interface KpiCard {
    label: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    badgeClass: string;
    iconClass: string;
    hint?: string;
    valueClass?: string;
}

interface KpiSectionProps {
    stats: DashboardStats;
}

export default function KpiSection({ stats }: KpiSectionProps) {
    const profitIsPositive = stats.profit >= 0;

    const cards: KpiCard[] = [
        {
            label: 'أراضٍ نشطة',
            value: stats.activeLands,
            hint: `من ${stats.totalLands} أرض`,
            icon: Layers,
            badgeClass: 'bg-emerald-50',
            iconClass: 'text-emerald-700',
        },
        {
            label: 'مواسم جارية',
            value: stats.activeSeasons,
            icon: Sprout,
            badgeClass: 'bg-sky-50',
            iconClass: 'text-sky-700',
        },
        {
            label: 'إجمالي المبيعات',
            value: stats.salesTotal,
            icon: DollarSign,
            badgeClass: 'bg-blue-50',
            iconClass: 'text-blue-700',
        },
        {
            label: 'إجمالي التكاليف',
            value: stats.costsTotal,
            icon: CircleDollarSign,
            badgeClass: 'bg-amber-50',
            iconClass: 'text-amber-700',
        },
        {
            label: 'صافي الربح',
            value: stats.profit,
            icon: TrendingUp,
            badgeClass: profitIsPositive ? 'bg-emerald-50' : 'bg-rose-50',
            iconClass: profitIsPositive ? 'text-emerald-700' : 'text-rose-700',
            valueClass: profitIsPositive ? 'text-emerald-700' : 'text-rose-700',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
            {cards.map((card) => (
                <Card key={card.label} className="border-stone-200 py-0">
                    <CardContent className="flex items-start gap-3 p-5">
                        <div className={`shrink-0 rounded-lg p-2.5 ${card.badgeClass}`}>
                            <card.icon className={`size-5 ${card.iconClass}`} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs leading-snug text-stone-500">{card.label}</p>
                            <p className={`mt-1 font-mono text-lg font-bold leading-tight tabular-nums ${card.valueClass ?? 'text-stone-900'}`}>
                                {card.value.toLocaleString()}
                            </p>
                            {card.hint && <p className="mt-1 text-xs text-stone-400">{card.hint}</p>}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
