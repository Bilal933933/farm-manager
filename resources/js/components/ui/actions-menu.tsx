import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { EllipsisVertical } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteDialog } from '@/components/ui/delete-dialog';

interface ActionItem {
  label: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'danger';
  delete?: {
    itemName: string;
    onDelete: () => void;
    description?: string;
  };
}

interface ActionsMenuProps {
  actions: ActionItem[];
}

export function ActionsMenu({ actions }: ActionsMenuProps) {
  const [deleteItem, setDeleteItem] = useState<ActionItem['delete'] | null>(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="hover:bg-stone-100 p-2">
            <EllipsisVertical className="h-4 w-4 text-stone-500" />
            <span className="sr-only">إجراءات</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-40">
          {actions.map((action) => {
            const Icon = action.icon;
            const isDanger = action.variant === 'danger';
            const className = isDanger ? 'text-rose-600' : '';

            if (action.href) {
              return (
                <DropdownMenuItem key={action.label} asChild className={className}>
                  <Link href={action.href} className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0" />
                    {action.label}
                  </Link>
                </DropdownMenuItem>
              );
            }

            return (
              <DropdownMenuItem
                key={action.label}
                className={className}
                onClick={() => {
                  if (action.delete) {
                    setDeleteItem(action.delete);
                  } else {
                    action.onClick?.();
                  }
                }}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {action.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {deleteItem && (
        <DeleteDialog
          itemName={deleteItem.itemName}
          onDelete={() => {
            deleteItem.onDelete();
            setDeleteItem(null);
          }}
          description={deleteItem.description}
          open
          onOpenChange={(open) => { if (!open) setDeleteItem(null); }}
        />
      )}
    </>
  );
}
