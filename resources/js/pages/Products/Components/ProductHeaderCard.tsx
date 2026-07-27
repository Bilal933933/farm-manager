import { Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import StatusBadge from '@/components/Lands/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '../Types/product';

interface ProductHeaderCardProps {
  product: Product;
}

export default function ProductHeaderCard({ product }: ProductHeaderCardProps) {
  return (
    <Card className="border-stone-200 shadow-sm">
      <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-stone-900">{product.name}</h1>
            <StatusBadge value={product.status} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm text-stone-600">
            {product.code && (
              <p>
                <span className="text-stone-400">الكود:</span>{' '}
                <span className="font-mono font-medium text-stone-800">{product.code}</span>
              </p>
            )}
            <p className="flex items-center gap-1.5">
              <span className="text-stone-400">التصنيف:</span>
              <StatusBadge value={product.category} />
            </p>
            <p>
              <span className="text-stone-400">الوحدة:</span>{' '}
              <span className="font-medium text-stone-800">{product.unit}</span>
            </p>
            <p className="col-span-2">
              <span className="text-stone-400">آخر سعر شراء:</span>{' '}
              <span className="font-mono font-semibold text-stone-800">
                {product.last_purchase_price != null
                  ? `${product.last_purchase_price.toLocaleString()} ج.م`
                  : '—'}
              </span>
            </p>
          </div>

          {product.notes && (
            <p className="max-w-xl text-xs text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
              {product.notes}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl min-w-[180px] w-full md:w-auto">
          <span className="text-4xl font-extrabold tabular-nums text-emerald-700">
            {product.stock_balance.toLocaleString()}
          </span>
          <span className="text-xs font-medium text-emerald-800/70 mt-1">الرصيد الحالي ({product.unit})</span>

          <Button variant="outline" size="sm" asChild className="mt-4 w-full bg-white hover:bg-stone-50">
            <Link href={route('products.edit', product.id)}>
              <Pencil className="ms-2 h-3.5 w-3.5 text-stone-500" />
              تعديل البيانات
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
