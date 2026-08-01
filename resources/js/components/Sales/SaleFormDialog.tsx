import { useForm } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SALE_TYPES } from '@/lib/saleEnums';

interface HarvestOption {
  id: number;
  name: string | null;
  date: string;
  quantity: number;
}

interface PartyOption {
  id: number;
  name: string;
}

interface Props {
  land: { id: number; name: string };
  landSeasonId: number;
  harvests: HarvestOption[];
  parties: PartyOption[];
  trigger: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function SaleFormDialog({ land, landSeasonId, harvests, parties, trigger, open, onOpenChange }: Props) {
  const { data, setData, post, processing, errors, reset } = useForm({
    land_id: land.id.toString(),
    land_season_id: landSeasonId.toString(),
    harvest_id: '',
    party_id: '',
    quantity: '',
    unit_price: '',
    date: '',
    payment_type: 'نقدي',
    notes: '',
  });

  const formError = (errors as Record<string, string>)['form'];

  function handleOpenChange(next: boolean) {
    if (next) {
      reset();
    }

    onOpenChange?.(next);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post(route('sales.store'), { onSuccess: () => reset() });
  }

  const total = parseFloat(data.quantity || '0') * parseFloat(data.unit_price || '0');

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent dir="rtl" className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>تسجيل بيع</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          {formError && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {formError}
            </div>
          )}

          <div className="space-y-2">
            <Label>الأرض / الموسم</Label>
            <p className="rounded-lg bg-stone-50 px-3 py-2 text-sm text-stone-600">
              {land.name} — {harvests.length > 0 ? `${harvests.length} حصاد` : 'لا توجد حصادات بعد'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="harvest_id">الحصاد</Label>
              <Select value={data.harvest_id} onValueChange={(v) => setData('harvest_id', v)}>
                <SelectTrigger id="harvest_id">
                  <SelectValue placeholder={harvests.length > 0 ? 'اختر الحصاد' : 'سجّل حصادًا أولاً'} />
                </SelectTrigger>
                <SelectContent>
                  {harvests.map((h) => (
                    <SelectItem key={h.id} value={String(h.id)}>
                      {h.name || 'حصاد'} — {h.date} ({h.quantity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.harvest_id && <p className="text-sm text-rose-600">{errors.harvest_id}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="party_id">المشتري</Label>
              <Select value={data.party_id} onValueChange={(v) => setData('party_id', v)}>
                <SelectTrigger id="party_id">
                  <SelectValue placeholder="اختر المشتري" />
                </SelectTrigger>
                <SelectContent>
                  {parties.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.party_id && <p className="text-sm text-rose-600">{errors.party_id}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sale_date">التاريخ</Label>
              <Input
                id="sale_date"
                type="date"
                value={data.date}
                onChange={(e) => setData('date', e.target.value)}
              />
              {errors.date && <p className="text-sm text-rose-600">{errors.date}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_type">نوع الدفع</Label>
              <Select value={data.payment_type} onValueChange={(v) => setData('payment_type', v)}>
                <SelectTrigger id="payment_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SALE_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.payment_type && <p className="text-sm text-rose-600">{errors.payment_type}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sale_quantity">الكمية</Label>
              <Input
                id="sale_quantity"
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
              <Label htmlFor="unit_price">سعر الوحدة</Label>
              <Input
                id="unit_price"
                type="number"
                step="0.01"
                min="0"
                className="font-mono"
                value={data.unit_price}
                onChange={(e) => setData('unit_price', e.target.value)}
              />
              {errors.unit_price && <p className="text-sm text-rose-600">{errors.unit_price}</p>}
            </div>
          </div>

          {total > 0 && (
            <div className="rounded-lg bg-stone-50 p-3 text-center">
              <p className="text-sm text-stone-500">الإجمالي</p>
              <p className="font-mono text-xl font-semibold text-stone-900">{total.toFixed(2)}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="sale_notes">ملاحظات</Label>
            <Textarea id="sale_notes" rows={3} value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={processing} className="bg-emerald-700 hover:bg-emerald-800">
              تسجيل البيع
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
