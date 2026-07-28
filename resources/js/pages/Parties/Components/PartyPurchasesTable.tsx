import { Store } from 'lucide-react';
import { DateDisplay } from '@/components/ui/date-display';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import StatusBadge from '@/components/Lands/StatusBadge';
import type { Purchase } from './types';
import { currency } from './types';

interface Props {
  purchases: Purchase[];
}

export default function PartyPurchasesTable({ purchases }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-stone-900">
          المشتريات
          <span className="me-2 text-sm font-normal text-stone-400">({purchases.length})</span>
        </h2>
      </div>

      <div className="rounded-lg border border-stone-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-stone-50">
              <TableHead className="text-right font-medium text-stone-600 py-3">التاريخ</TableHead>
              <TableHead className="text-right font-medium text-stone-600 py-3">نوع الدفع</TableHead>
              <TableHead className="text-right font-medium text-stone-600 py-3">عدد الأصناف</TableHead>
              <TableHead className="text-right font-medium text-stone-600 py-3">الإجمالي</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Store className="h-8 w-8 text-stone-300" />
                    <span className="text-sm text-stone-400">لا توجد مشتريات مرتبطة بهذا الطرف بعد.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {purchases.map((purchase, i) => (
              <TableRow key={purchase.id} className={`${i % 2 === 1 ? 'bg-stone-50/50' : ''} hover:bg-stone-100/50 transition-colors`}>
                <TableCell className="font-mono tabular-nums text-sm py-3"><DateDisplay date={purchase.date} /></TableCell>
                <TableCell className="py-3">
                  <StatusBadge value={purchase.payment_type} />
                </TableCell>
                <TableCell className="font-mono tabular-nums text-center py-3">{purchase.items_count}</TableCell>
                <TableCell className="font-mono tabular-nums font-medium py-3">{currency(purchase.items_total ?? 0)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
