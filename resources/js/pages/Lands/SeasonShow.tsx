import { Link, Head } from '@inertiajs/react';
import { ArrowRight, DollarSign, TrendingUp, CircleDollarSign, Sprout } from 'lucide-react';
import KpiCards from '@/components/Lands/KpiCards';
import StatusBadge from '@/components/Lands/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateDisplay } from '@/components/ui/date-display';
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
  date: string; notes: string | null;
}

interface SaleData {
  id: number; date: string; quantity: number; unit_price: number;
  total: number; party: { id: number; name: string } | null;
  payment_type: string; notes: string | null;
}

interface Props {
  land: { id: number; name: string };
  season: { id: number; status: string; planting_date: string; harvest_date: string | null; cultivated_area: string | null; notes: string | null; farmer?: { id: number; name: string } | null };
  crop_name: string;
  harvests: HarvestData[];
  costs: CostData[];
  sales: SaleData[];
  stats: { total_harvest: number; total_sold_qty: number; total_sales: number; total_cost: number; profit: number };
  farmers: { id: number; name: string }[];
}

const cell = 'text-right';
const numCell = 'font-mono text-right tabular-nums';
const h = 'text-right text-stone-600 font-semibold bg-stone-100 border-b-2 border-stone-200';
const nh = `${numCell} ${h}`;

function fmt(n: number) { return n.toLocaleString() }

export default function SeasonShow({ land, season, crop_name, harvests, costs, sales, stats, farmers }: Props) {
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

      <Tabs defaultValue="harvests">
        <TabsList>
          <TabsTrigger value="harvests">الحصاد ({harvests.length})</TabsTrigger>
          <TabsTrigger value="costs">التكاليف ({costs.length})</TabsTrigger>
          <TabsTrigger value="sales">المبيعات ({sales.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="harvests" className="space-y-4">
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
                    <TableCell className="text-sm text-stone-500">{h.notes || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <Card className="border-stone-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={h}>التاريخ</TableHead>
                  <TableHead className={h}>النوع</TableHead>
                  <TableHead className={h}>البيان</TableHead>
                  <TableHead className={nh}>المبلغ</TableHead>
                  <TableHead className={h}>ملاحظات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costs.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="py-12 text-center text-stone-500">لا توجد تكاليف مسجّلة.</TableCell></TableRow>
                ) : costs.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className={cell}><DateDisplay date={c.date} /></TableCell>
                    <TableCell className={cell}>{c.type}</TableCell>
                    <TableCell className={cell}>{c.description}</TableCell>
                    <TableCell className={`${numCell} text-amber-700`}>{fmt(c.amount)}</TableCell>
                    <TableCell className="text-sm text-stone-500">{c.notes || '—'}</TableCell>
                  </TableRow>
                ))}
                {costs.length > 0 && (
                  <TableRow className="border-t-2 border-stone-300 bg-stone-50 font-semibold">
                    <TableCell colSpan={3} className={cell}>الإجمالي</TableCell>
                    <TableCell className={`${numCell} text-amber-700`}>{fmt(stats.total_cost)}</TableCell>
                    <TableCell />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
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
                    <TableCell className="text-sm text-stone-500">{s.notes || '—'}</TableCell>
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
