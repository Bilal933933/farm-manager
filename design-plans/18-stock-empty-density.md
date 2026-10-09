# خطة 18 — سخاء فراغ حركات المخزون (`py-16`)

- الحالة: منفذة (Done — `tsc --noEmit` ناجح)
- الكوميت المرجعي: `2c88a12cd42159cc62f0420e5fa134166c7fd654`
- السطح: حالة الفراغ في `StockMovementsTable`
- الأولوية: 3 (سطر واحد — آخر `py-12`)

## المشكلة
فراغ حركات المخزون `py-12` بينما القاعدة `py-16` (4 شواهد: `Purchases`, `ContractsTable`, `Sales` بعد 13, `ProductsTable`).

## الدليل
- العقد: قاعدة الفراغ السخي بالأيقونة.
- التشغيل: `pages/Products/Components/StockMovementsTable.tsx:27` — `py-12` مع أيقونة (الأيقونة موجودة، الكثافة فقط).

## التغيير
```tsx
// قبل:
<div className="py-12 text-center text-stone-400">
// بعد:
<div className="py-16 text-center text-stone-400">
```

## التحقق
1. منتج بلا حركات — فراغ سخي كالباقي.
2. `npx tsc --noEmit` ناجح. بصري فقط.

## خارج النطاق
- رأس البطاقة `CardHeader` المظلل — نمط خاص سليم.
