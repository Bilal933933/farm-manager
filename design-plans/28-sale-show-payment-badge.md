# خطة 28 — شارة `StatusBadge` لنوع الدفع في عرض البيع

- الحالة: منفذة (Done — `tsc --noEmit` ناجح)
- الكوميت المرجعي: `2c88a12cd42159cc62f0420e5fa134166c7fd654`
- السطح: شارة الدفع بجانب عنوان `Sales/Show`
- الأولوية: 3 (3 شواهد حية بنفس الحقل)

## المشكلة
نوع الدفع حبة مخصصة (`span` رمادي يدوي) بينما نفس الحقل `StatusBadge` في `Sales/Index` (بعد 11) و`Purchases/Show:89` و`SeasonShow:285`.

## الدليل
- العقد: تناقض عرض نفس الحقل (3 مقابل 1).
- التشغيل: `pages/Sales/Show.tsx:75-78` — `span` يدوي مقابل الشواهد.

## التغيير (استيراد + استبدال)
1. استيراد (نمط `Purchases/Show:3`):
```tsx
import StatusBadge from '@/components/Lands/StatusBadge';
```
2. الاستبدال (`:75-78`):
```tsx
// قبل:
<span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
  <CreditCard className="h-3 w-3" />
  {sale.payment_type}
</span>
// بعد:
<StatusBadge value={sale.payment_type} />
```

## التحقق
1. `/sales/1` — شارة دفع موحدة مع `/sales` و`/purchases/1`.
2. `npx tsc --noEmit` ناجح. بصري فقط.

## خارج النطاق
- استيراد `CreditCard` يبقى مستخدماً (`:109` بطاقة نوع الدفع) — لا حذف.
