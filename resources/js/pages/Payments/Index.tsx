import { Head, Link } from '@inertiajs/react';
import { Eye, Plus, Pencil, Wallet } from 'lucide-react';
import { ActionsMenu } from '@/components/ui/actions-menu';
import { Button } from '@/components/ui/button';
import { DateDisplay } from '@/components/ui/date-display';
import DetailCell from '@/components/ui/detail-cell';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import StatusBadge from '@/components/Lands/StatusBadge';
import { TYPE_TONE } from '@/lib/paymentEnums';

interface Party {
  id: number;
  name: string;
}

interface Contract {
  land: { id: number; name: string } | null;
}

interface Payment {
  id: number;
  type: string;
  date: string;
  amount: string;
  party: Party | null;
  contract: Contract | null;
  notes: string | null;
}

interface IndexProps {
  payments: Payment[];
}

export default function Index({ payments }: IndexProps) {
  return (
    <div dir="rtl" className="space-y-6 p-6">
      <Head title="المدفوعات" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">المدفوعات والمقبوضات</h1>
          <p className="mt-1 text-sm text-stone-500">سجل جميع المدفوعات والمقبوضات النقدية</p>
        </div>
        <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
          <Link href={route('payments.create')}>
            <Plus className="ms-2 h-4 w-4" />
            تسجيل جديد
          </Link>
        </Button>
      </div>

      <Card className="border-stone-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">الطرف</TableHead>
              <TableHead className="text-right">العقد</TableHead>
              <TableHead className="text-right">النوع</TableHead>
              <TableHead className="text-right">المبلغ</TableHead>
              <TableHead className="text-right">ملاحظات</TableHead>
              <TableHead className="text-left">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center text-stone-500">
                  <Wallet className="mx-auto mb-3 h-10 w-10 text-stone-300" />
                  لا توجد مدفوعات مسجّلة بعد.
                </TableCell>
              </TableRow>
            )}
            {payments.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono"><DateDisplay date={p.date} /></TableCell>
                <TableCell className="font-medium">
                  <Link href={route('payments.show', p.id)} className="hover:text-emerald-700 hover:underline">
                    {p.party?.name ?? '—'}
                  </Link>
                </TableCell>
                <TableCell className="text-sm text-stone-500">
                  {p.contract?.land?.name ? (
                    <Link href={route('lands.show', p.contract.land.id)} className="hover:text-emerald-700 hover:underline">
                      {p.contract.land.name}
                    </Link>
                  ) : '—'}
                </TableCell>
                <TableCell>
                  <StatusBadge value={p.type} toneMap={TYPE_TONE} />
                </TableCell>
                <TableCell className="font-mono">{p.amount}</TableCell>
                <TableCell><DetailCell text={p.notes} title="ملاحظات" className="text-sm text-stone-500" /></TableCell>
                <TableCell className="text-left">
                  <ActionsMenu
                    actions={[
                      { label: 'عرض', icon: Eye, href: route('payments.show', p.id) },
                      { label: 'تعديل', icon: Pencil, href: route('payments.edit', p.id) },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
