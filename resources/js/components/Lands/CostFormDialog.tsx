import { useForm } from '@inertiajs/react';
import type { ReactNode } from 'react';
import CostForm from '@/components/Lands/CostForm';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { snapshotDialogForm, usePersistentDialogForm } from '@/hooks/use-persistent-dialog-form';
import type { CostData } from '@/types';

interface Props {
  landId: number;
  cost?: CostData | null;
  trigger: ReactNode;
  seasons?: { id: number; name: string }[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialSeasonId?: number | null;
  hideSeason?: boolean;
}

export default function CostFormDialog({ landId, cost = null, trigger, seasons = [], open, onOpenChange, initialSeasonId = null, hideSeason = false }: Props) {
  const isEditing = Boolean(cost);

  const { data, setData, post, put, processing, errors, reset, setError } = useForm({
    land_id: landId.toString(),
    land_season_id: cost?.land_season_id?.toString() ?? (initialSeasonId ? initialSeasonId.toString() : ''),
    type: cost?.type ?? 'أخرى',
    description: cost?.description ?? '',
    amount: cost?.amount?.toString() ?? '',
    date: cost?.date ?? '',
    notes: cost?.notes ?? '',
  });

  const storageSlug = `cost-form:${cost?.id ?? 'new'}`;

  const persistent = usePersistentDialogForm({
    slug: storageSlug,
    fieldKeys: ['land_id', 'land_season_id', 'type', 'description', 'amount', 'date', 'notes'],
    data: data as unknown as Record<string, unknown>,
    setData: (key: string, value: string) => setData(key as never, value as never),
    setError,
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    snapshotDialogForm(storageSlug, data as unknown as Record<string, unknown>);

    if (isEditing) {
      put(route('costs.update', cost!.id), { preserveState: 'errors', onSuccess: () => reset() });
    } else {
      post(route('costs.store'), { preserveState: 'errors', onSuccess: () => reset() });
    }
  }

  return (
    <Dialog open={open ?? persistent.open} onOpenChange={onOpenChange ?? persistent.onOpenChange}>
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
          hideSeason={hideSeason}
          seasons={seasons}
        />
      </DialogContent>
    </Dialog>
  );
}
