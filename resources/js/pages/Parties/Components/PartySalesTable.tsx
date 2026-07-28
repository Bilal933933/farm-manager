import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Sale } from './types';
import { currency } from './types';

interface Props {
  sales: Sale[];
}

export default function PartySalesTable({ sales }: Props) {
  if (sales.length === 0) {
    return <p className="py-8 text-center text-stone-400">لا توجد مبيعات</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-right">التاريخ</TableHead>
          <TableHead className="text-center">الكمية</TableHead>
          <TableHead className="text-center">سعر الوحدة</TableHead>
          <TableHead className="text-center">الإجمالي</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.map((sale) => (
          <TableRow key={sale.id}>
            <TableCell className="font-mono whitespace-nowrap">{sale.date}</TableCell>
            <TableCell className="font-mono text-center tabular-nums">{sale.quantity}</TableCell>
            <TableCell className="font-mono text-center tabular-nums">{currency(Number(sale.unit_price))}</TableCell>
            <TableCell className="font-mono text-center tabular-nums font-medium">{currency(Number(sale.total ?? Number(sale.quantity) * Number(sale.unit_price)))}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
