import { Link, Head } from '@inertiajs/react';
import { ArrowRight, Plus, UserCheck } from 'lucide-react';
import HarvestFormDialog from '@/components/Harvests/HarvestFormDialog';
import CostFormDialog from '@/components/Lands/CostFormDialog';
import KpiCards from '@/components/Lands/KpiCards';
import StatusBadge from '@/components/Lands/StatusBadge';
import SaleFormDialog from '@/components/Sales/SaleFormDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateDisplay } from '@/components/ui/date-display';
import DetailCell from '@/components/ui/detail-cell';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HarvestData {
  id: number; name: string | null; date: string; quantity: number;
  sold_quantity: number; remaining: number; notes: string | null;
}

interface CostData {
  id: number; type: string; description: string; amount: number;
  date: string; notes: string | null; borne_by?: string;
}

interface SaleData {
  id: number; date: string; quantity: number; unit_price: number;
  total: number; party: { id: number; name: string } | null;
  payment_type: string; notes: string | null;
}

interface FarmerSettlement {
  total_revenue: number;
  shared_cost: number;
  farmer_cost: number;
  owner_cost: number;
  net_revenue: number;
  settlement_type: string;
  share_percentage: number | null;
  farmer_share: number;
  owner_share: number;
  farmer_share_net: number;
  owner_share_net: number;
  contract_amount: number | null;
  is_deficit: boolean;
}

interface Props {
  land: { id: number; name: string };
  season: { id: number; status: string; planting_date: string; harvest_date: string | null; cultivated_area: string | null; notes: string | null; farmer?: { id: number; name: string } | null };
  crop_name: string;
  harvests: HarvestData[];
  costs: CostData[];
  sales: SaleData[];
  stats: { total_harvest: number; total_sold_qty: number; total_sales: number; total_cost: number; shared_cost: number; profit: number };
  farmers: { id: number; name: string }[];
  parties: { id: number; name: string }[];
  farmerSettlement: FarmerSettlement | null;
}

const cell = 'text-right';
const numCell = 'font-mono text-right tabular-nums';
const h = 'text-right text-stone-600 font-semibold bg-stone-100 border-b-2 border-stone-200';
const nh = `${numCell} ${h}`;

function fmt(n: number) {
 return n.toLocaleString() 
}

