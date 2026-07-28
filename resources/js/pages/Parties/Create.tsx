import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PartyForm from '@/components/Parties/PartyForm';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    type: 'فرد',
    category: '',
    phone: '',
    email: '',
    national_id: '',
    address: '',
    notes: '',
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post(route('parties.store'));
  }

  return (
    <div dir="rtl" className="mx-auto max-w-3xl space-y-6 p-6">
      <Head title="إضافة طرف جديد" />

      <Link
        href={route('parties.index')}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى الأطراف
      </Link>

      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-xl">إضافة طرف جديد</CardTitle>
        </CardHeader>
        <CardContent>
          <PartyForm
            data={data}
            setData={setData}
            errors={errors}
            processing={processing}
            onSubmit={submit}
            submitLabel="حفظ الطرف"
          />
        </CardContent>
      </Card>
    </div>
  );
}
