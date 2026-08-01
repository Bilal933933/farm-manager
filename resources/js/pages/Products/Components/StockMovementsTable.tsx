import { Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { DateDisplay } from '@/components/ui/date-display';
import DetailCell from '@/components/ui/detail-cell';
import { Movement } from '../Types/product';
import { movementTypeIcons, reasonIcons, movementTypeColors } from '../Utils/movementConfig';

interface StockMovementsTableProps {
  movements: Movement[];
  category: string;
}

export default function StockMovementsTable({ movements, category }: StockMovementsTableProps) {
  const EmptyIcon = movementTypeIcons[category] || Truck;

  return (
    <Card className="border-stone-200 shadow-sm overflow-hidden">
      <CardHeader className="bg-stone-50/50 border-b border-stone-100 py-4">
        <CardTitle className="text-base font-bold text-stone-800">حركات المخزون</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {movements.length === 0 ? (
          <div className="py-12 text-center text-stone-400">
            <EmptyIcon className="mx-auto mb-2 h-10 w-10 text-stone-300" />
            <p className="text-sm">لا توجد حركات مخزون مسجلة لهذا المنتج</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-stone-100/70">
              <TableRow>
                <TableHead className="text-right font-bold text-stone-700 whitespace-nowrap">التاريخ</TableHead>
                <TableHead className="text-right font-bold text-stone-700 whitespace-nowrap">النوع</TableHead>
                <TableHead className="text-right font-bold text-stone-700 whitespace-nowrap">السبب</TableHead>
                <TableHead className="text-right font-bold text-stone-700 whitespace-nowrap">الكمية</TableHead>
                <TableHead className="text-right font-bold text-stone-700 whitespace-nowrap">سعر الوحدة</TableHead>
                <TableHead className="text-right font-bold text-stone-700 whitespace-nowrap">ملاحظات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((m) => {
                const ReasonIcon = reasonIcons[m.reason] || Truck;

                return (
                  <TableRow key={m.id} className="hover:bg-stone-50/80 transition-colors">
                    <TableCell className="whitespace-nowrap">
                      <DateDisplay date={m.movement_date} format="short" className="text-xs text-stone-600" />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${movementTypeColors[m.type] || 'text-stone-600 bg-stone-50'}`}>
                        {m.type}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-700">
                        <ReasonIcon className="h-3.5 w-3.5 text-stone-400" />
                        {m.reason}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono tabular-nums font-semibold text-stone-900 whitespace-nowrap">
                      {m.quantity.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-mono tabular-nums text-stone-600 whitespace-nowrap">
                      {m.unit_price != null ? `${m.unit_price.toLocaleString()} ج.م` : '—'}
                    </TableCell>
                    <TableCell><DetailCell text={m.notes} title="ملاحظات" className="text-xs text-stone-500" /></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
