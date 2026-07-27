import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { DateDisplay } from '@/components/ui/date-display';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import type { SaleData } from '@/types';

interface Props { sales: SaleData[] }

function fmt(n: number) {
 return n.toLocaleString() 
}

const cell = 'text-right';
const numCell = 'font-mono text-right tabular-nums';
const h = 'text-right text-stone-600 font-semibold bg-stone-100 border-b-2 border-stone-200';
const nh = `${numCell} ${h}`;

export default function RevenuesTab({ sales }: Props) {
  const totalQty = sales.reduce((s, sl) => s + Number(sl.quantity || 0), 0);
  const totalAmount = sales.reduce((s, sl) => s + (sl.total || 0), 0);

  return (
    <div className="space-y-4">
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
              <TableHead className={h}>التاريخ</TableHead>
              <TableHead className={nh}>الكمية</TableHead>
              <TableHead className={nh}>الوحدة</TableHead>
              <TableHead className={nh}>سعر الوحدة</TableHead>
              <TableHead className={nh}>الإجمالي</TableHead>
              <TableHead className={h}>المشتري</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-stone-500">لا توجد مبيعات مسجّلة.</TableCell>
              </TableRow>
            ) : sales.map((s) => (
              <TableRow key={s.id} className="border-b border-stone-100 last:border-b-0">
                <TableCell className={cell}><DateDisplay date={s.date} /></TableCell>
                <TableCell className={numCell}>{s.quantity}</TableCell>
                <TableCell className={cell}>{s.unit || '—'}</TableCell>
                <TableCell className={numCell}>{s.unit_price}</TableCell>
                <TableCell className={`${numCell} text-emerald-700`}>{fmt(s.total || 0)}</TableCell>
                <TableCell className={cell}>{s.party?.name || '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          {sales.length > 0 && (
            <tfoot>
              <TableRow className="border-t-2 border-stone-300 bg-stone-50 font-semibold">
                <TableCell className={cell}>الإجمالي</TableCell>
                <TableCell className={numCell}>{fmt(totalQty)}</TableCell>
                <TableCell className={cell}>—</TableCell>
                <TableCell className={numCell}>—</TableCell>
                <TableCell className={`${numCell} text-emerald-700`}>{fmt(totalAmount)}</TableCell>
                <TableCell />
              </TableRow>
            </tfoot>
          )}
        </Table>
      </Card>
    </div>
  );
}