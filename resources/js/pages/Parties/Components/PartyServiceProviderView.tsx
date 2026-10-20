import { Card, CardContent } from '@/components/ui/card';
import type { ServiceProviderFinancials } from './types';
import { currency } from './types';

interface Props {
  serviceProviderFinancials: ServiceProviderFinancials;
}

export default function PartyServiceProviderView({ serviceProviderFinancials }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="border-stone-200 shadow-sm">
        <CardContent className="p-5">
          <p className="text-xs text-stone-500">إجمالي الخدمات</p>
          <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-stone-900">
            {currency(serviceProviderFinancials.total_services_amount)}
          </p>
        </CardContent>
      </Card>

      <Card className="border-stone-200 shadow-sm">
        <CardContent className="p-5">
          <p className="text-xs text-stone-500">ما دُفع لمقدّم الخدمة</p>
          <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-emerald-700">
            {currency(serviceProviderFinancials.total_paid)}
          </p>
        </CardContent>
      </Card>

      <Card className="border-stone-200 shadow-sm">
        <CardContent className="p-5">
          <p className="text-xs text-stone-500">المتبقي لمقدّم الخدمة</p>
          <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-rose-700">
            {currency(serviceProviderFinancials.total_remaining)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
