import { router } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import ContractFormDialog from '@/components/Lands/ContractFormDialog';
import StatusBadge from '@/components/Lands/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DateDisplay } from '@/components/ui/date-display';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import type { Contract } from '@/types';

interface Props { contracts: Contract[]; landId: number }

const cell = 'text-right';
const numCell = 'font-mono text-right tabular-nums';
const h = 'text-right text-stone-600 font-semibold bg-stone-100 border-b-2 border-stone-200';
const nh = `${numCell} ${h}`;

export default function ContractsTab({ contracts, landId }: Props) {
  function deleteContract(c: Contract) {
 router.delete(route('lands.contracts.destroy', c.id)) 
}

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <ContractFormDialog landId={landId} trigger={
          <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800">
            <Plus className="ms-2 h-4 w-4" /> إضافة عقد
          </Button>
        } />
        <div className="mr-auto">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <Input placeholder="بحث..." className="w-56 pr-9 text-sm" />
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border-stone-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={h}>النوع</TableHead>
              <TableHead className={h}>البداية</TableHead>
              <TableHead className={h}>الانتهاء</TableHead>
              <TableHead className={nh}>القيمة</TableHead>
              <TableHead className="text-center font-semibold text-stone-600 bg-stone-100 border-b-2 border-stone-200">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-stone-500">لا توجد عقود مسجّلة لهذه الأرض بعد.</TableCell>
              </TableRow>
            ) : contracts.map((c) => (
              <TableRow key={c.id} className="border-b border-stone-100 last:border-b-0">
                <TableCell className={cell}><StatusBadge value={c.type} /></TableCell>
                <TableCell className={cell}><DateDisplay date={c.start_date} /></TableCell>
                <TableCell className={cell}>{c.end_date ? <DateDisplay date={c.end_date} /> : '—'}</TableCell>
                <TableCell className={numCell}>{c.amount}</TableCell>
                <TableCell className="text-center">
                  <div className="inline-flex items-center gap-0.5">
                    <ContractFormDialog landId={landId} contract={c} trigger={<Button variant="ghost" size="sm">تعديل</Button>} />
                    <Button variant="ghost" size="sm" className="text-rose-600 hover:text-rose-700" onClick={() => deleteContract(c)}>حذف</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}