import { Link } from '@inertiajs/react';
import StatusBadge from '@/components/Lands/StatusBadge';
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
import type { DashboardSeason } from '@/types/dashboard';

interface ActiveSeasonsTableProps {
    seasons: DashboardSeason[];
}

export default function ActiveSeasonsTable({ seasons }: ActiveSeasonsTableProps) {
    return (
        <Card className="gap-4 border-stone-200 py-5">
            <CardHeader>
                <CardTitle className="text-base text-stone-900">المواسم الجارية</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
                {seasons.length === 0 ? (
                    <p className="px-6 py-8 text-center text-sm text-stone-500">
                        لا توجد مواسم جارية حالياً.
                    </p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-right">الأرض</TableHead>
                                <TableHead className="text-right">المحصول</TableHead>
                                <TableHead className="text-right">تاريخ الزراعة</TableHead>
                                <TableHead className="text-right">التكاليف</TableHead>
                                <TableHead className="text-right">الحالة</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {seasons.map((season) => (
                                <TableRow key={season.id}>
                                    <TableCell className="text-right font-medium">
                                        <Link
                                            href={route('lands.seasons.show', { land: season.land_id, season: season.id })}
                                            className="hover:text-emerald-700 hover:underline"
                                        >
                                            {season.land_name}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-right text-stone-600">
                                        {season.crop_name}
                                    </TableCell>
                                    <TableCell className="text-right text-stone-600">
                                        {season.planting_date ? (
                                            <DateDisplay date={season.planting_date} format="short" />
                                        ) : (
                                            '—'
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right font-mono tabular-nums text-stone-600">
                                        {season.costs_total.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <StatusBadge value={season.status} />
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
