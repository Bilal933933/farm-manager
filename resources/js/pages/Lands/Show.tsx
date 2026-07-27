import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DateDisplay } from '@/components/ui/date-display';
import { Card, CardContent } from '@/components/ui/card';
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

export default function Show({ land, crops, activeSeason, seasonStats, overallSales, overallCosts, sales, costsBySeason }: ShowProps) {
  function deleteSeason(season: Season) {
    router.delete(route('lands.seasons.destroy', season.id));
  }

  function deleteContract(contract: Contract) {
    router.delete(route('lands.contracts.destroy', contract.id));
  }

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
          <div className="flex justify-start">
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
          </div>

          <Card className="border-stone-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">المحصول</TableHead>
                  <TableHead className="text-right">المساحة</TableHead>
                  <TableHead className="text-right">الزراعة</TableHead>
                  <TableHead className="text-right">الحصاد</TableHead>
                  <TableHead className="text-right">المبيعات</TableHead>
                  <TableHead className="text-right">التكلفة</TableHead>
                  <TableHead className="text-right">الربح</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-left">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(land.seasons ?? []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="py-8 text-center text-stone-500">
                      لا توجد مواسم مسجّلة لهذه الأرض بعد.
                    </TableCell>
                  </TableRow>
                )}
                {(land.seasons ?? []).map((season) => {
                  const cropName = getCropName(season);
                  const stats = seasonStats[season.id];
                  const totalHarvest = stats?.total_harvest ?? 0;
                  const totalSales = stats?.total_sales ?? 0;
                  const totalCost = stats?.total_cost ?? 0;
                  const profit = stats?.profit ?? 0;

                  return (
                    <TableRow key={season.id}>
                      <TableCell className="font-medium">{cropName}</TableCell>
                      <TableCell className="font-mono">{season.cultivated_area || '—'}</TableCell>
                      <TableCell className="font-mono"><DateDisplay date={season.planting_date} /></TableCell>
                      <TableCell className="font-mono">{totalHarvest > 0 ? totalHarvest : '—'}</TableCell>
                      <TableCell className="font-mono">{totalSales > 0 ? totalSales.toLocaleString() : '—'}</TableCell>
                      <TableCell className="font-mono">{totalCost > 0 ? totalCost.toLocaleString() : '—'}</TableCell>
                      <TableCell className={`font-mono ${profit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {profit !== 0 ? profit.toLocaleString() : '—'}
                      </TableCell>
                      <TableCell>
                        <StatusBadge value={season.status} />
                      </TableCell>
                      <TableCell className="text-left">
                        <div className="flex justify-start gap-1.5">
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
                })}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <Card className="border-stone-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">المحصول</TableHead>
                  <TableHead className="text-right">التكلفة المتوقعة</TableHead>
                  <TableHead className="text-right">التكلفة الفعلية</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costsBySeason.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-stone-500">
                      لا توجد تكاليف مسجّلة.
                    </TableCell>
                  </TableRow>
                )}
                {costsBySeason.map((cost) => (
                  <TableRow key={cost.season_id}>
                    <TableCell className="font-medium">{cost.crop_name}</TableCell>
                    <TableCell className="font-mono">{cost.expected_cost > 0 ? cost.expected_cost.toLocaleString() : '—'}</TableCell>
                    <TableCell className="font-mono">{cost.actual_cost > 0 ? cost.actual_cost.toLocaleString() : '—'}</TableCell>
                    <TableCell>
                      <StatusBadge value={cost.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="revenues" className="space-y-4">
          <Card className="border-stone-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">الكمية</TableHead>
                  <TableHead className="text-right">سعر الوحدة</TableHead>
                  <TableHead className="text-right">الإجمالي</TableHead>
                  <TableHead className="text-right">المشتري</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-stone-500">
                      لا توجد مبيعات مسجّلة.
                    </TableCell>
                  </TableRow>
                )}
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-mono"><DateDisplay date={sale.date} /></TableCell>
                    <TableCell className="font-mono">{sale.quantity}</TableCell>
                    <TableCell className="font-mono">{sale.unit_price}</TableCell>
                    <TableCell className="font-mono text-emerald-700">{Number(sale.total || 0).toLocaleString()}</TableCell>
                    <TableCell>{sale.party?.name || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <div className="flex justify-start">
            <ContractFormDialog
              landId={land.id}
              trigger={
                <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800">
                  <Plus className="ms-2 h-4 w-4" />
                  إضافة عقد
                </Button>
              }
            />
          </div>

          <Card className="border-stone-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">النوع</TableHead>
                  <TableHead className="text-right">البداية</TableHead>
                  <TableHead className="text-right">الانتهاء</TableHead>
                  <TableHead className="text-right">القيمة</TableHead>
                  <TableHead className="text-left">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(land.contracts ?? []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-stone-500">
                      لا توجد عقود مسجّلة لهذه الأرض بعد.
                    </TableCell>
                  </TableRow>
                )}
                {(land.contracts ?? []).map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell>
                      <StatusBadge value={contract.type} />
                    </TableCell>
                    <TableCell className="font-mono"><DateDisplay date={contract.start_date} /></TableCell>
                    <TableCell className="font-mono">{contract.end_date ? <DateDisplay date={contract.end_date} /> : '—'}</TableCell>
                    <TableCell className="font-mono">{contract.amount}</TableCell>
                    <TableCell className="text-left">
                      <div className="flex justify-start gap-1.5">
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
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}