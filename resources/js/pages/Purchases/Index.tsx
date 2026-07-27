import { Head, Link } from '@inertiajs/react';
import { Eye, Plus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DateDisplay } from '@/components/ui/date-display';
import { Card } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { ActionsMenu } from '@/components/ui/actions-menu';
import StatusBadge from '@/components/Lands/StatusBadge';

interface Party {
  id: number;
  name: string;
}

interface Purchase {
  id: number;
  party: Party | null;
  date: string;
  payment_type: string;
  items_total: number;
  items_count: number;
}

interface IndexProps {
  purchases: Purchase[];
}

export default function Index({ purchases }: IndexProps) {
  return (
    <div dir="rtl" className="space-y-6 p-6">
      <Head title="المشتريات" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">المشتريات</h1>
          <p className="mt-1 text-sm text-stone-500">فواتير شراء الأصناف من الموردين</p>
        </div>
        <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
          <Link href={route('purchases.create')}>
            <Plus className="ms-2 h-4 w-4" />
            فاتورة شراء جديدة
          </Link>
        </Button>
      </div>

      <Card className="border-stone-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-stone-700 font-semibold text-right">التاريخ</TableHead>
              <TableHead className="text-stone-700 font-semibold text-right">المورد</TableHead>
              <TableHead className="text-stone-700 font-semibold text-center">نوع الدفع</TableHead>
              <TableHead className="text-stone-700 font-semibold text-center">عدد الأصناف</TableHead>
              <TableHead className="text-stone-700 font-semibold text-center">الإجمالي</TableHead>
              <TableHead className="text-stone-700 font-semibold text-left w-20">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center text-stone-500">
                  <ShoppingCart className="mx-auto mb-3 h-10 w-10 text-stone-300" />
                  لا توجد مشتريات مسجّلة بعد.
                </TableCell>
              </TableRow>
            )}
            {purchases.map((p) => (
              <TableRow key={p.id} className="hover:bg-stone-50 transition-colors even:bg-stone-50/50">
                <TableCell className="font-mono"><DateDisplay date={p.date} /></TableCell>
                <TableCell className="font-medium">
                  <Link href={route('purchases.show', p.id)} className="hover:text-emerald-700 hover:underline">
                    {p.party?.name ?? '—'}
                  </Link>
                </TableCell>
                <TableCell className="text-center">
                  <div className="inline-flex justify-center">
                    <StatusBadge value={p.payment_type} />
                  </div>
                </TableCell>
                <TableCell className="font-mono text-center tabular-nums">{p.items_count}</TableCell>
                <TableCell className="font-mono text-center tabular-nums">{p.items_total.toFixed(2)}</TableCell>
                <TableCell className="text-left">
                  <ActionsMenu
                    actions={[
                      { label: 'عرض', icon: Eye, href: route('purchases.show', p.id) },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
