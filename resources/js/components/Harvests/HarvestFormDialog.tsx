import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { ReactNode } from 'react';

interface HarvestFormDialogProps {
  landSeasonId: number;
  trigger: ReactNode;
}

export default function HarvestFormDialog({ landSeasonId, trigger }: HarvestFormDialogProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    land_season_id: landSeasonId,
    date: '',
    quantity: '',
    notes: '',
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post(route('harvests.store'), { onSuccess: () => reset() });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent dir="rtl" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>تسجيل حصاد</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="harvest_date">التاريخ</Label>
              <Input
                id="harvest_date"
                type="date"
                value={data.date}
                onChange={(e) => setData('date', e.target.value)}
              />
              {errors.date && <p className="text-sm text-rose-600">{errors.date}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="harvest_quantity">الكمية</Label>
              <Input
                id="harvest_quantity"
                type="number"
                step="0.01"
                min="0.01"
                className="font-mono"
                value={data.quantity}
                onChange={(e) => setData('quantity', e.target.value)}
              />
              {errors.quantity && <p className="text-sm text-rose-600">{errors.quantity}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="harvest_notes">ملاحظات</Label>
            <Textarea id="harvest_notes" rows={3} value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={processing} className="bg-emerald-700 hover:bg-emerald-800">
              تسجيل الحصاد
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
