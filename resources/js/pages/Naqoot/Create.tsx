import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import NaqootForm from '@/components/Naqoot/NaqootForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    location: '',
    date: '',
    amount: '',
    direction: 'لنا',
    notes: '',
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post(route('naqoot.store'));
  }

  return (
    <div dir="rtl" className="mx-auto max-w-3xl space-y-6 p-6">
      <Head title="إضافة نقوط" />

      <Link
        href={route('naqoot.index')}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى النقوط
      </Link>

      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-xl">إضافة نقوط جديدة</CardTitle>
        </CardHeader>
        <CardContent>
          <NaqootForm
            data={data}
            setData={setData}
            errors={errors}
            processing={processing}
            onSubmit={submit}
            submitLabel="حفظ النقوط"
          />
        </CardContent>
      </Card>
    </div>
  );
}