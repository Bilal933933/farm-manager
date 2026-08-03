import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import NaqootForm from '@/components/Naqoot/NaqootForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { NaqootData } from '@/types';

interface EditProps {
  naqoot: NaqootData;
}

export default function Edit({ naqoot }: EditProps) {
  const { data, setData, put, processing, errors } = useForm({
    name: naqoot.name,
    date: naqoot.date,
    amount: naqoot.amount.toString(),
    direction: naqoot.direction,
    notes: naqoot.notes ?? '',
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    put(route('naqoot.update', naqoot.id));
  }

  return (
    <div dir="rtl" className="mx-auto max-w-3xl space-y-6 p-6">
      <Head title="تعديل نقوط" />

      <Link
        href={route('naqoot.index')}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى النقوط
      </Link>

      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-xl">تعديل النقوط</CardTitle>
        </CardHeader>
        <CardContent>
          <NaqootForm
            data={data}
            setData={setData}
            errors={errors}
            processing={processing}
            onSubmit={submit}
            submitLabel="حفظ التعديلات"
          />
        </CardContent>
      </Card>
    </div>
  );
}