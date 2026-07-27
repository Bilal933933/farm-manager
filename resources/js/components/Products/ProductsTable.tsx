import { Link, router } from '@inertiajs/react';
import { Eye, Pencil, Trash2, Package } from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { ActionsMenu } from '@/components/ui/actions-menu';
import StatusBadge from '@/components/Lands/StatusBadge';

interface Product {
  id: number;
  code: string | null;
  name: string;
  category: string;
  unit: string;
  status: string;
  display_order: number;
  last_purchase_price: number | null;
  stock_balance: number;
}

interface ProductsTableProps {
  products: Product[];
}

export default function ProductsTable({ products }: ProductsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-stone-700 font-semibold text-right w-20">الكود</TableHead>
          <TableHead className="text-stone-700 font-semibold text-right">الاسم</TableHead>
          <TableHead className="text-stone-700 font-semibold text-center">التصنيف</TableHead>
          <TableHead className="text-stone-700 font-semibold text-center w-20">الوحدة</TableHead>
          <TableHead className="text-stone-700 font-semibold text-center w-28">آخر سعر شراء</TableHead>
          <TableHead className="text-stone-700 font-semibold text-center w-24">الكمية</TableHead>
          <TableHead className="text-stone-700 font-semibold text-center w-24">الحالة</TableHead>
          <TableHead className="text-stone-700 font-semibold text-left w-20">إجراءات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="py-16 text-center text-stone-500">
              <Package className="mx-auto mb-3 h-10 w-10 text-stone-300" />
              لا يوجد منتجات مسجّلة بعد. ابدأ بإضافة أول منتج.
            </TableCell>
          </TableRow>
        ) : (
          products.map((product) => (
            <TableRow
              key={product.id}
              className="hover:bg-stone-50 transition-colors even:bg-stone-50/50"
            >
              <TableCell className="font-mono text-xs text-stone-500 whitespace-nowrap">
                {product.code || '—'}
              </TableCell>
              <TableCell className="font-medium whitespace-nowrap">
                <Link href={route('products.show', product.id)} className="hover:text-emerald-700 hover:underline">
                  {product.name}
                </Link>
              </TableCell>
              <TableCell className="text-center">
                <div className="inline-flex justify-center">
                  <StatusBadge value={product.category} />
                </div>
              </TableCell>
              <TableCell className="font-mono text-center whitespace-nowrap">{product.unit}</TableCell>
              <TableCell className="font-mono text-center tabular-nums whitespace-nowrap">
                {product.last_purchase_price != null ? (
                  <span dir="ltr">{product.last_purchase_price.toLocaleString()}</span>
                ) : (
                  <span className="text-stone-300">—</span>
                )}
              </TableCell>
              <TableCell className="font-mono text-center tabular-nums whitespace-nowrap">
                {product.stock_balance > 0 ? (
                  <span className="text-emerald-700">{product.stock_balance.toLocaleString()}</span>
                ) : (
                  <span className="text-stone-400">{product.stock_balance.toLocaleString()}</span>
                )}
              </TableCell>
              <TableCell className="text-center">
                <div className="inline-flex justify-center">
                  <StatusBadge value={product.status} />
                </div>
              </TableCell>
              <TableCell className="text-left whitespace-nowrap">
                <ActionsMenu
                  actions={[
                    { label: 'عرض', icon: Eye, href: route('products.show', product.id) },
                    { label: 'تعديل', icon: Pencil, href: route('products.edit', product.id) },
                    {
                      label: 'حذف',
                      icon: Trash2,
                      variant: 'danger',
                      delete: {
                        itemName: product.name,
                        onDelete: () => router.delete(route('products.destroy', product.id)),
                      },
                    },
                  ]}
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
