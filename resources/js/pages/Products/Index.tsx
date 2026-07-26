import { Head, Link, router } from '@inertiajs/react';
import { Package, Plus } from 'lucide-react';
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

interface Product {
  id: number;
  code: string | null;
  name: string;
  category: string;
  unit: string;
  status: string;
  display_order: number;
}

interface IndexProps {
  products: Product[];
}

export default function Index({ products }: IndexProps) {
  function destroy(product: Product) {
    router.delete(route('products.destroy', product.id));
  }

  return (
    <div dir="rtl" className="space-y-6 p-6">
      <Head title="المنتجات" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">المنتجات</h1>
          <p className="mt-1 text-sm text-stone-500">كتالوج الأصناف والمنتجات المستخدمة في المزرعة</p>
        </div>
        <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
          <Link href={route('products.create')}>
            <Plus className="ms-2 h-4 w-4" />
            إضافة منتج
          </Link>
        </Button>
      </div>

      <Card className="border-stone-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right w-24">الكود</TableHead>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">التصنيف</TableHead>
              <TableHead className="text-right">الوحدة</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-left">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center text-stone-500">
                  <Package className="mx-auto mb-3 h-10 w-10 text-stone-300" />
                  لا يوجد منتجات مسجّلة بعد. ابدأ بإضافة أول منتج.
                </TableCell>
              </TableRow>
            )}
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-mono text-xs text-stone-500">
                  {product.code || '—'}
                </TableCell>
                <TableCell className="font-medium">
                  <Link href={route('products.show', product.id)} className="hover:text-emerald-700 hover:underline">
                    {product.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <StatusBadge value={product.category} />
                </TableCell>
                <TableCell className="font-mono">{product.unit}</TableCell>
                <TableCell>
                  <StatusBadge value={product.status} />
                </TableCell>
                <TableCell className="text-left">
                  <div className="flex justify-start gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={route('products.edit', product.id)}>تعديل</Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-rose-600 hover:text-rose-700">
                          حذف
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent dir="rtl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>حذف "{product.name}"؟</AlertDialogTitle>
                          <AlertDialogDescription>
                            هذا الإجراء لا يمكن التراجع عنه. سيتم نقل المنتج إلى سلة المهملات.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>تراجع</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => destroy(product)}
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
