import { Landmark, ArrowLeftRight, Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { FinancialSummary } from './types';
import { currency } from './types';

interface Props {
  summary: FinancialSummary;
}

export default function PartyFinancialSummary({ summary }: Props) {
  const hasContracts = summary.totalContractAmount > 0;
  const isSettled = hasContracts && summary.netBalance === 0;
  const isCreditor = summary.netBalance >= 0;
  const totalCashFlow = summary.totalPaidTo + summary.totalReceivedFrom;

  const balanceBadge = () => {
    if (isSettled) return <Badge variant="secondary" className="rounded-full text-xs font-normal">مسدد بالكامل</Badge>;
    if (hasContracts) return null;
    return null;
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="border-stone-200 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 text-stone-500 mb-3">
            <Landmark className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">إجمالي العقود</span>
          </div>
          <p className={`font-mono tabular-nums text-3xl font-bold tracking-tight ${hasContracts ? 'text-stone-900' : 'text-stone-300'}`}>
            {hasContracts ? currency(summary.totalContractAmount) : '—'}
          </p>
          <p className="mt-1.5 text-xs text-stone-400">
            {hasContracts ? 'قيمة العقود المرتبطة' : 'لا توجد عقود'}
          </p>
        </CardContent>
      </Card>

      <Card className="border-stone-200 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 text-stone-500 mb-3">
            <ArrowLeftRight className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">إجمالي المدفوعات</span>
          </div>
          <p className="font-mono tabular-nums text-3xl font-bold tracking-tight text-emerald-700">
            {currency(totalCashFlow)}
          </p>
          <div className="mt-1.5 flex items-center gap-3 text-xs text-stone-400">
            <span>قبض <span className="font-mono tabular-nums font-medium text-stone-600">{currency(summary.totalReceivedFrom)}</span></span>
            <Separator orientation="vertical" className="h-3" />
            <span>دفع <span className="font-mono tabular-nums font-medium text-stone-600">{currency(summary.totalPaidTo)}</span></span>
          </div>
        </CardContent>
      </Card>

      <Card className={`border shadow-sm ${isSettled ? 'border-emerald-200' : hasContracts && isCreditor ? 'border-amber-200' : !hasContracts ? 'border-stone-200' : 'border-rose-200'}`}>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 text-stone-500 mb-3">
            <Wallet className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">المتبقي</span>
          </div>
          {hasContracts ? (
            <>
              <div className="flex items-center gap-2">
                <p className={`font-mono tabular-nums text-3xl font-bold tracking-tight ${isSettled ? 'text-emerald-700' : isCreditor ? 'text-amber-700' : 'text-rose-700'}`}>
                  {isSettled ? '0' : `${isCreditor ? 'له ' : 'عليه '}${currency(Math.abs(summary.netBalance))}`}
                </p>
                {balanceBadge()}
              </div>
              <p className="mt-1.5 text-xs text-stone-400">
                {isSettled ? 'تم سداد جميع المستحقات' : isCreditor ? 'المبلغ المتبقي للطرف' : 'المبلغ المطلوب من الطرف'}
              </p>
            </>
          ) : (
            <>
              <p className="font-mono tabular-nums text-2xl font-bold tracking-tight text-stone-700">
                {isCreditor ? 'له ' : 'عليه '}{currency(Math.abs(summary.netBalance))}
              </p>
              <p className="mt-1.5 text-xs text-stone-400">الرصيد الحالي</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
