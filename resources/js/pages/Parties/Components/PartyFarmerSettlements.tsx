import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table';
import type { FarmerSettlementSummary } from './types';
import { currency } from './types';

interface Props {
  farmerSettlement: FarmerSettlementSummary;
}

export default function PartyFarmerSettlements({ farmerSettlement }: Props) {
  return (
    <div className="space-y-4">
      <Card className="border-emerald-200 shadow-sm">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-stone-500">صافي مستحقات المزارع</p>
              <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-emerald-700">
                {currency(farmerSettlement.total_farmer_share_net)}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-500">صافي مستحقات المالك</p>
              <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-blue-700">
                {currency(farmerSettlement.total_owner_share_net)}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-500">إجمالي سلف المزارع</p>
              <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-rose-700">
                {currency(farmerSettlement.total_farmer_cost)}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-500">إجمالي سلف المالك</p>
              <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-rose-700">
                {currency(farmerSettlement.total_owner_cost)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
              <TableHead className="text-left">سلفة المزارع</TableHead>
              <TableHead className="text-left">صافي المزارع</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {farmerSettlement.settlements.map((s) => (
              <TableRow key={s.season_id}>
                <TableCell className="font-medium">{s.land_name}</TableCell>
                <TableCell>{s.planting_date}</TableCell>
                <TableCell>
                  {s.settlement_type === 'نسبة' ? `${s.share_percentage}%` : 'مبلغ ثابت'}
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
                <TableCell className="font-mono tabular-nums text-left font-semibold">
                  {currency(s.farmer_share_net)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
