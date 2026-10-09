# خطة 14 — محاذاة عمود المبلغ يميناً في جدول التكاليف

- الحالة: منفذة (Done — رأس + خلية، `tsc --noEmit` ناجح)
- الكوميت المرجعي (Commit = نسخة الكود): `2c88a12cd42159cc62f0420e5fa134166c7fd654`
- السطح المدقق (Surface): عمود `المبلغ` في `Costs/Index`
- الأولوية: 1 (امتداد الخطط 1 و8 و10 — سطران)

## المشكلة (Problem)
عمود المبلغ (رأس + خلية) بمحاذاة يسار — آخر عمود رقمي شاذ بعد توحيد كل أرقام التطبيق يميناً.

## الدليل (Evidence)
- العقد (Contract): عرف `text-right` للأرقام (الخطط 1: رؤوس، 8 و10: خلايا).
- التشغيل (Runtime) — `resources/js/pages/Costs/Index.tsx`:
  - سطر 80: `<TableHead className="text-stone-700 font-semibold text-left font-mono tabular-nums">المبلغ</TableHead>`
  - سطر 97: `<TableCell className="text-left font-mono tabular-nums text-amber-700">{fmt(c.amount)}</TableCell>`
- عمود الإجراءات يسار (`:81` + `:98`) يبقى كما هو — سابقة `Lands/Index:49` أبقته عمداً (جهة النهاية في RTL).

## التغيير المقترح (موضعان: محاذاة فقط)
```tsx
// الرأس — بدّل text-left فقط، أبق font-mono tabular-nums (ملاحظة مؤجلة أدناه):
<TableHead className="text-stone-700 font-semibold text-right font-mono tabular-nums">المبلغ</TableHead>
// الخلية:
<TableCell className="text-right font-mono tabular-nums text-amber-700">{fmt(c.amount)}</TableCell>
```

## خطوات المنفذ (Executor)
1. افتح `Costs/Index.tsx` سطري 80 و97.
2. بدّل `text-left` ← `text-right` فيهما فقط.
3. احفظ.

## التحقق (Verification)
1. افتح `/costs` — عمود المبلغ تحت رأسه يميناً مثل باقي الأرقام.
2. `npx tsc --noEmit` ينجح. بصري فقط.

## خارج النطاق / ملاحظة مؤجلة
- `font-mono tabular-nums` على نص الرأس العربي "المبلغ" — أثره شبه معدوم (العربية تسقط من الخط الأحادي)، يُنظف مع توحيد رؤوس الجداول إن طلب.
- عمود الإجراءات — يبقى يساراً عمداً.
