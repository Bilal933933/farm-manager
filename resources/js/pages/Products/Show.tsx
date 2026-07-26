import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import StatusBadge from '@/components/Lands/StatusBadge';

interface Product {
  id: number;
  code: string | null;
  name: string;
  category: string;
  unit: string;
  status: string;
  display_order: number;
  notes: string | null;
}

interface ShowProps {
  product: Product;
}

export default function Show({ product }: ShowProps) {
  return (
    <div dir="rtl" className="mx-auto max-w-4xl space-y-6 p-6">
      <Head title={product.name} />

      <Link
        href={route('products.index')}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى المنتجات
      </Link>

      <Card className="border-stone-200">
        <CardContent className="flex flex-wrap items-start justify-between gap-4 p-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-stone-900">{product.name}</h1>
              <StatusBadge value={product.status} />
            </div>
            <div className="space-y-1 text-sm text-stone-500">
              {product.code && <p dir="ltr" className="font-mono">الكود: {product.code}</p>}
              <p><span className="text-stone-400">التصنيف:</span> <StatusBadge value={product.category} /></p>
              <p className="font-mono">الوحدة: {product.unit}</p>
            </div>
            {product.notes && <p className="max-w-xl text-sm text-stone-500">{product.notes}</p>}
          </div>
          <Button variant="outline" asChild>
            <Link href={route('products.edit', product.id)}>
              <Pencil className="ms-2 h-4 w-4" />
              تعديل البيانات
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
