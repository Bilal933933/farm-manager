import type { StatusTone } from '@/components/Lands/StatusBadge';

export const MOVEMENT_TYPES = [
  { value: 'داخل', label: 'داخل' },
  { value: 'خارج', label: 'خارج' },
];

export const MOVEMENT_REASONS = [
  { value: 'شراء', label: 'شراء' },
  { value: 'صرف', label: 'صرف للموسم' },
  { value: 'جرد', label: 'جرد' },
  { value: 'إتلاف', label: 'إتلاف' },
  { value: 'مرتجع', label: 'مرتجع' },
  { value: 'تصحيح', label: 'تصحيح' },
];

export const TYPE_TONE: Record<string, StatusTone> = {
  داخل: 'emerald',
  خارج: 'rose',
};
