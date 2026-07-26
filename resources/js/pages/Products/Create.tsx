import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProductForm from '@/components/Products/ProductForm';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    code: '',
    name: '',
    category: '',
    unit: '',
    status: 'نشط',
    display_order: '0',
    notes: '',
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post(route('products.store'));
  }

  return (
    <div dir="rtl" className="mx-auto max-w-3xl space-y-6 p-6">
      <Head title="إضافة منتج جديد" />

      <Link
        href={route('products.index')}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى المنتجات
      </Link>

      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-xl">إضافة منتج جديد</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm
            data={data}
            setData={setData}
            errors={errors}
            processing={processing}
            onSubmit={submit}
            submitLabel="حفظ المنتج"
          />
        </CardContent>
      </Card>
    </div>
  );
}
