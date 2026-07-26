export const AREA_UNITS = [
  { value: 'دونم', label: 'دونم' },
  { value: 'هكتار', label: 'هكتار' },
];

export const LAND_STATUSES = [
  { value: 'نشط', label: 'نشط' },
  { value: 'متوقف', label: 'متوقف' },
];

export const CONTRACT_TYPES = [
  { value: 'إيجار', label: 'إيجار' },
  { value: 'تملك', label: 'تملك' },
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
  'إيجار': 'sky',
  'تملك': 'violet',
};
