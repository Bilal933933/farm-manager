import { ScrollText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';

interface NotesDialogProps {
  text: string;
  title?: string;
}

export default function NotesDialog({ text, title = 'ملاحظات' }: NotesDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="hover:bg-stone-100 p-2" title={text}>
          <ScrollText className="h-4 w-4 text-stone-400" />
          <span className="sr-only">عرض {title}</span>
        </Button>
      </DialogTrigger>
      <DialogContent dir="rtl" className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-stone-700 whitespace-pre-wrap leading-relaxed">
          {text}
        </p>
      </DialogContent>
    </Dialog>
  );
}
