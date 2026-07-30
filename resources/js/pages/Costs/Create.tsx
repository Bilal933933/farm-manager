import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import CostForm from '@/components/Lands/CostForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Option { id: number; name: string }
interface SeasonOption { id: number; land_id: number; crop?: { name: string } | null; planting_date: string; land: Option }

interface CreateProps { lands: Option[]; seasons: SeasonOption[] }

export default function Create({ lands, seasons }: CreateProps) {
  const { data, setData, post, processing, errors } = useForm({
    land_id: lands[0]?.id?.toString() ?? '',
    land_season_id: '',
    type: 'أخرى',
    borne_by: 'مشترك',
    description: '',
    amount: '',
    date: '',
    notes: '',
  });

  const filteredSeasons = seasons
    .filter((s) => s.land_id.toString() === data.land_id)
    .map((s) => ({ id: s.id, name: `${s.crop?.name ?? '—'} — ${s.land.name}` }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post(route('costs.store'));
  }

  return (
    <div dir="rtl" className="mx-auto max-w-3xl space-y-6 p-6">
      <Head title="إضافة تكلفة" />

      <Link
        href={route('costs.index')}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى التكاليف
      </Link>

      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-xl">إضافة تكلفة جديدة</CardTitle>
        </CardHeader>
        <CardContent>
          <CostForm
            data={data}
            setData={setData}
            errors={errors}
            processing={processing}
            onSubmit={submit}
            submitLabel="حفظ التكلفة"
            lands={lands}
            seasons={filteredSeasons}
          />
        </CardContent>
      </Card>
    </div>
  );
}
