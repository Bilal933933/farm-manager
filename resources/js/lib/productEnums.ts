import type { StatusTone } from '@/components/Lands/StatusBadge';

export const PRODUCT_CATEGORIES = [
  { value: 'سماد', label: 'سماد' },
  { value: 'مبيد', label: 'مبيد' },
  { value: 'بذور', label: 'بذور' },
  { value: 'شتلات', label: 'شتلات' },
  { value: 'ري', label: 'ري' },
  { value: 'صوبة', label: 'صوبة' },
  { value: 'أدوات', label: 'أدوات' },
  { value: 'وقود', label: 'وقود' },
  { value: 'أخرى', label: 'أخرى' },
];

export const PRODUCT_UNITS = [
  { value: 'كجم', label: 'كجم' },
  { value: 'طن', label: 'طن' },
  { value: 'لتر', label: 'لتر' },
  { value: 'شيكارة', label: 'شيكارة' },
  { value: 'قطعة', label: 'قطعة' },
  { value: 'لفة', label: 'لفة' },
  { value: 'متر', label: 'متر' },
  { value: 'علبة', label: 'علبة' },
];

export const PRODUCT_STATUSES = [
  { value: 'نشط', label: 'نشط' },
  { value: 'متوقف', label: 'متوقف' },
];

export const STATUS_TONE: Record<string, StatusTone> = {
  نشط: 'emerald',
  متوقف: 'stone',
};
