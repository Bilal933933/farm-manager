import { ScrollText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';

interface DetailCellProps {
  text?: string | null;
  title?: string;
  className?: string;
}

export default function DetailCell({
  text,
  title = 'البيان',
  className = 'text-stone-500',
}: DetailCellProps) {
  const normalized = text?.trim() ?? '';

  if (!normalized) {
    return <span className={`${className} text-stone-300`}>—</span>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
          title={normalized}
        >
          <ScrollText className="h-4 w-4 shrink-0" />
          <span className="sr-only">عرض {title}</span>
        </Button>
      </DialogTrigger>
      <DialogContent dir="rtl" className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-700">
          {normalized}
        </p>
      </DialogContent>
    </Dialog>
  );
}
