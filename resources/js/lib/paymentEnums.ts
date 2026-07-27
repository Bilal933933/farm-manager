import type { StatusTone } from '@/components/Lands/StatusBadge';

export const PAYMENT_TYPES = [
  { value: 'دفع', label: 'دفع' },
  { value: 'قبض', label: 'قبض' },
];

export const TYPE_TONE: Record<string, StatusTone> = {
  دفع: 'rose',
  قبض: 'emerald',
};
