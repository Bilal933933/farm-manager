import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DateDisplay } from '@/components/ui/date-display';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import StatusBadge from '@/components/Lands/StatusBadge';

interface Land {
  id: number;
  name: string;
}

interface Contract {
  id: number;
  land_id: number;
  land?: Land | null;
  type: string;
  start_date: string;
  end_date: string | null;
  amount: string;
}

interface Party {
  id: number;
  name: string;
  type: string;
  phone: string | null;
  email: string | null;
  national_id: string | null;
  address: string | null;
  notes: string | null;
  contracts?: Contract[];
}

interface ShowProps {
  party: Party;
}

export default function Show({ party }: ShowProps) {
  return (
    <div dir="rtl" className="mx-auto max-w-4xl space-y-6 p-6">
      <Head title={party.name} />

      <Link
        href={route('parties.index')}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى الأطراف
      </Link>

      <Card className="border-stone-200">
        <CardContent className="flex flex-wrap items-start justify-between gap-4 p-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-stone-900">{party.name}</h1>
              <StatusBadge value={party.type} />
            </div>
            <div className="space-y-1 text-sm text-stone-500">
              {party.phone && <p dir="ltr" className="font-mono">{party.phone}</p>}
              {party.email && <p dir="ltr" className="font-mono">{party.email}</p>}
              {party.national_id && <p className="font-mono">الرقم القومي: {party.national_id}</p>}
              {party.address && <p>{party.address}</p>}
            </div>
            {party.notes && <p className="max-w-xl text-sm text-stone-500">{party.notes}</p>}
          </div>
          <Button variant="outline" asChild>
            <Link href={route('parties.edit', party.id)}>
              <Pencil className="ms-2 h-4 w-4" />
              تعديل البيانات
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-medium text-stone-900">
          العقود المرتبطة ({party.contracts?.length ?? 0})
        </h2>
        <Card className="border-stone-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الأرض</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">البداية</TableHead>
                <TableHead className="text-right">الانتهاء</TableHead>
                <TableHead className="text-right">القيمة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(party.contracts ?? []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-stone-500">
                    لا توجد عقود مرتبطة بهذا الطرف بعد.
                  </TableCell>
                </TableRow>
              )}
              {(party.contracts ?? []).map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={route('lands.show', contract.land_id)}
                      className="hover:text-emerald-700 hover:underline"
                    >
                      {contract.land?.name ?? '—'}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <StatusBadge value={contract.type} />
                  </TableCell>
                  <TableCell className="font-mono"><DateDisplay date={contract.start_date} /></TableCell>
                  <TableCell className="font-mono">{contract.end_date ? <DateDisplay date={contract.end_date} /> : '—'}</TableCell>
                  <TableCell className="font-mono">{contract.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
