# خطة 16 — توحيد رابط العودة في عرض المنتج (gap-1.5 بلا عريض)

- الحالة: منفذة (Done — `tsc --noEmit` ناجح)
- الكوميت المرجعي: `2c88a12cd42159cc62f0420e5fa134166c7fd654`
- السطح: `Products/Show` رابط العودة
- الأولوية: 1 (8 شواهد مطابقة)

## المشكلة
رابط العودة الوحيد الشاذ: `gap-2 font-medium` بينما كل روابط العودة `gap-1.5` عادية.

## الدليل
- العقد: عرف روابط العودة — `LandHeader:17`, `Costs/Show:22`, `Parties/Show:36` (×6 فروع بنفس السطر).
- التشغيل: `pages/Products/Show.tsx:12-18` — `gap-2 ... font-medium`.

## التغيير
```tsx
// قبل:
className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors"
// بعد:
className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors"
```

## التحقق
1. `/products/1` — رابط العودة مطابق لباقي الصفحات.
2. `npx tsc --noEmit` ناجح. بصري فقط.

## خارج النطاق
- `gap-2` داخل الأيقونة+النص في `contactItems` — `gap-1.5` هناك جزء من شارة لها مالك مختلف، لا يمس.
