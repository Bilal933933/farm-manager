import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PaymentForm from '@/components/Payments/PaymentForm';

interface Party {
  id: number;
  name: string;
}

interface CreateProps {
  parties: Party[];
}

export default function Create({ parties }: CreateProps) {
  const { data, setData, post, processing, errors } = useForm({
    party_id: '',
    type: '',
    date: new Date().toISOString().slice(0, 10),
    amount: '',
    notes: '',
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post(route('payments.store'));
  }

  return (
    <div dir="rtl" className="mx-auto max-w-3xl space-y-6 p-6">
      <Head title="تسجيل جديد" />

      <Link
        href={route('payments.index')}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى المدفوعات
      </Link>

      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-xl">تسجيل دفع أو قبض</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentForm
            data={data}
            setData={setData}
            errors={errors}
            processing={processing}
            onSubmit={submit}
            submitLabel="حفظ"
            parties={parties}
          />
        </CardContent>
      </Card>
    </div>
  );
}
