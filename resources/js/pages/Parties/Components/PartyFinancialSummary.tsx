import { Landmark, ArrowLeftRight, Wallet, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { FinancialSummary } from './types';
import { currency } from './types';

interface Props {
  summary: FinancialSummary;
}

function BalanceIcon({ settled, creditor, hasContracts }: { settled: boolean; creditor: boolean; hasContracts: boolean }) {
  if (settled) return <Minus className="h-5 w-5 text-emerald-500" />;
  if (creditor) return <TrendingUp className="h-5 w-5 text-amber-500" />;
  return <TrendingDown className="h-5 w-5 text-rose-500" />;
}

export default function PartyFinancialSummary({ summary }: Props) {
  const hasContracts = summary.totalContractAmount > 0;
  const isSettled = hasContracts && summary.netBalance === 0;
  const isCreditor = summary.netBalance >= 0;
  const totalCashFlow = summary.totalPaidTo + summary.totalReceivedFrom;

  const paymentProgress = hasContracts && summary.totalContractAmount > 0
    ? Math.min(100, Math.round(((summary.totalPaidTo + summary.totalReceivedFrom) / summary.totalContractAmount) * 100))
    : 0;

  const balanceLabel = () => {
    if (isSettled) return 'مسدد بالكامل';
    if (hasContracts) return isCreditor ? 'المبلغ المتبقي للطرف' : 'المبلغ المطلوب من الطرف';
    return 'الرصيد الحالي';
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="border-stone-200 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-stone-500">
              <Landmark className="h-4 w-4" />
              <span className="text-xs font-medium">إجمالي العقود</span>
            </div>
            {hasContracts && (
              <span className="text-xs text-stone-400">{paymentProgress}%</span>
            )}
          </div>

          <p className={`font-mono tabular-nums text-3xl font-bold tracking-tight ${hasContracts ? 'text-stone-900' : 'text-stone-300'}`}>
            {hasContracts ? currency(summary.totalContractAmount) : '—'}
          </p>

          {hasContracts && (
            <div className="mt-3 h-1.5 w-full rounded-full bg-stone-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-l from-emerald-500 to-emerald-300 transition-all duration-500"
                style={{ width: `${paymentProgress}%` }}
              />
            </div>
          )}

          <p className="mt-2 text-xs text-stone-400">
            {hasContracts ? 'قيمة العقود المرتبطة' : 'لا توجد عقود'}
          </p>
        </CardContent>
      </Card>

      <Card className="border-stone-200 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 text-stone-500 mb-3">
            <ArrowLeftRight className="h-4 w-4" />
            <span className="text-xs font-medium">التدفق النقدي</span>
          </div>
          <p className="font-mono tabular-nums text-3xl font-bold tracking-tight text-stone-900">
            {currency(totalCashFlow)}
          </p>
          <div className="mt-2 flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-emerald-700 font-medium">
              <TrendingDown className="h-3 w-3" />
              {currency(summary.totalPaidTo)} دفع
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-blue-700 font-medium">
              <TrendingUp className="h-3 w-3" />
              {currency(summary.totalReceivedFrom)} قبض
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className={`border shadow-sm ${isSettled ? 'border-emerald-200' : hasContracts && isCreditor ? 'border-amber-200' : hasContracts ? 'border-rose-200' : 'border-stone-200'}`}>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-stone-500">
              <Wallet className="h-4 w-4" />
              <span className="text-xs font-medium">صافي الرصيد</span>
            </div>
            <BalanceIcon settled={isSettled} creditor={isCreditor} hasContracts={hasContracts} />
          </div>

          <div className="flex items-center gap-2">
            <p className={`font-mono tabular-nums text-3xl font-bold tracking-tight ${isSettled ? 'text-emerald-700' : hasContracts && isCreditor ? 'text-amber-700' : hasContracts ? 'text-rose-700' : 'text-stone-700'}`}>
              {isSettled ? (
                '0'
              ) : hasContracts ? (
                <>{isCreditor ? 'له ' : 'عليه '}{currency(Math.abs(summary.netBalance))}</>
              ) : (
                <>{isCreditor ? 'له ' : 'عليه '}{currency(Math.abs(summary.netBalance))}</>
              )}
            </p>
            {isSettled && (
              <Badge variant="secondary" className="rounded-full text-xs font-normal bg-emerald-50 text-emerald-700 border-emerald-200">
                مسدد
              </Badge>
            )}
          </div>

          <p className="mt-2 text-xs text-stone-400">{balanceLabel()}</p>
        </CardContent>
      </Card>
    </div>
  );
}
