import { useForm } from '@inertiajs/react';
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SEASON_STATUSES } from '@/lib/landEnums';
import type { ReactNode } from 'react';

interface Season {
  id?: number;
  crop?: string;
  planting_date?: string;
  harvest_date?: string;
  expected_cost?: string;
  actual_cost?: string;
  status?: string;
  notes?: string;
}

interface SeasonFormDialogProps {
  landId: number;
  season?: Season | null;
  trigger: ReactNode;
}

export default function SeasonFormDialog({ landId, season = null, trigger }: SeasonFormDialogProps) {
  const isEditing = Boolean(season);

  const { data, setData, post, put, processing, errors, reset } = useForm({
    land_id: landId,
    crop: season?.crop ?? '',
    planting_date: season?.planting_date ?? '',
    harvest_date: season?.harvest_date ?? '',
    expected_cost: season?.expected_cost ?? '',
    actual_cost: season?.actual_cost ?? '',
    status: season?.status ?? 'قادم',
    notes: season?.notes ?? '',
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
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent dir="rtl" className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'تعديل الموسم' : 'إضافة موسم زراعي'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="crop">المحصول</Label>
            <Input id="crop" value={data.crop} onChange={(e) => setData('crop', e.target.value)} placeholder="مثال: قمح" />
            {errors.crop && <p className="text-sm text-rose-600">{errors.crop}</p>}
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

          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="actual_cost">التكلفة الفعلية</Label>
              <Input
                id="actual_cost"
                type="number"
                step="0.01"
                className="font-mono"
                value={data.actual_cost}
                onChange={(e) => setData('actual_cost', e.target.value)}
              />
              {errors.actual_cost && <p className="text-sm text-rose-600">{errors.actual_cost}</p>}
            </div>
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
