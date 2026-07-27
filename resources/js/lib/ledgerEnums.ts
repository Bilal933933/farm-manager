import type { StatusTone } from '@/components/Lands/StatusBadge';

export const DIRECTIONS = [
  { value: 'مدين', label: 'مدين' },
  { value: 'دائن', label: 'دائن' },
];

export const DIRECTION_TONE: Record<string, StatusTone> = {
  مدين: 'rose',
  دائن: 'emerald',
};
