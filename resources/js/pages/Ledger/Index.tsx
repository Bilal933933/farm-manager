import { Head } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
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
import { DIRECTION_TONE } from '@/lib/ledgerEnums';

interface Party {
  id: number;
  name: string;
}

interface LedgerEntry {
  id: number;
  date: string;
  direction: string;
  amount: string;
  description: string;
  party: Party | null;
}

interface IndexProps {
  entries: LedgerEntry[];
}

export default function Index({ entries }: IndexProps) {
  return (
    <div dir="rtl" className="space-y-6 p-6">
      <Head title="السجل المالي" />

      <div>
        <h1 className="text-2xl font-semibold text-stone-900">السجل المالي</h1>
        <p className="mt-1 text-sm text-stone-500">الحركات المالية الناتجة عن المشتريات والمدفوعات</p>
      </div>

      <Card className="border-stone-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">البيان</TableHead>
              <TableHead className="text-right">الطرف</TableHead>
              <TableHead className="text-right">الاتجاه</TableHead>
              <TableHead className="text-right">المبلغ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-16 text-center text-stone-500">
                  <BookOpen className="mx-auto mb-3 h-10 w-10 text-stone-300" />
                  لا توجد قيود مالية بعد. تظهر القيود تلقائيًا عند تسجيل مشتريات أو مدفوعات.
                </TableCell>
              </TableRow>
            )}
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-mono"><DateDisplay date={entry.date} /></TableCell>
                <TableCell className="max-w-xs truncate">{entry.description}</TableCell>
                <TableCell className="font-medium">{entry.party?.name ?? '—'}</TableCell>
                <TableCell>
                  <StatusBadge value={entry.direction} toneMap={DIRECTION_TONE} />
                </TableCell>
                <TableCell className="font-mono">{entry.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
