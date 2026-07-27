import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CropForm from '@/components/Crops/CropForm';

interface Crop {
  id: number;
  name: string;
  category: string;
  unit: string;
  typical_season: string | null;
  notes: string | null;
}

interface EditProps {
  crop: Crop;
}

export default function Edit({ crop }: EditProps) {
  const { data, setData, put, processing, errors } = useForm({
    name: crop.name,
    category: crop.category,
    unit: crop.unit,
    typical_season: crop.typical_season ?? '',
    notes: crop.notes ?? '',
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    put(route('crops.update', crop.id));
  }

  return (
    <div dir="rtl" className="mx-auto max-w-3xl space-y-6 p-6">
      <Head title={`تعديل ${crop.name}`} />

      <Link
        href={route('crops.show', crop.id)}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى تفاصيل المحصول
      </Link>

      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-xl">تعديل المحصول</CardTitle>
        </CardHeader>
        <CardContent>
          <CropForm
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
