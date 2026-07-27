import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import StatusBadge from '@/components/Lands/StatusBadge';

interface Crop {
  id: number;
  name: string;
  category: string;
  unit: string;
  typical_season: string | null;
  notes: string | null;
}

interface ShowProps {
  crop: Crop;
}

export default function Show({ crop }: ShowProps) {
  return (
    <div dir="rtl" className="mx-auto max-w-3xl space-y-6 p-6">
      <Head title={crop.name} />

      <Link
        href={route('crops.index')}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى المحاصيل
      </Link>

      <Card className="border-stone-200">
        <CardContent className="flex flex-wrap items-start justify-between gap-4 p-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-stone-900">{crop.name}</h1>
            <div className="space-y-1 text-sm text-stone-500">
              <p><span className="text-stone-400">التصنيف:</span> <StatusBadge value={crop.category} /></p>
              <p className="font-mono">وحدة الإنتاج: {crop.unit}</p>
              {crop.typical_season && <p>الموسم المعتاد: {crop.typical_season}</p>}
            </div>
            {crop.notes && <p className="max-w-xl text-sm text-stone-500">{crop.notes}</p>}
          </div>
          <Button variant="outline" asChild>
            <Link href={route('crops.edit', crop.id)}>
              <Pencil className="ms-2 h-4 w-4" />
              تعديل
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
