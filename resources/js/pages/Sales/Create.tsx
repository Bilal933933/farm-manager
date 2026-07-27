import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SaleForm from '@/components/Sales/SaleForm';

interface Harvest {
  id: number;
  date: string;
  quantity: string;
  notes: string | null;
  land_season: {
    id: number;
    crop: { id: number; name: string } | null;
    land: { id: number; name: string };
  };
}

interface Party {
  id: number;
  name: string;
}

interface CreateProps {
  harvests: Harvest[];
  parties: Party[];
}

export default function Create({ harvests, parties }: CreateProps) {
  return (
    <div dir="rtl" className="mx-auto max-w-2xl space-y-6 p-6">
      <Head title="إضافة بيع" />

      <Link
        href={route('sales.index')}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى المبيعات
      </Link>

      <h1 className="text-2xl font-semibold text-stone-900">إضافة بيع</h1>

      <Card className="border-stone-200">
        <CardContent className="p-6">
          <SaleForm harvests={harvests} parties={parties} />
        </CardContent>
      </Card>
    </div>
  );
}
