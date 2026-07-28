import { Link } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import type { Contract } from './types';
import { currency } from './types';

interface Props {
  contracts: Contract[];
}

export default function PartyContractsTable({ contracts }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-stone-900">
          العقود المرتبطة
          <span className="me-2 text-sm font-normal text-stone-400">({contracts.length})</span>
        </h2>
      </div>

      <div className="rounded-lg border border-stone-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-stone-50">
              <TableHead className="text-right font-medium text-stone-600 py-3">الأرض</TableHead>
              <TableHead className="text-right font-medium text-stone-600 py-3">النوع</TableHead>
              <TableHead className="text-right font-medium text-stone-600 py-3">البداية</TableHead>
              <TableHead className="text-right font-medium text-stone-600 py-3">الانتهاء</TableHead>
              <TableHead className="text-right font-medium text-stone-600 py-3">القيمة</TableHead>
              <TableHead className="text-right font-medium text-stone-600 py-3">المتبقي</TableHead>
              <TableHead className="text-center font-medium text-stone-600 py-3">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-stone-400">
                  لا توجد عقود مرتبطة بهذا الطرف بعد.
                </TableCell>
              </TableRow>
            )}
            {contracts.map((contract, i) => (
              <TableRow key={contract.id} className={`${i % 2 === 1 ? 'bg-stone-50/50' : ''} hover:bg-stone-100/50 transition-colors`}>
                <TableCell className="font-medium py-3">
                  <Link
                    href={route('lands.show', contract.land_id)}
                    className="text-stone-800 hover:text-emerald-700 hover:underline transition-colors"
                  >
                    {contract.land?.name ?? '—'}
                  </Link>
                </TableCell>
                <TableCell className="py-3">
                  <StatusBadge value={contract.type} />
                </TableCell>
                <TableCell className="font-mono tabular-nums text-sm py-3"><DateDisplay date={contract.start_date} /></TableCell>
                <TableCell className="font-mono tabular-nums text-sm py-3">
                  {contract.end_date ? <DateDisplay date={contract.end_date} /> : <span className="text-stone-400">—</span>}
                </TableCell>
                <TableCell className="font-mono tabular-nums font-medium py-3">{currency(Number(contract.amount))}</TableCell>
                <TableCell className="font-mono tabular-nums py-3">
                  {contract.remaining !== undefined && contract.remaining > 0 ? (
                    <span className="text-amber-700">{currency(contract.remaining)}</span>
                  ) : contract.remaining === 0 ? (
                    <span className="text-emerald-600 text-xs font-medium">مسدد</span>
                  ) : (
                    <span className="text-stone-400">—</span>
                  )}
                </TableCell>
                <TableCell className="text-center py-3">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={route('lands.show', contract.land_id)}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
