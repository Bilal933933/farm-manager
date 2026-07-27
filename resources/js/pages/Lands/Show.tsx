import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DateDisplay } from '@/components/ui/date-display';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import StatusBadge from '@/components/Lands/StatusBadge';
import SeasonFormDialog from '@/components/Lands/SeasonFormDialog';
import ContractFormDialog from '@/components/Lands/ContractFormDialog';
import HarvestFormDialog from '@/components/Harvests/HarvestFormDialog';
import LandHeader from '@/components/Lands/LandHeader';
import ActiveSeasonCard from '@/components/Lands/ActiveSeasonCard';
import KpiCards from '@/components/Lands/KpiCards';

interface Crop {
  id: number;
  name: string;
}

interface HarvestItem {
  id: number;
  date: string;
  quantity: string;
}

interface Season {
  id: number;
  crop_id?: number | null;
  crop_obj?: Crop | null;
  cultivated_area?: string;
  crop: string | Crop;
  planting_date: string;
  harvest_date?: string;
  expected_cost?: string;
  actual_cost?: string;
  status: string;
  harvests?: HarvestItem[];
}

interface Contract {
  id: number;
  type: string;
  start_date: string;
  end_date?: string;
  amount: string;
}

interface Land {
  id: number;
  name: string;
  location: string | null;
  area: string;
  area_unit: string;
  status: string;
  notes: string | null;
  seasons?: Season[];
  contracts?: Contract[];
}

interface SeasonStats {
  total_harvest: number;
  total_sales: number;
  total_sold_qty: number;
  total_cost: number;
  profit: number;
}

interface SaleData {
  id: number;
  date: string;
  quantity: string;
  unit_price: string;
  total: number;
  party: { id: number; name: string } | null;
  harvest: { land_season_id: number; landSeason?: { id: number } } | null;
}

interface CostData {
  season_id: number;
  crop_name: string;
  expected_cost: number;
  actual_cost: number;
  status: string;
}

interface ShowProps {
  land: Land;
  crops: Crop[];
  activeSeason: Season | null;
  seasonStats: Record<number, SeasonStats>;
  overallSales: number;
  overallCosts: number;
  sales: SaleData[];
  costsBySeason: CostData[];
}

function getCropName(season: Season): string {
  if (season.crop_obj?.name) return season.crop_obj.name;
  if (typeof season.crop === 'string') return season.crop;
  if (season.crop && typeof season.crop === 'object' && 'name' in (season.crop as object)) return (season.crop as Crop).name;
  return '—';
}

const thClass = 'text-right text-stone-600 font-semibold bg-stone-100 border-b-2 border-stone-200';
const tdNumClass = 'font-mono text-left tabular-nums';
const tdTextClass = 'text-right';

