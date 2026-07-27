import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import ProductHeaderCard from './Components/ProductHeaderCard';
import StockMovementsTable from './Components/StockMovementsTable';
import type { ShowProps } from './Types/product';

export default function Show({ product }: ShowProps) {
  return (
    <div dir="rtl" className="mx-auto max-w-5xl space-y-6 p-6">
      <Head title={product.name} />

      <Link
        href={route('products.index')}
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors"
      >
        <ArrowRight className="h-4 w-4" />
        <span>العودة إلى المنتجات</span>
      </Link>

      <ProductHeaderCard product={product} />

      <StockMovementsTable movements={product.stock_movements} category={product.category} />
    </div>
  );
}
