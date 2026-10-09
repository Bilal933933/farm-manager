# خطة 25 — خط أحادي لقيم بطاقات مؤشرات الأراضي (`KpiCards`)

- الحالة: منفذة (Done — بطاقتان، `tsc --noEmit` ناجح)
- الكوميت المرجعي: `2c88a12cd42159cc62f0420e5fa134166c7fd654`
- السطح: بطاقات `KpiCards` و`OverallKpiCards` في `Lands/Show`
- الأولوية: 2 (آخر بطاقات مالية بلا `mono` — توحيد كامل العرف)

## المشكلة
قيَم البطاقات `text-xl font-bold` بلا `font-mono tabular-nums` — كل بطاقات الماليات الأخرى (`PartyFinancialSummary`, `PartyFarmerView`, ملخص `Naqoot` بعد 22) أحادية؛ هاتان آخر الشواذ.

## الدليل
- العقد: عرف عرض الماليات.
- التشغيل:
  - `components/Lands/KpiCards.tsx:41`: `mt-0.5 truncate text-base font-bold sm:text-lg lg:text-xl`
  - `components/Lands/OverallKpiCards.tsx:32`: `mt-0.5 text-xl font-bold ...`

## التغيير (إضافة توكنين لكل سطر)
```tsx
// KpiCards :41:
<p className={`mt-0.5 truncate font-mono tabular-nums text-base font-bold sm:text-lg lg:text-xl ${card.valueClass}`}>
// OverallKpiCards :32:
<p className={`mt-0.5 font-mono tabular-nums text-xl font-bold ${(card as any).valueClass ?? 'text-stone-900'}`}>
```

## التحقق
1. `/lands/1` مع فلتر موسم وبدونه — أرقام أحادية مصطفة.
2. `npx tsc --noEmit` ناجح. بصري فقط.

## خارج النطاق
- شبكتا الاستجابة المختلفتان (`1/2/4` مقابل `2/4`) — اتجاه تصحيح غامض، مرفوض.
- `(card as any)` — جودة كود لا بصريات.
