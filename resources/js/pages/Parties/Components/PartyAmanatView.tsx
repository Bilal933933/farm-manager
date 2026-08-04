import { Card, CardContent } from '@/components/ui/card';
import PartyPaymentsTable from './PartyPaymentsTable';
import type { AmanatFinancials, Payment } from './types';
import { currency } from './types';

interface Props {
  amanatFinancials: AmanatFinancials;
  payments: Payment[];
}

export default function PartyAmanatView({ amanatFinancials, payments }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-stone-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs text-stone-500">إجمالي الأمانات المستلمة</p>
            <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-stone-900">
              {currency(amanatFinancials.total_deposited)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-stone-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs text-stone-500">ما رُدّ من الأمانات</p>
            <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-emerald-700">
              {currency(amanatFinancials.total_returned)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-stone-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs text-stone-500">الأمانات المتبقية</p>
            <p className={`mt-1 font-mono tabular-nums text-2xl font-bold ${amanatFinancials.total_remaining > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
              {currency(amanatFinancials.total_remaining)}
            </p>
          </CardContent>
        </Card>
      </div>

      <PartyPaymentsTable payments={payments} />
    </div>
  );
}
