import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LandForm from '@/components/Lands/LandForm';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    location: '',
    area: '',
    area_unit: 'دونم',
    status: 'نشط',
    notes: '',
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post(route('lands.store'));
  }

  return (
    <div dir="rtl" className="mx-auto max-w-3xl space-y-6 p-6">
      <Head title="إضافة أرض جديدة" />

      <Link
        href={route('lands.index')}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى الأراضي
      </Link>

      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-xl">إضافة أرض جديدة</CardTitle>
        </CardHeader>
        <CardContent>
          <LandForm
            data={data}
            setData={setData}
            errors={errors}
            processing={processing}
            onSubmit={submit}
            submitLabel="حفظ الأرض"
          />
        </CardContent>
      </Card>
    </div>
  );
}
