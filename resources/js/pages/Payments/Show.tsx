import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { DateDisplay } from '@/components/ui/date-display';
import StatusBadge from '@/components/Lands/StatusBadge';
import { TYPE_TONE } from '@/lib/paymentEnums';

interface Party {
  id: number;
  name: string;
}

interface Payment {
  id: number;
  type: string;
  date: string;
  amount: string;
  party: Party | null;
  notes: string | null;
}

interface ShowProps {
  payment: Payment;
}

export default function Show({ payment }: ShowProps) {
  return (
    <div dir="rtl" className="mx-auto max-w-3xl space-y-6 p-6">
      <Head title={`${payment.type} - ${payment.party?.name}`} />

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
          </div>

          {payment.notes && <p className="mt-4 text-sm text-stone-500">{payment.notes}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
