import { Truck } from 'lucide-react';
import { DateDisplay } from '@/components/ui/date-display';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Sale } from './types';
import { currency } from './types';

interface Props {
  sales: Sale[];
}

export default function PartySalesTable({ sales }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-stone-900">
          المبيعات
          <span className="me-2 text-sm font-normal text-stone-400">({sales.length})</span>
        </h2>
      </div>

      <div className="rounded-lg border border-stone-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-stone-50">
              <TableHead className="text-right font-medium text-stone-600 py-3">التاريخ</TableHead>
              <TableHead className="text-right font-medium text-stone-600 py-3">الكمية</TableHead>
              <TableHead className="text-right font-medium text-stone-600 py-3">سعر الوحدة</TableHead>
              <TableHead className="text-right font-medium text-stone-600 py-3">الإجمالي</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Truck className="h-8 w-8 text-stone-300" />
                    <span className="text-sm text-stone-400">لا توجد مبيعات مرتبطة بهذا الطرف بعد.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {sales.map((sale, i) => (
              <TableRow key={sale.id} className={`${i % 2 === 1 ? 'bg-stone-50/50' : ''} hover:bg-stone-100/50 transition-colors`}>
                <TableCell className="font-mono tabular-nums text-sm py-3"><DateDisplay date={sale.date} /></TableCell>
                <TableCell className="font-mono tabular-nums py-3">{sale.quantity}</TableCell>
                <TableCell className="font-mono tabular-nums py-3">{currency(Number(sale.unit_price))}</TableCell>
                <TableCell className="font-mono tabular-nums font-medium py-3">{currency(Number(sale.total ?? Number(sale.quantity) * Number(sale.unit_price)))}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
