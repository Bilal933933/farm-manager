import { Head, Link, router } from '@inertiajs/react';
import { Gift, HandCoins, Pencil, Plus, Search, Scale, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ActionsMenu } from '@/components/ui/actions-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DateDisplay } from '@/components/ui/date-display';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { NaqootData } from '@/types';

interface IndexProps {
  naqoot: NaqootData[];
  summary: { count: number; countForUs: number; countOnUs: number; totalForUs: number; totalOnUs: number; net: number };
}

const TABS = [
  { value: 'all', label: 'الكل' },
  { value: 'لنا', label: 'لنا' },
  { value: 'علينا', label: 'علينا' },
];

function fmt(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default function Index({ naqoot, summary }: IndexProps) {
  const [tab, setTab] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return naqoot.filter((n) => {
      const matchesTab = tab === 'all' || n.direction === tab;
      const matchesQuery = query.trim() === '' || n.name.includes(query.trim());

      return matchesTab && matchesQuery;
    });
  }, [naqoot, tab, query]);

  return (
    <div dir="rtl" className="space-y-6 p-6">
      <Head title="النقوط" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">النقوط</h1>
          <p className="mt-1 text-sm text-stone-500">سجل النقوط في الأفراح والمناسبات</p>
        </div>
        <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
          <Link href={route('naqoot.create')}>
            <Plus className="ms-2 h-4 w-4" />
            إضافة نقوط
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-stone-200">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-700">
              <HandCoins className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs text-stone-500">لنا (استلمنا)</p>
              <p className="mt-0.5 text-xl font-bold text-stone-900">{fmt(summary.totalForUs)}</p>
              <p className="mt-0.5 text-xs text-stone-400">{summary.countForUs} نقطة</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-stone-200">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-amber-50 p-3 text-amber-700">
              <Gift className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs text-stone-500">علينا (دفعنا)</p>
              <p className="mt-0.5 text-xl font-bold text-stone-900">{fmt(summary.totalOnUs)}</p>
              <p className="mt-0.5 text-xs text-stone-400">{summary.countOnUs} نقطة</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-stone-200">
          <CardContent className="flex items-center gap-4 p-5">
            <div className={cn(
              'rounded-lg p-3',
              summary.net >= 0 ? 'bg-sky-50 text-sky-700' : 'bg-rose-50 text-rose-700',
            )}>
              <Scale className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs text-stone-500">الصافي (لنا − علينا)</p>
              <p className={cn('mt-0.5 text-xl font-bold', summary.net >= 0 ? 'text-sky-700' : 'text-rose-700')}>
                {fmt(summary.net)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-stone-200">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                {TABS.map((t) => (
                  <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="relative sm:w-72">
              <Search className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="بحث بالاسم..."
                className="pe-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-stone-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-stone-700 font-semibold text-right">التاريخ</TableHead>
              <TableHead className="text-stone-700 font-semibold text-right">الاسم</TableHead>
              <TableHead className="text-stone-700 font-semibold text-right">المكان / المنطقة</TableHead>
              <TableHead className="text-stone-700 font-semibold text-right">الاتجاه</TableHead>
              <TableHead className="text-stone-700 font-semibold text-left font-mono tabular-nums">المبلغ</TableHead>
              <TableHead className="text-stone-700 font-semibold text-left w-20">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center text-stone-500">
                  لا توجد نقوط مسجّلة {query.trim() !== '' ? 'مطابقة للبحث' : 'بعد'}.
                </TableCell>
              </TableRow>
            ) : filtered.map((n) => {
              const isForUs = n.direction === 'لنا';

              return (
                <TableRow key={n.id} className="hover:bg-stone-50 transition-colors even:bg-stone-50/50">
                  <TableCell><DateDisplay date={n.date} /></TableCell>
                  <TableCell className="font-medium text-stone-900">{n.name}</TableCell>
                  <TableCell className="text-stone-500">{n.location || '—'}</TableCell>
                  <TableCell>
                    <Badge className={isForUs ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}>
                      {isForUs ? 'لنا' : 'علينا'}
                    </Badge>
                  </TableCell>
                  <TableCell className={cn(
                    'text-left font-mono tabular-nums',
                    isForUs ? 'text-emerald-700' : 'text-amber-700',
                  )}>
                    {fmt(Number(n.amount))}
                  </TableCell>
                  <TableCell className="text-left whitespace-nowrap">
                    <ActionsMenu
                      actions={[
                        { label: 'تعديل', icon: Pencil, href: route('naqoot.edit', n.id) },
                        {
                          label: 'حذف', icon: Trash2, variant: 'danger',
                          delete: {
                            itemName: n.name,
                            onDelete: () => router.delete(route('naqoot.destroy', n.id)),
                          },
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}