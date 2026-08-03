import { ScrollText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  HoverCard, HoverCardContent, HoverCardTrigger,
} from '@/components/ui/hover-card';

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
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
        >
          <ScrollText className="h-4 w-4 shrink-0" />
          <span className="sr-only">عرض {title}</span>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        align="start"
        sideOffset={6}
        className="max-w-xs max-h-56 overflow-y-auto whitespace-normal break-words"
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-700">
          {normalized}
        </p>
      </HoverCardContent>
    </HoverCard>
  );
}
