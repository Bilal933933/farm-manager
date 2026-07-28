import { Link, router } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import HarvestFormDialog from '@/components/Harvests/HarvestFormDialog';
import SeasonFormDialog from '@/components/Lands/SeasonFormDialog';
import StatusBadge from '@/components/Lands/StatusBadge';
import { ActionsMenu } from '@/components/ui/actions-menu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DateDisplay } from '@/components/ui/date-display';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Crop, Season, SeasonStats } from '@/types';

interface Farmer {
  id: number;
  name: string;
}

interface Props {
  seasons: Season[]; seasonStats: Record<number, SeasonStats>;
  crops: Crop[]; farmers?: Farmer[]; landId: number;
}

function getCropName(s: Season): string {
  if (s.crop_obj?.name) {
return s.crop_obj.name;
}

  if (typeof s.crop === 'string') {
return s.crop;
}

  if (s.crop && typeof s.crop === 'object' && 'name' in s.crop) {
return (s.crop as Crop).name;
}

  return '—';
}

function fmt(n: number) {
 return n.toLocaleString() 
}

const cell = 'text-right';
const numCell = 'font-mono text-right tabular-nums';
const h = 'text-right font-semibold text-stone-700 bg-stone-100 border-b-2 border-stone-200';
const nh = `${numCell} ${h}`;

export default function SeasonsTab({ seasons, seasonStats, crops, farmers, landId }: Props) {
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <SeasonFormDialog landId={landId} crops={crops} farmers={farmers} trigger={
          <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800">
            <Plus className="ms-2 h-4 w-4" /> إضافة موسم
          </Button>
        } />
        <div className="mr-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <Input placeholder="بحث..." className="w-56 pl-9 text-sm" />
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border-stone-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={h}>المحصول</TableHead>
              <TableHead className={h}>المساحة</TableHead>
              <TableHead className={h}>المزارع</TableHead>
              <TableHead className={h}>الزراعة</TableHead>
              <TableHead className={nh}>الحصاد</TableHead>
              <TableHead className={nh}>المبيعات</TableHead>
              <TableHead className={nh}>التكلفة</TableHead>
              <TableHead className={nh}>الربح</TableHead>
              <TableHead className={h}>الحالة</TableHead>
              <TableHead className="text-left font-semibold text-stone-700 bg-stone-100 border-b-2 border-stone-200 w-20">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {seasons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="py-12 text-center text-stone-500">
                  لا توجد مواسم مسجّلة لهذه الأرض بعد.
                </TableCell>
              </TableRow>
            ) : seasons.map((s) => {
              const st = seasonStats[s.id];
              const harvest = st?.total_harvest ?? 0;
              const salesTotal = st?.total_sales ?? 0;
              const cost = st?.total_cost ?? 0;
              const profit = st?.profit ?? 0;

              return (
                <TableRow key={s.id} className="border-b border-stone-100 last:border-b-0">
                  <TableCell className={cell}>
                    <Link href={route('lands.seasons.show', { land: landId, season: s.id })} className="font-medium text-emerald-700 hover:underline">
                      {getCropName(s)}
                    </Link>
                  </TableCell>
                  <TableCell className={cell}>{s.cultivated_area || '—'}</TableCell>
                  <TableCell className={cell}>{s.farmer?.name || '—'}</TableCell>
                  <TableCell className={cell}><DateDisplay date={s.planting_date} /></TableCell>
                  <TableCell className={numCell}>{harvest > 0 ? harvest : '—'}</TableCell>
                  <TableCell className={numCell}>{salesTotal > 0 ? fmt(salesTotal) : '—'}</TableCell>
                  <TableCell className={numCell}>{cost > 0 ? fmt(cost) : '—'}</TableCell>
                  <TableCell className={`${numCell} ${profit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {profit !== 0 ? fmt(profit) : '—'}
                  </TableCell>
                  <TableCell className={cell}><StatusBadge value={s.status} /></TableCell>
                  <TableCell className="text-left whitespace-nowrap">
                    <HarvestFormDialog landSeasonId={s.id} trigger={
                      <Button size="sm" className="bg-amber-500 text-white hover:bg-amber-600 px-2 h-9">
                        🌾
                      </Button>
                    } />
                    <ActionsMenu
                      actions={[
                        {
                          label: 'تعديل', icon: Pencil,
                          onClick: () => setEditingSeason(s),
                        },
                        {
                          label: 'حذف', icon: Trash2, variant: 'danger',
                          delete: {
                            itemName: getCropName(s),
                            onDelete: () => router.delete(route('lands.seasons.destroy', s.id)),
                          },
                        },
                      ]}
                    />
                    <SeasonFormDialog
                      landId={landId}
                      season={editingSeason}
                      crops={crops}
                      farmers={farmers}
                      open={editingSeason?.id === s.id}
                      onOpenChange={(open) => {
 if (!open) {
setEditingSeason(null);
} 
}}
                      trigger={<span />}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
