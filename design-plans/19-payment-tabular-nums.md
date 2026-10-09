# خطة 19 — `tabular-nums` لخلية مبلغ المدفوعات

- الحالة: منفذة (Done — `tsc --noEmit` ناجح)
- الكوميت المرجعي: `2c88a12cd42159cc62f0420e5fa134166c7fd654`
- السطح: خلية `المبلغ` في `Payments/Index`
- الأولوية: 1 (امتداد الخطة 12 — نفس القاعدة)

## المشكلة
خلية المبلغ `font-mono` بلا `tabular-nums` — آخر خلية مبلغ بلا أرقام متساوية العرض (`Sales` أُصلحت بالخطة 12، و`Purchases` و`numCell` يحملانها).

## الدليل
- العقد: عرف `tabular-nums` للأرقام (`Purchases:82-83`، الخطة 12).
- التشغيل: `pages/Payments/Index.tsx:107` — `<TableCell className="font-mono">{p.amount}</TableCell>`.

## التغيير (خلية واحدة)
```tsx
// قبل:
<TableCell className="font-mono">{p.amount}</TableCell>
// بعد:
<TableCell className="font-mono tabular-nums">{p.amount}</TableCell>
```

## التحقق
1. `/payments` — عمود المبلغ مصطف عمودياً.
2. `npx tsc --noEmit` ناجح. بصري فقط.

## خارج النطاق
- رابط اسم الطرف (يوصل لصفحة الدفعة لا الطرف) — سلوك تنقل متسق مع `Purchases`، ليس علة تصميم.
- لا نتائج مدعومة أخرى في العائلة: المحاذاة سليمة، الفراغ بأيقونة، الشارات والروابط والعناوين مطابقة للعرف.
