# خطة 17 — قص عنوان بطاقة المنتج (`truncate` + `min-w-0`)

- الحالة: منفذة (Done — `tsc --noEmit` ناجح)
- الكوميت المرجعي: `2c88a12cd42159cc62f0420e5fa134166c7fd654`
- السطح: `ProductHeaderCard` عنوان `h1`
- الأولوية: 2 (اسم طويل يدفع زر التعديل خارج الشاشة)

## المشكلة
`h1` اسم المنتج بلا قص، وغلافه المرن بلا `min-w-0` — اسم طويل يمنع الانكماش ويدفع زر التعديل خارج البطاقة. كل بطاقات الرؤوس الشقيقة تقص العنوان.

## الدليل
- العقد: عرف قص عناوين الرؤوس — `LandHeader:27` (`truncate`) + `:25` (`min-w-0 flex-1`)، `PartyHeader:62`، `Costs/Show:42`.
- التشغيل: `pages/Products/Components/ProductHeaderCard.tsx:16` (غلاف `space-y-3` بلا `min-w-0`) + `:18` (`h1` بلا `truncate`).

## التغيير (موضعان مترابطان)
```tsx
// الغلاف :16 — قبل:
<div className="space-y-3">
// بعد:
<div className="min-w-0 flex-1 space-y-3">
// العنوان :18 — قبل:
<h1 className="text-2xl font-bold text-stone-900">{product.name}</h1>
// بعد:
<h1 className="truncate text-2xl font-bold text-stone-900">{product.name}</h1>
```

## التحقق
1. `/products/1` باسم طويل — العنوان يُقص (...) وزر التعديل ثابت.
2. `npx tsc --noEmit` ناجح. بصري فقط.

## خارج النطاق
- شبكة البيانات الوصفية تحت العنوان — سليمة.
