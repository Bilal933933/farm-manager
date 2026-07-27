import type { StatusTone } from '@/components/Lands/StatusBadge';

export const CROP_CATEGORIES = [
  { value: 'محاصيل حقلية', label: 'محاصيل حقلية' },
  { value: 'خضروات', label: 'خضروات' },
  { value: 'فاكهة', label: 'فاكهة' },
  { value: 'أعلاف', label: 'أعلاف' },
  { value: 'أخرى', label: 'أخرى' },
];

export const CROP_UNITS = [
  { value: 'طن', label: 'طن' },
  { value: 'كجم', label: 'كجم' },
];

export const CROP_SEASONS = [
  { value: 'صيفي', label: 'صيفي' },
  { value: 'شتوي', label: 'شتوي' },
  { value: 'نيلي', label: 'نيلي' },
];

export const STATUS_TONE: Record<string, StatusTone> = {};