export default function SeasonShow({ land, season, crop_name, harvests, costs, sales, stats, parties, farmerSettlement }: Props) {
  return (
    <div dir="rtl" className="space-y-6 p-6">
      <Head title={`${crop_name} - ${land.name}`} />

      <div className="flex items-center gap-3">
        <Link href={route('lands.show', land.id)} className="text-stone-500 hover:text-stone-700">
          <ArrowRight className="h-5 w-5" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-stone-900">{crop_name}</h1>
            <StatusBadge value={season.status} />
          </div>
          <p className="mt-0.5 text-sm text-stone-500">
            {land.name}{season.farmer ? <> | مزارع: {season.farmer.name}</> : null} — زراعة: <DateDisplay date={season.planting_date} />
            {season.harvest_date && <> | حصاد متوقع: <DateDisplay date={season.harvest_date} /></>}
          </p>
        </div>
      </div>

      <KpiCards stats={{
        total_harvest: stats.total_harvest,
        total_sold_qty: stats.total_sold_qty,
        total_sales: stats.total_sales,
        total_cost: stats.total_cost,
        profit: stats.profit,
      }} />

      {farmerSettlement && (
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserCheck className="h-5 w-5 text-emerald-700" />
              تسوية المزارع — تقديري
            </CardTitle>
          </CardHeader>
          <CardContent>
            {farmerSettlement.is_deficit && (
              <div className="mb-4 rounded-lg border border-amber-300 bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-800">
                عجز: صافي الإيراد ({fmt(farmerSettlement.net_revenue)}) لا يغطي المبلغ الثابت المستحق للمزارع (
                {fmt(farmerSettlement.contract_amount ?? farmerSettlement.farmer_share)}) — يتحمل المالك العجز.
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-xs text-stone-500">إجمالي الإيراد</p>
                <p className="text-lg font-semibold text-stone-900">{fmt(farmerSettlement.total_revenue)}</p>
              </div>
              <div>
                <p className="text-xs text-stone-500">تكاليف مشتركة</p>
                <p className="text-lg font-semibold text-amber-700">{fmt(farmerSettlement.shared_cost)}</p>
              </div>
              <div>
                <p className="text-xs text-stone-500">صافي الإيراد</p>
                <p className="text-lg font-semibold text-stone-900">{fmt(farmerSettlement.net_revenue)}</p>
              </div>
              <div>
                <p className="text-xs text-stone-500">نوع التسوية</p>
                <p className="text-lg font-semibold text-stone-900">
                  {farmerSettlement.settlement_type === 'نسبة' ? `${farmerSettlement.share_percentage}%` : 'مبلغ ثابت'}
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-500">تكاليف المزارع</p>
                <p className="text-lg font-semibold text-rose-700">{fmt(farmerSettlement.farmer_cost)}</p>
              </div>
              <div>
                <p className="text-xs text-stone-500">تكاليف المالك</p>
                <p className="text-lg font-semibold text-rose-700">{fmt(farmerSettlement.owner_cost)}</p>
              </div>
              <div className="rounded-lg bg-emerald-100 p-3">
                <p className="text-xs text-emerald-700">نصيب المزارع</p>
                <p className="text-xl font-bold text-emerald-800">{fmt(farmerSettlement.farmer_share)}</p>
                <p className="mt-1 border-t border-emerald-200 pt-1 text-xs font-semibold text-emerald-900">
                  صافي المستحق للمزارع: <span className="font-mono tabular-nums">{fmt(farmerSettlement.farmer_share_net)}</span>
                </p>
              </div>
              <div className="rounded-lg bg-blue-100 p-3">
                <p className="text-xs text-blue-700">نصيب المالك</p>
                <p className="text-xl font-bold text-blue-800">{fmt(farmerSettlement.owner_share)}</p>
                <p className="mt-1 border-t border-blue-200 pt-1 text-xs font-semibold text-blue-900">
                  صافي المستحق/المقبوض للمالك: <span className="font-mono tabular-nums">{fmt(farmerSettlement.owner_share_net)}</span>
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-stone-400">* هذه التسوية تقديرية وقابلة للتعديل ولم تُرحّل بعد إلى القيود المحاسبية.</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="harvests">
        <TabsList>
          <TabsTrigger value="harvests">الحصاد ({harvests.length})</TabsTrigger>
          <TabsTrigger value="costs">التكاليف ({costs.length})</TabsTrigger>
          <TabsTrigger value="sales">المبيعات ({sales.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="harvests" className="space-y-4">
          <HarvestFormDialog landSeasonId={season.id} trigger={
            <Button size="sm" className="bg-amber-500 text-white hover:bg-amber-600">
              <Plus className="ms-2 h-4 w-4" /> إضافة حصاد
            </Button>
          } />
          <Card className="border-stone-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={h}>اسم الحصاد</TableHead>
                  <TableHead className={h}>التاريخ</TableHead>
                  <TableHead className={nh}>الكمية</TableHead>
                  <TableHead className={nh}>مباع</TableHead>
                  <TableHead className={nh}>المتبقي</TableHead>
                  <TableHead className={h}>ملاحظات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {harvests.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="py-12 text-center text-stone-500">لا توجد حصادات مسجّلة.</TableCell></TableRow>
                ) : harvests.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell className={cell}>{h.name || '—'}</TableCell>
                    <TableCell className={cell}><DateDisplay date={h.date} /></TableCell>
                    <TableCell className={numCell}>{fmt(h.quantity)}</TableCell>
                    <TableCell className={numCell}>{fmt(h.sold_quantity)}</TableCell>
                    <TableCell className={`${numCell} ${h.remaining > 0 ? 'text-emerald-700' : 'text-stone-400'}`}>{fmt(h.remaining)}</TableCell>
                    <TableCell className="text-sm text-stone-500"><DetailCell text={h.notes} title="ملاحظات" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <CostFormDialog landId={land.id} initialSeasonId={season.id} hideSeason seasons={[]} trigger={
            <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800">
              <Plus className="ms-2 h-4 w-4" /> إضافة تكلفة
            </Button>
          } />
          <Card className="border-stone-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={h}>التاريخ</TableHead>
                  <TableHead className={h}>النوع</TableHead>
                  <TableHead className={h}>البيان</TableHead>
                  <TableHead className={h}>يتحمله</TableHead>
                  <TableHead className={nh}>المبلغ</TableHead>
                  <TableHead className={h}>ملاحظات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costs.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="py-12 text-center text-stone-500">لا توجد تكاليف مسجّلة.</TableCell></TableRow>
                ) : costs.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className={cell}><DateDisplay date={c.date} /></TableCell>
                    <TableCell className={cell}>{c.type}</TableCell>
                    <TableCell className={cell}><DetailCell text={c.description} title="البيان" /></TableCell>
                    <TableCell className={cell}>
                      <StatusBadge value={c.borne_by || 'مشترك'} />
                    </TableCell>
                    <TableCell className={`${numCell} text-amber-700`}>{fmt(c.amount)}</TableCell>
                    <TableCell className="text-sm text-stone-500"><DetailCell text={c.notes} title="ملاحظات" /></TableCell>
                  </TableRow>
                ))}
                {costs.length > 0 && (
                  <TableRow className="border-t-2 border-stone-300 bg-stone-50 font-semibold">
                    <TableCell colSpan={4} className={cell}>الإجمالي</TableCell>
                    <TableCell className={`${numCell} text-amber-700`}>{fmt(stats.total_cost)}</TableCell>
                    <TableCell />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <SaleFormDialog
            land={land}
            landSeasonId={season.id}
            harvests={harvests}
            parties={parties}
            trigger={
              <Button size="sm" className="bg-blue-700 hover:bg-blue-800">
                <Plus className="ms-2 h-4 w-4" /> إضافة بيع
              </Button>
            }
          />
          <Card className="border-stone-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={h}>التاريخ</TableHead>
                  <TableHead className={h}>المشتري</TableHead>
                  <TableHead className={nh}>الكمية</TableHead>
                  <TableHead className={nh}>سعر الوحدة</TableHead>
                  <TableHead className={nh}>الإجمالي</TableHead>
                  <TableHead className={h}>نوع الدفع</TableHead>
                  <TableHead className={h}>ملاحظات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="py-12 text-center text-stone-500">لا توجد مبيعات مسجّلة.</TableCell></TableRow>
                ) : sales.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className={cell}><DateDisplay date={s.date} /></TableCell>
                    <TableCell className={cell}>{s.party?.name || '—'}</TableCell>
                    <TableCell className={numCell}>{fmt(s.quantity)}</TableCell>
                    <TableCell className={numCell}>{fmt(s.unit_price)}</TableCell>
                    <TableCell className={`${numCell} text-blue-700`}>{fmt(s.total)}</TableCell>
                    <TableCell className={cell}><StatusBadge value={s.payment_type} /></TableCell>
                    <TableCell className="text-sm text-stone-500"><DetailCell text={s.notes} title="ملاحظات" /></TableCell>
                  </TableRow>
                ))}
                {sales.length > 0 && (
                  <TableRow className="border-t-2 border-stone-300 bg-stone-50 font-semibold">
                    <TableCell colSpan={4} className={cell}>الإجمالي</TableCell>
                    <TableCell className={`${numCell} text-blue-700`}>{fmt(stats.total_sales)}</TableCell>
                    <TableCell colSpan={2} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
