import { Card, CardContent } from '@/components/ui/card';
import type { MerchantFinancials } from './types';
import { currency } from './types';

interface Props {
  merchantFinancials: MerchantFinancials;
}

export default function PartyMerchantView({ merchantFinancials }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="border-stone-200 shadow-sm">
        <CardContent className="p-5">
          <p className="text-xs text-stone-500">إجمالي المبيعات</p>
          <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-stone-900">
            {currency(merchantFinancials.total_sales_amount)}
          </p>
        </CardContent>
      </Card>

      <Card className="border-stone-200 shadow-sm">
        <CardContent className="p-5">
          <p className="text-xs text-stone-500">ما قُبض من التاجر</p>
          <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-emerald-700">
            {currency(merchantFinancials.total_received)}
          </p>
        </CardContent>
      </Card>

      <Card className="border-stone-200 shadow-sm">
        <CardContent className="p-5">
          <p className="text-xs text-stone-500">المتبقي على التاجر</p>
          <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-rose-700">
            {currency(merchantFinancials.total_due)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
