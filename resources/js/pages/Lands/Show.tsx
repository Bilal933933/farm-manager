import { useState } from 'react';
import { Head } from '@inertiajs/react';
import ActiveSeasonCard from '@/components/Lands/ActiveSeasonCard';
import KpiCards from '@/components/Lands/KpiCards';
import LandHeader from '@/components/Lands/LandHeader';
import OverallKpiCards from '@/components/Lands/OverallKpiCards';
import ContractsTab from '@/components/Lands/Tabs/ContractsTab';
import CostsTab from '@/components/Lands/Tabs/CostsTab';
import RevenuesTab from '@/components/Lands/Tabs/RevenuesTab';
import SeasonsTab from '@/components/Lands/Tabs/SeasonsTab';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CostData, Crop, Land, SaleData, Season, SeasonStats, StockProductOption } from '@/types';

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
  products: StockProductOption[];
}

function getCropName(s: Season): string {
  if (typeof s.crop === 'string') return s.crop;
  if (s.crop && typeof s.crop === 'object' && 'name' in s.crop) return (s.crop as Crop).name;
  return 'موسم';
}

export default function Show({ land, crops, activeSeason, seasonStats, overallSales, overallCosts, totalHarvest, sales, costs, products }: ShowProps) {
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(activeSeason?.id ?? null);

  const seasons = (land.seasons ?? []);
  const selectedStats = selectedSeasonId && seasonStats[selectedSeasonId] ? seasonStats[selectedSeasonId] : null;

  return (
    <div dir="rtl" className="space-y-6 p-6">
      <Head title={land.name} />

      <LandHeader land={land} />
      <ActiveSeasonCard activeSeason={activeSeason} areaUnit={land.area_unit} />

      <div className="flex items-end gap-4">
        <div className="space-y-2">
          <Label>تصفية حسب الموسم</Label>
          <Select value={selectedSeasonId?.toString() ?? 'all'} onValueChange={(v) => setSelectedSeasonId(v === 'all' ? null : Number(v))}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="الكل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل — جميع المواسم</SelectItem>
              {seasons.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>{getCropName(s)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedStats ? (
        <div>
          <p className="mb-3 text-sm font-semibold text-stone-600">إحصائيات الموسم</p>
          <KpiCards stats={selectedStats} />
        </div>
      ) : (
        <div>
          <p className="mb-3 text-sm font-semibold text-stone-600">إجمالي المزرعة</p>
          <OverallKpiCards overallSales={overallSales} overallCosts={overallCosts} totalHarvest={totalHarvest} />
        </div>
      )}

      <Tabs defaultValue="seasons">
        <TabsList>
          <TabsTrigger value="seasons">المواسم الزراعية ({seasons.length})</TabsTrigger>
          <TabsTrigger value="costs">التكاليف ({costs.length})</TabsTrigger>
          <TabsTrigger value="revenues">الإيرادات ({sales.length})</TabsTrigger>
          <TabsTrigger value="contracts">العقود ({land.contracts?.length ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="seasons">
          <SeasonsTab seasons={seasons} seasonStats={seasonStats} crops={crops} landId={land.id} />
        </TabsContent>

        <TabsContent value="costs">
          <CostsTab
            costs={costs}
            landId={land.id}
            selectedSeasonId={selectedSeasonId}
            activeSeasonId={activeSeason?.id ?? null}
            seasons={seasons.map((s) => ({ id: s.id, name: getCropName(s) }))}
            products={products}
          />
        </TabsContent>

        <TabsContent value="revenues">
          <RevenuesTab sales={sales} selectedSeasonId={selectedSeasonId} />
        </TabsContent>

        <TabsContent value="contracts">
          <ContractsTab contracts={land.contracts ?? []} landId={land.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
