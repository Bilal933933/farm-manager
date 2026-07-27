import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Sale {
  id: number;
  date: string;
  quantity: string;
  unit_price: string;
  total: number;
  payment_type: string;
  notes: string | null;
  party: { id: number; name: string };
  harvest: {
    id: number;
    date: string;
    quantity: string;
    land_season: {
      id: number;
      crop: { id: number; name: string } | null;
      land: { id: number; name: string };
    };
  };
}

interface ShowProps {
  sale: Sale;
}

export default function Show({ sale }: ShowProps) {
  return (
    <div dir="rtl" className="mx-auto max-w-2xl space-y-6 p-6">
      <Head title={`بيع #${sale.id}`} />

      <Link
        href={route('sales.index')}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى المبيعات
      </Link>

      <h1 className="text-2xl font-semibold text-stone-900">
        بيع #{sale.id}
      </h1>

      <Card className="border-stone-200">
        <CardContent className="space-y-4 p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-stone-500">التاريخ</p>
              <p className="font-mono text-stone-900">{sale.date}</p>
            </div>
            <div>
              <p className="text-sm text-stone-500">المشتري</p>
              <p className="text-stone-900">{sale.party?.name || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-stone-500">المحصول</p>
              <p className="text-stone-900">{sale.harvest?.land_season?.crop?.name || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-stone-500">الأرض</p>
              <p className="text-stone-900">{sale.harvest?.land_season?.land?.name || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-stone-500">الكمية</p>
              <p className="font-mono text-stone-900">{sale.quantity}</p>
            </div>
            <div>
              <p className="text-sm text-stone-500">سعر الوحدة</p>
              <p className="font-mono text-stone-900">{sale.unit_price}</p>
            </div>
            <div>
              <p className="text-sm text-stone-500">الإجمالي</p>
              <p className="font-mono text-lg font-semibold text-stone-900">{sale.total.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-stone-500">نوع الدفع</p>
              <p className="text-stone-900">{sale.payment_type}</p>
            </div>
          </div>
          {sale.notes && (
            <div>
              <p className="text-sm text-stone-500">ملاحظات</p>
              <p className="text-stone-900">{sale.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
