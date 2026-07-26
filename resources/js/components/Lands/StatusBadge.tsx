import { Badge } from '@/components/ui/badge';
import { STATUS_TONE } from '@/lib/landEnums';

const TONE_CLASSES: Record<string, string> = {
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  stone: 'bg-stone-100 text-stone-600 border-stone-200',
  sky: 'bg-sky-50 text-sky-700 border-sky-200',
  violet: 'bg-violet-50 text-violet-700 border-violet-200',
};

export default function StatusBadge({ value }: { value: string }) {
  const tone = STATUS_TONE[value] ?? 'stone';

  return (
    <Badge
      variant="outline"
      className={`font-normal rounded-full px-2.5 py-0.5 ${TONE_CLASSES[tone]}`}
    >
      {value}
    </Badge>
  );
}
