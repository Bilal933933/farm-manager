import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DateDisplay } from '@/components/ui/date-display';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import StatusBadge from '@/components/Lands/StatusBadge';
import { TYPE_TONE } from '@/lib/stockEnums';

interface Party {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  code: string | null;
}

interface PurchaseItem {
  id: number;
  product: Product | null;
  quantity: string;
  unit_price: string;
}

interface StockMovement {
  id: number;
  type: string;
  reason: string;
  quantity: string;
  movement_date: string;
}

interface Purchase {
  id: number;
  party: Party | null;
  date: string;
  payment_type: string;
  notes: string | null;
  items: PurchaseItem[];
  stockMovements: StockMovement[];
  items_total: number;
}

interface ShowProps {
  purchase: Purchase;
}

export default function Show({ purchase }: ShowProps) {
  return (
    <div dir="rtl" className="mx-auto max-w-4xl space-y-6 p-6">
      <Head title={`فاتورة شراء #${purchase.id}`} />

      <Link
        href={route('purchases.index')}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى المشتريات
      </Link>

      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-xl">
            <span>فاتورة شراء</span>
            <span className="font-mono text-base text-stone-500">#{purchase.id}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-stone-400">المورد: </span>
              <span className="font-medium">{purchase.party?.name ?? '—'}</span>
            </div>
            <div>
              <span className="text-stone-400">التاريخ: </span>
              <DateDisplay date={purchase.date} />
            </div>
            <div>
              <span className="text-stone-400">نوع الدفع: </span>
              <StatusBadge value={purchase.payment_type} />
            </div>
          </div>
          {purchase.notes && <p className="text-sm text-stone-500">{purchase.notes}</p>}
        </CardContent>
      </Card>

      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-lg">بنود الفاتورة</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الصنف</TableHead>
                <TableHead className="text-right">الكمية</TableHead>
                <TableHead className="text-right">سعر الوحدة</TableHead>
                <TableHead className="text-right">الإجمالي</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchase.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.product?.code && (
                      <span className="ms-1 font-mono text-xs text-stone-400">[{item.product.code}]</span>
                    )}
                    {item.product?.name ?? '—'}
                  </TableCell>
                  <TableCell className="font-mono">{item.quantity}</TableCell>
                  <TableCell className="font-mono">{parseFloat(item.unit_price).toFixed(2)}</TableCell>
                  <TableCell className="font-mono">
                    {(parseFloat(item.quantity) * parseFloat(item.unit_price)).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end border-t border-stone-200 pt-4 mt-4">
            <div className="text-left">
              <span className="text-sm text-stone-500">الإجمالي: </span>
              <span className="font-mono text-lg font-semibold text-stone-900">{purchase.items_total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {purchase.stockMovements.length > 0 && (
        <Card className="border-stone-200">
          <CardHeader>
            <CardTitle className="text-lg">الحركات المخزنية الناتجة</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">النوع</TableHead>
                  <TableHead className="text-right">السبب</TableHead>
                  <TableHead className="text-right">الكمية</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchase.stockMovements.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-mono"><DateDisplay date={m.movement_date} /></TableCell>
                    <TableCell>
                      <StatusBadge value={m.type} toneMap={TYPE_TONE} />
                    </TableCell>
                    <TableCell>{m.reason}</TableCell>
                    <TableCell className="font-mono">{m.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
