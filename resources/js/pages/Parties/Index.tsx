import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PartiesTable from '@/components/Parties/PartiesTable';

interface Party {
  id: number;
  name: string;
  type: string;
  phone: string | null;
  contracts_count: number;
}

interface IndexProps {
  parties: Party[];
}

export default function Index({ parties }: IndexProps) {
  return (
    <div dir="rtl" className="space-y-6 p-6">
      <Head title="الأطراف" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">الأطراف</h1>
          <p className="mt-1 text-sm text-stone-500">الأفراد والشركات المرتبطون بعقود الأراضي</p>
        </div>
        <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
          <Link href={route('parties.create')}>
            <Plus className="ms-2 h-4 w-4" />
            إضافة طرف
          </Link>
        </Button>
      </div>

      <Card className="border-stone-200">
        <PartiesTable parties={parties} />
      </Card>
    </div>
  );
}
