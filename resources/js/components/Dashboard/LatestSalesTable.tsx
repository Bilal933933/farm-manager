import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateDisplay } from '@/components/ui/date-display';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { DashboardSale } from '@/types/dashboard';

interface LatestSalesTableProps {
    sales: DashboardSale[];
}

export default function LatestSalesTable({ sales }: LatestSalesTableProps) {
    return (
        <Card className="gap-4 border-stone-200 py-5">
            <CardHeader>
                <CardTitle className="text-base text-stone-900">آخر المبيعات</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
                {sales.length === 0 ? (
                    <p className="px-6 py-8 text-center text-sm text-stone-500">
                        لا توجد مبيعات مسجّلة بعد.
                    </p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-right">التاريخ</TableHead>
                                <TableHead className="text-right">المحصول</TableHead>
                                <TableHead className="text-right">الطرف</TableHead>
                                <TableHead className="text-right">الكمية</TableHead>
                                <TableHead className="text-right">القيمة</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sales.map((sale) => (
                                <TableRow key={sale.id}>
                                    <TableCell className="text-right text-stone-600">
                                        {sale.date ? <DateDisplay date={sale.date} format="short" /> : '—'}
                                    </TableCell>
                                    <TableCell className="text-right text-stone-600">
                                        {sale.crop_name}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        {sale.party_name}
                                    </TableCell>
                                    <TableCell className="text-right font-mono tabular-nums text-stone-600">
                                        {sale.quantity.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right font-mono tabular-nums font-semibold text-stone-900">
                                        {sale.total.toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
