import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table';
import type { LesseeFinancials } from './types';
import { currency } from './types';

interface Props {
  lesseeFinancials: LesseeFinancials;
}

export default function PartyLesseeView({ lesseeFinancials }: Props) {
  const { contracts } = lesseeFinancials;

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-stone-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs text-stone-500">إجمالي الإيجار</p>
            <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-stone-900">
              {currency(lesseeFinancials.total_rent_amount)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-stone-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs text-stone-500">ما دفعه المستأجر</p>
            <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-emerald-700">
              {currency(lesseeFinancials.total_paid)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-stone-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs text-stone-500">المتبقي على المستأجر</p>
            <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-rose-700">
              {currency(lesseeFinancials.total_remaining)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-stone-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الأرض</TableHead>
              <TableHead className="text-left">إجمالي الإيجار</TableHead>
              <TableHead className="text-left">المدفوع</TableHead>
              <TableHead className="text-left">المتبقي</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((c) => (
              <TableRow key={c.contract_id}>
                <TableCell className="font-medium">{c.land_name}</TableCell>
                <TableCell className="font-mono tabular-nums text-left">{currency(c.contract_amount)}</TableCell>
                <TableCell className="font-mono tabular-nums text-left text-emerald-700">{currency(c.paid)}</TableCell>
                <TableCell className="font-mono tabular-nums text-left text-rose-700">{currency(c.remaining)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
