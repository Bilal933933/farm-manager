import { Head } from '@inertiajs/react';
import ActiveSeasonsTable from '@/components/Dashboard/ActiveSeasonsTable';
import KpiSection from '@/components/Dashboard/KpiSection';
import LatestSalesTable from '@/components/Dashboard/LatestSalesTable';
import PartyBalancesTable from '@/components/Dashboard/PartyBalancesTable';
import QuickActions from '@/components/Dashboard/QuickActions';
import type {
    DashboardPartyBalance,
    DashboardSale,
    DashboardSeason,
    DashboardStats,
} from '@/types/dashboard';

interface DashboardProps {
    stats: DashboardStats;
    activeSeasons: DashboardSeason[];
    latestSales: DashboardSale[];
    partyBalances: DashboardPartyBalance[];
}

export default function Dashboard({ stats, activeSeasons, latestSales, partyBalances }: DashboardProps) {
    return (
        <div dir="rtl" className="space-y-6 p-6">
            <Head title="لوحة التحكم" />

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-stone-900">لوحة التحكم</h1>
                    <p className="mt-1 text-sm text-stone-500">نظرة عامة على الأراضي والمواسم والحركة المالية</p>
                </div>
                <QuickActions />
            </div>

            <KpiSection stats={stats} />

            <ActiveSeasonsTable seasons={activeSeasons} />

            <div className="grid gap-6 lg:grid-cols-2">
                <LatestSalesTable sales={latestSales} />
                <PartyBalancesTable balances={partyBalances} />
            </div>
        </div>
    );
}
