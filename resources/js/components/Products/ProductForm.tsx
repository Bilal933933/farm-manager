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
import { PRODUCT_CATEGORIES, PRODUCT_UNITS, PRODUCT_STATUSES } from '@/lib/productEnums';

interface ProductFormData {
  code: string;
  name: string;
  category: string;
  unit: string;
  status: string;
  display_order: string;
  notes: string;
}

interface ProductFormProps {
  data: ProductFormData;
  setData: (key: string, value: string) => void;
  errors: Record<string, string>;
  processing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
}

export default function ProductForm({ data, setData, errors, processing, onSubmit, submitLabel }: ProductFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="code">الكود</Label>
          <Input
            id="code"
            className="font-mono"
            dir="ltr"
            value={data.code}
            onChange={(e) => setData('code', e.target.value)}
            placeholder="FER-001"
          />
          {errors.code && <p className="text-sm text-rose-600">{errors.code}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="display_order">ترتيب العرض</Label>
          <Input
            id="display_order"
            type="number"
            min="0"
            className="font-mono"
            value={data.display_order}
            onChange={(e) => setData('display_order', e.target.value)}
          />
          {errors.display_order && <p className="text-sm text-rose-600">{errors.display_order}</p>}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">اسم الصنف</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            placeholder="اسم المنتج"
          />
          {errors.name && <p className="text-sm text-rose-600">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">التصنيف</Label>
          <Select value={data.category} onValueChange={(v) => setData('category', v)}>
            <SelectTrigger id="category">
              <SelectValue placeholder="اختر التصنيف" />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-sm text-rose-600">{errors.category}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">الوحدة</Label>
          <Select value={data.unit} onValueChange={(v) => setData('unit', v)}>
            <SelectTrigger id="unit">
              <SelectValue placeholder="اختر الوحدة" />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_UNITS.map((u) => (
                <SelectItem key={u.value} value={u.value}>
                  {u.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.unit && <p className="text-sm text-rose-600">{errors.unit}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">الحالة</Label>
          <Select value={data.status} onValueChange={(v) => setData('status', v)}>
            <SelectTrigger id="status">
              <SelectValue placeholder="اختر الحالة" />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.status && <p className="text-sm text-rose-600">{errors.status}</p>}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="notes">ملاحظات</Label>
          <Textarea
            id="notes"
            rows={3}
            value={data.notes ?? ''}
            onChange={(e) => setData('notes', e.target.value)}
          />
          {errors.notes && <p className="text-sm text-rose-600">{errors.notes}</p>}
        </div>
      </div>

      <div className="flex justify-start gap-3 border-t border-stone-200 pt-6">
        <Button type="submit" disabled={processing} className="bg-emerald-700 hover:bg-emerald-800">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
