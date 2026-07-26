import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { PAYMENT_TYPES } from '@/lib/purchaseEnums';

interface Party {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  code: string | null;
}

interface ItemRow {
  key: string;
  product_id: string;
  quantity: string;
  unit_price: string;
}

interface PurchaseFormData {
  party_id: string;
  date: string;
  payment_type: string;
  notes: string;
  items: ItemRow[];
}

interface PurchaseFormProps {
  data: PurchaseFormData;
  setData: (key: string, value: unknown) => void;
  errors: Record<string, string>;
  processing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
  parties: Party[];
  products: Product[];
}

export default function PurchaseForm({ data, setData, errors, processing, onSubmit, submitLabel, parties, products }: PurchaseFormProps) {
  function addItem() {
    setData('items', [...data.items, { key: crypto.randomUUID(), product_id: '', quantity: '', unit_price: '' }]);
  }

  function removeItem(key: string) {
    setData('items', data.items.filter((i) => i.key !== key));
  }

  function updateItem(key: string, field: string, value: string) {
    setData('items', data.items.map((i) => (i.key === key ? { ...i, [field]: value } : i)));
  }

  const total = data.items.reduce((sum, i) => {
    const qty = parseFloat(i.quantity) || 0;
    const price = parseFloat(i.unit_price) || 0;
    return sum + qty * price;
  }, 0);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="party_id">المورد</Label>
          <Select value={data.party_id} onValueChange={(v) => setData('party_id', v)}>
            <SelectTrigger id="party_id">
              <SelectValue placeholder="اختر المورد" />
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

        <div className="space-y-2">
          <Label htmlFor="date">التاريخ</Label>
          <Input
            id="date"
            type="date"
            className="font-mono"
            value={data.date}
            onChange={(e) => setData('date', e.target.value)}
          />
          {errors.date && <p className="text-sm text-rose-600">{errors.date}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment_type">نوع الدفع</Label>
          <Select value={data.payment_type} onValueChange={(v) => setData('payment_type', v)}>
            <SelectTrigger id="payment_type">
              <SelectValue placeholder="اختر" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.payment_type && <p className="text-sm text-rose-600">{errors.payment_type}</p>}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">البنود</Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="ms-1 h-4 w-4" />
            إضافة بند
          </Button>
        </div>

        {data.items.length === 0 && (
          <p className="py-4 text-center text-sm text-stone-500">أضف بنودًا للفاتورة</p>
        )}

        {data.items.map((item, idx) => (
          <div key={item.key} className="flex items-end gap-3 rounded-lg border border-stone-200 p-3">
            <div className="flex-1 space-y-2">
              <Label>الصنف</Label>
              <Select value={item.product_id} onValueChange={(v) => updateItem(item.key, 'product_id', v)}>
                <SelectTrigger>
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
              {errors[`items.${idx}.product_id`] && <p className="text-sm text-rose-600">{errors[`items.${idx}.product_id`]}</p>}
            </div>
            <div className="w-28 space-y-2">
              <Label>الكمية</Label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                className="font-mono"
                value={item.quantity}
                onChange={(e) => updateItem(item.key, 'quantity', e.target.value)}
              />
              {errors[`items.${idx}.quantity`] && <p className="text-sm text-rose-600">{errors[`items.${idx}.quantity`]}</p>}
            </div>
            <div className="w-28 space-y-2">
              <Label>سعر الوحدة</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                className="font-mono"
                value={item.unit_price}
                onChange={(e) => updateItem(item.key, 'unit_price', e.target.value)}
              />
              {errors[`items.${idx}.unit_price`] && <p className="text-sm text-rose-600">{errors[`items.${idx}.unit_price`]}</p>}
            </div>
            <div className="w-20 space-y-2">
              <Label className="text-stone-400">الإجمالي</Label>
              <p className="font-mono pt-2 text-sm">
                {((parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0)).toFixed(2)}
              </p>
            </div>
            <Button type="button" variant="ghost" size="icon" className="text-rose-500 shrink-0" onClick={() => removeItem(item.key)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {data.items.length > 0 && (
        <div className="flex justify-end border-t border-stone-200 pt-4">
          <div className="text-left">
            <span className="text-sm text-stone-500">إجمالي الفاتورة: </span>
            <span className="font-mono text-lg font-semibold text-stone-900">{total.toFixed(2)}</span>
          </div>
        </div>
      )}

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

      <div className="flex justify-start gap-3 border-t border-stone-200 pt-6">
        <Button type="submit" disabled={processing} className="bg-emerald-700 hover:bg-emerald-800">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
