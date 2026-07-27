import { Head, router, useForm } from '@inertiajs/react';
import { ArrowDownUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DateDisplay } from '@/components/ui/date-display';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import StatusBadge from '@/components/Lands/StatusBadge';
import { MOVEMENT_TYPES, MOVEMENT_REASONS, TYPE_TONE } from '@/lib/stockEnums';

interface Product {
  id: number;
  name: string;
  code: string | null;
}

interface StockMovement {
  id: number;
  product_id: number;
  type: string;
  reason: string;
  quantity: string;
  movement_date: string;
  notes: string | null;
  product: Product | null;
}

interface IndexProps {
  movements: Record<string, StockMovement[]>;
  products: Product[];
}

export default function Index({ movements, products }: IndexProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    product_id: '',
    type: '',
    reason: '',
    quantity: '',
    movement_date: new Date().toISOString().slice(0, 10),
    notes: '',
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post(route('stock.store'), {
      onSuccess: () => {
        reset();
        setData('movement_date', new Date().toISOString().slice(0, 10));
      },
    });
  }

  const productIds = Object.keys(movements).length;

  return (
    <div dir="rtl" className="space-y-6 p-6">
      <Head title="المخزون" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">سجل المخزون</h1>
          <p className="mt-1 text-sm text-stone-500">جميع حركات دخول وخروج الأصناف</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-emerald-700 hover:bg-emerald-800">
              <Plus className="ms-2 h-4 w-4" />
              إضافة حركة
            </Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>تسجيل حركة مخزنية</DialogTitle>
            </DialogHeader>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product_id">الصنف</Label>
                <Select value={data.product_id} onValueChange={(v) => setData('product_id', v)}>
                  <SelectTrigger id="product_id">
                    <SelectValue placeholder="اختر الصنف" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.code ? `[${p.code}] ` : ''}{p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.product_id && <p className="text-sm text-rose-600">{errors.product_id}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">نوع الحركة</Label>
                  <Select value={data.type} onValueChange={(v) => setData('type', v)}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOVEMENT_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-sm text-rose-600">{errors.type}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">السبب</Label>
                  <Select value={data.reason} onValueChange={(v) => setData('reason', v)}>
                    <SelectTrigger id="reason">
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOVEMENT_REASONS.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.reason && <p className="text-sm text-rose-600">{errors.reason}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">الكمية</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    min="0.01"
                    className="font-mono"
                    value={data.quantity}
                    onChange={(e) => setData('quantity', e.target.value)}
                  />
                  {errors.quantity && <p className="text-sm text-rose-600">{errors.quantity}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="movement_date">التاريخ</Label>
                  <Input
                    id="movement_date"
                    type="date"
                    className="font-mono"
                    value={data.movement_date}
                    onChange={(e) => setData('movement_date', e.target.value)}
                  />
                  {errors.movement_date && <p className="text-sm text-rose-600">{errors.movement_date}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <Textarea
                  id="notes"
                  rows={2}
                  value={data.notes}
                  onChange={(e) => setData('notes', e.target.value)}
                />
                {errors.notes && <p className="text-sm text-rose-600">{errors.notes}</p>}
              </div>

              <div className="flex justify-start gap-3 pt-2">
                <Button type="submit" disabled={processing} className="bg-emerald-700 hover:bg-emerald-800">
                  {processing ? 'جاري الحفظ...' : 'تسجيل الحركة'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {productIds === 0 && (
        <Card className="border-stone-200">
          <CardContent className="py-16 text-center text-stone-500">
            <ArrowDownUp className="mx-auto mb-3 h-10 w-10 text-stone-300" />
            لا توجد حركات مخزنية مسجّلة بعد.
          </CardContent>
        </Card>
      )}

      {Object.entries(movements).map(([productName, productMovements]) => {
        const latest = productMovements[0];
        const stock = productMovements.reduce((sum, m) => {
          return sum + (m.type === 'داخل' ? parseFloat(m.quantity) : -parseFloat(m.quantity));
        }, 0);

        return (
          <Card key={productName} className="border-stone-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span>
                  {latest.product?.code && (
                    <span className="ms-2 font-mono text-xs text-stone-400">[{latest.product.code}]</span>
                  )}
                  {productName}
                </span>
                <span className="font-mono text-sm">
                  الرصيد:{' '}
                  <span className={stock >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                    {stock.toFixed(2)}
                  </span>
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">النوع</TableHead>
                    <TableHead className="text-right">السبب</TableHead>
                    <TableHead className="text-right">الكمية</TableHead>
                    <TableHead className="text-right">ملاحظات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productMovements.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-mono"><DateDisplay date={m.movement_date} /></TableCell>
                      <TableCell>
                        <StatusBadge value={m.type} toneMap={TYPE_TONE} />
                      </TableCell>
                      <TableCell>{m.reason}</TableCell>
                      <TableCell className="font-mono">{m.quantity}</TableCell>
                      <TableCell className="text-sm text-stone-500">{m.notes || '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
