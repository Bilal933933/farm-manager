import { Link, router } from '@inertiajs/react';
import { DollarSign, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ContractFormDialog from '@/components/Lands/ContractFormDialog';
import StatusBadge from '@/components/Lands/StatusBadge';
import { ActionsMenu } from '@/components/ui/actions-menu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DateDisplay } from '@/components/ui/date-display';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import type { Contract } from '@/types';

interface Props { contracts: Contract[]; landId: number; parties: { id: number; name: string; type: string; phone: string | null }[] }

const cell = 'text-right';
const numCell = 'font-mono text-right tabular-nums';
const h = 'text-right font-semibold text-stone-700 bg-stone-100 border-b-2 border-stone-200';
const nh = `${numCell} ${h}`;

export default function ContractsTab({ contracts, landId, parties }: Props) {
  const [editingContract, setEditingContract] = useState<Contract | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <ContractFormDialog landId={landId} parties={parties} trigger={
          <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800">
            <Plus className="ms-2 h-4 w-4" /> إضافة عقد
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
              <TableHead className={h}>الطرف</TableHead>
              <TableHead className={h}>النوع</TableHead>
              <TableHead className={h}>البداية</TableHead>
              <TableHead className={h}>الانتهاء</TableHead>
              <TableHead className={nh}>القيمة</TableHead>
              <TableHead className={nh}>المتبقي</TableHead>
              <TableHead className="text-left font-semibold text-stone-700 bg-stone-100 border-b-2 border-stone-200 w-20">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-stone-500">لا توجد عقود مسجّلة لهذه الأرض بعد.</TableCell>
              </TableRow>
            ) : contracts.map((c) => (
              <TableRow key={c.id} className="border-b border-stone-100 last:border-b-0">
                <TableCell className={cell}>{c.party?.name ?? '—'}</TableCell>
                <TableCell className={cell}><StatusBadge value={c.type} /></TableCell>
                <TableCell className={cell}><DateDisplay date={c.start_date} /></TableCell>
                <TableCell className={cell}>{c.end_date ? <DateDisplay date={c.end_date} /> : '—'}</TableCell>
                <TableCell className={numCell}>
                  {c.type === 'مزارع' && c.settlement_type === 'نسبة' ? '—' : c.amount}
                </TableCell>
                <TableCell className={numCell}>
                  {c.type === 'مزارع' && c.settlement_type === 'نسبة'
                    ? <span className="text-xs text-stone-500">نسبة من المحصول</span>
                    : c.remaining?.toFixed(2) ?? c.amount}
                </TableCell>
                <TableCell className="text-left whitespace-nowrap">
                  <ActionsMenu
                    actions={[
                      {
                        label: 'دفعات', icon: DollarSign,
                        href: route('payments.create', { contract_id: c.id, party_id: c.party_id }),
                      },
                      {
                        label: 'تعديل', icon: Pencil,
                        onClick: () => setEditingContract(c),
                      },
                      {
                        label: 'حذف', icon: Trash2, variant: 'danger',
                        delete: {
                          itemName: c.type,
                          onDelete: () => router.delete(route('lands.contracts.destroy', c.id)),
                          description: 'لن يمكن حذف هذا العقد إذا كان مرتبطاً بعمليات.',
                        },
                      },
                    ]}
                  />
                  <ContractFormDialog
                    landId={landId}
                    parties={parties}
                    contract={editingContract}
                    open={editingContract?.id === c.id}
                    onOpenChange={(open) => {
 if (!open) {
setEditingContract(null);
} 
}}
                    trigger={<span />}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
