import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PaymentForm from '@/components/Payments/PaymentForm';

interface Party {
  id: number;
  name: string;
  category: string | null;
}

interface Contract {
  id: number;
  type: string;
  amount: number;
  paid_amount: number;
  remaining: number;
  party: { id: number; name: string };
  land: { id: number; name: string };
}

interface Season {
  id: number;
  farmer_id: number;
  label: string;
}

interface Payment {
  id: number;
  party_id: number;
  contract_id: number | null;
  land_season_id: number | null;
  type: string;
  date: string;
  amount: string;
  notes: string | null;
  party: Party | null;
}

interface EditProps {
  payment: Payment;
  parties: Party[];
  contracts: Contract[];
  seasons: Season[];
}

export default function Edit({ payment, parties, contracts, seasons }: EditProps) {
  const { data, setData, put, processing, errors } = useForm({
    party_id: String(payment.party_id),
    contract_id: payment.contract_id ? String(payment.contract_id) : '',
    land_season_id: payment.land_season_id ? String(payment.land_season_id) : '',
    type: payment.type,
    date: payment.date.slice(0, 10),
    amount: payment.amount,
    notes: payment.notes ?? '',
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    put(route('payments.update', payment.id));
  }

  return (
    <div dir="rtl" className="mx-auto max-w-3xl space-y-6 p-6">
      <Head title={`تعديل - ${payment.party?.name}`} />

      <Link
        href={route('payments.index')}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى المدفوعات
      </Link>

      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-xl">تعديل الدفعة</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentForm
            data={data}
            setData={setData}
            errors={errors}
            processing={processing}
            onSubmit={submit}
            submitLabel="حفظ التعديلات"
            parties={parties}
            contracts={contracts}
            seasons={seasons}
          />
        </CardContent>
      </Card>
    </div>
  );
}
