import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProductForm from '@/components/Products/ProductForm';

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

interface EditProps {
  product: Product;
}

export default function Edit({ product }: EditProps) {
  const { data, setData, put, processing, errors } = useForm({
    code: product.code ?? '',
    name: product.name,
    category: product.category,
    unit: product.unit,
    status: product.status,
    display_order: String(product.display_order),
    notes: product.notes ?? '',
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    put(route('products.update', product.id));
  }

  return (
    <div dir="rtl" className="mx-auto max-w-3xl space-y-6 p-6">
      <Head title={`تعديل ${product.name}`} />

      <Link
        href={route('products.show', product.id)}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى تفاصيل المنتج
      </Link>

      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-xl">تعديل المنتج</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm
            data={data}
            setData={setData}
            errors={errors}
            processing={processing}
            onSubmit={submit}
            submitLabel="حفظ التعديلات"
          />
        </CardContent>
      </Card>
    </div>
  );
}
