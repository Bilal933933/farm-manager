import { Link, router } from '@inertiajs/react';
import StatusBadge from '@/components/Lands/StatusBadge';
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
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import type { Land } from '@/types';

interface Props {
  land: Land;
}

export default function LandTableRow({ land }: Props) {
  function destroy() {
    router.delete(route('lands.destroy', land.id));
  }

  return (
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
                <AlertDialogAction onClick={destroy} className="bg-rose-600 hover:bg-rose-700">
                  حذف
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
}