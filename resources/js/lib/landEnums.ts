export const AREA_UNITS = [
  { value: 'دونم', label: 'دونم' },
  { value: 'هكتار', label: 'هكتار' },
];

export const LAND_STATUSES = [
  { value: 'نشط', label: 'نشط' },
  { value: 'متوقف', label: 'متوقف' },
];

export const CONTRACT_TYPES = [
  { value: 'مؤجر', label: 'مؤجر' },
  { value: 'مستأجر', label: 'مستأجر' },
  { value: 'مزارع', label: 'مزارع' },
];

export const SETTLEMENT_TYPES = [
  { value: 'ثابت', label: 'مبلغ ثابت' },
  { value: 'نسبة', label: 'نسبة من الإنتاج' },
];

export const COST_BORNE_BY = [
  { value: 'مشترك', label: 'مشترك' },
  { value: 'مزارع', label: 'المزارع' },
  { value: 'مالك', label: 'المالك' },
];

export const SEASON_STATUSES = [
  { value: 'قادم', label: 'قادم' },
  { value: 'نشط', label: 'نشط' },
  { value: 'منتهي', label: 'منتهي' },
];

export const STATUS_TONE: Record<string, string> = {
  'نشط': 'emerald',
  'متوقف': 'stone',
  'قادم': 'amber',
  'منتهي': 'stone',
  'مؤجر': 'sky',
  'مستأجر': 'violet',
  'مزارع': 'amber',
};
