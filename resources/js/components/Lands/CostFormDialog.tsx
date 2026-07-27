import { useForm } from '@inertiajs/react';
import type { ReactNode } from 'react';
import CostForm from '@/components/Lands/CostForm';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import type { CostData } from '@/types';

interface Props {
  landId: number;
  cost?: CostData | null;
  trigger: ReactNode;
  seasons?: { id: number; name: string }[];
}

export default function CostFormDialog({ landId, cost = null, trigger, seasons = [] }: Props) {
  const isEditing = Boolean(cost);

  const { data, setData, post, put, processing, errors, reset } = useForm({
    land_id: landId.toString(),
    land_season_id: cost?.land_season_id?.toString() ?? '',
    type: cost?.type ?? 'أخرى',
    description: cost?.description ?? '',
    amount: cost?.amount?.toString() ?? '',
    date: cost?.date ?? '',
    notes: cost?.notes ?? '',
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();

    if (isEditing) {
      put(route('costs.update', cost!.id), { onSuccess: () => reset() });
    } else {
      post(route('costs.store'), { onSuccess: () => reset() });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent dir="rtl" className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'تعديل التكلفة' : 'إضافة تكلفة'}</DialogTitle>
        </DialogHeader>

        <CostForm
          data={data}
          setData={setData}
          errors={errors}
          processing={processing}
          onSubmit={submit}
          submitLabel={isEditing ? 'حفظ التغييرات' : 'إضافة'}
          hideLand
          seasons={seasons}
        />
      </DialogContent>
    </Dialog>
  );
}
