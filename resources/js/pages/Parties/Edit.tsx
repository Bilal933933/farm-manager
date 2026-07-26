import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PartyForm from '@/components/Parties/PartyForm';

interface Party {
  id: number;
  name: string;
  type: string;
  phone: string | null;
  email: string | null;
  national_id: string | null;
  address: string | null;
  notes: string | null;
}

interface EditProps {
  party: Party;
}

export default function Edit({ party }: EditProps) {
  const { data, setData, put, processing, errors } = useForm({
    name: party.name ?? '',
    type: party.type,
    phone: party.phone ?? '',
    email: party.email ?? '',
    national_id: party.national_id ?? '',
    address: party.address ?? '',
    notes: party.notes ?? '',
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    put(route('parties.update', party.id));
  }

  return (
    <div dir="rtl" className="mx-auto max-w-3xl space-y-6 p-6">
      <Head title={`تعديل ${party.name}`} />

      <Link
        href={route('parties.show', party.id)}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى تفاصيل الطرف
      </Link>

      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-xl">تعديل بيانات الطرف</CardTitle>
        </CardHeader>
        <CardContent>
          <PartyForm
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
