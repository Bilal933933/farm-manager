import { Head, Link, router } from '@inertiajs/react';
import { Eye, Pencil, Plus, ListOrdered, Trash2, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DateDisplay } from '@/components/ui/date-display';
import DetailCell from '@/components/ui/detail-cell';
import { ActionsMenu } from '@/components/ui/actions-menu';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import type { CostData } from '@/types';

interface IndexProps {
  costs: { data: CostData[]; from: number; to: number; total: number; last_page: number; current_page: number };
  summary: { count: number; total_amount: number };
}

function fmt(n: number) {
  return n.toLocaleString();
}

export default function Index({ costs, summary }: IndexProps) {
  return (
    <div dir="rtl" className="space-y-6 p-6">
      <Head title="التكاليف" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">التكاليف</h1>
          <p className="mt-1 text-sm text-stone-500">إدارة تكاليف التشغيل الزراعي</p>
        </div>
        <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
          <Link href={route('costs.create')}>
            <Plus className="ms-2 h-4 w-4" />
            إضافة تكلفة
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="border-stone-200">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-700">
              <ListOrdered className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs text-stone-500">عدد التكاليف</p>
              <p className="mt-0.5 text-xl font-bold text-stone-900">{summary.count}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-stone-200">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-amber-50 p-3 text-amber-700">
              <Wallet className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs text-stone-500">إجمالي المبلغ</p>
              <p className="mt-0.5 text-xl font-bold text-stone-900">{fmt(summary.total_amount)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden border-stone-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-stone-700 font-semibold text-right">التاريخ</TableHead>
              <TableHead className="text-stone-700 font-semibold text-right">الأرض</TableHead>
              <TableHead className="text-stone-700 font-semibold text-right">النوع</TableHead>
              <TableHead className="text-stone-700 font-semibold text-right">البيان</TableHead>
              <TableHead className="text-stone-700 font-semibold text-left font-mono tabular-nums">المبلغ</TableHead>
              <TableHead className="text-stone-700 font-semibold text-left w-20">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {costs.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center text-stone-500">
                  لا توجد تكاليف مسجّلة بعد.
                </TableCell>
              </TableRow>
            ) : costs.data.map((c) => (
              <TableRow key={c.id} className="hover:bg-stone-50 transition-colors even:bg-stone-50/50">
                <TableCell><DateDisplay date={c.date} /></TableCell>
                <TableCell>{c.land?.name ?? '—'}</TableCell>
                <TableCell>{c.type}</TableCell>
                <TableCell><DetailCell text={c.description} title="البيان" /></TableCell>
                <TableCell className="text-left font-mono tabular-nums text-amber-700">{fmt(c.amount)}</TableCell>
                <TableCell className="text-left whitespace-nowrap">
                  <ActionsMenu
                    actions={[
                      { label: 'عرض', icon: Eye, href: route('costs.show', c.id) },
                      { label: 'تعديل', icon: Pencil, href: route('costs.edit', c.id) },
                      {
                        label: 'حذف', icon: Trash2, variant: 'danger',
                        delete: {
                          itemName: c.description,
                          onDelete: () => router.delete(route('costs.destroy', c.id)),
                        },
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
