# خطة 32 — بقايا موبايل/أرقام: شبكة الحصاد الثلاثية + إجمالي الصرف

- الحالة: منفذة (Done — `tsc --noEmit` ناجح)
- الكوميت المرجعي: `2c88a12cd42159cc62f0420e5fa134166c7fd654`
- السطح: `HarvestFormDialog` + `ConsumeStockForm`
- الأولوية: 2 (اكتُشفا أثناء تدقيق التحقق — نفس القاعدتين)

## المشكلة
1. شبكة ثلاثية ثابتة (تاريخ+كمية+وحدة) في حوار ضيق — فاتت grep الخطة 29 (كان يبحث `cols-2`).
2. إجمالي الصرف `font-mono` بلا `tabular-nums` — امتداد قاعدة الأرقام.

## الدليل
- العقد: (1) قاعدة الخطة 29 + `ProductForm` النموذجي. (2) عرف `tabular-nums` (آخرها 24/25).
- التشغيل: `HarvestFormDialog:73` (`grid-cols-3`) — `ConsumeStockForm:122` (`font-mono text-lg`).

## التغيير
```tsx
// 1:
<div className="grid grid-cols-3 gap-4">  ←  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
// 2:
<p className="font-mono text-lg font-semibold text-amber-700">  ←  <p className="font-mono tabular-nums text-lg font-semibold text-amber-700">
```

## التحقق
1. حوار الحصاد على 360px مكدس؛ إجمالي الصرف مصطف.
2. `npx tsc --noEmit` ناجح. بصري فقط.

## خارج النطاق
- `aria-invalid` الشامل — تمريرة مستقلة.
