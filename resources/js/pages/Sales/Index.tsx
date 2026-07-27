import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Sale {
  id: number;
  date: string;
  quantity: string;
  unit_price: string;
  total: number;
  payment_type: string;
  description?: string;
  party: { id: number; name: string };
  harvest: {
    id: number;
    land_season: {
      land: { id: number; name: string };
      crop: { id: number; name: string } | null;
    };
  };
}

interface IndexProps {
  sales: Sale[];
}

export default function Index({ sales }: IndexProps) {
  return (
    <div dir="rtl" className="mx-auto max-w-6xl space-y-6 p-6">
      <Head title="المبيعات" />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-stone-900">المبيعات</h1>
        <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
          <Link href={route('sales.create')}>
            <Plus className="ms-2 h-4 w-4" />
            إضافة بيع
          </Link>
        </Button>
      </div>

      <Card className="border-stone-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">المحصول</TableHead>
              <TableHead className="text-right">الأرض</TableHead>
              <TableHead className="text-right">المشتري</TableHead>
              <TableHead className="text-right">الكمية</TableHead>
              <TableHead className="text-right">سعر الوحدة</TableHead>
              <TableHead className="text-right">الإجمالي</TableHead>
              <TableHead className="text-right">نوع الدفع</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-stone-500">
                  لا توجد مبيعات مسجّلة بعد.
                </TableCell>
              </TableRow>
            )}
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-mono">
                  <Link href={route('sales.show', sale.id)} className="hover:text-emerald-700 hover:underline">
                    {sale.date}
                  </Link>
                </TableCell>
                <TableCell>{sale.harvest?.land_season?.crop?.name || '—'}</TableCell>
                <TableCell>{sale.harvest?.land_season?.land?.name || '—'}</TableCell>
                <TableCell>{sale.party?.name || '—'}</TableCell>
                <TableCell className="font-mono">{sale.quantity}</TableCell>
                <TableCell className="font-mono">{sale.unit_price}</TableCell>
                <TableCell className="font-mono">{sale.total.toFixed(2)}</TableCell>
                <TableCell>{sale.payment_type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
