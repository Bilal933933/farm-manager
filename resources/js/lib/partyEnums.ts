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
  { value: 'أمانات', label: 'أمانات' },
];

export const PARTY_CATEGORY_TONE: Record<string, string> = {
  مؤجر: 'amber',
  مستأجر: 'blue',
  مزارع: 'green',
  'متجر مستلزمات زراعية': 'purple',
  تاجر: 'orange',
  أمانات: 'sky',
};

export const PARTY_CATEGORY_AVATAR: Record<string, { gradient: string; icon: string }> = {
  مؤجر: { gradient: 'from-amber-100 to-amber-200', icon: 'home' },
  مستأجر: { gradient: 'from-blue-100 to-blue-200', icon: 'user' },
  مزارع: { gradient: 'from-emerald-100 to-emerald-200', icon: 'sprout' },
  'متجر مستلزمات زراعية': { gradient: 'from-purple-100 to-purple-200', icon: 'store' },
  تاجر: { gradient: 'from-orange-100 to-orange-200', icon: 'truck' },
  أمانات: { gradient: 'from-sky-100 to-sky-200', icon: 'vault' },
};

export const CATEGORY_ALLOWED_PAYMENT_TYPES: Record<string, string[]> = {
  مؤجر: ['دفع', 'سلف'],
  مستأجر: ['قبض'],
  مزارع: ['دفع', 'سلف'],
  'متجر مستلزمات زراعية': ['دفع', 'سلف'],
  تاجر: ['قبض'],
  أمانات: ['دفع', 'قبض'],
};
