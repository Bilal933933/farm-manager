import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Calendar, CircleDollarSign, Pencil, Sprout, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DateDisplay } from '@/components/ui/date-display';
import type { CostData } from '@/types';

interface ShowProps { cost: CostData }

export default function Show({ cost }: ShowProps) {
  return (
    <div dir="rtl" className="space-y-6 p-6">
      <Head title={cost.type} />

      <Link
        href={route('costs.index')}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى التكاليف
      </Link>

      <Card className="border-stone-200">
        <CardContent className="flex items-start justify-between gap-4 p-6">
          <div className="min-w-0 flex-1 space-y-1.5">
            <h1 className="text-2xl font-semibold text-stone-900">{cost.type}</h1>
            <p className="max-w-xl text-sm text-stone-500">{cost.description}</p>
          </div>
          <Button variant="outline" size="sm" asChild className="shrink-0 self-start">
            <Link href={route('costs.edit', cost.id)}>
              <Pencil className="ms-1.5 h-3.5 w-3.5" />
              تعديل
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="border-stone-200">
          <CardContent className="flex items-center gap-4 p-5">
            <CircleDollarSign className="h-8 w-8 shrink-0 text-amber-600" />
            <div className="min-w-0">
              <p className="truncate text-xs text-stone-500">المبلغ</p>
              <p className="mt-0.5 text-xl font-bold text-stone-900">{cost.amount.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-stone-200">
          <CardContent className="flex items-center gap-4 p-5">
            <Calendar className="h-8 w-8 shrink-0 text-blue-600" />
            <div className="min-w-0">
              <p className="truncate text-xs text-stone-500">التاريخ</p>
              <p className="mt-0.5 text-xl font-bold text-stone-900">
                <DateDisplay date={cost.date} />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-stone-200">
          <CardContent className="flex items-center gap-4 p-5">
            <Sprout className="h-8 w-8 shrink-0 text-emerald-600" />
            <div className="min-w-0">
              <p className="truncate text-xs text-stone-500">الأرض</p>
              <p className="mt-0.5 truncate text-xl font-bold text-stone-900">{cost.land?.name ?? '—'}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-stone-200">
          <CardContent className="flex items-center gap-4 p-5">
            <Tag className="h-8 w-8 shrink-0 text-purple-600" />
            <div className="min-w-0">
              <p className="truncate text-xs text-stone-500">نوع التكلفة</p>
              <p className="mt-0.5 truncate text-xl font-bold text-stone-900">{cost.type}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {cost.notes && (
        <Card className="border-stone-200">
          <CardContent className="p-6">
            <h2 className="mb-2 text-sm font-medium text-stone-500">ملاحظات</h2>
            <p className="text-stone-700">{cost.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
