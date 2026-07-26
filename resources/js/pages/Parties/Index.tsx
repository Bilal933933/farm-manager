import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
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
import StatusBadge from '@/Components/Lands/StatusBadge';

interface Party {
  id: number;
  name: string;
  type: string;
  phone: string | null;
  contracts_count: number;
}

interface IndexProps {
  parties: Party[];
}

export default function Index({ parties }: IndexProps) {
  function destroy(party: Party) {
    router.delete(route('parties.destroy', party.id));
  }

  return (
    <div dir="rtl" className="space-y-6 p-6">
      <Head title="الأطراف" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">الأطراف</h1>
          <p className="mt-1 text-sm text-stone-500">الأفراد والشركات المرتبطون بعقود الأراضي</p>
        </div>
        <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
          <Link href={route('parties.create')}>
            <Plus className="ms-2 h-4 w-4" />
            إضافة طرف
          </Link>
        </Button>
      </div>

      <Card className="border-stone-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">النوع</TableHead>
              <TableHead className="text-right">الهاتف</TableHead>
              <TableHead className="text-right">العقود</TableHead>
              <TableHead className="text-left">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parties.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-stone-500">
                  لا يوجد أطراف مسجّلون بعد. ابدأ بإضافة أول طرف.
                </TableCell>
              </TableRow>
            )}
            {parties.map((party) => (
              <TableRow key={party.id}>
                <TableCell className="font-medium">
                  <Link href={route('parties.show', party.id)} className="hover:text-emerald-700 hover:underline">
                    {party.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <StatusBadge value={party.type} />
                </TableCell>
                <TableCell className="font-mono" dir="ltr">
                  {party.phone || '—'}
                </TableCell>
                <TableCell className="font-mono">{party.contracts_count ?? 0}</TableCell>
                <TableCell className="text-left">
                  <div className="flex justify-start gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={route('parties.edit', party.id)}>تعديل</Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-rose-600 hover:text-rose-700">
                          حذف
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent dir="rtl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>حذف "{party.name}"؟</AlertDialogTitle>
                          <AlertDialogDescription>
                            لن يمكن حذف هذا الطرف إذا كانت هناك عقود مرتبطة به.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>تراجع</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => destroy(party)}
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
