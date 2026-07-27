import { Head } from '@inertiajs/react';
import ActiveSeasonCard from '@/components/Lands/ActiveSeasonCard';
import KpiCards from '@/components/Lands/KpiCards';
import LandHeader from '@/components/Lands/LandHeader';
import OverallKpiCards from '@/components/Lands/OverallKpiCards';
import ContractsTab from '@/components/Lands/Tabs/ContractsTab';
import CostsTab from '@/components/Lands/Tabs/CostsTab';
import RevenuesTab from '@/components/Lands/Tabs/RevenuesTab';
import SeasonsTab from '@/components/Lands/Tabs/SeasonsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CostData, Crop, Land, SaleData, Season, SeasonStats } from '@/types';

interface ShowProps {
  land: Land;
  crops: Crop[];
  activeSeason: Season | null;
  seasonStats: Record<number, SeasonStats>;
  overallSales: number;
  overallCosts: number;
  totalHarvest: number;
  sales: SaleData[];
  costs: CostData[];
}

export default function Show({ land, crops, activeSeason, seasonStats, overallSales, overallCosts, totalHarvest, sales, costs }: ShowProps) {
  const currentSeasonStats = activeSeason ? seasonStats[activeSeason.id] : null;

  return (
    <div dir="rtl" className="space-y-6 p-6">
      <Head title={land.name} />

      <LandHeader land={land} />
      <ActiveSeasonCard activeSeason={activeSeason} areaUnit={land.area_unit} />

      {activeSeason && currentSeasonStats && (
        <div>
          <p className="mb-3 text-sm font-semibold text-stone-600">الموسم الحالي</p>
          <KpiCards stats={currentSeasonStats} />
        </div>
      )}

      <div>
        <p className="mb-3 text-sm font-semibold text-stone-600">إجمالي المزرعة</p>
        <OverallKpiCards overallSales={overallSales} overallCosts={overallCosts} totalHarvest={totalHarvest} />
      </div>

      <Tabs defaultValue="seasons">
        <TabsList>
          <TabsTrigger value="seasons">المواسم الزراعية ({land.seasons?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="costs">التكاليف ({costs.length})</TabsTrigger>
          <TabsTrigger value="revenues">الإيرادات ({sales.length})</TabsTrigger>
          <TabsTrigger value="contracts">العقود ({land.contracts?.length ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="seasons">
          <SeasonsTab seasons={land.seasons ?? []} seasonStats={seasonStats} crops={crops} landId={land.id} />
        </TabsContent>

        <TabsContent value="costs">
          <CostsTab
            costs={costs}
            landId={land.id}
            seasons={(land.seasons ?? []).map((s) => ({
              id: s.id,
              name: typeof s.crop === 'string' ? s.crop : s.crop.name,
            }))}
          />
        </TabsContent>

        <TabsContent value="revenues">
          <RevenuesTab sales={sales} />
        </TabsContent>

        <TabsContent value="contracts">
          <ContractsTab contracts={land.contracts ?? []} landId={land.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
