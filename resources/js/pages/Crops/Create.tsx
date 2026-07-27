import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CropForm from '@/components/Crops/CropForm';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    category: '',
    unit: '',
    typical_season: '',
    notes: '',
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post(route('crops.store'));
  }

  return (
    <div dir="rtl" className="mx-auto max-w-3xl space-y-6 p-6">
      <Head title="إضافة محصول جديد" />

      <Link
        href={route('crops.index')}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى المحاصيل
      </Link>

      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-xl">إضافة محصول جديد</CardTitle>
        </CardHeader>
        <CardContent>
          <CropForm
            data={data}
            setData={setData}
            errors={errors}
            processing={processing}
            onSubmit={submit}
            submitLabel="حفظ المحصول"
          />
        </CardContent>
      </Card>
    </div>
  );
}