export default function Show({ land, crops, activeSeason, seasonStats, overallSales, overallCosts, sales, costsBySeason }: ShowProps) {
  function deleteSeason(season: Season) {
    router.delete(route('lands.seasons.destroy', season.id));
  }

  function deleteContract(contract: Contract) {
    router.delete(route('lands.contracts.destroy', contract.id));
  }

  const totalExpectedCost = costsBySeason.reduce((s, c) => s + c.expected_cost, 0);
  const totalActualCost = costsBySeason.reduce((s, c) => s + c.actual_cost, 0);

  return (
    <div dir="rtl" className="space-y-6 p-6">
      <Head title={land.name} />

      <LandHeader land={land} />
      <ActiveSeasonCard activeSeason={activeSeason} areaUnit={land.area_unit} />
      <KpiCards seasonStats={seasonStats} overallSales={overallSales} overallCosts={overallCosts} />

      <Tabs defaultValue="seasons">
        <TabsList>
          <TabsTrigger value="seasons">المواسم الزراعية ({land.seasons?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="costs">التكاليف</TabsTrigger>
          <TabsTrigger value="revenues">الإيرادات</TabsTrigger>
          <TabsTrigger value="contracts">العقود ({land.contracts?.length ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="seasons" className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <SeasonFormDialog
              landId={land.id}
              crops={crops}
              trigger={
                <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800">
                  <Plus className="ms-2 h-4 w-4" />
                  إضافة موسم
                </Button>
              }
            />
            <div className="relative w-64">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <Input placeholder="بحث في المواسم..." className="pr-9 text-sm" />
            </div>
          </div>

          <Card className="border-stone-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={thClass}>المحصول</TableHead>
                  <TableHead className={thClass}>المساحة</TableHead>
                  <TableHead className={thClass}>الزراعة</TableHead>
                  <TableHead className={`${tdNumClass} ${thClass}`}>الحصاد</TableHead>
                  <TableHead className={`${tdNumClass} ${thClass}`}>المبيعات</TableHead>
                  <TableHead className={`${tdNumClass} ${thClass}`}>التكلفة</TableHead>
                  <TableHead className={`${tdNumClass} ${thClass}`}>الربح</TableHead>
                  <TableHead className={thClass}>الحالة</TableHead>
                  <TableHead className="text-left font-semibold text-stone-600 bg-stone-100 border-b-2 border-stone-200">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(land.seasons ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="py-12 text-center text-stone-500">
                      لا توجد مواسم مسجّلة لهذه الأرض بعد.
                    </TableCell>
                  </TableRow>
                ) : (
                  (land.seasons ?? []).map((season) => {
                    const cropName = getCropName(season);
                    const stats = seasonStats[season.id];
                    const harvestVal = stats?.total_harvest ?? 0;
                    const salesVal = stats?.total_sales ?? 0;
                    const costVal = stats?.total_cost ?? 0;
                    const profit = stats?.profit ?? 0;
                    const hasVal = harvestVal > 0;

                    return (
                      <TableRow key={season.id} className="border-b border-stone-100 last:border-0">
                        <TableCell className={tdTextClass}>{cropName}</TableCell>
                        <TableCell className={tdTextClass}>{season.cultivated_area || '—'}</TableCell>
                        <TableCell className={tdTextClass}><DateDisplay date={season.planting_date} /></TableCell>
                        <TableCell className={tdNumClass}>{hasVal ? harvestVal : '—'}</TableCell>
                        <TableCell className={tdNumClass}>{salesVal > 0 ? salesVal.toLocaleString() : '—'}</TableCell>
                        <TableCell className={tdNumClass}>{costVal > 0 ? costVal.toLocaleString() : '—'}</TableCell>
                        <TableCell className={`${tdNumClass} ${profit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {profit !== 0 ? profit.toLocaleString() : '—'}
                        </TableCell>
                        <TableCell className={tdTextClass}>
                          <StatusBadge value={season.status} />
                        </TableCell>
                        <TableCell className="text-left">
                          <div className="flex justify-start gap-0.5">
                            <HarvestFormDialog
                              landSeasonId={season.id}
                              trigger={<Button variant="ghost" size="sm">حصاد</Button>}
                            />
                            <SeasonFormDialog
                              landId={land.id}
                              season={season as any}
                              crops={crops}
                              trigger={<Button variant="ghost" size="sm">تعديل</Button>}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-rose-600 hover:text-rose-700"
                              onClick={() => deleteSeason(season)}
                            >
                              حذف
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800">
              <Plus className="ms-2 h-4 w-4" />
              إضافة تكلفة
            </Button>
            <div className="relative w-64">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <Input placeholder="بحث في التكاليف..." className="pr-9 text-sm" />
            </div>
          </div>

          <Card className="border-stone-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={thClass}>المحصول</TableHead>
                  <TableHead className={`${tdNumClass} ${thClass}`}>التكلفة المتوقعة</TableHead>
                  <TableHead className={`${tdNumClass} ${thClass}`}>التكلفة الفعلية</TableHead>
                  <TableHead className={thClass}>الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costsBySeason.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-12 text-center text-stone-500">
                      لا توجد تكاليف مسجّلة.
                    </TableCell>
                  </TableRow>
                ) : (
                  costsBySeason.map((cost) => (
                    <TableRow key={cost.season_id} className="border-b border-stone-100 last:border-0">
                      <TableCell className={tdTextClass}>{cost.crop_name}</TableCell>
                      <TableCell className={tdNumClass}>{cost.expected_cost > 0 ? cost.expected_cost.toLocaleString() : '—'}</TableCell>
                      <TableCell className={tdNumClass}>{cost.actual_cost > 0 ? cost.actual_cost.toLocaleString() : '—'}</TableCell>
                      <TableCell className={tdTextClass}>
                        <StatusBadge value={cost.status} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              {costsBySeason.length > 0 && (
                <tfoot>
                  <TableRow className="border-t-2 border-stone-300 bg-stone-50 font-semibold">
                    <TableCell className={tdTextClass}>الإجمالي</TableCell>
                    <TableCell className={tdNumClass}>{totalExpectedCost.toLocaleString()}</TableCell>
                    <TableCell className={tdNumClass}>{totalActualCost.toLocaleString()}</TableCell>
                    <TableCell />
                  </TableRow>
                </tfoot>
              )}
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="revenues" className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div />
            <div className="relative w-64">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <Input placeholder="بحث في المبيعات..." className="pr-9 text-sm" />
            </div>
          </div>

          <Card className="border-stone-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={thClass}>التاريخ</TableHead>
                  <TableHead className={`${tdNumClass} ${thClass}`}>الكمية</TableHead>
                  <TableHead className={`${tdNumClass} ${thClass}`}>سعر الوحدة</TableHead>
                  <TableHead className={`${tdNumClass} ${thClass}`}>الإجمالي</TableHead>
                  <TableHead className={thClass}>المشتري</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-stone-500">
                      لا توجد مبيعات مسجّلة.
                    </TableCell>
                  </TableRow>
                ) : (
                  sales.map((sale) => (
                    <TableRow key={sale.id} className="border-b border-stone-100 last:border-0">
                      <TableCell className={tdTextClass}><DateDisplay date={sale.date} /></TableCell>
                      <TableCell className={tdNumClass}>{sale.quantity}</TableCell>
                      <TableCell className={tdNumClass}>{sale.unit_price}</TableCell>
                      <TableCell className={`${tdNumClass} text-emerald-700`}>{Number(sale.total || 0).toLocaleString()}</TableCell>
                      <TableCell className={tdTextClass}>{sale.party?.name || '—'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <ContractFormDialog
              landId={land.id}
              trigger={
                <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800">
                  <Plus className="ms-2 h-4 w-4" />
                  إضافة عقد
                </Button>
              }
            />
            <div className="relative w-64">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <Input placeholder="بحث في العقود..." className="pr-9 text-sm" />
            </div>
          </div>

          <Card className="border-stone-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={thClass}>النوع</TableHead>
                  <TableHead className={thClass}>البداية</TableHead>
                  <TableHead className={thClass}>الانتهاء</TableHead>
                  <TableHead className={`${tdNumClass} ${thClass}`}>القيمة</TableHead>
                  <TableHead className="text-left font-semibold text-stone-600 bg-stone-100 border-b-2 border-stone-200">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(land.contracts ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-stone-500">
                      لا توجد عقود مسجّلة لهذه الأرض بعد.
                    </TableCell>
                  </TableRow>
                ) : (
                  (land.contracts ?? []).map((contract) => (
                    <TableRow key={contract.id} className="border-b border-stone-100 last:border-0">
                      <TableCell className={tdTextClass}>
                        <StatusBadge value={contract.type} />
                      </TableCell>
                      <TableCell className={tdTextClass}><DateDisplay date={contract.start_date} /></TableCell>
                      <TableCell className={tdTextClass}>{contract.end_date ? <DateDisplay date={contract.end_date} /> : '—'}</TableCell>
                      <TableCell className={tdNumClass}>{contract.amount}</TableCell>
                      <TableCell className="text-left">
                        <div className="flex justify-start gap-0.5">
                          <ContractFormDialog
                            landId={land.id}
                            contract={contract}
                            trigger={<Button variant="ghost" size="sm">تعديل</Button>}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-rose-600 hover:text-rose-700"
                            onClick={() => deleteContract(contract)}
                          >
                            حذف
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}