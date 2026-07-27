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
import { CROP_CATEGORIES, CROP_UNITS, CROP_SEASONS } from '@/lib/cropEnums';

interface CropFormData {
  name: string;
  category: string;
  unit: string;
  typical_season: string;
  notes: string;
}

interface CropFormProps {
  data: CropFormData;
  setData: (key: string, value: string) => void;
  errors: Record<string, string>;
  processing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
}

export default function CropForm({ data, setData, errors, processing, onSubmit, submitLabel }: CropFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">اسم المحصول</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            placeholder="أرز، قمح، بطيخ..."
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
              {CROP_CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-sm text-rose-600">{errors.category}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">وحدة الإنتاج</Label>
          <Select value={data.unit} onValueChange={(v) => setData('unit', v)}>
            <SelectTrigger id="unit">
              <SelectValue placeholder="اختر" />
            </SelectTrigger>
            <SelectContent>
              {CROP_UNITS.map((u) => (
                <SelectItem key={u.value} value={u.value}>
                  {u.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.unit && <p className="text-sm text-rose-600">{errors.unit}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="typical_season">الموسم المعتاد (اختياري)</Label>
          <Select value={data.typical_season} onValueChange={(v) => setData('typical_season', v)}>
            <SelectTrigger id="typical_season">
              <SelectValue placeholder="غير محدد" />
            </SelectTrigger>
            <SelectContent>
              {CROP_SEASONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.typical_season && <p className="text-sm text-rose-600">{errors.typical_season}</p>}
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
