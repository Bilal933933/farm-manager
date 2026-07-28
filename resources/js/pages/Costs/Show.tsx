import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Calendar, CircleDollarSign, Pencil, Sprout, Tag, Wallet, Notebook } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DateDisplay } from '@/components/ui/date-display';
import type { CostData } from '@/types';

interface ShowProps { cost: CostData }

function currency(value: number): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Show({ cost }: ShowProps) {
  return (
    <div dir="rtl" className="mx-auto max-w-4xl space-y-6 p-6">
      <Head title={cost.type} />

      <Link
        href={route('costs.index')}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى التكاليف
      </Link>

      <Card className="overflow-hidden border-stone-200 shadow-sm">
        <div className="h-2 bg-gradient-to-l from-amber-500 via-amber-400 to-yellow-300" />

        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 min-w-0">
              <Avatar className="hidden sm:flex h-14 w-14 rounded-xl border-2 border-stone-200 shadow-sm">
                <AvatarFallback className="rounded-xl bg-gradient-to-br from-amber-50 to-yellow-100 text-amber-700">
                  <Wallet className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-stone-900 truncate">{cost.type}</h1>
                </div>
                {cost.description && (
                  <p className="max-w-xl text-sm text-stone-500">{cost.description}</p>
                )}
              </div>
            </div>

            <Button variant="outline" size="sm" asChild className="shrink-0 self-start shadow-sm">
              <Link href={route('costs.edit', cost.id)}>
                <Pencil className="ms-1.5 h-3.5 w-3.5" />
                تعديل
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="border-stone-200 shadow-sm overflow-hidden">
          <div className="h-1 bg-amber-400" />
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-amber-50 p-2">
                <CircleDollarSign className="h-5 w-5 text-amber-600" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs text-stone-500">المبلغ</p>
                <p className="mt-0.5 text-lg font-bold text-stone-900">{currency(cost.amount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-stone-200 shadow-sm overflow-hidden">
          <div className="h-1 bg-blue-400" />
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-50 p-2">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs text-stone-500">التاريخ</p>
                <p className="mt-0.5 text-lg font-bold text-stone-900">
                  <DateDisplay date={cost.date} />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-stone-200 shadow-sm overflow-hidden">
          <div className="h-1 bg-emerald-400" />
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-50 p-2">
                <Sprout className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs text-stone-500">الأرض</p>
                <p className="mt-0.5 truncate text-lg font-bold text-stone-900">{cost.land?.name ?? '—'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-stone-200 shadow-sm overflow-hidden">
          <div className="h-1 bg-purple-400" />
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-50 p-2">
                <Tag className="h-5 w-5 text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs text-stone-500">نوع التكلفة</p>
                <p className="mt-0.5 truncate text-lg font-bold text-stone-900">{cost.type}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {cost.notes && (
        <Card className="border-stone-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-2">
              <Notebook className="h-4 w-4 text-stone-400 mt-0.5 shrink-0" />
              <div>
                <h2 className="mb-1 text-sm font-medium text-stone-500">ملاحظات</h2>
                <p className="text-stone-700">{cost.notes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
