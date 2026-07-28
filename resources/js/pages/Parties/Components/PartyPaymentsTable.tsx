import { Wallet } from 'lucide-react';
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
import { TYPE_TONE } from '@/lib/paymentEnums';
import type { Payment } from './types';
import { currency } from './types';

interface Props {
  payments: Payment[];
}

export default function PartyPaymentsTable({ payments }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-stone-900">
          المدفوعات
          <span className="me-2 text-sm font-normal text-stone-400">({payments.length})</span>
        </h2>
      </div>

      <div className="rounded-lg border border-stone-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-stone-50">
              <TableHead className="text-right font-medium text-stone-600 py-3">التاريخ</TableHead>
              <TableHead className="text-right font-medium text-stone-600 py-3">النوع</TableHead>
              <TableHead className="text-right font-medium text-stone-600 py-3">المبلغ</TableHead>
              <TableHead className="text-right font-medium text-stone-600 py-3">ملاحظات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Wallet className="h-8 w-8 text-stone-300" />
                    <span className="text-sm text-stone-400">لا توجد مدفوعات مرتبطة بهذا الطرف بعد.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {payments.map((payment, i) => (
              <TableRow key={payment.id} className={`${i % 2 === 1 ? 'bg-stone-50/50' : ''} hover:bg-stone-100/50 transition-colors`}>
                <TableCell className="font-mono tabular-nums text-sm py-3"><DateDisplay date={payment.date} /></TableCell>
                <TableCell className="py-3">
                  <StatusBadge value={payment.type} toneMap={TYPE_TONE} />
                </TableCell>
                <TableCell className="font-mono tabular-nums font-medium py-3">{currency(Number(payment.amount))}</TableCell>
                <TableCell className="text-stone-500 text-sm py-3">{payment.notes ?? <span className="text-stone-300">—</span>}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
