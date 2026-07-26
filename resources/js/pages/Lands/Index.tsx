import { Head, Link, router } from '@inertiajs/react';
import { Plus, Sprout, FileText, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import StatusBadge from '@/Components/Lands/StatusBadge';

interface Land {
  id: number;
  name: string;
  location: string | null;
  area: string;
  area_unit: string;
  status: string;
  seasons?: unknown[];
  contracts?: unknown[];
}

interface IndexProps {
  lands: Land[];
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number }) {
  return (
    <Card className="border-stone-200">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="rounded-lg bg-emerald-50 p-2.5 text-emerald-700">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-semibold font-mono leading-none">{value}</p>
          <p className="mt-1 text-sm text-stone-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Index({ lands }: IndexProps) {
  const activeCount = lands.filter((l) => l.status === 'نشط').length;
  const totalContracts = lands.reduce((sum, l) => sum + (l.contracts?.length ?? 0), 0);
  const totalSeasons = lands.reduce((sum, l) => sum + (l.seasons?.length ?? 0), 0);

  function destroy(land: Land) {
    router.delete(route('lands.destroy', land.id));
  }

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
            {lands.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-stone-500">
                  لا توجد أراضٍ مسجّلة بعد. ابدأ بإضافة أول أرض.
                </TableCell>
              </TableRow>
            )}
            {lands.map((land) => (
              <TableRow key={land.id}>
                <TableCell className="font-medium">
                  <Link href={route('lands.show', land.id)} className="hover:text-emerald-700 hover:underline">
                    {land.name}
                  </Link>
                </TableCell>
                <TableCell className="text-stone-500">{land.location || '—'}</TableCell>
                <TableCell className="font-mono">
                  {land.area} {land.area_unit}
                </TableCell>
                <TableCell>
                  <StatusBadge value={land.status} />
                </TableCell>
                <TableCell className="font-mono">{land.seasons?.length ?? 0}</TableCell>
                <TableCell className="font-mono">{land.contracts?.length ?? 0}</TableCell>
                <TableCell className="text-left">
                  <div className="flex justify-start gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={route('lands.edit', land.id)}>تعديل</Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-rose-600 hover:text-rose-700">
                          حذف
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent dir="rtl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>حذف "{land.name}"؟</AlertDialogTitle>
                          <AlertDialogDescription>
                            سيتم نقل هذه الأرض إلى سلة المحذوفات. يمكن استرجاعها لاحقاً إذا لزم الأمر.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>تراجع</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => destroy(land)}
                            className="bg-rose-600 hover:bg-rose-700"
                          >
                            حذف
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
