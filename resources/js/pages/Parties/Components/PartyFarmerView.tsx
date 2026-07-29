import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table';
import type { FarmerFinancials } from './types';
import { currency } from './types';

interface Props {
  farmerFinancials: FarmerFinancials;
}

export default function PartyFarmerView({ farmerFinancials }: Props) {
  const { seasons } = farmerFinancials;

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="border-stone-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs text-stone-500">إجمالي الإيرادات</p>
            <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-stone-900">
              {currency(farmerFinancials.total_revenue)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-stone-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs text-stone-500">إجمالي التكاليف المشتركة</p>
            <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-amber-700">
              {currency(farmerFinancials.total_shared_cost)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-stone-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs text-stone-500">إجمالي السلف (تكاليف + دفعات)</p>
            <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-rose-700">
              {currency(farmerFinancials.total_advances)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs text-emerald-700">صافي الأرباح</p>
            <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-emerald-700">
              {currency(farmerFinancials.total_profit)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-stone-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الأرض</TableHead>
              <TableHead>تاريخ الزراعة</TableHead>
              <TableHead>نوع التسوية</TableHead>
              <TableHead className="text-left">الإيراد</TableHead>
              <TableHead className="text-left">تكاليف مشتركة</TableHead>
              <TableHead className="text-left">نصيب المزارع</TableHead>
              <TableHead className="text-left">تكاليف خاصة</TableHead>
              <TableHead className="text-left">سلف دفعات</TableHead>
              <TableHead className="text-left">صافي الربح</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {seasons.map((s) => (
              <TableRow key={s.season_id}>
                <TableCell className="font-medium">{s.land_name}</TableCell>
                <TableCell>{s.planting_date}</TableCell>
                <TableCell>
                  {s.settlement_type === 'نسبة' ? `${s.share_percentage ?? 0}%` : 'مبلغ ثابت'}
                </TableCell>
                <TableCell className="font-mono tabular-nums text-left">
                  {currency(s.total_revenue)}
                </TableCell>
                <TableCell className="font-mono tabular-nums text-left text-amber-700">
                  {currency(s.shared_cost)}
                </TableCell>
                <TableCell className="font-mono tabular-nums text-left text-emerald-700">
                  {currency(s.farmer_share)}
                </TableCell>
                <TableCell className="font-mono tabular-nums text-left text-rose-700">
                  {currency(s.farmer_cost)}
                </TableCell>
                <TableCell className="font-mono tabular-nums text-left text-rose-700">
                  {currency(s.advances)}
                </TableCell>
                <TableCell className="font-mono tabular-nums text-left font-bold">
                  {currency(s.profit)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
