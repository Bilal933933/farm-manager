import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Store, Calendar, CreditCard, Package, DollarSign, ClipboardList, Barcode } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DateDisplay } from '@/components/ui/date-display';
import { Card, CardContent } from '@/components/ui/card';
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

function currency(value: number): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Show({ purchase }: ShowProps) {
  return (
    <div dir="rtl" className="mx-auto max-w-4xl space-y-6 p-6">
      <Head title={`فاتورة شراء #${purchase.id}`} />

      <Link
        href={route('purchases.index')}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى المشتريات
      </Link>

      <Card className="overflow-hidden border-stone-200 shadow-sm">
        <div className="h-2 bg-gradient-to-l from-purple-500 via-purple-400 to-violet-300" />

        <CardContent className="p-6">
          <div className="flex items-start gap-4 min-w-0">
            <Avatar className="hidden sm:flex h-14 w-14 rounded-xl border-2 border-stone-200 shadow-sm">
              <AvatarFallback className="rounded-xl bg-gradient-to-br from-purple-50 to-violet-100 text-purple-700">
                <ClipboardList className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>

            <div className="space-y-4 flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-stone-900 truncate">فاتورة شراء #{purchase.id}</h1>
                <StatusBadge value={purchase.payment_type} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-lg bg-stone-50 border border-stone-100 p-3">
                  <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
                    <Store className="h-3.5 w-3.5" />
                    المورد
                  </div>
                  <p className="text-sm font-medium text-stone-800 truncate">{purchase.party?.name ?? '—'}</p>
                </div>

                <div className="rounded-lg bg-stone-50 border border-stone-100 p-3">
                  <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
                    <Calendar className="h-3.5 w-3.5" />
                    التاريخ
                  </div>
                  <DateDisplay date={purchase.date} className="text-sm font-medium text-stone-800" />
                </div>

                <div className="rounded-lg bg-stone-50 border border-stone-100 p-3">
                  <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
                    <CreditCard className="h-3.5 w-3.5" />
                    نوع الدفع
                  </div>
                  <p className="text-sm font-medium text-stone-800">{purchase.payment_type}</p>
                </div>
              </div>

              {purchase.notes && (
                <p className="text-sm text-stone-600 bg-amber-50/70 border border-amber-200/50 p-3 rounded-lg">
                  {purchase.notes}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-stone-200 shadow-sm">
        <div className="h-1.5 bg-gradient-to-l from-purple-400 via-purple-300 to-violet-200" />
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-purple-500" />
            بنود الفاتورة
          </h2>

          <div className="rounded-lg border border-stone-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-stone-50">
                  <TableHead className="text-right font-medium text-stone-600">الصنف</TableHead>
                  <TableHead className="text-right font-medium text-stone-600">الكمية</TableHead>
                  <TableHead className="text-right font-medium text-stone-600">سعر الوحدة</TableHead>
                  <TableHead className="text-right font-medium text-stone-600">الإجمالي</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(purchase.items?.length ?? 0) === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-12 text-center text-stone-400">
                      لا توجد بنود في هذه الفاتورة.
                    </TableCell>
                  </TableRow>
                )}
                {(purchase.items ?? []).map((item, i) => (
                  <TableRow key={item.id} className={`${i % 2 === 1 ? 'bg-stone-50/50' : ''} hover:bg-stone-100/50 transition-colors`}>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        {item.product?.code && (
                          <span className="inline-flex items-center gap-1 font-mono text-xs text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                            <Barcode className="h-3 w-3" />
                            {item.product.code}
                          </span>
                        )}
                        <span className="font-medium text-stone-800">{item.product?.name ?? '—'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono py-3">{item.quantity}</TableCell>
                    <TableCell className="font-mono py-3">{currency(parseFloat(item.unit_price))}</TableCell>
                    <TableCell className="font-mono font-medium py-3">
                      {currency(parseFloat(item.quantity) * parseFloat(item.unit_price))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end mt-4 pt-4 border-t border-stone-200">
            <div className="flex items-center gap-3">
              <span className="text-sm text-stone-500">الإجمالي:</span>
              <span className="font-mono text-xl font-bold text-purple-700">{currency(purchase.items_total ?? 0)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {(purchase.stockMovements?.length ?? 0) > 0 && (
        <Card className="overflow-hidden border-stone-200 shadow-sm">
          <div className="h-1.5 bg-gradient-to-l from-blue-400 via-blue-300 to-sky-200" />
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-500" />
              الحركات المخزنية الناتجة
            </h2>

            <div className="rounded-lg border border-stone-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-stone-50">
                    <TableHead className="text-right font-medium text-stone-600">التاريخ</TableHead>
                    <TableHead className="text-right font-medium text-stone-600">النوع</TableHead>
                    <TableHead className="text-right font-medium text-stone-600">السبب</TableHead>
                    <TableHead className="text-right font-medium text-stone-600">الكمية</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(purchase.stockMovements ?? []).map((m, i) => (
                    <TableRow key={m.id} className={`${i % 2 === 1 ? 'bg-stone-50/50' : ''} hover:bg-stone-100/50 transition-colors`}>
                      <TableCell className="font-mono py-3"><DateDisplay date={m.movement_date} /></TableCell>
                      <TableCell className="py-3">
                        <StatusBadge value={m.type} toneMap={TYPE_TONE} />
                      </TableCell>
                      <TableCell className="py-3">{m.reason}</TableCell>
                      <TableCell className="font-mono py-3">{m.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
