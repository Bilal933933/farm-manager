import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Pencil, Landmark, Calendar, User, Building } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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

function currency(value: number): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Show({ payment }: ShowProps) {
  const isLinkedToContract = Boolean(payment.contract);
  const isPayment = payment.type === 'دفع';
  const accentColor = isPayment ? 'from-rose-500 via-rose-400 to-orange-300' : 'from-emerald-500 via-emerald-400 to-teal-300';

  return (
    <div dir="rtl" className="mx-auto max-w-3xl space-y-6 p-6">
      <Head title={`${isPayment ? 'دفعة' : 'مقبوض'} - ${payment.party?.name}`} />

      <Link
        href={route('payments.index')}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى المدفوعات
      </Link>

      <Card className="overflow-hidden border-stone-200 shadow-sm">
        <div className={`h-2 bg-gradient-to-l ${accentColor}`} />

        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 min-w-0">
              <Avatar className="hidden sm:flex h-14 w-14 rounded-xl border-2 border-stone-200 shadow-sm">
                <AvatarFallback className={`rounded-xl bg-gradient-to-br ${isPayment ? 'from-rose-50 to-orange-100' : 'from-emerald-50 to-teal-100'} text-stone-700`}>
                  <Landmark className={`h-6 w-6 ${isPayment ? 'text-rose-600' : 'text-emerald-600'}`} />
                </AvatarFallback>
              </Avatar>

              <div className="space-y-4 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-stone-900 truncate">
                    {isPayment ? 'دفعة' : 'مقبوض'}
                  </h1>
                  <StatusBadge value={payment.type} toneMap={TYPE_TONE} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="inline-flex items-center gap-2 rounded-lg bg-stone-50 border border-stone-100 p-3">
                    <Calendar className="h-4 w-4 text-stone-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-stone-400">التاريخ</p>
                      <DateDisplay date={payment.date} className="text-sm font-medium text-stone-800" />
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-lg bg-stone-50 border border-stone-100 p-3">
                    <User className="h-4 w-4 text-stone-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-stone-400">الطرف</p>
                      <p className="text-sm font-medium text-stone-800 truncate">{payment.party?.name ?? '—'}</p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-lg bg-stone-50 border border-stone-100 p-3 col-span-2 sm:col-span-1">
                    <Building className="h-4 w-4 text-stone-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-stone-400">المبلغ</p>
                      <p className={`text-lg font-bold font-mono tabular-nums ${isPayment ? 'text-rose-700' : 'text-emerald-700'}`}>
                        {currency(Number(payment.amount))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isLinkedToContract && payment.contract && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-lg bg-blue-50/50 border border-blue-100 p-4">
              <div>
                <p className="text-xs text-stone-400">الأرض</p>
                <Link href={route('lands.show', payment.contract.land.id)} className="text-sm font-medium text-stone-800 hover:text-emerald-700 hover:underline">
                  {payment.contract.land.name}
                </Link>
              </div>
              <div>
                <p className="text-xs text-stone-400">العقد</p>
                <p className="text-sm font-medium text-stone-800">{payment.contract.type}</p>
              </div>
              <div>
                <p className="text-xs text-stone-400">قيمة العقد</p>
                <p className="text-sm font-mono text-stone-800">{currency(payment.contract.amount)}</p>
              </div>
              <div>
                <p className="text-xs text-stone-400">المتبقي</p>
                <p className={`text-sm font-mono font-medium ${payment.contract.remaining > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {currency(payment.contract.remaining)}
                </p>
              </div>
            </div>
          )}

          {payment.notes && (
            <p className="mt-4 text-sm text-stone-600 bg-amber-50/70 border border-amber-200/50 p-3 rounded-lg">
              {payment.notes}
            </p>
          )}

          <div className="mt-6 flex items-center gap-3 border-t border-stone-100 pt-6">
            <Button variant="outline" size="sm" asChild className="shadow-sm">
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
