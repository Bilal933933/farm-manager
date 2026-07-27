import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import ProductsTable from '@/components/Products/ProductsTable';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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

interface IndexProps {
  products: Product[];
}

export default function Index({ products }: IndexProps) {
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
        <ProductsTable products={products} />
      </Card>
    </div>
  );
}
