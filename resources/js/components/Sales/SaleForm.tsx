import { useForm } from '@inertiajs/react';
import { useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SALE_TYPES } from '@/lib/saleEnums';

interface Harvest {
  id: number;
  date: string;
  quantity: string;
  notes: string | null;
  land_season: {
    id: number;
    crop: { id: number; name: string } | null;
    land: { id: number; name: string };
  };
}

interface Party { id: number; name: string }
interface LandOption { id: number; name: string }

interface SaleFormProps {
  harvests: Harvest[];
  parties: Party[];
  lands: LandOption[];
}

export default function SaleForm({ harvests, parties, lands }: SaleFormProps) {
  const { data, setData, post, processing, errors } = useForm({
    land_id: '',
    land_season_id: '',
    harvest_id: '',
    party_id: '',
    quantity: '',
    unit_price: '',
    date: '',
    payment_type: 'نقدي',
    notes: '',
    screenshot: null as File | null,
  });
  const fileRef = useRef<HTMLInputElement>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post(route('sales.store'));
  }

  const total = parseFloat(data.quantity || '0') * parseFloat(data.unit_price || '0');

  const seasons = useMemo(() => {
    const seen = new Set<number>();

    return harvests
      .filter((h) => !data.land_id || h.land_season.land.id.toString() === data.land_id)
      .filter((h) => {
        if (seen.has(h.land_season.id)) {
return false;
}

        seen.add(h.land_season.id);

        return true;
      })
      .map((h) => ({
        id: h.land_season.id,
        name: `${h.land_season.crop?.name ?? '—'} — ${h.date}`,
      }));
  }, [harvests, data.land_id]);

  const filteredHarvests = harvests.filter((h) => {
    if (data.land_id && h.land_season.land.id.toString() !== data.land_id) {
return false;
}

    if (data.land_season_id && h.land_season.id.toString() !== data.land_season_id) {
return false;
}

    return true;
  });

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="land_id">الأرض</Label>
          <Select value={data.land_id} onValueChange={(v) => {
 setData('land_id', v); setData('land_season_id', ''); setData('harvest_id', ''); 
}}>
            <SelectTrigger id="land_id">
              <SelectValue placeholder="اختر الأرض" />
            </SelectTrigger>
            <SelectContent>
              {lands.map((l) => (
                <SelectItem key={l.id} value={l.id.toString()}>{l.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="land_season_id">الموسم</Label>
          <Select value={data.land_season_id} onValueChange={(v) => {
 setData('land_season_id', v); setData('harvest_id', ''); 
}}>
            <SelectTrigger id="land_season_id">
              <SelectValue placeholder="اختر الموسم" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="harvest_id">الحصاد</Label>
          <Select value={data.harvest_id} onValueChange={(v) => setData('harvest_id', v)}>
            <SelectTrigger id="harvest_id">
              <SelectValue placeholder={data.land_id ? 'اختر الحصاد' : 'اختر الأرض أولاً'} />
            </SelectTrigger>
            <SelectContent>
              {filteredHarvests.map((h) => (
                <SelectItem key={h.id} value={String(h.id)}>
                  {h.date} — {h.quantity} ({h.land_season?.crop?.name || '—'})
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
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.name}
                </SelectItem>
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
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
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

      <div className="space-y-2">
        <Label htmlFor="screenshot">اسكرين شوت (اختياري)</Label>
        <div className="flex items-center gap-3">
          <Input
            id="screenshot"
            ref={fileRef}
            type="file"
            accept="image/*"
            className="cursor-pointer file:cursor-pointer"
            onChange={(e) => setData('screenshot', e.target.files?.[0] ?? null)}
          />
          {data.screenshot && (
            <button
              type="button"
              onClick={() => { setData('screenshot', null); if (fileRef.current) fileRef.current.value = ''; }}
              className="text-sm text-rose-600 hover:text-rose-700 shrink-0"
            >
              إزالة
            </button>
          )}
        </div>
        {errors.screenshot && <p className="text-sm text-rose-600">{errors.screenshot}</p>}
      </div>

      <Button type="submit" disabled={processing} className="w-full bg-emerald-700 hover:bg-emerald-800">
        إضافة البيع
      </Button>
    </form>
  );
}
