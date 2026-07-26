import { Badge } from '@/components/ui/badge';
import { STATUS_TONE } from '@/lib/landEnums';

export type StatusTone = 'emerald' | 'amber' | 'stone' | 'sky' | 'violet' | 'rose';

const TONE_CLASSES: Record<string, string> = {
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  stone: 'bg-stone-100 text-stone-600 border-stone-200',
  sky: 'bg-sky-50 text-sky-700 border-sky-200',
  violet: 'bg-violet-50 text-violet-700 border-violet-200',
  rose: 'bg-rose-50 text-rose-700 border-rose-200',
};

interface StatusBadgeProps {
  value: string;
  toneMap?: Record<string, StatusTone>;
}

export default function StatusBadge({ value, toneMap }: StatusBadgeProps) {
  const map = toneMap ?? STATUS_TONE;
  const tone = map[value] ?? 'stone';

  return (
    <Badge
      variant="outline"
      className={`font-normal rounded-full px-2.5 py-0.5 ${TONE_CLASSES[tone]}`}
    >
      {value}
    </Badge>
  );
}
