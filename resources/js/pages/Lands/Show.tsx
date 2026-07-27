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
  harvests?: { id: number; date: string; quantity: string }[];
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

function fmt(n: number): string {
  return n.toLocaleString();
}

const cell = 'text-right';
const numCell = 'font-mono text-right tabular-nums';
const headCell = 'text-right text-stone-600 font-semibold bg-stone-100 border-b-2 border-stone-200';
const numHead = `${numCell} ${headCell}`;

export default function Show({ land, crops, activeSeason, seasonStats, overallSales, overallCosts, sales, costsBySeason }: ShowProps) {
  function deleteSeason(season: Season) {
    router.delete(route('lands.seasons.destroy', season.id));
  }

  function deleteContract(contract: Contract) {
    router.delete(route('lands.contracts.destroy', contract.id));
  }

  const totalExpected = costsBySeason.reduce((s, c) => s + c.expected_cost, 0);
  const totalActual = costsBySeason.reduce((s, c) => s + c.actual_cost, 0);
  const totalSalesQty = sales.reduce((s, sl) => s + Number(sl.quantity || 0), 0);
  const totalSalesAmount = sales.reduce((s, sl) => s + (sl.total || 0), 0);

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
          <div className="flex items-center gap-4">
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
            <div className="mr-auto">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <Input placeholder="بحث..." className="w-56 pr-9 text-sm" />
              </div>
            </div>
          </div>

          <Card className="overflow-hidden border-stone-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={headCell}>المحصول</TableHead>
                  <TableHead className={headCell}>المساحة</TableHead>
                  <TableHead className={headCell}>الزراعة</TableHead>
                  <TableHead className={numHead}>الحصاد</TableHead>
                  <TableHead className={numHead}>المبيعات</TableHead>
                  <TableHead className={numHead}>التكلفة</TableHead>
                  <TableHead className={numHead}>الربح</TableHead>
                  <TableHead className={headCell}>الحالة</TableHead>
                  <TableHead className="text-center font-semibold text-stone-600 bg-stone-100 border-b-2 border-stone-200">إجراءات</TableHead>
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
                    const st = seasonStats[season.id];
                    const harvest = st?.total_harvest ?? 0;
                    const salesTotal = st?.total_sales ?? 0;
                    const cost = st?.total_cost ?? 0;
                    const profit = st?.profit ?? 0;

                    return (
                      <TableRow key={season.id} className="border-b border-stone-100 last:border-b-0">
                        <TableCell className={cell}>{getCropName(season)}</TableCell>
                        <TableCell className={cell}>{season.cultivated_area || '—'}</TableCell>
                        <TableCell className={cell}><DateDisplay date={season.planting_date} /></TableCell>
                        <TableCell className={numCell}>{harvest > 0 ? harvest : '—'}</TableCell>
                        <TableCell className={numCell}>{salesTotal > 0 ? fmt(salesTotal) : '—'}</TableCell>
                        <TableCell className={numCell}>{cost > 0 ? fmt(cost) : '—'}</TableCell>
                        <TableCell className={`${numCell} ${profit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {profit !== 0 ? fmt(profit) : '—'}
                        </TableCell>
                        <TableCell className={cell}><StatusBadge value={season.status} /></TableCell>
                        <TableCell className="text-center">
                          <div className="inline-flex items-center gap-0.5">
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
          <div className="flex items-center gap-4">
            <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800">
              <Plus className="ms-2 h-4 w-4" />
              إضافة تكلفة
            </Button>
            <div className="mr-auto">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <Input placeholder="بحث..." className="w-56 pr-9 text-sm" />
              </div>
            </div>
          </div>

          <Card className="overflow-hidden border-stone-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={headCell}>المحصول</TableHead>
                  <TableHead className={numHead}>التكلفة المتوقعة</TableHead>
                  <TableHead className={numHead}>التكلفة الفعلية</TableHead>
                  <TableHead className={headCell}>الحالة</TableHead>
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
                  costsBySeason.map((c) => (
                    <TableRow key={c.season_id} className="border-b border-stone-100 last:border-b-0">
                      <TableCell className={cell}>{c.crop_name}</TableCell>
                      <TableCell className={numCell}>{c.expected_cost > 0 ? fmt(c.expected_cost) : '—'}</TableCell>
                      <TableCell className={numCell}>{c.actual_cost > 0 ? fmt(c.actual_cost) : '—'}</TableCell>
                      <TableCell className={cell}><StatusBadge value={c.status} /></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              {costsBySeason.length > 0 && (
                <tfoot>
                  <TableRow className="border-t-2 border-stone-300 bg-stone-50 font-semibold">
                    <TableCell className={cell}>الإجمالي</TableCell>
                    <TableCell className={numCell}>{fmt(totalExpected)}</TableCell>
                    <TableCell className={numCell}>{fmt(totalActual)}</TableCell>
                    <TableCell />
                  </TableRow>
                </tfoot>
              )}
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="revenues" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="mr-auto">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <Input placeholder="بحث..." className="w-56 pr-9 text-sm" />
              </div>
            </div>
          </div>

          <Card className="overflow-hidden border-stone-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={headCell}>التاريخ</TableHead>
                  <TableHead className={numHead}>الكمية</TableHead>
                  <TableHead className={numHead}>سعر الوحدة</TableHead>
                  <TableHead className={numHead}>الإجمالي</TableHead>
                  <TableHead className={headCell}>المشتري</TableHead>
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
                  sales.map((s) => (
                    <TableRow key={s.id} className="border-b border-stone-100 last:border-b-0">
                      <TableCell className={cell}><DateDisplay date={s.date} /></TableCell>
                      <TableCell className={numCell}>{s.quantity}</TableCell>
                      <TableCell className={numCell}>{s.unit_price}</TableCell>
                      <TableCell className={`${numCell} text-emerald-700`}>{fmt(s.total || 0)}</TableCell>
                      <TableCell className={cell}>{s.party?.name || '—'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              {sales.length > 0 && (
                <tfoot>
                  <TableRow className="border-t-2 border-stone-300 bg-stone-50 font-semibold">
                    <TableCell className={cell}>الإجمالي</TableCell>
                    <TableCell className={numCell}>{fmt(totalSalesQty)}</TableCell>
                    <TableCell className={numCell}>—</TableCell>
                    <TableCell className={`${numCell} text-emerald-700`}>{fmt(totalSalesAmount)}</TableCell>
                    <TableCell />
                  </TableRow>
                </tfoot>
              )}
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <div className="flex items-center gap-4">
            <ContractFormDialog
              landId={land.id}
              trigger={
                <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800">
                  <Plus className="ms-2 h-4 w-4" />
                  إضافة عقد
                </Button>
              }
            />
            <div className="mr-auto">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <Input placeholder="بحث..." className="w-56 pr-9 text-sm" />
              </div>
            </div>
          </div>

          <Card className="overflow-hidden border-stone-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={headCell}>النوع</TableHead>
                  <TableHead className={headCell}>البداية</TableHead>
                  <TableHead className={headCell}>الانتهاء</TableHead>
                  <TableHead className={numHead}>القيمة</TableHead>
                  <TableHead className="text-center font-semibold text-stone-600 bg-stone-100 border-b-2 border-stone-200">إجراءات</TableHead>
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
                    <TableRow key={contract.id} className="border-b border-stone-100 last:border-b-0">
                      <TableCell className={cell}><StatusBadge value={contract.type} /></TableCell>
                      <TableCell className={cell}><DateDisplay date={contract.start_date} /></TableCell>
                      <TableCell className={cell}>{contract.end_date ? <DateDisplay date={contract.end_date} /> : '—'}</TableCell>
                      <TableCell className={numCell}>{contract.amount}</TableCell>
                      <TableCell className="text-center">
                        <div className="inline-flex items-center gap-0.5">
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