import { useMemo } from 'react';
import { router } from '@inertiajs/react';
import { Package, Plus, Search } from 'lucide-react';
import ConsumeStockDialog from '@/components/Lands/ConsumeStockDialog';
import CostFormDialog from '@/components/Lands/CostFormDialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DateDisplay } from '@/components/ui/date-display';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import type { CostData, StockProductOption } from '@/types';

interface Props {
  costs: CostData[];
  landId: number;
  selectedSeasonId?: number | null;
  activeSeasonId?: number | null;
  seasons?: { id: number; name: string }[];
  products?: StockProductOption[];
}

function fmt(n: number) {
 return n.toLocaleString() 
}

const cell = 'text-right';
const numCell = 'font-mono text-right tabular-nums';
const h = 'text-right text-stone-600 font-semibold bg-stone-100 border-b-2 border-stone-200';
const nh = `${numCell} ${h}`;

export default function CostsTab({ costs, landId, selectedSeasonId = null, activeSeasonId = null, seasons = [], products = [] }: Props) {
  const filtered = useMemo(() => {
    if (selectedSeasonId === null) return costs;
    return costs.filter((c) =>
      c.land_season_id === selectedSeasonId ||
      (c.land_season_id === null && selectedSeasonId === activeSeasonId),
    );
  }, [costs, selectedSeasonId, activeSeasonId]);

  const totalAmount = filtered.reduce((s, c) => s + c.amount, 0);

  function deleteCost(c: CostData) {
 router.delete(route('lands.costs.destroy', c.id)) 
}

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <CostFormDialog landId={landId} seasons={seasons} trigger={
          <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800">
            <Plus className="ms-2 h-4 w-4" /> إضافة تكلفة
          </Button>
        } />
        {products.length > 0 && (
          <ConsumeStockDialog products={products} seasons={seasons} trigger={
            <Button size="sm" variant="outline" className="border-emerald-700 text-emerald-700 hover:bg-emerald-50">
              <Package className="ms-2 h-4 w-4" /> صرف من المخزون
            </Button>
          } />
        )}
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
              <TableHead className={h}>التاريخ</TableHead>
              <TableHead className={h}>المحصول</TableHead>
              <TableHead className={h}>النوع</TableHead>
              <TableHead className={h}>البيان</TableHead>
              <TableHead className={nh}>المبلغ</TableHead>
              <TableHead className={h}>ملاحظات</TableHead>
              <TableHead className="text-center font-semibold text-stone-600 bg-stone-100 border-b-2 border-stone-200">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-stone-500">لا توجد تكاليف مسجّلة.</TableCell>
              </TableRow>
            ) : filtered.map((c) => (
              <TableRow key={c.id} className="border-b border-stone-100 last:border-b-0">
                <TableCell className={cell}><DateDisplay date={c.date} /></TableCell>
                <TableCell className={cell}>{c.crop_name}</TableCell>
                <TableCell className={cell}>{c.type}</TableCell>
                <TableCell className={cell}>{c.description}</TableCell>
                <TableCell className={`${numCell} text-amber-700`}>{fmt(c.amount)}</TableCell>
                <TableCell className={cell}>{c.notes || '—'}</TableCell>
                <TableCell className="text-center">
                  <div className="inline-flex items-center gap-0.5">
                    <CostFormDialog landId={landId} cost={c} seasons={seasons} trigger={<Button variant="ghost" size="sm">تعديل</Button>} />
                    <Button variant="ghost" size="sm" className="text-rose-600 hover:text-rose-700" onClick={() => deleteCost(c)}>حذف</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {filtered.length > 0 && (
            <tfoot>
              <TableRow className="border-t-2 border-stone-300 bg-stone-50 font-semibold">
                <TableCell colSpan={4} className={cell}>الإجمالي</TableCell>
                <TableCell className={`${numCell} text-amber-700`}>{fmt(totalAmount)}</TableCell>
                <TableCell />
                <TableCell />
              </TableRow>
            </tfoot>
          )}
        </Table>
      </Card>
    </div>
  );
}
