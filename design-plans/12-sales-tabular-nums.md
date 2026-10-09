# خطة 12 — `tabular-nums` لخلايا أرقام المبيعات الثلاث

- الحالة: منفذة (Done — 3 خلايا، `tsc --noEmit` ناجح)
- الكوميت المرجعي (Commit = نسخة الكود): `2c88a12cd42159cc62f0420e5fa134166c7fd654`
- السطح المدقق (Surface): أعمدة الكمية/السعر/الإجمالي في `Sales/Index`
- الأولوية: 2 (3 خلايا — نفس عرف `Purchases` و`numCell`)

## المشكلة (Problem)
الأرقام `font-mono` بلا `tabular-nums` (أرقام متساوية العرض) — الأعمدة تهتز بصرياً ويصعب المسح العمودي، خلاف شقيقتها وعرف التطبيق.

## الدليل (Evidence)
- العقد (Contract): `Purchases/Index:82-83` (`font-mono text-center tabular-nums`) وعرف `numCell` في عائلة الأراضي.
- التشغيل (Runtime) — `pages/Sales/Index.tsx:108-110`:
```tsx
<TableCell className="font-mono">{sale.quantity}</TableCell>
<TableCell className="font-mono">{sale.unit_price}</TableCell>
<TableCell className="font-mono">{sale.total.toFixed(2)}</TableCell>
```

## التغيير المقترح (3 خلايا: توكن واحد يضاف)
```tsx
<TableCell className="font-mono tabular-nums">{sale.quantity}</TableCell>
<TableCell className="font-mono tabular-nums">{sale.unit_price}</TableCell>
<TableCell className="font-mono tabular-nums">{sale.total.toFixed(2)}</TableCell>
```

- المحاذاة تبقى طبيعية (يمين في RTL) — لا تمس الرؤوس. `toFixed(2)` يبقى كما هو (مطابق `currency` بصرياً).

## خطوات المنفذ (Executor)
1. افتح `Sales/Index.tsx` أسطر 108-110.
2. أضف `tabular-nums` لكلاس الخلايا الثلاث.
3. احفظ.

## التحقق (Verification)
1. افتح `/sales` — أرقام الأعمدة الثلاثة مصطفة عمودياً.
2. `npx tsc --noEmit` ينجح. بصري فقط.

## خارج النطاق
- تنسيق العملة الموحد (`currency()`) — مطابق بصرياً حالياً، توحيد لاحق إن طلب.
