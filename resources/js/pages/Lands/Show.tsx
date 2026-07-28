import { Head, Deferred } from '@inertiajs/react';
import { useState } from 'react';
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

interface FarmerContract {
  id: number;
  party_id: number;
  party?: { id: number; name: string };
  settlement_type: string;
  share_percentage: string | null;
}

interface ShowProps {
  land: Land;
  crops?: Crop[];
  activeSeason: Season | null;
  seasonStats?: Record<number, SeasonStats>;
  overallSales: number;
  overallCosts: number;
  totalHarvest: number;
  sales?: SaleData[];
  costs?: CostData[];
  products?: StockProductOption[];
  costsCount: number;
  revenuesCount: number;
  parties?: { id: number; name: string; type: string; phone: string | null }[];
  farmers?: { id: number; name: string }[];
  farmerContracts?: FarmerContract[];
}

function getCropName(s: Season): string {
  if (typeof s.crop === 'string') {
return s.crop;
}

  if (s.crop && typeof s.crop === 'object' && 'name' in s.crop) {
return (s.crop as Crop).name;
}

  return 'موسم';
}

export default function Show({ land, crops, activeSeason, seasonStats, overallSales, overallCosts, totalHarvest, sales, costs, products, costsCount, revenuesCount, parties, farmers, farmerContracts }: ShowProps) {
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(activeSeason?.id ?? null);

  const seasons = (land.seasons ?? []);
  const selectedStats = selectedSeasonId && seasonStats?.[selectedSeasonId] ? seasonStats[selectedSeasonId] : null;

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

      <Tabs defaultValue="seasons" dir="rtl">
        <TabsList>
          <TabsTrigger value="seasons">المواسم الزراعية ({seasons.length})</TabsTrigger>
          <TabsTrigger value="costs">التكاليف ({costsCount})</TabsTrigger>
          <TabsTrigger value="revenues">الإيرادات ({revenuesCount})</TabsTrigger>
          <TabsTrigger value="contracts">العقود ({land.contracts?.length ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="seasons">
          <Deferred data={['crops', 'seasonStats', 'farmers', 'farmerContracts']} fallback={
            <div className="flex items-center justify-center py-16 text-stone-400">
              <div className="ms-2 h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
              جاري تحميل المواسم...
            </div>
          }>
            <SeasonsTab seasons={seasons} seasonStats={seasonStats!} crops={crops!} farmers={farmers} farmerContracts={farmerContracts} landId={land.id} />
          </Deferred>
        </TabsContent>

        <TabsContent value="costs">
          <Deferred data={['costs', 'products']} fallback={
            <div className="flex items-center justify-center py-16 text-stone-400">
              <div className="ms-2 h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
              جاري تحميل التكاليف...
            </div>
          }>
            <CostsTab
              costs={costs!}
              landId={land.id}
              selectedSeasonId={selectedSeasonId}
              activeSeasonId={activeSeason?.id ?? null}
              seasons={seasons.map((s) => ({ id: s.id, name: getCropName(s) }))}
              products={products!}
            />
          </Deferred>
        </TabsContent>

        <TabsContent value="revenues">
          <Deferred data="sales" fallback={
            <div className="flex items-center justify-center py-16 text-stone-400">
              <div className="ms-2 h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
              جاري تحميل الإيرادات...
            </div>
          }>
            <RevenuesTab sales={sales!} selectedSeasonId={selectedSeasonId} />
          </Deferred>
        </TabsContent>

        <TabsContent value="contracts">
          <ContractsTab contracts={land.contracts ?? []} landId={land.id} parties={parties ?? []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
