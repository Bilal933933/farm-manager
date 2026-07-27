import { Head, Link } from '@inertiajs/react';
import { FileText, Layers, Plus, Sprout } from 'lucide-react';
import LandTableRow from '@/components/Lands/LandTableRow';
import StatCard from '@/components/Lands/StatCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import type { Land } from '@/types';

export default function Index({ lands }: { lands: Land[] }) {
  const activeCount = lands.filter((l) => l.status === 'نشط').length;
  const totalContracts = lands.reduce((sum, l) => sum + (l.contracts?.length ?? 0), 0);

  return (
    <div dir="rtl" className="space-y-6 p-6">
      <Head title="الأراضي" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">الأراضي</h1>
          <p className="mt-1 text-sm text-stone-500">إدارة قطع الأراضي وعقودها ومواسمها الزراعية</p>
        </div>
        <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
          <Link href={route('lands.create')}>
            <Plus className="ms-2 h-4 w-4" />
            إضافة أرض
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Layers} label="إجمالي الأراضي" value={lands.length} />
        <StatCard icon={Sprout} label="أراضٍ نشطة" value={activeCount} />
        <StatCard icon={FileText} label="عقود مسجّلة" value={totalContracts} />
      </div>

      <Card className="border-stone-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">اسم الأرض</TableHead>
              <TableHead className="text-right">الموقع</TableHead>
              <TableHead className="text-right">المساحة</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">المواسم</TableHead>
              <TableHead className="text-right">العقود</TableHead>
              <TableHead className="text-left">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-stone-500">
                  لا توجد أراضٍ مسجّلة بعد. ابدأ بإضافة أول أرض.
                </TableCell>
              </TableRow>
            ) : lands.map((land) => (
              <LandTableRow key={land.id} land={land} />
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}