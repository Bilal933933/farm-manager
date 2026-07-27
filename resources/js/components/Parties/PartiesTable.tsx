import { Link, router } from '@inertiajs/react';
import { Eye, Pencil, Trash2, Users } from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { ActionsMenu } from '@/components/ui/actions-menu';
import StatusBadge from '@/components/Lands/StatusBadge';
import { PARTY_TONE } from '@/lib/partyEnums';

interface Party {
  id: number;
  name: string;
  type: string;
  phone: string | null;
  contracts_count: number;
}

interface PartiesTableProps {
  parties: Party[];
}

export default function PartiesTable({ parties }: PartiesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-stone-700 font-semibold text-right">الاسم</TableHead>
          <TableHead className="text-stone-700 font-semibold text-center w-28">النوع</TableHead>
          <TableHead className="text-stone-700 font-semibold text-center w-36">الهاتف</TableHead>
          <TableHead className="text-stone-700 font-semibold text-center w-24">العقود</TableHead>
          <TableHead className="text-stone-700 font-semibold text-left w-20">إجراءات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {parties.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="py-16 text-center text-stone-500">
              <Users className="mx-auto mb-3 h-10 w-10 text-stone-300" />
              لا يوجد أطراف مسجّلون بعد. ابدأ بإضافة أول طرف.
            </TableCell>
          </TableRow>
        ) : (
          parties.map((party) => (
            <TableRow
              key={party.id}
              className="hover:bg-stone-50 transition-colors even:bg-stone-50/50"
            >
              <TableCell className="font-medium whitespace-nowrap">
                <Link href={route('parties.show', party.id)} className="hover:text-emerald-700 hover:underline">
                  {party.name}
                </Link>
              </TableCell>
              <TableCell className="text-center">
                <div className="inline-flex justify-center">
                  <StatusBadge value={party.type} toneMap={PARTY_TONE} />
                </div>
              </TableCell>
              <TableCell className="font-mono text-center whitespace-nowrap" dir="ltr">
                {party.phone || <span className="text-stone-300">—</span>}
              </TableCell>
              <TableCell className="font-mono text-center tabular-nums whitespace-nowrap text-stone-700">
                {party.contracts_count ?? 0}
              </TableCell>
              <TableCell className="text-left whitespace-nowrap">
                <ActionsMenu
                  actions={[
                    { label: 'عرض', icon: Eye, href: route('parties.show', party.id) },
                    { label: 'تعديل', icon: Pencil, href: route('parties.edit', party.id) },
                    {
                      label: 'حذف',
                      icon: Trash2,
                      variant: 'danger',
                      delete: {
                        itemName: party.name,
                        onDelete: () => router.delete(route('parties.destroy', party.id)),
                        description: 'لن يمكن حذف هذا الطرف إذا كانت هناك عقود مرتبطة به.',
                      },
                    },
                  ]}
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
