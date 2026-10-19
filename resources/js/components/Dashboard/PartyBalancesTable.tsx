import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { DashboardPartyBalance } from '@/types/dashboard';

interface PartyBalancesTableProps {
    balances: DashboardPartyBalance[];
}

const KIND_LABELS: Record<DashboardPartyBalance['kind'], string> = {
    receivable: 'لنا',
    payable: 'علينا',
};

const KIND_CLASSES: Record<DashboardPartyBalance['kind'], string> = {
    receivable: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    payable: 'bg-rose-50 text-rose-700 border-rose-200',
};

export default function PartyBalancesTable({ balances }: PartyBalancesTableProps) {
    return (
        <Card className="gap-4 border-stone-200 py-5">
            <CardHeader>
                <CardTitle className="text-base text-stone-900">أرصدة الأطراف</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
                {balances.length === 0 ? (
                    <p className="px-6 py-8 text-center text-sm text-stone-500">
                        لا توجد أرصدة مستحقة حالياً.
                    </p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-right">الطرف</TableHead>
                                <TableHead className="text-right">التصنيف</TableHead>
                                <TableHead className="text-right">الحالة</TableHead>
                                <TableHead className="text-right">المبلغ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {balances.map((balance) => (
                                <TableRow key={`${balance.kind}-${balance.id}`}>
                                    <TableCell className="text-right font-medium">
                                        {balance.name}
                                    </TableCell>
                                    <TableCell className="text-right text-stone-600">
                                        {balance.category}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge
                                            variant="outline"
                                            className={`rounded-full px-2.5 py-0.5 font-normal ${KIND_CLASSES[balance.kind]}`}
                                        >
                                            {KIND_LABELS[balance.kind]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell
                                        className={`text-right font-mono tabular-nums font-semibold ${balance.kind === 'receivable' ? 'text-emerald-700' : 'text-rose-700'}`}
                                    >
                                        {balance.amount.toLocaleString()}
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
