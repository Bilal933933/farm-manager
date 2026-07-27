import { Link, router } from '@inertiajs/react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import StatusBadge from '@/components/Lands/StatusBadge';
import { ActionsMenu } from '@/components/ui/actions-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import type { Land } from '@/types';

interface Props {
  land: Land;
}

export default function LandTableRow({ land }: Props) {
  return (
    <TableRow key={land.id} className="hover:bg-stone-50 transition-colors even:bg-stone-50/50">
      <TableCell className="font-medium whitespace-nowrap">
        <Link href={route('lands.show', land.id)} className="hover:text-emerald-700 hover:underline">
          {land.name}
        </Link>
      </TableCell>
      <TableCell className="text-stone-500">{land.location || '—'}</TableCell>
      <TableCell className="font-mono whitespace-nowrap">{land.area} {land.area_unit}</TableCell>
      <TableCell>
        <StatusBadge value={land.status} />
      </TableCell>
      <TableCell className="font-mono text-center tabular-nums">{land.seasons?.length ?? 0}</TableCell>
      <TableCell className="font-mono text-center tabular-nums">{land.contracts?.length ?? 0}</TableCell>
      <TableCell className="text-left whitespace-nowrap">
        <ActionsMenu
          actions={[
            { label: 'عرض', icon: Eye, href: route('lands.show', land.id) },
            { label: 'تعديل', icon: Pencil, href: route('lands.edit', land.id) },
            {
              label: 'حذف', icon: Trash2, variant: 'danger',
              delete: {
                itemName: land.name,
                onDelete: () => router.delete(route('lands.destroy', land.id)),
                description: 'سيتم نقل هذه الأرض إلى سلة المحذوفات. يمكن استرجاعها لاحقاً.',
              },
            },
          ]}
        />
      </TableCell>
    </TableRow>
  );
}
