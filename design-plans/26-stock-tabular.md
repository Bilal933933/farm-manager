# خطة 26 — `tabular-nums` لأرقام سجل المخزون (3 مواضع)

- الحالة: منفذة (Done — 3 مواضع، `tsc --noEmit` ناجح)
- الكوميت المرجعي: `2c88a12cd42159cc62f0420e5fa134166c7fd654`
- السطح: بطاقات المنتجات في `StockMovements/Index`
- الأولوية: 1 (امتداد قاعدة الأرقام — الشقيقة `Products/StockMovementsTable` تحملها)

## المشكلة
الرصيد والكمية والسعر `font-mono` بلا `tabular-nums` — بينما جدول حركات المنتج الشقيق (`:63,66`) يحملها لنفس البيانات.

## الدليل
- العقد: عرف `tabular-nums` + شقيقة مباشرة بنفس الحقول.
- التشغيل: `pages/StockMovements/Index.tsx:302` (الرصيد)، `:330` (الكمية)، `:331` (السعر).

## التغيير
```tsx
// :302: <span className="font-mono text-sm"> ← <span className="font-mono tabular-nums text-sm">
// :330: <TableCell className="font-mono">{m.quantity}</TableCell> ← + tabular-nums
// :331: <TableCell className="font-mono">{...}</TableCell> ← + tabular-nums
```

## التحقق
1. `/stock` — الأرصدة والكميات مصطفة.
2. `npx tsc --noEmit` ناجح. بصري فقط.

## خارج النطاق
- نموذج الحوار (labels/errors/mono) — سليم. شارة `TYPE_TONE` — سليمة.
