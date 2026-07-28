export const PARTY_TYPES = [
  { value: 'فرد', label: 'فرد' },
  { value: 'شركة', label: 'شركة' },
];

export const PARTY_TONE: Record<string, string> = {
  فرد: 'sky',
  شركة: 'violet',
};

export const PARTY_CATEGORIES = [
  { value: 'مؤجر', label: 'مؤجر' },
  { value: 'مستأجر', label: 'مستأجر' },
  { value: 'مزارع', label: 'مزارع' },
  { value: 'متجر مستلزمات زراعية', label: 'متجر مستلزمات زراعية' },
  { value: 'تاجر', label: 'تاجر' },
];

export const PARTY_CATEGORY_TONE: Record<string, string> = {
  مؤجر: 'amber',
  مستأجر: 'blue',
  مزارع: 'green',
  'متجر مستلزمات زراعية': 'purple',
  تاجر: 'orange',
};

export const CATEGORY_ALLOWED_PAYMENT_TYPES: Record<string, string[]> = {
  مؤجر: ['دفع', 'سلف'],
  مستأجر: ['قبض'],
  مزارع: ['دفع', 'سلف'],
  'متجر مستلزمات زراعية': ['دفع', 'سلف'],
  تاجر: ['قبض'],
};
