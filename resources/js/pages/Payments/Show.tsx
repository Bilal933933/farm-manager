import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DateDisplay } from '@/components/ui/date-display';
import StatusBadge from '@/components/Lands/StatusBadge';
import { TYPE_TONE } from '@/lib/paymentEnums';

interface Party {
  id: number;
  name: string;
}

interface Contract {
  id: number;
  type: string;
  amount: number;
  paid_amount: number;
  remaining: number;
  land: { id: number; name: string };
  party: { id: number; name: string };
}

interface Payment {
  id: number;
  type: string;
  date: string;
  amount: string;
  party: Party | null;
  contract: Contract | null;
  notes: string | null;
}

interface ShowProps {
  payment: Payment;
}

export default function Show({ payment }: ShowProps) {
  const isLinkedToContract = Boolean(payment.contract);

  return (
    <div dir="rtl" className="mx-auto max-w-3xl space-y-6 p-6">
      <Head title={`${payment.type === 'دفع' ? 'دفعة' : 'مقبوض'} - ${payment.party?.name}`} />

      <Link
        href={route('payments.index')}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى المدفوعات
      </Link>

      <Card className="border-stone-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-2xl font-semibold text-stone-900">
              {payment.type === 'دفع' ? 'دفعة' : 'مقبوض'} لـ {payment.party?.name}
            </h1>
            <StatusBadge value={payment.type} toneMap={TYPE_TONE} />
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-stone-400">التاريخ: </span>
              <DateDisplay date={payment.date} />
            </div>
            <div>
              <span className="text-stone-400">المبلغ: </span>
              <span className="font-mono text-lg font-semibold text-stone-900">{payment.amount}</span>
            </div>
            <div>
              <span className="text-stone-400">الطرف: </span>
              <span className="font-medium">{payment.party?.name ?? '—'}</span>
            </div>
            {isLinkedToContract && (
              <>
                <div>
                  <span className="text-stone-400">الأرض: </span>
                  <Link href={route('lands.show', payment.contract!.land.id)} className="font-medium hover:text-emerald-700 hover:underline">
                    {payment.contract!.land.name}
                  </Link>
                </div>
                <div>
                  <span className="text-stone-400">العقد: </span>
                  <span className="font-medium">{payment.contract!.type}</span>
                </div>
                <div>
                  <span className="text-stone-400">المتبقي: </span>
                  <span className="font-mono font-semibold">{payment.contract!.remaining.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

          {payment.notes && <p className="mt-4 text-sm text-stone-500">{payment.notes}</p>}

          <div className="mt-6 flex items-center gap-3 border-t border-stone-100 pt-6">
            <Button variant="outline" size="sm" asChild>
              <Link href={route('payments.edit', payment.id)}>
                <Pencil className="ms-2 h-4 w-4" />
                تعديل الدفعة
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
