import { Head, Link } from '@inertiajs/react';
import { ArrowRight, FileText, Wallet, ShoppingCart, Store, Truck } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PartyHeader from './Components/PartyHeader';
import PartyFinancialSummary from './Components/PartyFinancialSummary';
import PartyContractsTable from './Components/PartyContractsTable';
import PartyPaymentsTable from './Components/PartyPaymentsTable';
import PartyPurchasesTable from './Components/PartyPurchasesTable';
import PartySalesTable from './Components/PartySalesTable';
import type { Party, FinancialSummary } from './Components/types';

interface ShowProps {
  party: Party;
  summary: FinancialSummary;
}

export default function Show({ party, summary }: ShowProps) {
  const showContracts = party.category === 'مؤجر' || party.category === 'مستأجر' || !party.category;
  const showPayments = true;
  const showPurchases = party.category === 'متجر مستلزمات زراعية' || !party.category;
  const showSales = party.category === 'تاجر' || !party.category;

  const contractsCount = party.contracts?.length ?? 0;
  const paymentsCount = party.payments?.length ?? 0;
  const purchasesCount = party.purchases?.length ?? 0;
  const salesCount = party.sales?.length ?? 0;

  const defaultTab = showContracts ? 'contracts' : showPayments ? 'payments' : showPurchases ? 'purchases' : 'sales';

  const tabs = [
    { key: 'contracts', label: 'العقود', icon: FileText, count: contractsCount, visible: showContracts },
    { key: 'payments', label: 'المدفوعات', icon: Wallet, count: paymentsCount, visible: showPayments },
    { key: 'purchases', label: 'المشتريات', icon: Store, count: purchasesCount, visible: showPurchases },
    { key: 'sales', label: 'المبيعات', icon: Truck, count: salesCount, visible: showSales },
  ].filter((t) => t.visible);

  return (
    <div dir="rtl" className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <Head title={party.name} />

      <Link
        href={route('parties.index')}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى الأطراف
      </Link>

      <PartyHeader party={party} />
      <PartyFinancialSummary summary={summary} />

      <Tabs defaultValue={defaultTab} dir="rtl" className="w-full">
        <div className="sticky top-0 z-10 -mx-4 sm:-mx-6 px-4 sm:px-6 pb-0.5 bg-white/95 backdrop-blur-sm">
          <TabsList className="w-full justify-start bg-stone-100 p-1 rounded-xl gap-1">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-4 py-2 text-sm transition-all"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.count > 0 && (
                  <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 text-xs font-medium rounded-full bg-stone-200 text-stone-600 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700">
                    {tab.count}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {showContracts && (
          <TabsContent value="contracts" className="mt-6">
            <PartyContractsTable contracts={party.contracts ?? []} />
          </TabsContent>
        )}

        {showPayments && (
          <TabsContent value="payments" className="mt-6">
            <PartyPaymentsTable payments={party.payments ?? []} />
          </TabsContent>
        )}

        {showPurchases && (
          <TabsContent value="purchases" className="mt-6">
            <PartyPurchasesTable purchases={party.purchases ?? []} />
          </TabsContent>
        )}

        {showSales && (
          <TabsContent value="sales" className="mt-6">
            <PartySalesTable sales={party.sales ?? []} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
