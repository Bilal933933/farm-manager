import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LandForm from '@/Components/Lands/LandForm';

interface Land {
  id: number;
  name: string;
  location: string | null;
  area: string;
  area_unit: string;
  status: string;
  notes: string | null;
}

interface EditProps {
  land: Land;
}

export default function Edit({ land }: EditProps) {
  const { data, setData, put, processing, errors } = useForm({
    name: land.name ?? '',
    location: land.location ?? '',
    area: land.area ?? '',
    area_unit: land.area_unit,
    status: land.status,
    notes: land.notes ?? '',
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    put(route('lands.update', land.id));
  }

  return (
    <div dir="rtl" className="mx-auto max-w-3xl space-y-6 p-6">
      <Head title={`تعديل ${land.name}`} />

      <Link
        href={route('lands.show', land.id)}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى تفاصيل الأرض
      </Link>

      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-xl">تعديل بيانات الأرض</CardTitle>
        </CardHeader>
        <CardContent>
          <LandForm
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
