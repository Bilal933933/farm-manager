import { Head, Link, router } from '@inertiajs/react';
import { Plus, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import StatusBadge from '@/components/Lands/StatusBadge';

interface Crop {
  id: number;
  name: string;
  category: string;
  unit: string;
  typical_season: string | null;
}

interface IndexProps {
  crops: Crop[];
}

export default function Index({ crops }: IndexProps) {
  function destroy(crop: Crop) {
    router.delete(route('crops.destroy', crop.id));
  }

  return (
    <div dir="rtl" className="space-y-6 p-6">
      <Head title="المحاصيل" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">المحاصيل</h1>
          <p className="mt-1 text-sm text-stone-500">تعريف المحاصيل الزراعية المزروعة في المزرعة</p>
        </div>
        <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
          <Link href={route('crops.create')}>
            <Plus className="ms-2 h-4 w-4" />
            إضافة محصول
          </Link>
        </Button>
      </div>

      <Card className="border-stone-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">التصنيف</TableHead>
              <TableHead className="text-right">الوحدة</TableHead>
              <TableHead className="text-right">الموسم المعتاد</TableHead>
              <TableHead className="text-left">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {crops.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-16 text-center text-stone-500">
                  <Sprout className="mx-auto mb-3 h-10 w-10 text-stone-300" />
                  لا توجد محاصيل مسجّلة بعد. ابدأ بإضافة أول محصول.
                </TableCell>
              </TableRow>
            )}
            {crops.map((crop) => (
              <TableRow key={crop.id}>
                <TableCell className="font-medium">
                  <Link href={route('crops.show', crop.id)} className="hover:text-emerald-700 hover:underline">
                    {crop.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <StatusBadge value={crop.category} />
                </TableCell>
                <TableCell className="font-mono">{crop.unit}</TableCell>
                <TableCell>{crop.typical_season || '—'}</TableCell>
                <TableCell className="text-left">
                  <div className="flex justify-start gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={route('crops.edit', crop.id)}>تعديل</Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-rose-600 hover:text-rose-700">
                          حذف
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent dir="rtl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>حذف "{crop.name}"؟</AlertDialogTitle>
                          <AlertDialogDescription>
                            لن يمكن الحذف إذا كان المحصول مرتبطًا بموسم زراعي.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>تراجع</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => destroy(crop)}
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
