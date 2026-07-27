import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import CostForm from '@/components/Lands/CostForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CostData } from '@/types';

interface SeasonOption { id: number; land_id: number; crop: string; planting_date: string; land: { id: number; name: string } }
interface EditProps { cost: CostData; lands: { id: number; name: string }[]; seasons: SeasonOption[] }

export default function Edit({ cost, lands, seasons }: EditProps) {
  const { data, setData, put, processing, errors } = useForm({
    type: cost.type,
    description: cost.description,
    amount: cost.amount.toString(),
    date: cost.date,
    notes: cost.notes ?? '',
    land_id: cost.land?.id?.toString() ?? cost.land_id?.toString() ?? '',
    land_season_id: cost.land_season?.id?.toString() ?? cost.land_season_id?.toString() ?? '',
  });

  const filteredSeasons = seasons
    .filter((s) => s.land_id.toString() === data.land_id)
    .map((s) => ({ id: s.id, name: `${s.crop} — ${s.land.name}` }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    put(route('costs.update', cost.id));
  }

  return (
    <div dir="rtl" className="mx-auto max-w-3xl space-y-6 p-6">
      <Head title="تعديل التكلفة" />

      <Link
        href={route('costs.show', cost.id)}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى تفاصيل التكلفة
      </Link>

      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-xl">تعديل التكلفة</CardTitle>
        </CardHeader>
        <CardContent>
          <CostForm
            data={data}
            setData={setData}
            errors={errors}
            processing={processing}
            onSubmit={submit}
            submitLabel="حفظ التعديلات"
            lands={lands}
            seasons={filteredSeasons}
          />
        </CardContent>
      </Card>
    </div>
  );
}
