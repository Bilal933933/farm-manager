# خطة 24 — `tabular-nums` لمعاينة إجمالي البيع (نموذجان)

- الحالة: منفذة (Done — نموذجان، `tsc --noEmit` ناجح)
- الكوميت المرجعي: `2c88a12cd42159cc62f0420e5fa134166c7fd654`
- السطح: معاينة `الإجمالي` الحية في `SaleForm` و`SaleFormDialog`
- الأولوية: 1 (امتداد قاعدة الأرقام — سطران متطابقان)

## المشكلة
معاينة الإجمالي `font-mono` بلا `tabular-nums` — آخر شاشات المال بلا أرقام متساوية العرض.

## الدليل
- العقد: عرف `tabular-nums` (الخطط 12 و19 و20).
- التشغيل: `components/Sales/SaleForm.tsx:220` و`components/Sales/SaleFormDialog.tsx:182` — سطران متطابقان:
```tsx
<p className="font-mono text-xl font-semibold text-stone-900">{total.toFixed(2)}</p>
```

## التغيير
```tsx
<p className="font-mono tabular-nums text-xl font-semibold text-stone-900">{total.toFixed(2)}</p>
```

## التحقق
1. نموذج بيع بكمية/سعر — الإجمالي مصطف.
2. `npx tsc --noEmit` ناجح. بصري فقط.

## خارج النطاق
- `Crops/Show` — دُقق وسليم بلا نتائج (يُحتذى: رابط عودة + قص عنوان + شارات).
- تسمية "اسكرين شوت" — بلا معجم ملزم، مرفوضة التغيير.
