import { useForm } from '@inertiajs/react';
import type {ReactNode} from 'react';
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
import { SEASON_STATUSES } from '@/lib/landEnums';
import type { Crop, Season } from '@/types';

interface Farmer {
  id: number;
  name: string;
}

interface SeasonFormData {
  land_id: number;
  crop_id: string;
  cultivated_area: string;
  crop: string;
  planting_date: string;
  harvest_date: string;
  expected_cost: string;
  status: string;
  notes: string;
  farmer_id: string;
}

interface SeasonFormDialogProps {
  landId: number;
  season?: Season | null;
  trigger: ReactNode;
  crops: Crop[];
  farmers?: Farmer[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function toDateInputValue(dateStr?: string): string {
  if (!dateStr) {
return '';
}

  return dateStr.split('T')[0];
}

export default function SeasonFormDialog({ landId, season = null, trigger, crops, farmers, open, onOpenChange }: SeasonFormDialogProps) {
  const isEditing = Boolean(season);

  const initialCrop = season?.crop && typeof season.crop === 'object'
    ? (season.crop as { name?: string }).name ?? ''
    : String(season?.crop ?? '');

  const { data, setData, post, put, processing, errors, reset } = useForm<SeasonFormData>({
    land_id: landId,
    crop_id: String(season?.crop_id ?? ''),
    cultivated_area: season?.cultivated_area ?? '',
    crop: initialCrop,
    planting_date: toDateInputValue(season?.planting_date),
    harvest_date: toDateInputValue(season?.harvest_date),
    expected_cost: season?.expected_cost ?? '',
    status: season?.status ?? 'قادم',
    notes: season?.notes ?? '',
    farmer_id: String(season?.farmer_id ?? ''),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();

    if (isEditing) {
      put(route('lands.seasons.update', season!.id), { onSuccess: () => reset() });
    } else {
      post(route('lands.seasons.store'), { onSuccess: () => reset() });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent dir="rtl" className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'تعديل الموسم' : 'إضافة موسم زراعي'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="crop_id">المحصول</Label>
              <Select value={data.crop_id} onValueChange={(v) => setData('crop_id', v)}>
                <SelectTrigger id="crop_id">
                  <SelectValue placeholder="اختر المحصول" />
                </SelectTrigger>
                <SelectContent>
                  {crops.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.crop_id && <p className="text-sm text-rose-600">{errors.crop_id}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cultivated_area">المساحة المزروعة</Label>
              <Input
                id="cultivated_area"
                type="number"
                step="0.01"
                min="0"
                className="font-mono"
                value={data.cultivated_area}
                onChange={(e) => setData('cultivated_area', e.target.value)}
              />
              {errors.cultivated_area && <p className="text-sm text-rose-600">{errors.cultivated_area}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="planting_date">تاريخ الزراعة</Label>
              <Input
                id="planting_date"
                type="date"
                value={data.planting_date}
                onChange={(e) => setData('planting_date', e.target.value)}
              />
              {errors.planting_date && <p className="text-sm text-rose-600">{errors.planting_date}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="harvest_date">تاريخ الحصاد المتوقع</Label>
              <Input
                id="harvest_date"
                type="date"
                value={data.harvest_date}
                onChange={(e) => setData('harvest_date', e.target.value)}
              />
              {errors.harvest_date && <p className="text-sm text-rose-600">{errors.harvest_date}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expected_cost">التكلفة المتوقعة</Label>
            <Input
              id="expected_cost"
              type="number"
              step="0.01"
              className="font-mono"
              value={data.expected_cost}
              onChange={(e) => setData('expected_cost', e.target.value)}
            />
            {errors.expected_cost && <p className="text-sm text-rose-600">{errors.expected_cost}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="farmer_id">المزارع (اختياري)</Label>
            <Select value={data.farmer_id} onValueChange={(v) => setData('farmer_id', v)}>
              <SelectTrigger id="farmer_id">
                <SelectValue placeholder="اختر المزارع" />
              </SelectTrigger>
              <SelectContent>
                {farmers?.map((f) => (
                  <SelectItem key={f.id} value={String(f.id)}>{f.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.farmer_id && <p className="text-sm text-rose-600">{errors.farmer_id}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="season_status">الحالة</Label>
            <Select value={data.status} onValueChange={(v) => setData('status', v)}>
              <SelectTrigger id="season_status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SEASON_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="season_notes">ملاحظات</Label>
            <Textarea id="season_notes" rows={3} value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={processing} className="bg-emerald-700 hover:bg-emerald-800">
              {isEditing ? 'حفظ التعديلات' : 'إضافة الموسم'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
