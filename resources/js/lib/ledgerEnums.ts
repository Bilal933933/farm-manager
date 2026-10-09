import type { StatusTone } from '@/lib/landEnums';

export const DIRECTIONS = [
  { value: 'مدين', label: 'مدين' },
  { value: 'دائن', label: 'دائن' },
];

export const DIRECTION_TONE: Record<string, StatusTone> = {
  مدين: 'rose',
  دائن: 'emerald',
};
