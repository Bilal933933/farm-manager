# خطة 22 — خط أحادي لملخصات النقوط المالية الثلاث

- الحالة: منفذة (Done — الزوج المتطابق + سطر الصافي، `tsc --noEmit` ناجح)
- الكوميت المرجعي: `2c88a12cd42159cc62f0420e5fa134166c7fd654`
- السطح: بطاقات ملخص `Naqoot/Index` (لنا/علينا/الصافي)
- الأولوية: 2 (3 أسطر — عرف الماليات `font-mono tabular-nums`)

## المشكلة
قيم المبالغ `text-xl font-bold` بلا خط أحادي — كل بطاقات الماليات في التطبيق (`OverallKpiCards`, `PartyFarmerView`, `PartyFinancialSummary`) `font-mono tabular-nums`.

## الدليل
- العقد: عرف عرض الماليات.
- التشغيل: `Naqoot/Index:70` و`:82` (متطابقتان) و`:97` (`cn` ملوّنة).

## التغيير
```tsx
// :70 و:82 (استبدال شامل — السطران متطابقان ولا ثالث لهما):
<p className="mt-0.5 font-mono tabular-nums text-xl font-bold text-stone-900">
// :97:
<p className={cn('mt-0.5 font-mono tabular-nums text-xl font-bold', summary.net >= 0 ? 'text-sky-700' : 'text-rose-700')}>
```

## التحقق
1. `/naqoot` — أرقام الملخص بخط أحادي متساوٍ.
2. `npx tsc --noEmit` ناجح. بصري فقط.

## خارج النطاق
- `fmt()` المحلية — سليمة.
