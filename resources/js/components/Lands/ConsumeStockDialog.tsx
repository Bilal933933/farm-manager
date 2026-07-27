import { useForm } from '@inertiajs/react';
import type { ReactNode } from 'react';
import ConsumeStockForm from '@/components/Lands/ConsumeStockForm';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import type { StockProductOption } from '@/types';

interface SeasonOption { id: number; name: string }

interface Props {
  trigger: ReactNode;
  products: StockProductOption[];
  seasons: SeasonOption[];
}

export default function ConsumeStockDialog({ trigger, products, seasons }: Props) {
  const { data, setData, post, processing, errors, reset } = useForm({
    product_id: '',
    land_season_id: '',
    quantity: '',
    unit_price: '',
    date: '',
    notes: '',
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();

    post(route('stock.consume'), { onSuccess: () => reset() });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent dir="rtl" className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>صرف من المخزون لموسم</DialogTitle>
        </DialogHeader>

        <ConsumeStockForm
          data={data}
          setData={setData}
          errors={errors}
          processing={processing}
          onSubmit={submit}
          products={products}
          seasons={seasons}
        />
      </DialogContent>
    </Dialog>
  );
}
