import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PurchaseForm from '@/components/Purchases/PurchaseForm';

interface Party {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  code: string | null;
}

interface CreateProps {
  parties: Party[];
  products: Product[];
}

export default function Create({ parties, products }: CreateProps) {
  const { data, setData, post, processing, errors } = useForm({
    party_id: '',
    date: new Date().toISOString().slice(0, 10),
    payment_type: '',
    notes: '',
    items: [] as { key: string; product_id: string; quantity: string; unit_price: string }[],
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post(route('purchases.store'));
  }

  return (
    <div dir="rtl" className="mx-auto max-w-4xl space-y-6 p-6">
      <Head title="فاتورة شراء جديدة" />

      <Link
        href={route('purchases.index')}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى المشتريات
      </Link>

      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-xl">فاتورة شراء جديدة</CardTitle>
        </CardHeader>
        <CardContent>
          <PurchaseForm
            data={data}
            setData={setData}
            errors={errors}
            processing={processing}
            onSubmit={submit}
            submitLabel="حفظ الفاتورة"
            parties={parties}
            products={products}
          />
        </CardContent>
      </Card>
    </div>
  );
}
