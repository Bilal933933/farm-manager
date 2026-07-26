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
import { AREA_UNITS, LAND_STATUSES } from '@/lib/landEnums';

interface LandFormData {
  name: string;
  location: string;
  area: string;
  area_unit: string;
  status: string;
  notes: string;
}

interface LandFormProps {
  data: LandFormData;
  setData: (key: string, value: string) => void;
  errors: Record<string, string>;
  processing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
}

export default function LandForm({ data, setData, errors, processing, onSubmit, submitLabel }: LandFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">اسم الأرض</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            placeholder="مثال: قطعة الوادي الشمالية"
          />
          {errors.name && <p className="text-sm text-rose-600">{errors.name}</p>}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="location">الموقع</Label>
          <Input
            id="location"
            value={data.location ?? ''}
            onChange={(e) => setData('location', e.target.value)}
            placeholder="مثال: قرب طريق الواحة، الجيزة"
          />
          {errors.location && <p className="text-sm text-rose-600">{errors.location}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="area">المساحة</Label>
          <Input
            id="area"
            type="number"
            step="0.01"
            min="0"
            className="font-mono"
            value={data.area}
            onChange={(e) => setData('area', e.target.value)}
            placeholder="0.00"
          />
          {errors.area && <p className="text-sm text-rose-600">{errors.area}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="area_unit">وحدة المساحة</Label>
          <Select value={data.area_unit} onValueChange={(v) => setData('area_unit', v)}>
            <SelectTrigger id="area_unit">
              <SelectValue placeholder="اختر الوحدة" />
            </SelectTrigger>
            <SelectContent>
              {AREA_UNITS.map((unit) => (
                <SelectItem key={unit.value} value={unit.value}>
                  {unit.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.area_unit && <p className="text-sm text-rose-600">{errors.area_unit}</p>}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="status">الحالة</Label>
          <Select value={data.status} onValueChange={(v) => setData('status', v)}>
            <SelectTrigger id="status" className="sm:w-64">
              <SelectValue placeholder="اختر الحالة" />
            </SelectTrigger>
            <SelectContent>
              {LAND_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
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
            rows={4}
            value={data.notes ?? ''}
            onChange={(e) => setData('notes', e.target.value)}
            placeholder="أي تفاصيل إضافية عن الأرض..."
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
